// routes/studentAnalytics.js
const express = require("express");
const routes = express.Router();
const db = require("../db");
require("dotenv").config();
const ExcelJS = require("exceljs");

routes.get("/batch/:batchYear/companies/:companyId", async (req, res, next) => {
  try {
    const { batchYear, companyId } = req.params;

    // 1. Get Company Basic Info
    const companyQuery = `
      SELECT 
        c.id,
        c.company_name,
        c.company_description,
        c.sector,
        c.is_marquee,
        c.website_url,
        c.linkedin_url,
        c.scheduled_visit,
        c.actual_arrival,
        c.glassdoor_rating,
        c.work_locations,
        c.min_cgpa,
        c.max_backlogs,
        c.bond_required,
        c.office_address,
        c.jd_shared_date,
        c.eligibility_10th,
        c.eligibility_12th,
        c.allowed_specializations
      FROM companies c
      INNER JOIN company_batches cb ON c.id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      WHERE c.id = $1 AND b.year = $2
    `;

    // 2. Get Positions (clean, no events)
    const positionsQuery = `
      SELECT 
        cp.id,
        cp.position_title,
        cp.job_type,
        cp.company_type,
        cp.package,
        cp.package_end,
        cp.has_range,
        cp.internship_stipend_monthly,
        cp.rounds_start_date,
        cp.rounds_end_date,
        cp.is_active
      FROM company_positions cp
      WHERE cp.company_id = $1
      ORDER BY cp.created_at
    `;

    // 3. Get ALL Events with their position associations
    const eventsQuery = `
      SELECT 
        e.id AS event_id,
        e.title,
        e.event_type,
        e.event_date,
        e.start_time,
        e.end_time,
        e.venue,
        e.mode,
        e.status,
        e.is_mandatory,
        e.round_type,
        e.round_number,
        e.position_ids,
        e.speaker_details,
        -- Attendance metrics
        COUNT(DISTINCT ea.student_id) FILTER (WHERE ea.status != 'absent') AS total_appeared,
        COUNT(DISTINCT ea.student_id) FILTER (WHERE ea.status = 'present') AS total_present,
        COUNT(DISTINCT ea.student_id) FILTER (WHERE ea.status = 'absent') AS total_absent,
        -- Overall result metrics
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'selected') AS total_selected,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'rejected') AS total_rejected,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'waitlisted') AS total_waitlisted,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'pending') AS total_pending
      FROM events e
      INNER JOIN company_batches cb ON e.company_id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      WHERE e.company_id = $1 
        AND b.year = $2
        AND e.is_placement_event = true
      GROUP BY e.id
      ORDER BY e.event_date, e.round_number
    `;

    // 4. Get position-specific metrics for each event
    const positionMetricsQuery = `
      SELECT 
        e.id AS event_id,
        unnest(e.position_ids) AS position_id,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'selected') AS selected,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'rejected') AS rejected,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'waitlisted') AS waitlisted,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'pending') AS pending,
        COUNT(DISTINCT ea.student_id) FILTER (WHERE ea.status != 'absent') AS appeared
      FROM events e
      INNER JOIN company_batches cb ON e.company_id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      WHERE e.company_id = $1 
        AND b.year = $2
        AND e.is_placement_event = true
        AND e.position_ids IS NOT NULL
      GROUP BY e.id, position_id
    `;

    // 5. Get final selection count per position
    const positionSelectionsQuery = `
      SELECT 
        unnest(e.position_ids) AS position_id,
        COUNT(DISTINCT srr.student_id) AS total_selected
      FROM events e
      INNER JOIN student_round_results srr ON e.id = srr.event_id
      INNER JOIN company_batches cb ON e.company_id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      WHERE e.company_id = $1
        AND b.year = $2
        AND e.is_placement_event = true 
        AND e.round_type = 'last' 
        AND srr.result_status = 'selected'
      GROUP BY position_id
    `;

    // 6. Get eligibility data
    const eligibilityQuery = `
      SELECT 
        ce.total_eligible_count,
        ce.total_ineligible_count,
        ce.total_placed_count
      FROM company_eligibility ce
      INNER JOIN batches b ON ce.batch_id = b.id
      WHERE ce.company_id = $1 AND b.year = $2
    `;

    // 7. Get registration data
    const registrationQuery = `
      SELECT 
        COUNT(DISTINCT fr.student_id) AS total_registered
      FROM form_responses fr
      INNER JOIN forms f ON fr.form_id = f.id
      INNER JOIN events e ON f.event_id = e.id
      WHERE e.company_id = $1
        AND f.batch_year = $2
    `;

    // Execute all queries
    const [
      companyResult,
      positionsResult,
      eventsResult,
      positionMetricsResult,
      positionSelectionsResult,
      eligibilityResult,
      registrationResult,
    ] = await Promise.all([
      db.query(companyQuery, [companyId, batchYear]),
      db.query(positionsQuery, [companyId]),
      db.query(eventsQuery, [companyId, batchYear]),
      db.query(positionMetricsQuery, [companyId, batchYear]),
      db.query(positionSelectionsQuery, [companyId, batchYear]),
      db.query(eligibilityQuery, [companyId, batchYear]),
      db.query(registrationQuery, [companyId, batchYear]),
    ]);

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found for this batch",
      });
    }

    const company = companyResult.rows[0];
    const positions = positionsResult.rows;
    const events = eventsResult.rows;
    const positionMetrics = positionMetricsResult.rows;
    const positionSelections = positionSelectionsResult.rows;
    const eligibility = eligibilityResult.rows[0] || {};
    const registration = registrationResult.rows[0] || {};

    // Create lookup maps
    const eventPositionMetricsMap = {};
    positionMetrics.forEach((pm) => {
      if (!eventPositionMetricsMap[pm.event_id]) {
        eventPositionMetricsMap[pm.event_id] = {};
      }
      eventPositionMetricsMap[pm.event_id][pm.position_id] = {
        selected: parseInt(pm.selected) || 0,
        rejected: parseInt(pm.rejected) || 0,
        waitlisted: parseInt(pm.waitlisted) || 0,
        pending: parseInt(pm.pending) || 0,
        appeared: parseInt(pm.appeared) || 0,
      };
    });

    const positionSelectionMap = {};
    positionSelections.forEach((ps) => {
      positionSelectionMap[ps.position_id] = parseInt(ps.total_selected) || 0;
    });

    // Format positions (clean, no events nested)
    const formattedPositions = positions.map((position) => ({
      id: position.id,
      title: position.position_title,
      jobType: position.job_type,
      companyType: position.company_type,
      package: position.package,
      packageEnd: position.package_end,
      hasRange: position.has_range,
      internshipStipend: position.internship_stipend_monthly,
      roundsStartDate: position.rounds_start_date,
      roundsEndDate: position.rounds_end_date,
      isActive: position.is_active,
      totalSelected: positionSelectionMap[position.id] || 0,
    }));

    // Format events and separate into shared/specific
    const sharedEvents = [];
    const specificEvents = [];

    events.forEach((event) => {
      const positionIds = event.position_ids || [];
      const isShared = positionIds.length > 1;

      const formattedEvent = {
        id: event.event_id,
        title: event.title,
        type: event.event_type,
        date: event.event_date,
        startTime: event.start_time,
        endTime: event.end_time,
        venue: event.venue,
        mode: event.mode,
        status: event.status,
        isMandatory: event.is_mandatory,
        roundType: event.round_type,
        roundNumber: event.round_number,
        speakerDetails: event.speaker_details,

        // Which positions this event is for
        positionIds: positionIds,

        // Overall attendance
        attendance: {
          present: parseInt(event.total_appeared) || 0,
          absent: parseInt(event.total_absent) || 0,
        },

        // Overall results (across all positions)
        overallResults: {
          selected: parseInt(event.total_selected) || 0,
          rejected: parseInt(event.total_rejected) || 0,
          pending: parseInt(event.total_pending) || 0,
        },
      };

      if (isShared) {
        sharedEvents.push(formattedEvent);
      } else {
        specificEvents.push(formattedEvent);
      }
    });

    // Build final response
    const response = {
      success: true,
      data: {
        company: {
          id: company.id,
          name: company.company_name,
          description: company.company_description,
          sector: company.sector,
          isMarquee: company.is_marquee,
          websiteUrl: company.website_url,
          linkedinUrl: company.linkedin_url,
          scheduledVisit: company.scheduled_visit,
          actualArrival: company.actual_arrival,
          glassdoorRating: company.glassdoor_rating,
          workLocations: company.work_locations,
          officeAddress: company.office_address,
          jdSharedDate: company.jd_shared_date,
          eligibilityCriteria: {
            minCgpa: company.min_cgpa,
            maxBacklogs: company.max_backlogs,
            min10th: company.eligibility_10th,
            min12th: company.eligibility_12th,
            allowedSpecializations: company.allowed_specializations,
          },
          bondRequired: company.bond_required,
        },

        eligibility: {
          totalEligible: parseInt(eligibility.total_eligible_count) || 0,
          totalIneligible: parseInt(eligibility.total_ineligible_count) || 0,
          totalPlaced: parseInt(eligibility.total_placed_count) || 0,
        },

        registration: {
          totalRegistered: parseInt(registration.total_registered) || 0,
        },

        // Clean positions array - no nested events
        positions: formattedPositions,

        // Events separated by type
        events: {
          // Shared events: PPT, common rounds for multiple positions
          shared: sharedEvents.sort(
            (a, b) =>
              new Date(a.date) - new Date(b.date) ||
              a.roundNumber - b.roundNumber
          ),

          // Specific events: rounds for individual positions
          specific: specificEvents.sort(
            (a, b) =>
              new Date(a.date) - new Date(b.date) ||
              a.roundNumber - b.roundNumber
          ),
        },
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error in /batch/:batchYear/companies/:companyId:", error);
    next(error);
  }
});

routes.get("/batch/:batchYear/companies", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    const companiesQuery = `
      WITH company_basics AS (
        SELECT 
          c.id,
          c.company_name,
          c.sector,
          c.is_marquee,
          c.scheduled_visit,
          c.actual_arrival
        FROM companies c
        INNER JOIN company_batches cb ON c.id = cb.company_id
        INNER JOIN batches b ON cb.batch_id = b.id
        WHERE b.year = $1
      ),
      position_summary AS (
        SELECT 
          cp.company_id,
          COUNT(*) AS total_positions,
          jsonb_agg(
            jsonb_build_object(
              'id', cp.id,
              'title', cp.position_title,
              'jobType', cp.job_type,
              'companyType', cp.company_type,
              'package', cp.package,
              'packageEnd', cp.package_end,
              'hasRange', cp.has_range
            ) ORDER BY cp.created_at
          ) AS positions
        FROM company_positions cp
        WHERE cp.is_active = true
        GROUP BY cp.company_id
      ),
      eligibility_summary AS (
        SELECT 
          ce.company_id,
          ce.total_eligible_count,
          ce.total_placed_count
        FROM company_eligibility ce
        INNER JOIN batches b ON ce.batch_id = b.id
        WHERE b.year = $1
      ),
      registration_summary AS (
        SELECT
          e.company_id,
          COUNT(DISTINCT fr.student_id) AS total_registered
        FROM form_responses fr
        INNER JOIN forms f ON fr.form_id = f.id
        INNER JOIN events e ON f.event_id = e.id
        WHERE f.batch_year = $1
          AND e.company_id IS NOT NULL
        GROUP BY e.company_id
      ),
      event_summary AS (
        SELECT 
          e.company_id,
          COUNT(*) AS total_events,
          MAX(e.event_date) AS last_event_date,
          COUNT(*) FILTER (WHERE e.status = 'completed') AS completed_events,
          COUNT(*) FILTER (WHERE e.status = 'upcoming') AS upcoming_events,
          COUNT(*) FILTER (WHERE e.position_ids IS NOT NULL AND array_length(e.position_ids, 1) > 1) AS shared_events,
          COUNT(*) FILTER (WHERE e.position_ids IS NOT NULL AND array_length(e.position_ids, 1) = 1) AS specific_events
        FROM events e
        INNER JOIN company_batches cb ON e.company_id = cb.company_id
        INNER JOIN batches b ON cb.batch_id = b.id
        WHERE b.year = $1 
          AND e.is_placement_event = true
        GROUP BY e.company_id
      ),
      final_selections AS (
        SELECT 
          e.company_id,
          COUNT(DISTINCT srr.student_id) AS total_selected
        FROM events e
        INNER JOIN student_round_results srr ON e.id = srr.event_id
        INNER JOIN company_batches cb ON e.company_id = cb.company_id
        INNER JOIN batches b ON cb.batch_id = b.id
        WHERE b.year = $1 
          AND e.is_placement_event = true 
          AND e.round_type = 'last' 
          AND srr.result_status = 'selected'
        GROUP BY e.company_id
      )
      SELECT 
        cb.id,
        cb.company_name AS company,
        cb.sector,
        cb.is_marquee AS "isMarquee",
        cb.scheduled_visit AS "scheduledVisit",
        cb.actual_arrival AS "actualArrival",
        COALESCE(ps.total_positions, 0) AS "totalPositions",
        COALESCE(ps.positions, '[]'::jsonb) AS positions,
        COALESCE(es.total_eligible_count, 0) AS "totalEligible",
        COALESCE(rs.total_registered, 0) AS "totalRegistered",
        COALESCE(evs.total_events, 0) AS "totalEvents",
        COALESCE(evs.completed_events, 0) AS "completedEvents",
        COALESCE(evs.upcoming_events, 0) AS "upcomingEvents",
        COALESCE(evs.shared_events, 0) AS "sharedEvents",
        COALESCE(evs.specific_events, 0) AS "specificEvents",
        evs.last_event_date AS "lastEventDate",
        COALESCE(fs.total_selected, 0) AS "totalSelected",
        COALESCE(es.total_placed_count, 0) AS "totalPlaced"
      FROM company_basics cb
      LEFT JOIN position_summary ps ON cb.id = ps.company_id
      LEFT JOIN eligibility_summary es ON cb.id = es.company_id
      LEFT JOIN registration_summary rs ON cb.id = rs.company_id
      LEFT JOIN event_summary evs ON cb.id = evs.company_id
      LEFT JOIN final_selections fs ON cb.id = fs.company_id
      ORDER BY cb.scheduled_visit DESC NULLS LAST, cb.company_name;
    `;

    const result = await db.query(companiesQuery, [batchYear]);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in /batch/:batchYear/companies:", error);
    next(error);
  }
});

// Get student list for a batch with detailed current offer information
routes.get("/batch/:batchYear/students", async (req, res, next) => {
  try {
    const { batchYear } = req.params;
    const {
      search,
      placementStatus,
      department,
      limit = 100,
      offset = 0,
    } = req.query;

    let whereClause = "WHERE s.batch_year = $1";
    const params = [batchYear];
    let paramCount = 1;

    if (placementStatus) {
      paramCount++;
      whereClause += ` AND s.placement_status = $${paramCount}`;
      params.push(placementStatus);
    }

    if (department && department !== "all") {
      paramCount++;
      whereClause += ` AND s.branch = $${paramCount}`;
      params.push(department);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (s.full_name ILIKE $${paramCount} OR s.registration_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const studentsQuery = `
      SELECT
        s.id,
        s.registration_number,
        s.full_name,
        s.college_email as email,
        sp.name as specialization,
        s.cgpa,
        s.batch_year,
        s.placement_status,
        s.current_offer,

        -- Offer company details
        c.id as offer_company_id,
        c.company_name as offer_company_name,
        c.sector as offer_company_sector,

        -- Offer position details
        cp.id as offer_position_id,
        cp.position_title as offer_position_title,
        cp.job_type as offer_job_type,
        cp.package as offer_package,
        cp.package_end as offer_package_end,
        cp.has_range as offer_has_range,
        cp.company_type as offer_company_type,
        cp.internship_stipend_monthly as offer_stipend,

        -- ⭐ FIXED: Distinct companies applied (NOT events)
        (SELECT COUNT(DISTINCT e.company_id)
         FROM event_attendance ea
         INNER JOIN events e ON ea.event_id = e.id
         WHERE ea.student_id = s.id
           AND e.is_placement_event = TRUE
           AND ea.status != 'absent') AS total_applications,

        -- ⭐ FIXED: Distinct companies with pending rounds
        (SELECT COUNT(DISTINCT e.company_id)
         FROM student_round_results srr
         INNER JOIN events e ON srr.event_id = e.id
         WHERE srr.student_id = s.id
           AND srr.result_status = 'pending'
           AND e.is_placement_event = TRUE) AS active_applications,

        (
          SELECT COUNT(*)
          FROM company_eligibility ce
          INNER JOIN batches b ON ce.batch_id = b.id
          WHERE b.year = s.batch_year
            AND EXISTS (
              SELECT 1
              FROM jsonb_array_elements(ce.eligible_student_ids) elem
              WHERE elem::int = s.id
            )
        ) AS total_eligible_companies,

        -- Offers received (correct)
        (SELECT COUNT(DISTINCT e.company_id)
         FROM student_round_results srr
         INNER JOIN events e ON srr.event_id = e.id
         WHERE srr.student_id = s.id
           AND srr.result_status = 'selected'
           AND e.round_type = 'last'
           AND e.is_placement_event = TRUE) AS offers_received,

        s.class_10_percentage,
        s.class_12_percentage,
        s.backlogs

      FROM students s
      LEFT JOIN specializations sp ON s.specialization_id = sp.id
      LEFT JOIN companies c ON c.id = (s.current_offer->>'company_id')::int
      LEFT JOIN company_positions cp ON cp.id = (s.current_offer->>'position_id')::int
      ${whereClause}
      ORDER BY s.full_name
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    params.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM students s
      ${whereClause}
    `;

    const [studentsResult, countResult] = await Promise.all([
      db.query(studentsQuery, params),
      db.query(countQuery, params.slice(0, paramCount)),
    ]);

    const students = studentsResult.rows;

    res.json({
      success: true,
      data: {
        students: studentsResult.rows.map((row) => {
          let currentOffer = null;

          if (
            row.current_offer &&
            row.offer_company_id &&
            row.offer_position_id
          ) {
            currentOffer = {
              offerId: row.current_offer.offer_id,
              source: row.current_offer.source || "campus",
              companyId: row.offer_company_id,
              companyName: row.offer_company_name,
              sector: row.offer_company_sector,
              positionId: row.offer_position_id,
              positionTitle: row.offer_position_title,
              jobType: row.offer_job_type,
              package: parseFloat(row.offer_package) || 0,
              packageEnd: row.offer_package_end
                ? parseFloat(row.offer_package_end)
                : null,
              hasRange: row.offer_has_range || false,
              companyType: row.offer_company_type,
              internshipStipend: row.offer_stipend,
              workLocation: row.current_offer.work_location,
              offerDate: row.current_offer.offer_date,
              acceptanceDate: row.current_offer.acceptance_date,
              isAccepted: row.current_offer.is_accepted || false,
            };
          }

          return {
            id: row.id,
            registrationNumber: row.registration_number,
            fullName: row.full_name,
            email: row.email,
            specialization: row.specialization,
            cgpa: parseFloat(row.cgpa) || 0,
            batchYear: row.batch_year,
            placementStatus: row.placement_status,

            currentOffer,

            totalApplications: parseInt(row.total_applications) || 0,
            activeApplications: parseInt(row.active_applications) || 0,
            offersReceived: parseInt(row.offers_received) || 0,
            totalEligibleCompanies: parseInt(row.total_eligible_companies) || 0,
            class10Percentage: parseFloat(row.class_10_percentage) || 0,
            class12Percentage: parseFloat(row.class_12_percentage) || 0,
            backlogs: parseInt(row.backlogs) || 0,
          };
        }),
        pagination: {
          total: parseInt(countResult.rows[0].total),
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      },
    });
  } catch (error) {
    console.error("Error in /batch/:batchYear/students:", error);
    next(error);
  }
});

// Get student's company applications with detailed round information
routes.get("/student/:studentId/applications", async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const applicationsQuery = `
      -- Get positions applied via form
      WITH student_positions AS (
        SELECT DISTINCT
          (fr.response_data ->> 'position_id')::INTEGER AS position_id,
          c.id AS company_id,
          fr.response_data ->> 'position_title' AS position_title
        FROM form_responses fr
        INNER JOIN forms f ON f.id = fr.form_id
        INNER JOIN events e ON e.id = f.event_id
        INNER JOIN companies c ON c.id = e.company_id
        WHERE fr.student_id = $1
          AND (fr.response_data ->> 'position_id') IS NOT NULL
      ),

      -- Get all companies student has applied to
      student_companies AS (
        SELECT DISTINCT
          c.id AS company_id,
          c.company_name,
          c.sector,
          MIN(e.event_date) AS first_interaction_date
        FROM companies c
        INNER JOIN events e ON e.company_id = c.id
        INNER JOIN forms f ON f.event_id = e.id
        INNER JOIN form_responses fr ON fr.form_id = f.id
        WHERE fr.student_id = $1
        GROUP BY c.id, c.company_name, c.sector
      ),

      -- Get the positions info for student
      company_positions_for_student AS (
        SELECT
          sp.position_id,
          sp.company_id,
          sp.position_title,
          cp.job_type,
          cp.package,
          cp.package_end,
          cp.has_range
        FROM student_positions sp
        LEFT JOIN company_positions cp ON cp.id = sp.position_id
      ),

      -- Get rounds relevant to the student positions
      company_rounds AS (
        SELECT DISTINCT ON (e.id)
          e.company_id,
          e.id AS event_id,
          e.title AS event_title,
          e.event_type,
          e.event_date,
          e.round_type,
          e.round_number,
          e.position_ids,
          srr.result_status,
          srr.updated_at AS result_date
        FROM events e
        LEFT JOIN student_round_results srr ON e.id = srr.event_id AND srr.student_id = $1
        WHERE e.is_placement_event = TRUE
          AND EXISTS (
            SELECT 1
            FROM student_positions sp
            WHERE sp.company_id = e.company_id
              AND sp.position_id = ANY(e.position_ids)
          )
        ORDER BY e.id, e.round_number
      ),

      -- Get final results
      final_results AS (
        SELECT DISTINCT ON (e.company_id)
          e.company_id,
          srr.result_status AS final_status,
          MAX(e.round_number) AS max_round_reached
        FROM events e
        INNER JOIN student_round_results srr ON e.id = srr.event_id
        WHERE srr.student_id = $1
          AND e.round_type = 'last'
        GROUP BY e.company_id, srr.result_status
      )

      SELECT 
        sc.company_id,
        sc.company_name,
        sc.sector,
        sc.first_interaction_date,

        (
          SELECT json_agg(jsonb_build_object(
            'positionId', position_id,
            'positionTitle', position_title,
            'jobType', job_type,
            'package', package,
            'packageEnd', package_end,
            'hasRange', has_range
          ))
          FROM company_positions_for_student cps
          WHERE cps.company_id = sc.company_id
        ) AS positions,

        (
          SELECT json_agg(jsonb_build_object(
            'eventId', event_id,
            'eventTitle', event_title,
            'eventType', event_type,
            'eventDate', event_date,
            'roundType', round_type,
            'roundNumber', round_number,
            'positionIds', position_ids,
            'resultStatus', result_status,
            'resultDate', result_date
          ) ORDER BY event_date, round_number)
          FROM company_rounds cr
          WHERE cr.company_id = sc.company_id
        ) AS rounds,

        fr.final_status,
        fr.max_round_reached,

        (SELECT CASE WHEN s.current_offer->>'company_id' = sc.company_id::text
                THEN true ELSE false END
         FROM students s WHERE s.id = $1) AS is_accepted_offer

      FROM student_companies sc
      LEFT JOIN final_results fr ON fr.company_id = sc.company_id
      ORDER BY sc.first_interaction_date DESC
    `;

    const result = await db.query(applicationsQuery, [studentId]);

    res.json({
      success: true,
      data: {
        applied: result.rows.map((row) => ({
          companyId: row.company_id,
          companyName: row.company_name,
          sector: row.sector,
          firstInteractionDate: row.first_interaction_date,
          positions: row.positions || [],
          rounds: row.rounds || [],
          finalStatus: row.final_status,
          maxRoundReached: row.max_round_reached,
          isAcceptedOffer: row.is_accepted_offer || false,
        })),
      },
    });
  } catch (error) {
    console.error("Error in student applications:", error);
    next(error);
  }
});

// Get companies student was eligible for but didn't apply
routes.get("/student/:studentId/eligible-companies", async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const eligibleQuery = `
      WITH student_batch AS (
        SELECT batch_year 
        FROM students 
        WHERE id = $1
      ),
      applied_companies AS (
        SELECT DISTINCT e.company_id
        FROM event_attendance ea
        INNER JOIN events e ON ea.event_id = e.id
        WHERE ea.student_id = $1
          AND e.is_placement_event = true
          AND ea.status != 'absent'
      ),
      eligible_companies AS (
        SELECT 
          ce.company_id,
          c.company_name,
          c.sector,
          c.is_marquee,
          c.scheduled_visit,
          c.actual_arrival,
          ce.eligible_student_ids,
          ce.dream_company_student_ids
        FROM company_eligibility ce
        INNER JOIN companies c ON ce.company_id = c.id
        INNER JOIN batches b ON ce.batch_id = b.id
        CROSS JOIN student_batch sb
        WHERE b.year = sb.batch_year
          AND (
            ce.eligible_student_ids @> to_jsonb($1::int)
            OR ce.dream_company_student_ids @> to_jsonb($1::int)
          )
          AND ce.company_id NOT IN (SELECT company_id FROM applied_companies)
      )
      SELECT 
        ec.company_id,
        ec.company_name,
        ec.sector,
        ec.is_marquee,
        ec.scheduled_visit,
        ec.actual_arrival,
        CASE 
          WHEN ec.dream_company_student_ids @> to_jsonb($1::int) THEN true 
          ELSE false 
        END as is_dream_company,
        COUNT(DISTINCT cp.id) as total_positions,
        json_agg(DISTINCT jsonb_build_object(
          'positionId', cp.id,
          'positionTitle', cp.position_title,
          'jobType', cp.job_type,
          'package', cp.package,
          'packageEnd', cp.package_end,
          'hasRange', cp.has_range
        )) as positions
      FROM eligible_companies ec
      LEFT JOIN company_positions cp ON ec.company_id = cp.company_id
      GROUP BY 
        ec.company_id,
        ec.company_name,
        ec.sector,
        ec.is_marquee,
        ec.scheduled_visit,
        ec.actual_arrival,
        ec.dream_company_student_ids
      ORDER BY ec.scheduled_visit DESC NULLS LAST
    `;

    const result = await db.query(eligibleQuery, [studentId]);

    res.json({
      success: true,
      data: {
        eligibleNotApplied: result.rows.map((row) => ({
          companyId: row.company_id,
          companyName: row.company_name,
          sector: row.sector,
          isMarquee: row.is_marquee || false,
          isDreamCompany: row.is_dream_company || false,
          scheduledVisit: row.scheduled_visit,
          actualArrival: row.actual_arrival,
          totalPositions: parseInt(row.total_positions) || 0,
          positions: row.positions || [],
        })),
      },
    });
  } catch (error) {
    console.error("Error in eligible companies:", error);
    next(error);
  }
});

// BASIC OVERVIEW - Core stats only
routes.get("/batch/:batchYear/overview", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    const query = `
      SELECT 
        COUNT(*) as total_students,
        COUNT(*) FILTER (WHERE placement_status = 'placed') as placed_students,
        COUNT(*) FILTER (WHERE placement_status = 'unplaced') as unplaced_students,
        ROUND(
          (COUNT(*) FILTER (WHERE placement_status = 'placed')::NUMERIC / 
          NULLIF(COUNT(*)::NUMERIC, 0) * 100), 2
        ) as placement_rate,
        -- Package stats (only from placed students)
        ROUND(AVG((current_offer->>'package')::NUMERIC) 
          FILTER (WHERE placement_status = 'placed' AND current_offer IS NOT NULL), 2) as avg_package,
        MAX((current_offer->>'package')::NUMERIC) 
          FILTER (WHERE placement_status = 'placed' AND current_offer IS NOT NULL) as highest_package,
        (SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (
          ORDER BY (current_offer->>'package')::NUMERIC
        ) FROM students WHERE batch_year = $1 AND placement_status = 'placed' AND current_offer IS NOT NULL) as median_package,
        -- Company count
        (SELECT COUNT(DISTINCT company_id) 
         FROM company_batches cb 
         INNER JOIN batches b ON cb.batch_id = b.id 
         WHERE b.year = $1) as total_companies,
        -- Total offers count
        COUNT(DISTINCT (current_offer->>'offer_id')) 
          FILTER (WHERE current_offer IS NOT NULL) as total_offers
      FROM students
      WHERE batch_year = $1
    `;

    const result = await db.query(query, [batchYear]);
    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        totalStudents: parseInt(stats.total_students) || 0,
        placedStudents: parseInt(stats.placed_students) || 0,
        unplacedStudents: parseInt(stats.unplaced_students) || 0,
        placementRate: parseFloat(stats.placement_rate) || 0,
        avgPackage: parseFloat(stats.avg_package) || 0,
        medianPackage: parseFloat(stats.median_package) || 0,
        highestPackage: parseFloat(stats.highest_package) || 0,
        totalCompanies: parseInt(stats.total_companies) || 0,
        totalOffers: parseInt(stats.total_offers) || 0,
      },
    });
  } catch (error) {
    console.error("Error in analytics overview:", error);
    next(error);
  }
});

// ALL PLACEMENTS DATA - Frontend filters by date/department
routes.get("/batch/:batchYear/placements", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    const query = `
      SELECT 
        s.id,
        s.full_name,
        s.registration_number,
        s.branch::text as department,
        s.placement_status,
        s.cgpa,
        -- Offer details
        (s.current_offer->>'company_name') as company_name,
        (s.current_offer->>'position_title') as position_title,
        (s.current_offer->>'package')::NUMERIC as package,
        (s.current_offer->>'job_type') as job_type,
        (s.current_offer->>'offer_date')::DATE as offer_date,
        (s.current_offer->>'acceptance_date')::DATE as acceptance_date,
        (s.current_offer->>'company_id')::INTEGER as company_id
      FROM students s
      WHERE s.batch_year = $1 
        AND s.placement_status = 'placed'
        AND s.current_offer IS NOT NULL
      ORDER BY (s.current_offer->>'acceptance_date')::DATE DESC NULLS LAST
    `;

    const result = await db.query(query, [batchYear]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        registrationNumber: row.registration_number,
        department: row.department,
        cgpa: parseFloat(row.cgpa) || 0,
        companyName: row.company_name,
        companyId: row.company_id,
        positionTitle: row.position_title,
        package: parseFloat(row.package) || 0,
        jobType: row.job_type,
        offerDate: row.offer_date,
        acceptanceDate: row.acceptance_date,
      })),
    });
  } catch (error) {
    console.error("Error in placements data:", error);
    next(error);
  }
});

// DEPARTMENT-WISE STATS - Simple breakdown
routes.get("/batch/:batchYear/departments", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    const query = `
      SELECT 
        COALESCE(branch::text, 'Unknown') as department,
        COUNT(*) as total_students,
        COUNT(*) FILTER (WHERE placement_status = 'placed') as placed_students,
        ROUND(
          (COUNT(*) FILTER (WHERE placement_status = 'placed')::NUMERIC / 
          NULLIF(COUNT(*)::NUMERIC, 0) * 100), 2
        ) as placement_rate,
        ROUND(AVG((current_offer->>'package')::NUMERIC) 
          FILTER (WHERE placement_status = 'placed' AND current_offer IS NOT NULL), 2) as avg_package,
        MAX((current_offer->>'package')::NUMERIC) 
          FILTER (WHERE placement_status = 'placed' AND current_offer IS NOT NULL) as highest_package
      FROM students
      WHERE batch_year = $1
      GROUP BY branch
      ORDER BY placed_students DESC
    `;

    const result = await db.query(query, [batchYear]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        department: row.department,
        totalStudents: parseInt(row.total_students) || 0,
        placedStudents: parseInt(row.placed_students) || 0,
        placementRate: parseFloat(row.placement_rate) || 0,
        avgPackage: parseFloat(row.avg_package) || 0,
        highestPackage: parseFloat(row.highest_package) || 0,
      })),
    });
  } catch (error) {
    console.error("Error in department stats:", error);
    next(error);
  }
});

// COMPANY STATS - Top companies by placements
routes.get("/batch/:batchYear/companies", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    const query = `
      SELECT 
        (s.current_offer->>'company_id')::INTEGER as company_id,
        (s.current_offer->>'company_name') as company_name,
        COUNT(*) as students_placed,
        ROUND(AVG((s.current_offer->>'package')::NUMERIC), 2) as avg_package,
        MAX((s.current_offer->>'package')::NUMERIC) as highest_package,
        MIN((s.current_offer->>'package')::NUMERIC) as lowest_package,
        array_agg(DISTINCT s.branch::text) as departments,
        array_agg(DISTINCT (s.current_offer->>'job_type')) as job_types
      FROM students s
      WHERE s.batch_year = $1
        AND s.placement_status = 'placed'
        AND s.current_offer IS NOT NULL
      GROUP BY 
        (s.current_offer->>'company_id')::INTEGER,
        (s.current_offer->>'company_name')
      ORDER BY students_placed DESC, avg_package DESC
    `;

    const result = await db.query(query, [batchYear]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        companyId: row.company_id,
        companyName: row.company_name,
        studentsPlaced: parseInt(row.students_placed) || 0,
        avgPackage: parseFloat(row.avg_package) || 0,
        highestPackage: parseFloat(row.highest_package) || 0,
        lowestPackage: parseFloat(row.lowest_package) || 0,
        departments: row.departments || [],
        jobTypes: row.job_types || [],
      })),
    });
  } catch (error) {
    console.error("Error in company stats:", error);
    next(error);
  }
});

// PACKAGE DISTRIBUTION - Raw package data for histograms
routes.get("/batch/:batchYear/packages", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    const query = `
      SELECT 
        (current_offer->>'package')::NUMERIC as package,
        branch::text as department,
        (current_offer->>'job_type') as job_type,
        (current_offer->>'company_name') as company_name
      FROM students
      WHERE batch_year = $1
        AND placement_status = 'placed'
        AND current_offer IS NOT NULL
        AND (current_offer->>'package') IS NOT NULL
      ORDER BY package DESC
    `;

    const result = await db.query(query, [batchYear]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        package: parseFloat(row.package) || 0,
        department: row.department,
        jobType: row.job_type,
        companyName: row.company_name,
      })),
    });
  } catch (error) {
    console.error("Error in package distribution:", error);
    next(error);
  }
});

// COMPANY VISIT TIMELINE - When companies came
routes.get("/batch/:batchYear/company-timeline", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    const query = `
      SELECT 
        c.id,
        c.company_name,
        c.scheduled_visit,
        c.actual_arrival,
        c.is_marquee,
        c.sector,
        COUNT(DISTINCT cp.id) as total_positions
      FROM companies c
      INNER JOIN company_batches cb ON c.id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN company_positions cp ON c.id = cp.company_id
      WHERE b.year = $1
      GROUP BY c.id
      ORDER BY COALESCE(c.actual_arrival, c.scheduled_visit) DESC NULLS LAST
    `;

    const result = await db.query(query, [batchYear]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        companyId: row.id,
        companyName: row.company_name,
        scheduledVisit: row.scheduled_visit,
        actualArrival: row.actual_arrival,
        isMarquee: row.is_marquee || false,
        sector: row.sector,
        totalPositions: parseInt(row.total_positions) || 0,
      })),
    });
  } catch (error) {
    console.error("Error in company timeline:", error);
    next(error);
  }
});

// // EXPORT STUDENT ROUNDS DATA TO EXCEL
routes.get(
  "/batch/:batchYear/students/rounds-export",
  async (req, res, next) => {
    try {
      const { batchYear } = req.params;
      const { studentIds } = req.query;

      // Build filters
      let whereClause = "WHERE s.batch_year = $1";
      const params = [batchYear];
      let paramCount = 1;

      if (studentIds) {
        paramCount++;
        const ids = studentIds.split(",").map((id) => parseInt(id.trim()));
        whereClause += ` AND s.id = ANY($${paramCount}::int[])`;
        params.push(ids);
      }

      const studentsQuery = `
        SELECT
          s.id,
          s.registration_number,
          s.full_name,
          s.college_email,
          sp.name as specialization,
          s.cgpa,
          s.placement_status,
          s.current_offer,
          -- Enrich current_offer with company and position details
          CASE 
            WHEN s.current_offer IS NOT NULL AND s.current_offer->>'company_id' IS NOT NULL THEN
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    s.current_offer,
                    '{company_name}',
                    to_jsonb(c.company_name)
                  ),
                  '{position_title}',
                  to_jsonb(cp.position_title)
                ),
                '{package}',
                to_jsonb(cp.package)
              ) || 
              jsonb_build_object(
                'has_range', cp.has_range,
                'package_end', cp.package_end
              )
            ELSE s.current_offer
          END as current_offer_enriched
        FROM students s
        LEFT JOIN specializations sp ON s.specialization_id = sp.id
        LEFT JOIN companies c ON c.id = (s.current_offer->>'company_id')::INTEGER
        LEFT JOIN company_positions cp ON cp.id = (s.current_offer->>'position_id')::INTEGER
        ${whereClause}
        ORDER BY s.full_name
      `;

      const studentsResult = await db.query(studentsQuery, params);
      // const students = studentsResult.rows;
      const students = studentsResult.rows.map((student) => ({
        ...student,
        current_offer: student.current_offer_enriched || student.current_offer,
      }));

      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No students found",
        });
      }

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Placement Management System";
      workbook.created = new Date();

      // Create Index Sheet first
      const indexSheet = workbook.addWorksheet("Student Index");

      // Index Sheet Header
      indexSheet.mergeCells("A1:I1");
      indexSheet.getCell("A1").value = "STUDENT INDEX - QUICK ACCESS";
      indexSheet.getCell("A1").font = {
        bold: true,
        size: 16,
        color: { argb: "FFFFFFFF" },
      };
      indexSheet.getCell("A1").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF7C3AED" },
      };
      indexSheet.getCell("A1").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Index Sheet Subtitle
      indexSheet.mergeCells("A2:I2");
      indexSheet.getCell(
        "A2"
      ).value = `Click on student names to jump to their sheets | Total Students: ${students.length}`;
      indexSheet.getCell("A2").font = {
        italic: true,
        color: { argb: "FF6B7280" },
      };
      indexSheet.getCell("A2").alignment = {
        horizontal: "center",
      };

      // Index Sheet Column Headers
      const headerRow = indexSheet.getRow(3);
      headerRow.values = [
        "S.No",
        "Student Name",
        "Registration No",
        "Email",
        "Specialization",
        "CGPA",
        "Placement Status",
        "Current Company",
        "Position & Package",
      ];
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2563EB" },
      };
      headerRow.alignment = { horizontal: "center" };

      // Process each student and create individual sheets first to ensure they exist
      const studentSheets = [];
      const sheetNameMap = new Map();

      for (const student of students) {
        // Get student's applications data with position names
        const applicationsQuery = `
        -- Get positions student applied for via form registration with position names
        WITH student_positions AS (
          SELECT DISTINCT
            (fr.response_data ->> 'position_id')::INTEGER AS position_id,
            fr.response_data ->> 'position_title' as position_title,
            c.id AS company_id,
            c.company_name
          FROM form_responses fr
          INNER JOIN forms f ON f.id = fr.form_id
          INNER JOIN events e ON e.id = f.event_id
          INNER JOIN companies c ON c.id = e.company_id
          WHERE fr.student_id = $1
            AND (fr.response_data ->> 'position_id') IS NOT NULL
        ),
        -- Get companies student registered for
        student_companies AS (
          SELECT DISTINCT
            c.id as company_id,
            c.company_name,
            c.sector,
            c.is_marquee
          FROM companies c
          INNER JOIN events e ON e.company_id = c.id
          INNER JOIN forms f ON f.event_id = e.id
          INNER JOIN form_responses fr ON fr.form_id = f.id
          WHERE fr.student_id = $1
        ),
        -- Get only rounds for positions student applied to with position names
        company_rounds AS (
          SELECT
            e.company_id,
            e.title as event_title,
            e.event_type,
            e.event_date,
            e.round_type,
            e.round_number,
            e.position_ids,
            srr.result_status,
            ea.remarks AS remarks,
            -- Get position names from form responses
            (
              SELECT array_agg(DISTINCT sp.position_title)
              FROM student_positions sp
              WHERE sp.company_id = e.company_id
                AND sp.position_id = ANY(e.position_ids)
            ) as position_names
          FROM events e
          LEFT JOIN student_round_results srr ON e.id = srr.event_id AND srr.student_id = $1
          LEFT JOIN event_attendance ea ON ea.event_id = e.id AND ea.student_id = $1
          WHERE e.is_placement_event = true
            AND e.company_id IN (SELECT company_id FROM student_companies)
            AND EXISTS (
              SELECT 1
              FROM student_positions sp
              WHERE sp.company_id = e.company_id
                AND sp.position_id = ANY(e.position_ids)
            )
          ORDER BY e.company_id, e.event_date, e.round_number
        ),
        eligible_not_applied AS (
          SELECT
            c.id as company_id,
            c.company_name,
            c.sector,
            c.is_marquee,
            c.scheduled_visit,
            CASE
              WHEN ce.dream_company_student_ids @> to_jsonb($1::int) THEN true
              ELSE false
            END as is_dream_company
          FROM company_eligibility ce
          INNER JOIN companies c ON ce.company_id = c.id
          INNER JOIN batches b ON ce.batch_id = b.id
          WHERE b.year = $2
            AND (
              ce.eligible_student_ids @> to_jsonb($1::int)
              OR ce.dream_company_student_ids @> to_jsonb($1::int)
            )
            AND c.id NOT IN (SELECT company_id FROM student_companies)
          ORDER BY c.scheduled_visit DESC NULLS LAST
        )
        SELECT
          sc.company_id,
          sc.company_name,
          sc.sector,
          sc.is_marquee,
          json_agg(
            json_build_object(
              'eventTitle', cr.event_title,
              'eventType', cr.event_type,
              'eventDate', cr.event_date,
              'roundType', cr.round_type,
              'roundNumber', cr.round_number,
              'positionIds', cr.position_ids,
              'positionNames', cr.position_names,
              'resultStatus', cr.result_status,
              'remarks', cr.remarks
            ) ORDER BY cr.event_date, cr.round_number
          ) FILTER (WHERE cr.event_title IS NOT NULL) as rounds,
          (SELECT json_agg(json_build_object(
            'companyName', ena.company_name,
            'sector', ena.sector,
            'isMarquee', ena.is_marquee,
            'isDreamCompany', ena.is_dream_company,
            'scheduledVisit', ena.scheduled_visit
          ))
          FROM eligible_not_applied ena) as not_applied
        FROM student_companies sc
        LEFT JOIN company_rounds cr ON sc.company_id = cr.company_id
        GROUP BY sc.company_id, sc.company_name, sc.sector, sc.is_marquee
        ORDER BY sc.company_name
      `;

        const appResult = await db.query(applicationsQuery, [
          student.id,
          batchYear,
        ]);

        // Create sheet with registration number
        const sheetName = `Student_${student.registration_number}`
          .replace(/[:\\\/\?\*\[\]]/g, "_")
          .substring(0, 31);
        const worksheet = workbook.addWorksheet(sheetName);
        studentSheets.push({ worksheet, student, sheetName });
        sheetNameMap.set(student.id, sheetName); // Store the actual sheet name used

        // Add "Back to Index" hyperlink at the top
        worksheet.mergeCells("A1:B1");
        const backCell = worksheet.getCell("A1");
        backCell.value = {
          text: "← Back to Student Index",
          hyperlink: "#'Student Index'!A1",
        };
        backCell.font = {
          color: { argb: "FF2563EB" },
          underline: true,
          bold: true,
        };
        backCell.tooltip = "Click to return to main index";

        // SECTION 1: Student Info
        worksheet.mergeCells("A4:H4");
        worksheet.getCell("A4").value = "STUDENT INFORMATION";
        worksheet.getCell("A4").font = {
          bold: true,
          size: 14,
          color: { argb: "FFFFFFFF" },
        };
        worksheet.getCell("A4").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF2563EB" },
        };
        worksheet.getCell("A4").alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        let currentOfferDisplay = "—";
        if (
          student.current_offer &&
          Object.keys(student.current_offer).length > 0
        ) {
          // Added length check
          try {
            const offer =
              typeof student.current_offer === "string"
                ? JSON.parse(student.current_offer)
                : student.current_offer;

            const company = offer.company_name || "";
            const position = offer.position_title || "";
            const pkg = offer.package || "";
            const pkgEnd = offer.package_end || null;
            const hasRange = offer.has_range || false;

            if (company && position && pkg) {
              // Format package based on whether it's a range
              let packageDisplay =
                hasRange && pkgEnd ? `₹${pkg}-${pkgEnd} LPA` : `₹${pkg} LPA`;
              currentOfferDisplay = `${company} - ${position} (${packageDisplay})`;
            } else if (company && position) {
              currentOfferDisplay = `${company} - ${position}`;
            } else if (company) {
              currentOfferDisplay = company;
            }
          } catch (e) {
            console.error(
              `Error parsing current_offer for ${student.full_name}:`,
              e
            );
            currentOfferDisplay = "—";
          }
        }

        worksheet.getRow(5).values = [
          "Registration",
          student.registration_number,
          "Name",
          student.full_name,
          "Specialization",
          student.specialization,
        ];
        worksheet.getRow(6).values = [
          "Email",
          student.college_email,
          "CGPA",
          student.cgpa,
          "Status",
          student.placement_status,
        ];
        worksheet.getRow(7).values = [
          "Current Offer",
          currentOfferDisplay,
          "",
          "",
          "",
          "",
        ];

        // Style student info
        ["A5", "C5", "E5", "A6", "C6", "E6", "A7"].forEach((cell) => {
          worksheet.getCell(cell).font = { bold: true };
          worksheet.getCell(cell).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE5E7EB" },
          };
        });

        // SECTION 2: Companies Applied To
        let currentRow = 9;

        worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = "COMPANIES APPLIED TO";
        worksheet.getCell(`A${currentRow}`).font = {
          bold: true,
          size: 12,
          color: { argb: "FFFFFFFF" },
        };
        worksheet.getCell(`A${currentRow}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF10B981" },
        };
        worksheet.getCell(`A${currentRow}`).alignment = {
          horizontal: "center",
        };
        currentRow++;

        const appliedCompanies = appResult.rows.filter(
          (r) => r.rounds && r.rounds.length > 0
        );

        if (appliedCompanies.length > 0) {
          for (const company of appliedCompanies) {
            // Get the position name from the first round (student applied for only one position)
            const positionName = company.rounds[0]?.positionNames?.[0] || "—";

            // Company name row with position information in the format "Company (Position)"
            worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
            const companyCell = worksheet.getCell(`A${currentRow}`);
            companyCell.value = `${company.company_name} ${
              company.is_marquee ? "⭐" : ""
            }${positionName !== "—" ? ` (${positionName})` : ""}`;
            companyCell.font = { bold: true, size: 11 };
            companyCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF3F4F6" },
            };
            currentRow++;

            // Remove the separate position names row since it's now in the company header
            // Rounds header
            const headerRow = worksheet.getRow(currentRow);
            headerRow.values = [
              "Round",
              "Event Type",
              "Date",
              "Round Type",
              "Result",
              "Status",
              "Remarks",
            ];
            headerRow.font = { bold: true };
            headerRow.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFDBEAFE" },
            };
            currentRow++;

            // Rounds data
            const rounds = company.rounds || [];
            for (const round of rounds) {
              const resultSymbol =
                round.resultStatus === "selected"
                  ? "✓"
                  : round.resultStatus === "rejected"
                  ? "✗"
                  : round.resultStatus === "waitlisted"
                  ? "⏳"
                  : "—";

              worksheet.getRow(currentRow).values = [
                round.roundNumber || "—",
                round.eventType || "—",
                round.eventDate
                  ? new Date(round.eventDate).toLocaleDateString()
                  : "—",
                round.roundType || "—",
                resultSymbol,
                round.resultStatus || "N/A",
                round.remarks || "—",
              ];

              // Color code result cell
              const resultCell = worksheet.getCell(`E${currentRow}`);
              if (round.resultStatus === "selected") {
                resultCell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFD1FAE5" },
                };
              } else if (round.resultStatus === "rejected") {
                resultCell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFEE2E2" },
                };
              }

              currentRow++;
            }
            currentRow++; // Empty row between companies
          }
        } else {
          worksheet.getCell(`A${currentRow}`).value = "No applications found";
          currentRow++;
        }

        // SECTION 3: Eligible But Not Applied
        currentRow++;
        worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = "ELIGIBLE BUT NOT APPLIED";
        worksheet.getCell(`A${currentRow}`).font = {
          bold: true,
          size: 12,
          color: { argb: "FFFFFFFF" },
        };
        worksheet.getCell(`A${currentRow}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF59E0B" },
        };
        worksheet.getCell(`A${currentRow}`).alignment = {
          horizontal: "center",
        };
        currentRow++;

        const notApplied = appResult.rows[0]?.not_applied || [];

        if (notApplied.length > 0) {
          // Header
          const headerRow = worksheet.getRow(currentRow);
          headerRow.values = [
            "Company Name",
            "Sector",
            "Marquee",
            "Dream Company",
            "Scheduled Visit",
          ];
          headerRow.font = { bold: true };
          headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" },
          };
          currentRow++;

          // Data
          for (const company of notApplied) {
            worksheet.getRow(currentRow).values = [
              company.companyName,
              company.sector,
              company.isMarquee ? "⭐" : "",
              company.isDreamCompany ? "💎" : "",
              company.scheduledVisit
                ? new Date(company.scheduledVisit).toLocaleDateString()
                : "—",
            ];
            currentRow++;
          }
        } else {
          worksheet.getCell(`A${currentRow}`).value =
            "Applied to all eligible companies";
          currentRow++;
        }

        // Set column widths
        worksheet.columns = [
          { width: 12 }, // A - Round
          { width: 15 }, // B - Event Type
          { width: 12 }, // C - Date
          { width: 15 }, // D - Round Type
          { width: 20 }, // E - Position(s)
          { width: 10 }, // F - Result
          { width: 12 }, // G - Status
          { width: 15 }, // H - (empty)
        ];

        // Add borders to all cells with data
        for (let i = 1; i <= currentRow; i++) {
          for (let j = 1; j <= 8; j++) {
            const cell = worksheet.getCell(i, j);
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
        }
      }

      // Now add hyperlinks to the index sheet after all sheets are created
      students.forEach((student, index) => {
        const dataRow = indexSheet.getRow(4 + index);
        const sheetName = sheetNameMap.get(student.id); // Use the stored sheet name

        // Parse current_offer to extract company, position and package
        let currentCompany = "—";
        let positionPackage = "—";

        if (student.current_offer) {
          try {
            const offer =
              typeof student.current_offer === "string"
                ? JSON.parse(student.current_offer)
                : student.current_offer;

            currentCompany = offer.company_name || "—";

            const position = offer.position_title || "";
            const pkg = offer.package || "";
            const pkgEnd = offer.package_end || null;
            const hasRange = offer.has_range || false;

            if (position && pkg) {
              // Format package based on whether it's a range
              let packageDisplay =
                hasRange && pkgEnd ? `₹${pkg}-${pkgEnd} LPA` : `₹${pkg} LPA`;
              positionPackage = `${position} (${packageDisplay})`;
            } else if (position) {
              positionPackage = position;
            } else if (pkg) {
              let packageDisplay =
                hasRange && pkgEnd ? `₹${pkg}-${pkgEnd} LPA` : `₹${pkg} LPA`;
              positionPackage = packageDisplay;
            }
          } catch (e) {
            console.error("Error parsing current_offer:", e);
            currentCompany = "—";
            positionPackage = "—";
          }
        }

        dataRow.values = [
          index + 1,
          {
            text: student.full_name,
            hyperlink: `#'${sheetName}'!A1`,
            tooltip: `Click to go to ${student.full_name}'s sheet`,
          },
          student.registration_number,
          student.college_email,
          student.specialization,
          student.cgpa,
          student.placement_status,
          currentCompany,
          positionPackage,
        ];

        // Style the hyperlink
        const nameCell = dataRow.getCell(2);
        nameCell.font = {
          color: { argb: "FF2563EB" },
          underline: true,
          bold: true,
        };

        // Alternate row coloring for better readability
        if (index % 2 === 0) {
          dataRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF9FAFB" },
          };
        }
      });

      // Set column widths for index sheet
      indexSheet.columns = [
        { width: 8 }, // S.No
        { width: 25 }, // Student Name
        { width: 18 }, // Registration No
        { width: 25 }, // Email
        { width: 20 }, // Specialization
        { width: 10 }, // CGPA
        { width: 15 }, // Placement Status
        { width: 20 }, // Current Company
        { width: 25 }, // Position & Package
      ];

      // Add borders to index sheet
      const totalIndexRows = 3 + students.length; // 3 header rows + data rows
      for (let i = 1; i <= totalIndexRows; i++) {
        // for (let i = 1; i <= students.length + 7; i++) {
        for (let j = 1; j <= 9; j++) {
          const cell = indexSheet.getCell(i, j);
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      }

      // Freeze the header rows for easy scrolling
      indexSheet.views = [{ state: "frozen", xSplit: 0, ySplit: 3 }];

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="student_rounds_${batchYear}_${Date.now()}.xlsx"`
      );
      res.setHeader("Content-Length", buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error("Error in rounds export:", error);
      next(error);
    }
  }
);

module.exports = routes;

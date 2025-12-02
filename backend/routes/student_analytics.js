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
          jdSharedDate: company.jd_shared_date,
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
          c.jd_shared_date,
          -- Derive company round dates from positions
          (SELECT MIN(cp.rounds_start_date) 
           FROM company_positions cp 
           WHERE cp.company_id = c.id) as company_rounds_start_date,
          (SELECT MAX(cp.rounds_end_date) 
           FROM company_positions cp 
           WHERE cp.company_id = c.id
           AND NOT EXISTS (
             SELECT 1 FROM company_positions cp2 
             WHERE cp2.company_id = c.id 
             AND cp2.rounds_end_date IS NULL
           )) as company_rounds_end_date
        FROM companies c
        INNER JOIN company_batches cb ON c.id = cb.company_id
        INNER JOIN batches b ON cb.batch_id = b.id
        WHERE b.year = $1
      ),
      company_status AS (
        SELECT 
          id,
          CASE 
            WHEN company_rounds_end_date IS NOT NULL THEN 'completed'
            WHEN company_rounds_start_date IS NOT NULL THEN 'ongoing'
            WHEN jd_shared_date IS NOT NULL THEN 'jd_shared'
            ELSE NULL
          END as status
        FROM company_basics
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
        cb.jd_shared_date AS "jdSharedDate",
        cb.company_rounds_start_date AS "companyRoundsStartDate",
        cb.company_rounds_end_date AS "companyRoundsEndDate",
        cs.status AS status,
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
      LEFT JOIN company_status cs ON cb.id = cs.id
      LEFT JOIN position_summary ps ON cb.id = ps.company_id
      LEFT JOIN eligibility_summary es ON cb.id = es.company_id
      LEFT JOIN registration_summary rs ON cb.id = rs.company_id
      LEFT JOIN event_summary evs ON cb.id = evs.company_id
      LEFT JOIN final_selections fs ON cb.id = fs.company_id
      ORDER BY 
        CASE cs.status
          WHEN 'ongoing' THEN 1
          WHEN 'jd_shared' THEN 2
          WHEN 'completed' THEN 3
          ELSE 4
        END,
        cb.company_rounds_start_date DESC NULLS LAST, 
        cb.company_name;
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
      limit = 500,
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
        ec.dream_company_student_ids
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

// EXPORT STUDENT ROUNDS DATA TO EXCEL
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
            ea.status AS attendance_status,
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
              'attendance', cr.attendance_status,
              'remarks', cr.remarks
            ) ORDER BY cr.event_date, cr.round_number
          ) FILTER (WHERE cr.event_title IS NOT NULL) as rounds,
          (SELECT json_agg(json_build_object(
            'companyName', ena.company_name,
            'sector', ena.sector,
            'isMarquee', ena.is_marquee,
            'isDreamCompany', ena.is_dream_company
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
        worksheet.mergeCells("A4:G4");
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

        worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
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
            worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
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
              "Attendance",
              "Status",
              "Remarks",
            ];
            headerRow.font = { bold: true };
            for (let col = 1; col <= 7; col++) {
              // A–G only
              const cell = worksheet.getCell(currentRow, col);
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDBEAFE" },
              };
            }

            currentRow++;

            // Rounds data
            const rounds = company.rounds || [];
            for (const round of rounds) {
              worksheet.getRow(currentRow).values = [
                round.roundNumber || "—",
                round.eventType || "—",
                round.eventDate
                  ? new Date(round.eventDate).toLocaleDateString()
                  : "—",
                round.roundType || "—",
                round.attendance || "N/A",
                round.resultStatus || "N/A",
                round.remarks || "—",
              ];

              // Color code result cell
              const resultCell = worksheet.getCell(`F${currentRow}`);
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
        worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
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
          ];
          headerRow.font = { bold: true };
          // Apply font + fill only for columns A to G
          ["A", "B", "C", "D", "E", "F", "G"].forEach((col) => {
            const cell = worksheet.getCell(`${col}${currentRow}`);
            cell.font = { bold: true };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFEF3C7" },
            };
          });

          currentRow++;

          // Data
          for (const company of notApplied) {
            worksheet.getRow(currentRow).values = [
              company.companyName,
              company.sector,
              company.isMarquee ? "⭐" : "",
              company.isDreamCompany ? "💎" : "",
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
        ];

        // Add borders to all cells with data
        for (let i = 1; i <= currentRow; i++) {
          for (let j = 1; j <= 7; j++) {
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

// EXPORT ALL STUDENTS WITH COMPANY MATRIX
routes.get("/batch/:batchYear/students/export", async (req, res, next) => {
  try {
    const { batchYear } = req.params;
    const { placementStatus } = req.query;

    let whereClause = "WHERE s.batch_year = $1";
    const params = [batchYear];
    let paramCount = 1;

    if (placementStatus) {
      paramCount++;
      whereClause += ` AND s.placement_status = $${paramCount}`;
      params.push(placementStatus);
    }

    // 1. Get all students with their basic info
    const studentsQuery = `
      SELECT
        s.id,
        s.registration_number,
        s.full_name,
        s.college_email,
        s.branch,
        sp.name as specialization,
        s.cgpa,
        s.class_10_percentage,
        s.class_12_percentage,
        s.backlogs,
        s.placement_status,
        s.current_offer,
        c.company_name as current_company,
        cp.position_title as current_position,
        cp.package as current_package,
        cp.package_end as current_package_end,
        cp.has_range as current_has_range,
        
        -- Source (campus or manual)
        COALESCE(s.current_offer->>'source', 'campus') as offer_source,
        
        -- Total eligible companies
        (SELECT COUNT(*)
         FROM company_eligibility ce
         INNER JOIN batches b ON ce.batch_id = b.id
         WHERE b.year = s.batch_year
           AND EXISTS (
             SELECT 1
             FROM jsonb_array_elements(ce.eligible_student_ids) elem
             WHERE elem::int = s.id
           )
        ) AS total_eligible_companies,
        
        -- Total applications (distinct companies applied)
        (SELECT COUNT(DISTINCT e.company_id)
         FROM event_attendance ea
         INNER JOIN events e ON ea.event_id = e.id
         WHERE ea.student_id = s.id
           AND e.is_placement_event = TRUE
           AND ea.status != 'absent') AS total_applications,
        
        -- Active applications (distinct companies with pending rounds)
        (SELECT COUNT(DISTINCT e.company_id)
         FROM student_round_results srr
         INNER JOIN events e ON srr.event_id = e.id
         WHERE srr.student_id = s.id
           AND srr.result_status = 'pending'
           AND e.is_placement_event = TRUE) AS active_applications,
        
        -- Total offers received
        (SELECT COUNT(DISTINCT e.company_id)
         FROM student_round_results srr
         INNER JOIN events e ON srr.event_id = e.id
         WHERE srr.student_id = s.id
           AND srr.result_status = 'selected'
           AND e.round_type = 'last'
           AND e.is_placement_event = TRUE) AS total_offers
           
      FROM students s
      LEFT JOIN specializations sp ON s.specialization_id = sp.id
      LEFT JOIN companies c ON c.id = (s.current_offer->>'company_id')::INTEGER
      LEFT JOIN company_positions cp ON cp.id = (s.current_offer->>'position_id')::INTEGER
      ${whereClause}
      ORDER BY s.full_name
    `;

    const studentsResult = await db.query(studentsQuery, params);
    const students = studentsResult.rows;

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    // 2. Get all companies for this batch
    const companiesQuery = `
      SELECT 
        c.id,
        c.company_name,
        c.sector,
        c.is_marquee
      FROM companies c
      INNER JOIN company_batches cb ON c.id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      WHERE b.year = $1
      ORDER BY c.company_name
    `;
    const companiesResult = await db.query(companiesQuery, [batchYear]);
    const companies = companiesResult.rows;

    // 3. Get eligibility data for all students and companies
    const eligibilityQuery = `
      SELECT 
        ce.company_id,
        ce.eligible_student_ids,
        ce.ineligible_student_ids,
        ce.dream_company_student_ids
      FROM company_eligibility ce
      INNER JOIN batches b ON ce.batch_id = b.id
      WHERE b.year = $1
    `;
    const eligibilityResult = await db.query(eligibilityQuery, [batchYear]);

    // Create eligibility map
    const eligibilityMap = new Map();
    eligibilityResult.rows.forEach((row) => {
      const eligible = Array.isArray(row.eligible_student_ids)
        ? row.eligible_student_ids
        : [];
      const ineligible = Array.isArray(row.ineligible_student_ids)
        ? row.ineligible_student_ids
        : [];
      const dreamCompany = Array.isArray(row.dream_company_student_ids)
        ? row.dream_company_student_ids
        : [];

      eligibilityMap.set(row.company_id, {
        eligible: new Set(eligible),
        ineligible: new Set(ineligible),
        dreamCompany: new Set(dreamCompany),
      });
    });

    // 4. Get registration data (students who filled forms for companies)
    const registrationQuery = `
      SELECT DISTINCT
        fr.student_id,
        e.company_id
      FROM form_responses fr
      INNER JOIN forms f ON fr.form_id = f.id
      INNER JOIN events e ON f.event_id = e.id
      WHERE f.batch_year = $1
        AND e.company_id IS NOT NULL
    `;
    const registrationResult = await db.query(registrationQuery, [batchYear]);

    // Create registration map
    const registrationMap = new Map();
    registrationResult.rows.forEach((row) => {
      if (!registrationMap.has(row.student_id)) {
        registrationMap.set(row.student_id, new Set());
      }
      registrationMap.get(row.student_id).add(row.company_id);
    });

    // 5. Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Placement Management System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Students Export");

    // Header styling
    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    };
    const headerFont = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
    };

    // Build headers - UPDATED with new columns
    const headers = [
      "S.No",
      "Registration Number",
      "Full Name",
      "Email",
      "Branch",
      "Specialization",
      "CGPA",
      "10th %",
      "12th %",
      "Backlogs",
      "Placement Status",
      "Source", // NEW
      "Current Company",
      "Current Position",
      "Current Package",
      "Total Eligible Companies", // NEW
      "Total Applications", // NEW
      "Active Applications", // NEW
      "Total Offers Received", // NEW (moved from end)
    ];

    // Add company headers
    companies.forEach((company) => {
      headers.push(`${company.company_name}${company.is_marquee ? " ⭐" : ""}`);
    });

    // Set headers
    worksheet.getRow(1).values = headers;
    worksheet.getRow(1).font = headerFont;
    worksheet.getRow(1).fill = headerFill;
    worksheet.getRow(1).alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    // Set column widths - UPDATED
    const staticColumnsCount = 19; // Updated count
    worksheet.columns = [
      { width: 8 }, // S.No
      { width: 18 }, // Registration
      { width: 25 }, // Name
      { width: 28 }, // Email
      { width: 12 }, // Branch
      { width: 20 }, // Specialization
      { width: 10 }, // CGPA
      { width: 10 }, // 10th
      { width: 10 }, // 12th
      { width: 10 }, // Backlogs
      { width: 15 }, // Status
      { width: 12 }, // Source
      { width: 20 }, // Current Company
      { width: 20 }, // Current Position
      { width: 15 }, // Current Package
      { width: 18 }, // Total Eligible Companies
      { width: 16 }, // Total Applications
      { width: 16 }, // Active Applications
      { width: 18 }, // Total Offers Received
      // Company columns
      ...companies.map(() => ({ width: 15 })),
    ];

    // Freeze first row and first 3 columns
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 3,
        ySplit: 1,
        topLeftCell: "D2",
      },
    ];

    // Add student data
    students.forEach((student, index) => {
      const rowData = [
        index + 1,
        student.registration_number,
        student.full_name,
        student.college_email,
        student.branch,
        student.specialization,
        student.cgpa ? parseFloat(student.cgpa).toFixed(2) : "N/A",
        student.class_10_percentage
          ? parseFloat(student.class_10_percentage).toFixed(2)
          : "N/A",
        student.class_12_percentage
          ? parseFloat(student.class_12_percentage).toFixed(2)
          : "N/A",
        student.backlogs || 0,
        student.placement_status === "placed" ? "Placed" : "Unplaced",
        student.offer_source === "manual" ? "Manual" : "Campus", // NEW
        student.current_company || "—",
        student.current_position || "—",
        student.current_package
          ? student.current_has_range && student.current_package_end
            ? `₹${student.current_package}-${student.current_package_end} LPA`
            : `₹${student.current_package} LPA`
          : "—",
        parseInt(student.total_eligible_companies) || 0, // NEW
        parseInt(student.total_applications) || 0, // NEW
        parseInt(student.active_applications) || 0, // NEW
        parseInt(student.total_offers) || 0, // MOVED
      ];

      const rowNumber = index + 2;
      const studentRegistrations = registrationMap.get(student.id) || new Set();

      // Add company status for each company
      companies.forEach((company, companyIndex) => {
        const companyEligibility = eligibilityMap.get(company.id);
        const isEligible =
          companyEligibility?.eligible.has(student.id) || false;
        const isIneligible =
          companyEligibility?.ineligible.has(student.id) || false;
        const isDreamCompany =
          companyEligibility?.dreamCompany.has(student.id) || false;
        const hasRegistered = studentRegistrations.has(company.id);

        let cellValue = "";
        let cellFill = null;

        if (isIneligible || !isEligible) {
          // Not Eligible - Yellow background
          cellValue = "Not Eligible";
          cellFill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" }, // Light yellow
          };
        } else if (isEligible) {
          if (hasRegistered) {
            // Registered - Green background with tick
            cellValue = "✓";
            cellFill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFD1FAE5" }, // Light green
            };
          } else {
            // Not Registered - Red background with cross
            cellValue = "✗";
            cellFill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFEE2E2" }, // Light red
            };
          }

          // Add dream company indicator
          if (isDreamCompany) {
            cellValue += " 💎";
          }
        }

        rowData.push(cellValue);

        // Set cell styling - FIXED: Column index calculation
        const companyColumnIndex = staticColumnsCount + companyIndex + 1; // +1 for Excel 1-based indexing
        const cell = worksheet.getCell(rowNumber, companyColumnIndex);

        // Apply fill BEFORE setting value
        if (cellFill) {
          cell.fill = cellFill;
        }

        cell.value = cellValue;

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        cell.font = {
          bold: cellValue.includes("✓") || cellValue.includes("✗"),
        };
      });

      // Set row values (only static columns, company cells already set)
      const staticRowData = rowData.slice(0, staticColumnsCount);
      for (let col = 1; col <= staticColumnsCount; col++) {
        worksheet.getCell(rowNumber, col).value = staticRowData[col - 1];
      }

      // Add borders to all cells
      worksheet.getRow(rowNumber).eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
      });

      // Alternate row coloring for basic info columns
      if (index % 2 === 0) {
        for (let col = 1; col <= staticColumnsCount; col++) {
          const cell = worksheet.getCell(rowNumber, col);
          if (
            !cell.fill ||
            !cell.fill.fgColor ||
            cell.fill.fgColor.argb === "FFFFFFFF"
          ) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF9FAFB" },
            };
          }
        }
      }
    });

    // Add borders to header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add a legend sheet
    const legendSheet = workbook.addWorksheet("Legend");

    legendSheet.mergeCells("A1:B1");
    legendSheet.getCell("A1").value = "LEGEND - Company Status Indicators";
    legendSheet.getCell("A1").font = { bold: true, size: 14 };
    legendSheet.getCell("A1").alignment = { horizontal: "center" };
    legendSheet.getCell("A1").fill = headerFill;
    legendSheet.getCell("A1").font = { ...headerFont, size: 14 };

    const legendData = [
      ["Status", "Description"],
      ["✓ Registered", "Student is eligible and has registered/applied"],
      [
        "✗ Not Registered",
        "Student is eligible but has NOT registered/applied",
      ],
      ["Not Eligible", "Student does not meet eligibility criteria"],
      ["💎", "Dream company for this student"],
      ["⭐", "Marquee company"],
      ["", ""],
      ["Column Definitions", ""],
      [
        "Source",
        "Campus (on-campus placement) or Manual (off-campus/self-placed)",
      ],
      [
        "Total Eligible Companies",
        "Number of companies student is eligible to apply for",
      ],
      [
        "Total Applications",
        "Number of companies student has applied/registered for",
      ],
      [
        "Active Applications",
        "Companies where student is still in selection process",
      ],
      ["Total Offers Received", "Number of job offers received by the student"],
    ];

    legendData.forEach((row, index) => {
      const rowNum = index + 2;
      legendSheet.getRow(rowNum).values = row;

      if (index === 0 || index === 7) {
        // Header rows
        legendSheet.getRow(rowNum).font = { bold: true };
        legendSheet.getRow(rowNum).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE5E7EB" },
        };
      } else if (index > 0 && index < 6) {
        // Data rows with color coding
        const statusCell = legendSheet.getCell(rowNum, 1);

        if (row[0].includes("✓")) {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD1FAE5" },
          };
        } else if (row[0].includes("✗")) {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEE2E2" },
          };
        } else if (row[0].includes("Not Eligible")) {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" },
          };
        }
      }
    });

    legendSheet.columns = [{ width: 25 }, { width: 60 }];

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="students_company_matrix_${batchYear}_${Date.now()}.xlsx"`
    );
    res.setHeader("Content-Length", buffer.length);

    res.send(buffer);
  } catch (error) {
    console.error("Error in students company matrix export:", error);
    next(error);
  }
});

// EXPORT ALL STUDENT OFFERS
routes.get(
  "/batch/:batchYear/students/offers-export",
  async (req, res, next) => {
    try {
      const { batchYear } = req.params;
      const { placementStatus } = req.query;

      let whereClause = "WHERE s.batch_year = $1";
      const params = [batchYear];
      let paramCount = 1;

      if (placementStatus && placementStatus === "placed") {
        paramCount++;
        whereClause += ` AND s.placement_status = $${paramCount}`;
        params.push(placementStatus);
      }

      // 1. Get all students with basic info
      const studentsQuery = `
      SELECT
        s.id,
        s.registration_number,
        s.full_name,
        s.placement_status,
        s.offers_received,
        s.current_offer
      FROM students s
      ${whereClause}
      ORDER BY s.full_name
    `;

      const studentsResult = await db.query(studentsQuery, params);
      const students = studentsResult.rows;

      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No students found",
        });
      }

      // 2. Get all unique companies that made offers
      const studentIds = students.map((s) => s.id);

      const companiesQuery = `
        SELECT DISTINCT
          c.id as company_id,
          c.company_name
        FROM student_round_results srr
        INNER JOIN events e ON srr.event_id = e.id
        INNER JOIN companies c ON e.company_id = c.id
        WHERE srr.student_id = ANY($1)
          AND srr.result_status = 'selected'
          AND e.round_type = 'last'
          AND e.is_placement_event = TRUE
        ORDER BY c.company_name
      `;

      const companiesResult = await db.query(companiesQuery, [studentIds]);
      const companies = companiesResult.rows;

      // 3. Get all offers with company and position details
      const offersQuery = `
        SELECT
          srr.student_id,
          c.id as company_id,
          c.company_name,
          cp.position_title,
          cp.package,
          cp.package_end,
          cp.has_range,
          cp.job_type,
          e.event_date as selection_date,
          srr.created_at as offer_date,
          cp.id as position_id
        FROM student_round_results srr
        INNER JOIN events e ON srr.event_id = e.id
        INNER JOIN companies c ON e.company_id = c.id
        LEFT JOIN company_positions cp ON cp.id = ANY(e.position_ids)
        WHERE srr.student_id = ANY($1)
          AND srr.result_status = 'selected'
          AND e.round_type = 'last'
          AND e.is_placement_event = TRUE
        ORDER BY srr.student_id, c.company_name
      `;

      const offersResult = await db.query(offersQuery, [studentIds]);

      // 4. Process offers from offers_received and current_offer as well
      const allOffers = new Map(); // Map<student_id, Map<company_id, offer>>

      // Process database results (from student_round_results)
      offersResult.rows.forEach((offer) => {
        if (!allOffers.has(offer.student_id)) {
          allOffers.set(offer.student_id, new Map());
        }

        const studentOffers = allOffers.get(offer.student_id);

        // Only add if this company doesn't already exist for this student
        if (!studentOffers.has(offer.company_id)) {
          studentOffers.set(offer.company_id, {
            companyId: offer.company_id,
            companyName: offer.company_name,
            positionTitle: offer.position_title,
            package: offer.package,
            packageEnd: offer.package_end,
            hasRange: offer.has_range,
            jobType: offer.job_type,
            selectionDate: offer.selection_date || offer.offer_date,
          });
        }
      });

      // Also process offers_received from students table
      students.forEach((student) => {
        if (!allOffers.has(student.id)) {
          allOffers.set(student.id, new Map());
        }

        const studentOffers = allOffers.get(student.id);

        // Process offers_received
        if (student.offers_received) {
          let offersArray = [];

          if (Array.isArray(student.offers_received)) {
            offersArray = Array.isArray(student.offers_received[0])
              ? student.offers_received[0]
              : student.offers_received;
          }

          offersArray.forEach(async (offer) => {
            if (
              offer &&
              offer.company_id &&
              !studentOffers.has(offer.company_id)
            ) {
              // Get company and position details
              const detailsQuery = `
                SELECT
                  c.company_name,
                  cp.position_title,
                  cp.package,
                  cp.package_end,
                  cp.has_range,
                  cp.job_type
                FROM companies c
                LEFT JOIN company_positions cp ON cp.id = $1
                WHERE c.id = $2
              `;

              try {
                const detailsResult = await db.query(detailsQuery, [
                  offer.position_id,
                  offer.company_id,
                ]);

                if (detailsResult.rows.length > 0) {
                  const details = detailsResult.rows[0];
                  studentOffers.set(offer.company_id, {
                    companyId: offer.company_id,
                    companyName: details.company_name,
                    positionTitle: details.position_title,
                    package: details.package,
                    packageEnd: details.package_end,
                    hasRange: details.has_range,
                    jobType: details.job_type,
                    selectionDate: offer.offer_date || offer.created_at,
                  });
                }
              } catch (err) {
                console.error("Error fetching offer details:", err);
              }
            }
          });
        }

        // Process current_offer
        if (student.current_offer && student.current_offer.company_id) {
          const offer = student.current_offer;
          if (!studentOffers.has(offer.company_id)) {
            // This will be handled in the sync query below
          }
        }
      });

      // Wait a bit for async queries to complete (not ideal, but works)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Re-fetch to ensure we have all company names
      const allCompanyIds = new Set();
      allOffers.forEach((studentOffers) => {
        studentOffers.forEach((offer) => {
          allCompanyIds.add(offer.companyId);
        });
      });

      // Update companies list to include all unique companies
      const uniqueCompanies = Array.from(
        new Map(
          Array.from(allOffers.values())
            .flatMap((studentOffers) => Array.from(studentOffers.values()))
            .map((offer) => [
              offer.companyId,
              {
                company_id: offer.companyId,
                company_name: offer.companyName,
              },
            ])
        ).values()
      ).sort((a, b) => a.company_name.localeCompare(b.company_name));

      const maxOffersPerStudent = Math.max(
        ...Array.from(allOffers.values()).map((m) => m.size),
        1
      );

      // 5. Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Placement Management System";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet("Student Offers");

      // Styling
      const headerFill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2563EB" },
      };
      const subHeaderFill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF60A5FA" },
      };
      const headerFont = {
        bold: true,
        color: { argb: "FFFFFFFF" },
        size: 11,
      };

      // 6. Create merged header row (Row 1)
      const row1Values = [
        "S.No",
        "Registration Number",
        "Full Name",
        "Placement Status",
      ];
      let currentCol = 5;

      // Add company group headers
      for (let i = 1; i <= uniqueCompanies.length; i++) {
        row1Values.push(`Placed Company ${i}`);
        row1Values.push("", "", ""); // Placeholders for merged cells
        currentCol += 4;
      }
      row1Values.push("Highest CTC Received (in LPA)");

      worksheet.getRow(1).values = row1Values;

      // Merge cells for each company group in row 1
      let mergeCol = 5;
      for (let i = 1; i <= uniqueCompanies.length; i++) {
        worksheet.mergeCells(1, mergeCol, 1, mergeCol + 3);
        mergeCol += 4;
      }

      // Style row 1
      worksheet.getRow(1).font = headerFont;
      worksheet.getRow(1).fill = headerFill;
      worksheet.getRow(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      worksheet.getRow(1).height = 25;

      // 7. Create sub-header row (Row 2)
      const row2Values = ["", "", "", ""]; // Empty for student info columns

      // Add sub-headers for each company
      uniqueCompanies.forEach((company) => {
        row2Values.push(company.company_name);
        row2Values.push("Date of Selection");
        row2Values.push("Profile Offered");
        row2Values.push("CTC Offered (in LPA)");
      });
      row2Values.push(""); // Empty for highest CTC column

      worksheet.getRow(2).values = row2Values;
      worksheet.getRow(2).font = headerFont;
      worksheet.getRow(2).fill = subHeaderFill;
      worksheet.getRow(2).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      worksheet.getRow(2).height = 30;

      // Merge student info cells in row 2
      worksheet.mergeCells(2, 1, 2, 1); // S.No
      worksheet.mergeCells(2, 2, 2, 2); // Registration Number
      worksheet.mergeCells(2, 3, 2, 3); // Full Name
      worksheet.mergeCells(2, 4, 2, 4); // Placement Status
      worksheet.mergeCells(
        2,
        5 + uniqueCompanies.length * 4,
        2,
        5 + uniqueCompanies.length * 4
      ); // Highest CTC

      // 8. Set column widths
      const columnWidths = [
        { width: 8 }, // S.No
        { width: 18 }, // Registration Number
        { width: 25 }, // Full Name
        { width: 15 }, // Placement Status
      ];

      // Add widths for company columns
      for (let i = 0; i < uniqueCompanies.length; i++) {
        columnWidths.push({ width: 25 }); // Company Name (will show in header only)
        columnWidths.push({ width: 18 }); // Date of Selection
        columnWidths.push({ width: 25 }); // Profile Offered
        columnWidths.push({ width: 18 }); // CTC Offered
      }
      columnWidths.push({ width: 20 }); // Highest CTC

      worksheet.columns = columnWidths;

      // 9. Add student data
      students.forEach((student, index) => {
        const rowNumber = index + 3;
        const studentOffers = allOffers.get(student.id) || new Map();

        // Calculate highest CTC
        let highestCTC = 0;
        studentOffers.forEach((offer) => {
          const ctc =
            offer.hasRange && offer.packageEnd
              ? parseFloat(offer.packageEnd)
              : parseFloat(offer.package || 0);

          highestCTC = Math.max(highestCTC, ctc);
        });

        const rowData = [
          index + 1,
          student.registration_number,
          student.full_name,
          student.placement_status === "placed" ? "Placed" : "Unplaced",
        ];

        // Add offer data for each company
        uniqueCompanies.forEach((company) => {
          const offer = studentOffers.get(company.company_id);

          if (offer) {
            // Company name (will be empty as it's in header)
            rowData.push("✓"); // Checkmark to indicate offer received

            // Selection date
            rowData.push(
              offer.selectionDate
                ? new Date(offer.selectionDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "—"
            );

            // Position title
            rowData.push(offer.positionTitle || "—");

            // CTC
            const ctc =
              offer.hasRange && offer.packageEnd
                ? `${offer.package}-${offer.packageEnd}`
                : offer.package
                ? parseFloat(offer.package).toFixed(2)
                : "—";
            rowData.push(ctc);
          } else {
            // Empty cells for companies where student didn't get offer
            rowData.push("", "", "", "");
          }
        });

        // Add highest CTC
        rowData.push(highestCTC > 0 ? parseFloat(highestCTC).toFixed(2) : "—");

        worksheet.getRow(rowNumber).values = rowData;

        // Style the row
        worksheet.getRow(rowNumber).alignment = {
          vertical: "middle",
        };

        // Center align specific columns
        const centerAlignCols = [1, 4]; // S.No, Placement Status

        // Add columns for each company (checkmark, date, CTC)
        for (let i = 0; i < uniqueCompanies.length; i++) {
          centerAlignCols.push(5 + i * 4); // Checkmark column
          centerAlignCols.push(6 + i * 4); // Date column
          centerAlignCols.push(8 + i * 4); // CTC column
        }
        centerAlignCols.push(5 + uniqueCompanies.length * 4); // Highest CTC

        centerAlignCols.forEach((col) => {
          const cell = worksheet.getCell(rowNumber, col);
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        });

        // Add borders to all cells
        worksheet.getRow(rowNumber).eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          };
        });

        // Alternate row coloring
        if (index % 2 === 0) {
          worksheet.getRow(rowNumber).eachCell((cell) => {
            if (!cell.fill || !cell.fill.fgColor) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF9FAFB" },
              };
            }
          });
        }

        // Highlight highest CTC cell
        const highestCTCCell = worksheet.getCell(
          rowNumber,
          5 + uniqueCompanies.length * 4
        );
        if (highestCTC > 0) {
          highestCTCCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFEF3C7" }, // Light yellow
          };
          highestCTCCell.font = {
            bold: true,
          };
        }
      });

      // Add borders to header rows
      worksheet.getRow(1).eachCell((cell) => {
        cell.border = {
          top: { style: "medium" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      worksheet.getRow(2).eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "medium" },
          right: { style: "thin" },
        };
      });

      // Freeze first 2 rows and first 3 columns
      worksheet.views = [
        {
          state: "frozen",
          xSplit: 3,
          ySplit: 2,
          topLeftCell: "D3",
        },
      ];

      // 10. Add summary sheet
      const summarySheet = workbook.addWorksheet("Summary");

      summarySheet.mergeCells("A1:B1");
      summarySheet.getCell("A1").value = "PLACEMENT SUMMARY";
      summarySheet.getCell("A1").font = { bold: true, size: 14 };
      summarySheet.getCell("A1").alignment = { horizontal: "center" };
      summarySheet.getCell("A1").fill = headerFill;
      summarySheet.getCell("A1").font = { ...headerFont, size: 14 };

      const totalPlaced = students.filter(
        (s) => s.placement_status === "placed"
      ).length;
      const totalStudents = students.length;
      const placementPercentage = ((totalPlaced / totalStudents) * 100).toFixed(
        2
      );

      // Count total offers
      let totalOffers = 0;
      allOffers.forEach((studentOffers) => {
        totalOffers += studentOffers.size;
      });

      const summaryData = [
        ["Metric", "Value"],
        ["Total Students", totalStudents],
        ["Students Placed", totalPlaced],
        ["Students Unplaced", totalStudents - totalPlaced],
        ["Placement Percentage", `${placementPercentage}%`],
        ["Total Unique Companies", uniqueCompanies.length],
        ["Total Offers Made", totalOffers],
        ["Maximum Offers to Single Student", maxOffersPerStudent],
      ];

      summaryData.forEach((row, index) => {
        const rowNum = index + 2;
        summarySheet.getRow(rowNum).values = row;

        if (index === 0) {
          summarySheet.getRow(rowNum).font = { bold: true };
          summarySheet.getRow(rowNum).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE5E7EB" },
          };
        }

        summarySheet.getRow(rowNum).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      summarySheet.columns = [{ width: 30 }, { width: 20 }];

      // 11. Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="student_offers_${batchYear}_${Date.now()}.xlsx"`
      );
      res.setHeader("Content-Length", buffer.length);

      res.send(buffer);
    } catch (error) {
      console.error("Error in student offers export:", error);
      next(error);
    }
  }
);

// EXPORT ALL COMPANIES FOR A BATCH
routes.get("/batch/:batchYear/export-all-companies", async (req, res, next) => {
  try {
    const { batchYear } = req.params;

    // 1. Get all companies for this batch
    const companiesQuery = `
      SELECT DISTINCT
        c.id,
        c.company_name,
        c.sector,
        c.website_url,
        c.office_address,
        c.work_locations,
        c.glassdoor_rating,
        c.bond_required,
        c.min_cgpa,
        c.max_backlogs,
        c.eligibility_10th,
        c.eligibility_12th,
        c.is_marquee,
        c.allowed_specializations
      FROM companies c
      INNER JOIN company_batches cb ON c.id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      WHERE b.year = $1
      ORDER BY c.company_name
    `;
    const companiesResult = await db.query(companiesQuery, [batchYear]);
    const companies = companiesResult.rows;

    if (companies.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No companies found for this batch",
      });
    }

    // Get batch ID
    const batchQuery = `SELECT id FROM batches WHERE year = $1`;
    const batchResult = await db.query(batchQuery, [batchYear]);
    const batchId = batchResult.rows[0].id;

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Placement Management System";
    workbook.created = new Date();

    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };
    const subHeaderFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    const sectionHeaderFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E2F3" },
    };
    const headerFont = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
    };

    // Process each company
    for (
      let companyIndex = 0;
      companyIndex < companies.length;
      companyIndex++
    ) {
      const company = companies[companyIndex];

      try {
        // Get eligibility data
        const eligibilityQuery = `
          SELECT 
            ce.eligible_student_ids,
            ce.ineligible_student_ids,
            ce.dream_company_student_ids
          FROM company_eligibility ce
          WHERE ce.company_id = $1 AND ce.batch_id = $2
        `;
        const eligibilityResult = await db.query(eligibilityQuery, [
          company.id,
          batchId,
        ]);

        const eligibilityData = eligibilityResult.rows[0] || {
          eligible_student_ids: [],
          ineligible_student_ids: [],
          dream_company_student_ids: [],
        };

        const totalEligible = Array.isArray(
          eligibilityData.eligible_student_ids
        )
          ? eligibilityData.eligible_student_ids.length
          : 0;
        const totalIneligible = Array.isArray(
          eligibilityData.ineligible_student_ids
        )
          ? eligibilityData.ineligible_student_ids.length
          : 0;

        // Get registration count
        const registrationQuery = `
          SELECT COUNT(DISTINCT fr.student_id) as total_registered
          FROM form_responses fr
          INNER JOIN forms f ON fr.form_id = f.id
          INNER JOIN events e ON f.event_id = e.id
          WHERE e.company_id = $1 AND f.batch_year = $2
        `;
        const registrationResult = await db.query(registrationQuery, [
          company.id,
          batchYear,
        ]);
        const totalRegistered =
          parseInt(registrationResult.rows[0].total_registered) || 0;

        // Get all positions
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
        const positionsResult = await db.query(positionsQuery, [company.id]);
        const positions = positionsResult.rows;

        // Get all events
        const eventsQuery = `
          SELECT 
            e.id,
            e.title,
            e.event_date as date,
            e.start_time,
            e.end_time,
            e.venue,
            e.mode,
            e.status,
            e.round_type,
            e.round_number,
            e.position_ids,
            e.event_type,
            
            (SELECT COUNT(*) FROM event_attendance ea 
             WHERE ea.event_id = e.id AND ea.status = 'present') as present_count,
            (SELECT COUNT(*) FROM event_attendance ea 
             WHERE ea.event_id = e.id AND ea.status = 'absent') as absent_count,
            (SELECT COUNT(*) FROM student_round_results srr 
             WHERE srr.event_id = e.id AND srr.result_status = 'selected') as selected_count,
            (SELECT COUNT(*) FROM student_round_results srr 
             WHERE srr.event_id = e.id AND srr.result_status = 'rejected') as rejected_count,
            (SELECT COUNT(*) FROM student_round_results srr 
             WHERE srr.event_id = e.id AND srr.result_status = 'pending') as pending_count
            
          FROM events e
          WHERE e.company_id = $1 
            AND e.is_placement_event = TRUE
          ORDER BY e.round_number, e.event_date
        `;
        const eventsResult = await db.query(eventsQuery, [company.id]);
        const events = eventsResult.rows;

        const finalSelectionsQuery = `
          SELECT 
            s.id as student_id,
            s.offers_received,
            s.current_offer
          FROM students s
          WHERE s.batch_year = $1
            AND s.placement_status = 'placed'
        `;
        const finalSelectionsResult = await db.query(finalSelectionsQuery, [
          batchYear,
        ]);

        // Process all offers to find selections for this company
        const studentSelections = [];

        finalSelectionsResult.rows.forEach((row) => {
          let offersArray = [];

          // Parse offers_received (handle both [] and [[]] formats)
          if (row.offers_received) {
            if (Array.isArray(row.offers_received)) {
              offersArray = Array.isArray(row.offers_received[0])
                ? row.offers_received[0]
                : row.offers_received;
            }
          }

          // Check each offer if it matches the current company
          offersArray.forEach((offer) => {
            if (offer && offer.company_id === company.id && offer.position_id) {
              studentSelections.push({
                student_id: row.student_id,
                position_id: offer.position_id,
              });
            }
          });

          // Also check current_offer
          if (
            row.current_offer &&
            row.current_offer.company_id === company.id &&
            row.current_offer.position_id
          ) {
            // Avoid duplicates - only add if not already in studentSelections
            const alreadyExists = studentSelections.some(
              (s) =>
                s.student_id === row.student_id &&
                s.position_id === row.current_offer.position_id
            );
            if (!alreadyExists) {
              studentSelections.push({
                student_id: row.student_id,
                position_id: row.current_offer.position_id,
              });
            }
          }
        });

        // Count selections by position
        const selectionsByPosition = new Map();
        studentSelections.forEach((selection) => {
          const count = selectionsByPosition.get(selection.position_id) || 0;
          selectionsByPosition.set(selection.position_id, count + 1);
        });

        // Create sheet for this company
        const sheetName = `${
          companyIndex + 1
        }. ${company.company_name.substring(0, 20)}`;
        const worksheet = workbook.addWorksheet(sheetName);

        let currentRow = 1;

        // ===== COMPANY INFORMATION SECTION =====
        worksheet.mergeCells(currentRow, 1, currentRow, 9);
        let cell = worksheet.getCell(currentRow, 1);
        cell.value = "COMPANY INFORMATION";
        cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
        cell.fill = headerFill;
        cell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(currentRow).height = 25;
        currentRow++;

        const companyInfo = [
          ["Company Name", company.company_name],
          ["Sector", company.sector || "—"],
          ["Company Type", company.is_marquee ? "Marquee ⭐" : "Regular"],
          ["Website", company.website_url || "—"],
          ["Office Address", company.office_address || "—"],
          ["Work Locations", company.work_locations || "—"],
          [
            "Glassdoor Rating",
            company.glassdoor_rating ? `${company.glassdoor_rating}/5` : "—",
          ],
          ["Bond Required", company.bond_required ? "Yes" : "No"],
        ];

        companyInfo.forEach((row) => {
          const r = worksheet.getRow(currentRow);
          r.getCell(1).value = row[0];
          r.getCell(1).font = { bold: true, color: { argb: "FF1F4E78" } };
          r.getCell(1).fill = sectionHeaderFill;
          r.getCell(2).value = row[1];
          worksheet.mergeCells(currentRow, 2, currentRow, 9);
          currentRow++;
        });

        currentRow++;

        // ===== ELIGIBILITY CRITERIA SECTION =====
        worksheet.mergeCells(currentRow, 1, currentRow, 9);
        cell = worksheet.getCell(currentRow, 1);
        cell.value = "ELIGIBILITY CRITERIA";
        cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
        cell.fill = headerFill;
        cell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(currentRow).height = 25;
        currentRow++;

        const eligibilityInfo = [
          ["Minimum CGPA", company.min_cgpa || "—"],
          ["Minimum 10th %", company.eligibility_10th || "—"],
          ["Minimum 12th %", company.eligibility_12th || "—"],
          [
            "Maximum Backlogs",
            company.max_backlogs ? "Allowed" : "Not Allowed",
          ],
          ["Allowed Specializations", company.allowed_specializations || "All"],
        ];

        eligibilityInfo.forEach((row) => {
          const r = worksheet.getRow(currentRow);
          r.getCell(1).value = row[0];
          r.getCell(1).font = { bold: true, color: { argb: "FF1F4E78" } };
          r.getCell(1).fill = sectionHeaderFill;
          r.getCell(2).value = row[1];
          worksheet.mergeCells(currentRow, 2, currentRow, 9);
          currentRow++;
        });

        currentRow++;

        // ===== STATISTICS SECTION =====
        worksheet.mergeCells(currentRow, 1, currentRow, 9);
        cell = worksheet.getCell(currentRow, 1);
        cell.value = "STATISTICS";
        cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
        cell.fill = headerFill;
        cell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(currentRow).height = 25;
        currentRow++;

        const statistics = [
          ["Total Eligible Students", totalEligible],
          ["Total Ineligible Students", totalIneligible],
          ["Total Registered Students", totalRegistered],
          ["Total Final Selections", studentSelections.length],
        ];

        statistics.forEach((row) => {
          const r = worksheet.getRow(currentRow);
          r.getCell(1).value = row[0];
          r.getCell(1).font = { bold: true, color: { argb: "FF1F4E78" } };
          r.getCell(1).fill = sectionHeaderFill;
          r.getCell(2).value = row[1];
          r.getCell(2).font = { bold: true, color: { argb: "FF0070C0" } };
          worksheet.mergeCells(currentRow, 2, currentRow, 9);
          currentRow++;
        });

        currentRow++;

        // ===== POSITIONS SECTION =====
        if (positions.length > 0) {
          worksheet.mergeCells(currentRow, 1, currentRow, 9);
          cell = worksheet.getCell(currentRow, 1);
          cell.value = "POSITIONS";
          cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
          cell.fill = headerFill;
          cell.alignment = { horizontal: "center", vertical: "middle" };
          worksheet.getRow(currentRow).height = 25;
          currentRow++;

          // Positions table header
          const positionsHeaders = [
            "Position",
            "Job Type",
            "Company Type",
            "Package (LPA)",
            "Stipend",
            "Rounds Start",
            "Rounds End",
            "Selected",
            "Status",
          ];
          const headerRow = worksheet.getRow(currentRow);
          positionsHeaders.forEach((header, idx) => {
            const cell = headerRow.getCell(idx + 1);
            cell.value = header;
            cell.font = headerFont;
            cell.fill = subHeaderFill;
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
          });
          currentRow++;

          // Positions data
          positions.forEach((position) => {
            const packageDisplay =
              position.has_range && position.package_end
                ? `${position.package} - ${position.package_end}`
                : position.package;

            const finalCount = selectionsByPosition.get(position.id) || 0;

            const r = worksheet.getRow(currentRow);
            r.getCell(1).value = position.position_title;
            r.getCell(2).value = position.job_type?.replace(/_/g, " ") || "—";
            r.getCell(3).value =
              position.company_type?.replace(/_/g, " ") || "—";
            r.getCell(4).value = packageDisplay;
            r.getCell(5).value = position.internship_stipend_monthly || "—";
            r.getCell(6).value = position.rounds_start_date
              ? new Date(position.rounds_start_date).toLocaleDateString()
              : "—";
            r.getCell(7).value = position.rounds_end_date
              ? new Date(position.rounds_end_date).toLocaleDateString()
              : "—";
            r.getCell(8).value = finalCount;
            r.getCell(8).font = { bold: true, color: { argb: "FF0070C0" } };
            r.getCell(9).value = position.is_active ? "Active" : "Inactive";

            if (position.is_active) {
              r.getCell(9).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFC6EFCE" },
              };
              r.getCell(9).font = { color: { argb: "FF006100" } };
            } else {
              r.getCell(9).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFC7CE" },
              };
              r.getCell(9).font = { color: { argb: "FF9C0006" } };
            }

            r.alignment = { horizontal: "center", vertical: "middle" };
            currentRow++;
          });

          currentRow++;
        }

        // ===== ROUNDS SECTION (GROUPED VERTICALLY BY ROUND NUMBER) =====
        if (events.length > 0) {
          // Group events by round number
          const roundsMap = new Map();
          events.forEach((event) => {
            const roundNum = event.round_number || 0;
            if (!roundsMap.has(roundNum)) {
              roundsMap.set(roundNum, []);
            }
            roundsMap.get(roundNum).push(event);
          });

          const sortedRoundNumbers = Array.from(roundsMap.keys()).sort(
            (a, b) => a - b
          );

          // For each round, show all positions vertically
          sortedRoundNumbers.forEach((roundNumber) => {
            const roundEvents = roundsMap.get(roundNumber);

            // Round header
            worksheet.mergeCells(currentRow, 1, currentRow, 15);
            cell = worksheet.getCell(currentRow, 1);
            cell.value = `ROUND ${roundNumber}`;
            cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
            cell.fill = headerFill;
            cell.alignment = { horizontal: "center", vertical: "middle" };
            worksheet.getRow(currentRow).height = 25;
            currentRow++;

            // Table headers
            const roundHeaders = [
              "Position(s)",
              "Event Title",
              "Event Type",
              "Round Type",
              "Date",
              "Start Time",
              "End Time",
              "Venue",
              "Mode",
              "Status",
              "Present",
              "Absent",
              "Selected",
              "Rejected",
              "Pending",
            ];
            const headerRow = worksheet.getRow(currentRow);
            roundHeaders.forEach((header, idx) => {
              const cell = headerRow.getCell(idx + 1);
              cell.value = header;
              cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
              cell.fill = subHeaderFill;
              cell.alignment = {
                horizontal: "center",
                vertical: "middle",
                wrapText: true,
              };
            });
            currentRow++;

            // Add each event for this round
            roundEvents.forEach((event) => {
              const eventPositionIds = Array.isArray(event.position_ids)
                ? event.position_ids
                : [];
              const positionTitles =
                positions
                  .filter((p) => eventPositionIds.includes(p.id))
                  .map((p) => p.position_title)
                  .join(", ") || "All Positions";

              const eventTypeLabel =
                event.event_type === "ONLINE_TEST"
                  ? "Online Test"
                  : event.event_type === "INTERVIEW"
                  ? "Interview"
                  : event.event_type === "GD"
                  ? "Group Discussion"
                  : event.event_type === "PRESENTATION"
                  ? "Presentation"
                  : event.event_type === "CODING_ROUND"
                  ? "Coding Round"
                  : event.event_type === "HR_ROUND"
                  ? "HR Round"
                  : event.event_type === "TECHNICAL_ROUND"
                  ? "Technical Round"
                  : event.event_type === "OTHER"
                  ? "Other"
                  : event.event_type;

              const r = worksheet.getRow(currentRow);
              r.getCell(1).value = positionTitles;
              r.getCell(2).value = event.title;
              r.getCell(3).value = eventTypeLabel;
              r.getCell(4).value = event.round_type?.replace(/_/g, " ") || "—";
              r.getCell(5).value = event.date
                ? new Date(event.date).toLocaleDateString()
                : "—";
              r.getCell(6).value = event.start_time || "—";
              r.getCell(7).value = event.end_time || "—";
              r.getCell(8).value = event.venue || "—";
              r.getCell(9).value = event.mode || "—";
              r.getCell(10).value = event.status?.replace(/_/g, " ") || "—";
              r.getCell(11).value = parseInt(event.present_count) || 0;
              r.getCell(12).value = parseInt(event.absent_count) || 0;
              r.getCell(13).value = parseInt(event.selected_count) || 0;
              r.getCell(14).value = parseInt(event.rejected_count) || 0;
              r.getCell(15).value = parseInt(event.pending_count) || 0;

              // Alternate row coloring
              if (currentRow % 2 === 0) {
                for (let col = 1; col <= 15; col++) {
                  r.getCell(col).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF2F2F2" },
                  };
                }
              }

              // Center align numeric columns
              for (let col = 11; col <= 15; col++) {
                r.getCell(col).alignment = {
                  horizontal: "center",
                  vertical: "middle",
                };
                r.getCell(col).font = {
                  bold: true,
                  color: { argb: "FF0070C0" },
                };
              }

              currentRow++;
            });

            currentRow++; // Space between rounds
          });
        }

        // ===== FINAL SELECTIONS PER POSITION =====
        if (studentSelections.length > 0) {
          // Get full student details for selections
          const selectedStudentIds = [
            ...new Set(studentSelections.map((r) => r.student_id)),
          ];

          const studentsQuery = `
            SELECT 
              s.id,
              s.registration_number,
              s.full_name,
              s.college_email,
              s.branch,
              s.cgpa,
              s.current_offer
            FROM students s
            WHERE s.id = ANY($1)
          `;
          const studentsResult = await db.query(studentsQuery, [
            selectedStudentIds,
          ]);
          const studentsMap = new Map(
            studentsResult.rows.map((s) => [s.id, s])
          );

          // Group selections by position
          const selectionsByPositionDetails = new Map();
          studentSelections.forEach((selection) => {
            const posId = selection.position_id;
            if (!selectionsByPositionDetails.has(posId)) {
              selectionsByPositionDetails.set(posId, []);
            }
            const student = studentsMap.get(selection.student_id);
            if (student) {
              // Avoid duplicate students in the same position
              const alreadyAdded = selectionsByPositionDetails
                .get(posId)
                .some((s) => s.id === student.id);
              if (!alreadyAdded) {
                selectionsByPositionDetails.get(posId).push(student);
              }
            }
          });

          // Add section for each position with selections
          positions.forEach((position) => {
            const selectedStudents =
              selectionsByPositionDetails.get(position.id) || [];

            if (selectedStudents.length === 0) return;

            // Position header
            worksheet.mergeCells(currentRow, 1, currentRow, 9);
            cell = worksheet.getCell(currentRow, 1);
            cell.value = `FINAL SELECTIONS - ${position.position_title}`;
            cell.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF2E7D32" }, // Green header for selections
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            worksheet.getRow(currentRow).height = 25;
            currentRow++;

            // Column headers
            const selectionHeaders = [
              "S.No",
              "Registration Number",
              "Full Name",
              "Email",
              "Branch",
              "CGPA",
              "Source",
            ];

            const selHeaderRow = worksheet.getRow(currentRow);
            selectionHeaders.forEach((header, idx) => {
              const cell = selHeaderRow.getCell(idx + 1);
              cell.value = header;
              cell.font = headerFont;
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF60A5FA" },
              };
              cell.alignment = {
                horizontal: "center",
                vertical: "middle",
                wrapText: true,
              };
            });
            currentRow++;

            // Student data
            selectedStudents.forEach((student, index) => {
              const offerSource =
                student.current_offer?.offer_source ||
                student.current_offer?.source ||
                "on_campus";

              const r = worksheet.getRow(currentRow);
              r.getCell(1).value = index + 1;
              r.getCell(2).value = student.registration_number;
              r.getCell(3).value = student.full_name;
              r.getCell(4).value = student.college_email;
              r.getCell(5).value = student.branch;
              r.getCell(7).value = student.cgpa
                ? parseFloat(student.cgpa).toFixed(2)
                : "—";
              r.getCell(8).value =
                offerSource === "manual" ? "Off-Campus" : "On-Campus";

              // Center align S.No, CGPA, Source
              [1, 7, 8].forEach((col) => {
                r.getCell(col).alignment = {
                  horizontal: "center",
                  vertical: "middle",
                };
              });

              // Alternate row coloring
              if (index % 2 === 0) {
                for (let col = 1; col <= 8; col++) {
                  r.getCell(col).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF9FAFB" },
                  };
                }
              }

              currentRow++;
            });

            currentRow++; // Space after each position's selections
          });
        }

        // Set column widths
        worksheet.columns = [
          { width: 25 },
          { width: 20 },
          { width: 18 },
          { width: 18 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 12 },
          { width: 12 },
          { width: 15 },
          { width: 12 },
          { width: 12 },
          { width: 12 },
          { width: 12 },
          { width: 12 },
        ];
      } catch (error) {
        console.error(`Error processing company ${company.id}:`, error);
        continue;
      }
    }

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="All_Companies_Details_${batchYear}_${Date.now()}.xlsx"`
    );
    res.setHeader("Content-Length", buffer.length);

    res.send(buffer);
  } catch (error) {
    console.error("Error in all companies export:", error);
    next(error);
  }
});

// ============================================================================
// ANALYTICS API ENDPOINTS
// ============================================================================

// 1. BATCH OVERVIEW WITH DEPARTMENT FILTER
routes.get(
  "/batch/:batchYear/overview/filter/:department?",
  async (req, res) => {
    const { batchYear, department } = req.params;

    try {
      const query = `
      WITH batch_students AS (
        SELECT
          s.id,
          s.branch,
          s.placement_status,
          s.offers_received
        FROM students s
        WHERE s.batch_year = $1
          AND s.placement_status IN ('placed', 'unplaced')
          ${department && department !== "all" ? "AND s.branch = $2" : ""}
      ),
      total_offers AS (
        SELECT SUM(
          jsonb_array_length(
            COALESCE(
              jsonb_path_query_array(offers_received::jsonb, '$[*] ? (@.source == "campus")'),
              '[]'::jsonb
            )
          )
        ) as offers_count
        FROM batch_students
      ),
      student_packages AS (
        -- Only consider best package for each student for package stats
        SELECT
          s.id as student_id,
          CASE
            WHEN s.current_offer->>'source' = 'manual' THEN
              CASE
                WHEN (s.current_offer->>'has_range')::boolean = true THEN
                  (s.current_offer->>'package_end')::numeric
                ELSE
                  (s.current_offer->>'package')::numeric
              END
            ELSE
              CASE
                WHEN cp.has_range = true THEN cp.package_end
                ELSE cp.package
              END
          END as package_amount
        FROM students s
        LEFT JOIN company_positions cp ON cp.id = (s.current_offer->>'position_id')::integer
        WHERE s.batch_year = $1
          AND s.placement_status = 'placed'
          ${department && department !== "all" ? "AND s.branch = $2" : ""}
      ),
      package_stats AS (
        SELECT
          COUNT(student_id) as placed_count,
          ROUND(MAX(package_amount)::numeric, 2) as highest_package,
          ROUND(MIN(package_amount)::numeric, 2) as lowest_package,
          ROUND(AVG(package_amount)::numeric, 2) as average_package,
          ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY package_amount)::numeric, 2) as median_package
        FROM student_packages
      ),
      companies_visited AS (
        SELECT COUNT(DISTINCT c.id) as total_companies
        FROM companies c
        INNER JOIN company_batches cb ON c.id = cb.company_id
        INNER JOIN batches b ON cb.batch_id = b.id
        WHERE b.year = $1
      )
      SELECT
        (SELECT COUNT(*) FROM batch_students) as total_students,
        COALESCE((SELECT placed_count FROM package_stats), 0) as placed_students,
        CASE
          WHEN (SELECT COUNT(*) FROM batch_students) > 0 THEN
            ROUND(
              COALESCE((SELECT placed_count FROM package_stats), 0)::numeric /
              (SELECT COUNT(*) FROM batch_students)::numeric * 100, 2
            )
          ELSE 0
        END as placement_rate,
        COALESCE((SELECT highest_package FROM package_stats), 0) as highest_package,
        COALESCE((SELECT lowest_package FROM package_stats), 0) as lowest_package,
        COALESCE((SELECT average_package FROM package_stats), 0) as average_package,
        COALESCE((SELECT median_package FROM package_stats), 0) as median_package,
        COALESCE((SELECT offers_count FROM total_offers), 0) as total_offers,
        COALESCE((SELECT total_companies FROM companies_visited), 0) as companies_visited;
      `;

      const params =
        department && department !== "all"
          ? [batchYear, department]
          : [batchYear];
      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No data found for batch year ${batchYear}${
            department && department !== "all"
              ? ` and department ${department}`
              : ""
          }`,
        });
      }

      const stats = result.rows[0];

      return res.status(200).json({
        success: true,
        batchYear: parseInt(batchYear),
        department: department || "all",
        data: {
          totalStudents: parseInt(stats.total_students),
          placedStudents: parseInt(stats.placed_students),
          unplacedStudents:
            parseInt(stats.total_students) - parseInt(stats.placed_students),
          placementRate: parseFloat(stats.placement_rate),
          highestPackage: parseFloat(stats.highest_package),
          lowestPackage: parseFloat(stats.lowest_package),
          averagePackage: parseFloat(stats.average_package),
          medianPackage: parseFloat(stats.median_package),
          totalOffers: parseInt(stats.total_offers),
          companiesVisited: parseInt(stats.companies_visited),
        },
      });
    } catch (error) {
      console.error("Error fetching batch overview:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch batch overview data",
        error: error.message,
      });
    }
  }
);

// 2. DEPARTMENT-WISE PLACEMENT STATS
routes.get(
  "/batch/:batchYear/departments/filter/:department",
  async (req, res, next) => {
    try {
      const { batchYear, department } = req.params;

      const query = `
      SELECT 
        COALESCE(branch::text, 'Unknown') AS department,
        COUNT(*) AS total_students,
        COUNT(*) FILTER (WHERE placement_status = 'placed') AS placed_students,
        ROUND(
          (COUNT(*) FILTER (WHERE placement_status = 'placed')::NUMERIC /
          NULLIF(COUNT(*)::NUMERIC, 0) * 100), 
        2) AS placement_rate
      FROM students
      WHERE batch_year = $1
        AND placement_status IN ('placed', 'unplaced')
        ${department && department !== "all" ? `AND branch = $2` : ""}
      GROUP BY branch
      ORDER BY placed_students DESC;
    `;

      const params =
        department && department !== "all"
          ? [batchYear, department]
          : [batchYear];
      const result = await db.query(query, params);

      res.json({
        success: true,
        department: department || "all",
        data: result.rows.map((row) => {
          const total = parseInt(row.total_students || 0);
          const placed = parseInt(row.placed_students || 0);

          return {
            department: row.department,
            totalStudents: total,
            placedStudents: placed,
            unplacedStudents: total - placed,
            placementRate: parseFloat(row.placement_rate) || 0,
          };
        }),
      });
    } catch (error) {
      console.error("Error in department stats:", error);
      next(error);
    }
  }
);

// 3. TOP COMPANIES BY PLACEMENTS
routes.get(
  "/batch/:batchYear/top-companies/filter/:department",
  async (req, res) => {
    const { batchYear, department } = req.params;

    try {
      const query = `
      WITH batch_companies AS (
        -- Get all companies for the specified batch with department filter
        SELECT DISTINCT 
          c.id as company_id,
          c.company_name,
          c.sector,
          b.id as batch_id
        FROM companies c
        INNER JOIN company_batches cb ON c.id = cb.company_id
        INNER JOIN batches b ON cb.batch_id = b.id
        WHERE b.year = $1
        ${
          department && department !== "all"
            ? `AND c.allowed_specializations @> ARRAY[$2]::specialization_enum[]`
            : ""
        }
      ),
      last_round_events AS (
        -- Get final round events for these companies
        SELECT DISTINCT
          e.id as event_id,
          e.company_id,
          e.position_ids
        FROM events e
        INNER JOIN batch_companies bc ON e.company_id = bc.company_id
        WHERE e.round_type = 'last'
      ),
      selected_students AS (
        -- Get students selected in final rounds with department filter
        SELECT 
          lre.company_id,
          lre.event_id,
          srr.student_id,
          UNNEST(lre.position_ids) as position_id
        FROM last_round_events lre
        INNER JOIN student_round_results srr 
          ON lre.event_id = srr.event_id
        INNER JOIN students s ON srr.student_id = s.id
        WHERE srr.result_status = 'selected'
        ${department && department !== "all" ? `AND s.branch = $2` : ""}
      ),
      position_packages AS (
        -- Get package information for selected students
        SELECT 
          ss.company_id,
          ss.student_id,
          cp.package,
          cp.package_end,
          cp.has_range
        FROM selected_students ss
        INNER JOIN company_positions cp ON ss.position_id = cp.id
      ),
      company_placement_counts AS (
        -- Count placed students per company
        SELECT 
          company_id,
          COUNT(DISTINCT student_id) as total_placed
        FROM position_packages
        GROUP BY company_id
      ),
      company_package_stats AS (
        -- Calculate package statistics per company
        SELECT 
          company_id,
          ROUND(
            AVG(
              CASE 
                WHEN has_range = true AND package_end IS NOT NULL 
                THEN package_end
                ELSE package
              END
            )::numeric, 
            2
          ) as avg_package,
          ROUND(
            MAX(
              CASE 
                WHEN has_range = true AND package_end IS NOT NULL 
                THEN package_end
                ELSE package
              END
            )::numeric, 
            2
          ) as highest_package
        FROM position_packages
        GROUP BY company_id
      ),
      company_stats AS (
        SELECT 
          bc.company_id,
          bc.company_name,
          bc.sector,
          
          -- Eligible students count with department filter
          COALESCE(
            (SELECT COUNT(*) 
             FROM jsonb_array_elements_text(ce.eligible_student_ids) AS student_id
             INNER JOIN students s ON student_id::INTEGER = s.id
             WHERE ${
               department && department !== "all" ? `s.branch = $2 AND` : ""
             } 
                   ce.company_id = bc.company_id 
                   AND ce.batch_id = bc.batch_id
            ), 0
          ) as total_eligible,
          
          -- Registered students count (from forms linked to company events) with department filter
          COALESCE(
            (SELECT COUNT(DISTINCT fr.student_id)
             FROM forms f
             INNER JOIN form_responses fr ON f.id = fr.form_id
             INNER JOIN events e ON f.event_id = e.id
             INNER JOIN students s ON fr.student_id = s.id
             WHERE e.company_id = bc.company_id
               AND f.batch_year = $1
               ${department && department !== "all" ? `AND s.branch = $2` : ""}
            ), 0
          ) as total_registered,
          
          -- Placed students count from separate CTE
          COALESCE(cpc.total_placed, 0) as total_placed,
          
          -- Package statistics from separate CTE
          COALESCE(cps.avg_package, 0) as avg_package,
          COALESCE(cps.highest_package, 0) as highest_package
          
        FROM batch_companies bc
        LEFT JOIN company_eligibility ce 
          ON bc.company_id = ce.company_id 
          AND bc.batch_id = ce.batch_id
        LEFT JOIN company_placement_counts cpc 
          ON bc.company_id = cpc.company_id
        LEFT JOIN company_package_stats cps 
          ON bc.company_id = cps.company_id
      )
      SELECT 
        company_name as "companyName",
        sector,
        total_eligible as "totalEligible",
        total_registered as "totalRegistered",
        total_placed as "totalPlaced",
        avg_package as "avgPackage",
        highest_package as "highestPackage",
        CASE 
          WHEN total_eligible > 0 
          THEN ROUND((total_placed::numeric / total_eligible::numeric * 100), 2)
          ELSE 0
        END as "successRate"
      FROM company_stats
      WHERE total_placed > 0  -- Only show companies with placements
      ORDER BY total_placed DESC, avg_package DESC
      limit 10;
    `;

      const params =
        department && department !== "all"
          ? [batchYear, department]
          : [batchYear];
      const result = await db.query(query, params);

      return res.status(200).json({
        success: false,
        batchYear: parseInt(batchYear),
        department: department || "all",
        totalCompanies: result.rows.length,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching top companies:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch top companies data",
        error: error.message,
      });
    }
  }
);

// 4. PACKAGE DISTRIBUTION - For histogram
routes.get(
  "/batch/:batchYear/packages/filter/:department",
  async (req, res, next) => {
    try {
      const { batchYear, department } = req.params;

      const packagesQuery = `
      SELECT 
        s.id,
        s.full_name,
        s.branch::text as department,
        c.company_name,
        cp.position_title,
        cp.job_type,
        CASE 
          WHEN cp.has_range = true THEN cp.package_end
          ELSE cp.package
        END as package,
        (s.current_offer->>'acceptance_date')::DATE as acceptance_date
      FROM students s
      INNER JOIN companies c 
        ON (s.current_offer->>'company_id')::INTEGER = c.id
      INNER JOIN company_positions cp 
        ON (s.current_offer->>'position_id')::INTEGER = cp.id
      WHERE s.batch_year = $1
        AND s.placement_status = 'placed'
        AND s.current_offer IS NOT NULL
        AND (s.current_offer->>'company_id') IS NOT NULL
        AND (s.current_offer->>'position_id') IS NOT NULL
        ${department && department !== "all" ? `AND s.branch = $2` : ""}
      ORDER BY package DESC
    `;

      const params =
        department && department !== "all"
          ? [batchYear, department]
          : [batchYear];
      const result = await db.query(packagesQuery, params);

      // Extract valid package numbers
      const packages = result.rows
        .map((row) => parseFloat(row.package || 0))
        .filter((p) => !isNaN(p) && p > 0);

      if (packages.length === 0) {
        return res.json({
          success: true,
          department: department || "all",
          data: [],
        });
      }

      // Predefined bins
      const binsConfig = [
        { label: "<6 LPA", min: 0, max: 6 },
        { label: "6-8 LPA", min: 6, max: 8 },
        { label: "8-10 LPA", min: 8, max: 10 },
        { label: "10-15 LPA", min: 10, max: 15 },
        { label: "15-20 LPA", min: 15, max: 20 },
        { label: "20+ LPA", min: 20, max: Infinity },
      ];

      const bins = binsConfig.map((bin) => {
        const count = packages.filter(
          (p) => p > bin.min && p <= bin.max
        ).length;
        return {
          range: bin.label,
          count,
          rangeStart: bin.min,
          rangeEnd: bin.max === Infinity ? null : bin.max,
        };
      });

      res.json({
        success: true,
        department: department || "all",
        data: bins,
      });
    } catch (error) {
      console.error("Error in package distribution:", error);
      next(error);
    }
  }
);

// 5. COMPANY TIMELINE ANALYSIS (offers_received -> acceptance_date used for placements)
routes.get(
  "/batch/:batchYear/company-timeline/filter/:department",
  async (req, res) => {
    const { batchYear, department } = req.params;

    try {
      const query = `
      WITH batch_companies AS (
        -- Get all companies for the specified batch with optional department filter (affects company allowed_specializations)
        SELECT DISTINCT
          c.id as company_id,
          c.company_name,
          c.sector,
          c.jd_shared_date
        FROM companies c
        INNER JOIN company_batches cb ON c.id = cb.company_id
        INNER JOIN batches b ON cb.batch_id = b.id
        WHERE b.year = $1
        ${
          department && department !== "all"
            ? `AND c.allowed_specializations @> ARRAY[$2]::specialization_enum[]`
            : ""
        }
      ),

      company_position_dates AS (
        -- Get round dates and package info for each company position
        SELECT
          cp.company_id,
          cp.id as position_id,
          cp.position_title,
          cp.rounds_start_date,
          cp.rounds_end_date,
          cp.job_type,
          cp.package,
          cp.has_range,
          cp.package_end
        FROM company_positions cp
      ),

      -- NEW: use students.offers_received (JSONB array) and acceptance_date as the placement date
      position_placements AS (
        SELECT
          c.id AS company_id,
          cp.id AS position_id,
          cp.position_title,
          (offer ->> 'acceptance_date')::date AS acceptance_date,
          COUNT(DISTINCT s.id) AS placed_count,

          -- average package (based on position package/range)
          ROUND(AVG(
            CASE
              WHEN cp.has_range = true AND cp.package_end IS NOT NULL AND cp.package_end > 0
                THEN (cp.package + cp.package_end) / 2
              WHEN cp.package > 0 THEN cp.package
              ELSE NULL
            END
          )::numeric, 2) AS avg_package,

          -- highest package
          ROUND(MAX(
            CASE
              WHEN cp.has_range = true AND cp.package_end IS NOT NULL AND cp.package_end > 0
                THEN cp.package_end
              WHEN cp.package > 0 THEN cp.package
              ELSE NULL
            END
          )::numeric, 2) AS highest_package

        FROM students s
        -- expand offers_received array into rows (offer is jsonb)
        CROSS JOIN LATERAL jsonb_array_elements(s.offers_received) AS offer
        INNER JOIN companies c ON c.id = (offer ->> 'company_id')::int
        INNER JOIN company_positions cp ON cp.id = (offer ->> 'position_id')::int
        INNER JOIN company_batches cb ON cb.company_id = c.id
        INNER JOIN batches b ON b.id = cb.batch_id
        WHERE b.year = $1
          -- either explicitly accepted OR has acceptance_date (some data might have acceptance_date even if is_accepted false)
          AND (
            (offer ->> 'is_accepted') = 'true'
            OR (offer ->> 'acceptance_date') IS NOT NULL
          )
          -- only consider valid acceptance dates
          AND (offer ->> 'acceptance_date') IS NOT NULL
          ${department && department !== "all" ? `AND s.branch = $2` : ""}
        GROUP BY c.id, cp.id, cp.position_title, (offer ->> 'acceptance_date')::date, cp.has_range, cp.package_end, cp.package
      ),

      company_rounds_aggregated AS (
        -- Calculate company-level earliest start and latest end date (null if any end date missing)
        SELECT
          company_id,
          MIN(rounds_start_date) as company_rounds_start_date,
          CASE
            WHEN COUNT(*) FILTER (WHERE rounds_end_date IS NULL) > 0 THEN NULL
            ELSE MAX(rounds_end_date)
          END as company_rounds_end_date
        FROM company_position_dates
        WHERE rounds_start_date IS NOT NULL
        GROUP BY company_id
      ),

      company_status AS (
        -- Determine status per company using JD / rounds aggregation
        SELECT
          bc.company_id,
          bc.company_name,
          bc.sector,
          bc.jd_shared_date,
          cra.company_rounds_start_date,
          cra.company_rounds_end_date,
          CASE
            WHEN cra.company_rounds_end_date IS NOT NULL THEN 'completed'
            WHEN cra.company_rounds_start_date IS NOT NULL THEN 'ongoing'
            WHEN bc.jd_shared_date IS NOT NULL THEN 'jd_shared'
            ELSE NULL
          END as status
        FROM batch_companies bc
        LEFT JOIN company_rounds_aggregated cra ON bc.company_id = cra.company_id
      ),

      -- Dataset 1: Placement Timeline (grouped by acceptance_date)
      placement_timeline AS (
        SELECT
          TO_CHAR(pp.acceptance_date, 'YYYY-MM') as month_key,
          TO_CHAR(pp.acceptance_date, 'Month YYYY') as month_label,
          EXTRACT(YEAR FROM pp.acceptance_date) as year,
          EXTRACT(MONTH FROM pp.acceptance_date) as month,
          SUM(pp.placed_count) as total_placements,
          ROUND(AVG(pp.avg_package)::numeric, 2) as avg_package,
          ROUND(MAX(pp.highest_package)::numeric, 2) as highest_package,
          json_agg(
            json_build_object(
              'companyId', cs.company_id,
              'companyName', cs.company_name,
              'positionTitle', pp.position_title,
              'sector', cs.sector,
              'acceptanceDate', pp.acceptance_date,
              'studentsPlaced', pp.placed_count,
              'avgPackage', pp.avg_package,
              'highestPackage', pp.highest_package
            ) ORDER BY pp.acceptance_date, cs.company_name
          ) as positions
        FROM position_placements pp
        INNER JOIN company_status cs ON pp.company_id = cs.company_id
        WHERE pp.acceptance_date IS NOT NULL
        GROUP BY month_key, month_label, year, month
      ),

      -- Dataset 2: Activity Timeline (grouped by JD / first rounds start)
      activity_timeline AS (
        -- First, get JD shared entries
        SELECT
          month_key,
          month_label,
          year,
          month,
          COUNT(DISTINCT company_id) as jd_shared_count,
          0 as ongoing_count,
          0 as completed_count,
          json_agg(
            jsonb_build_object(
              'companyId', company_id,
              'companyName', company_name,
              'sector', sector,
              'status', 'jd_shared',
              'jdSharedDate', jd_shared_date,
              'roundsStartDate', company_rounds_start_date,
              'roundsEndDate', company_rounds_end_date
            )
          ) as companies
        FROM (
          SELECT DISTINCT ON (cs.company_id, TO_CHAR(cs.jd_shared_date, 'YYYY-MM'))
            TO_CHAR(cs.jd_shared_date, 'YYYY-MM') as month_key,
            TO_CHAR(cs.jd_shared_date, 'Month YYYY') as month_label,
            EXTRACT(YEAR FROM cs.jd_shared_date) as year,
            EXTRACT(MONTH FROM cs.jd_shared_date) as month,
            cs.company_id,
            cs.company_name,
            cs.sector,
            cs.jd_shared_date,
            cs.company_rounds_start_date,
            cs.company_rounds_end_date
          FROM company_status cs
          WHERE cs.jd_shared_date IS NOT NULL
        ) deduped
        GROUP BY month_key, month_label, year, month

        UNION ALL

        -- Then, get ongoing/completed entries (based on rounds_start_date)
        SELECT
          month_key,
          month_label,
          year,
          month,
          0 as jd_shared_count,
          COUNT(DISTINCT company_id) FILTER (WHERE status = 'ongoing') as ongoing_count,
          COUNT(DISTINCT company_id) FILTER (WHERE status = 'completed') as completed_count,
          json_agg(
            jsonb_build_object(
              'companyId', company_id,
              'companyName', company_name,
              'sector', sector,
              'status', status,
              'jdSharedDate', jd_shared_date,
              'roundsStartDate', company_rounds_start_date,
              'roundsEndDate', company_rounds_end_date
            )
          ) as companies
        FROM (
          SELECT DISTINCT ON (cs.company_id, TO_CHAR(cs.company_rounds_start_date, 'YYYY-MM'))
            TO_CHAR(cs.company_rounds_start_date, 'YYYY-MM') as month_key,
            TO_CHAR(cs.company_rounds_start_date, 'Month YYYY') as month_label,
            EXTRACT(YEAR FROM cs.company_rounds_start_date) as year,
            EXTRACT(MONTH FROM cs.company_rounds_start_date) as month,
            cs.company_id,
            cs.company_name,
            cs.sector,
            cs.status,
            cs.jd_shared_date,
            cs.company_rounds_start_date,
            cs.company_rounds_end_date
          FROM company_status cs
          WHERE cs.company_rounds_start_date IS NOT NULL
            AND cs.status IN ('ongoing', 'completed')
        ) deduped
        GROUP BY month_key, month_label, year, month
      )

      -- Combine datasets into one JSON object
      SELECT
        json_build_object(
          'placementTimeline', (
            SELECT json_agg(pt ORDER BY pt.year, pt.month)
            FROM placement_timeline pt
          ),
          'activityTimeline', (
            SELECT json_agg(
              json_build_object(
                'month_key', agg.month_key,
                'month_label', agg.month_label,
                'year', agg.year,
                'month', agg.month,
                'jd_shared_count', agg.jd_shared_count,
                'ongoing_count', agg.ongoing_count,
                'completed_count', agg.completed_count,
                'companies', agg.companies
              ) ORDER BY agg.year, agg.month
            )
            FROM (
              SELECT 
                at.month_key,
                at.month_label,
                at.year,
                at.month,
                SUM(at.jd_shared_count) as jd_shared_count,
                SUM(at.ongoing_count) as ongoing_count,
                SUM(at.completed_count) as completed_count,
                json_agg(DISTINCT comp) as companies
              FROM activity_timeline at
              CROSS JOIN LATERAL jsonb_array_elements(at.companies::jsonb) as comp
              GROUP BY at.month_key, at.month_label, at.year, at.month
            ) agg
          )
        ) as data;
      `;

      const params =
        department && department !== "all"
          ? [batchYear, department]
          : [batchYear];

      const result = await db.query(query, params);

      const datasets = result.rows[0]?.data || {
        placementTimeline: [],
        activityTimeline: [],
      };

      // Calculate cumulative placements
      let cumulativePlacements = 0;
      const placementTimeline = (datasets.placementTimeline || []).map(
        (row, index) => {
          cumulativePlacements += parseInt(row.total_placements) || 0;
          return {
            ...row,
            cumulativePlacements,
          };
        }
      );

      // Calculate summary statistics
      const totalPlacements = placementTimeline.reduce(
        (sum, row) => sum + (parseInt(row.total_placements) || 0),
        0
      );

      const allCompanies = new Set();
      (datasets.activityTimeline || []).forEach((month, index) => {
        (month.companies || []).forEach((comp) => {
          allCompanies.add(comp.companyId); // Changed to companyId
        });
      });

      const summary = {
        totalMonths: placementTimeline.length,
        totalCompaniesActive: allCompanies.size,
        totalPlacementsMade: totalPlacements,
        overallAvgPackage:
          placementTimeline.length > 0
            ? parseFloat(
                (
                  placementTimeline.reduce(
                    (sum, row) => sum + parseFloat(row.avg_package || 0),
                    0
                  ) / placementTimeline.length
                ).toFixed(2)
              )
            : 0,
        peakPlacementMonth:
          placementTimeline.length > 0
            ? placementTimeline.reduce((max, row) =>
                parseInt(row.total_placements) >
                parseInt(max.total_placements || 0)
                  ? row
                  : max
              ).month_label
            : null,
      };

      return res.status(200).json({
        success: true,
        batchYear: parseInt(batchYear),
        department: department || "all",
        summary,
        placementTimeline,
        activityTimeline: datasets.activityTimeline || [],
      });
    } catch (error) {
      console.error("Error message:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch company timeline data",
        error: error.message,
      });
    }
  }
);

module.exports = routes;

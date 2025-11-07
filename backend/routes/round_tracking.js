const express = require("express");
const routes = express.Router();
const db = require("../db");
const { addCampusOffer } = require("./offers");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".xlsx", ".xls", ".csv"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel and CSV files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// GET /round-tracking/companies/:year
routes.get("/companies/:year", async (req, res) => {
  const { year } = req.params;

  try {
    // Get all companies for the year with their positions
    const companiesQuery = `
      SELECT DISTINCT
        c.id AS company_id,
        c.company_name,
        c.is_marquee,
        c.sector,
        c.office_address,
        c.jd_shared_date,
        c.eligibility_10th,
        c.eligibility_12th,
        c.max_backlogs,
        cp.id AS position_id,
        cp.position_title,
        cp.job_type,
        cp.package,
        cp.has_range,
        cp.package_end,
        cp.internship_stipend_monthly,
        cp.is_active AS position_active
      FROM companies c
      INNER JOIN company_batches cb ON c.id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN company_positions cp ON c.id = cp.company_id
      WHERE b.year = $1
      ORDER BY c.company_name, cp.position_title
    `;

    const companiesResult = await db.query(companiesQuery, [year]);

    // Get all events with their stats for this year
    const eventsQuery = `
      SELECT
        e.id AS event_id,
        e.title AS event_title,
        e.event_date,
        e.start_time,
        e.end_time,
        e.venue,
        e.mode,
        e.status AS event_status,
        e.is_placement_event,
        e.round_number,
        e.company_id,
        e.position_ids
      FROM events e
      INNER JOIN event_batches eb ON e.id = eb.event_id
      INNER JOIN batches b ON eb.batch_id = b.id
      WHERE b.year = $1
        AND e.is_placement_event = true
      ORDER BY e.company_id, e.round_number, e.event_date
    `;

    const eventsResult = await db.query(eventsQuery, [year]);

    // For each event, get position-specific stats
    const eventsWithStats = await Promise.all(
      eventsResult.rows.map(async (event) => {
        const statsPerPosition = {};

        // Process each position in this event
        for (const positionId of event.position_ids || []) {
          let appliedCount = 0;
          let attendedCount = 0;
          let qualifiedCount = 0;
          let eligibleCount = 0;

          if (event.round_number === 1) {
            // Round 1: Get eligible students from company_eligibility instead of form_responses
            const eligibilityQuery = `
              SELECT
                COALESCE(total_eligible_count, 0) AS eligible_count,
                eligible_student_ids
              FROM company_eligibility
              WHERE company_id = $1 AND batch_id = (
                SELECT id FROM batches WHERE year = $2 LIMIT 1
              )
            `;

            const eligibilityResult = await db.query(eligibilityQuery, [
              event.company_id,
              year,
            ]);
            const eligibility = eligibilityResult.rows[0] || {
              eligible_count: 0,
              eligible_student_ids: [],
            };

            eligibleCount = parseInt(eligibility.eligible_count) || 0;

            // Applied students still come from form responses (for position-specific applications)
            const round1StatsQuery = `
              SELECT
                COUNT(DISTINCT fr.student_id) AS applied_count,
                COUNT(DISTINCT CASE WHEN ea.status = 'present' THEN ea.student_id END) AS attended_count,
                COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' THEN srr.student_id END) AS qualified_count
              FROM form_responses fr
              INNER JOIN forms f ON fr.form_id = f.id
              LEFT JOIN event_attendance ea ON ea.event_id = f.event_id AND ea.student_id = fr.student_id
              LEFT JOIN student_round_results srr ON srr.event_id = f.event_id AND srr.student_id = fr.student_id
              WHERE f.event_id = $1
                AND (fr.response_data->>'position_id')::int = $2
                AND f.batch_year = $3
            `;

            const statsResult = await db.query(round1StatsQuery, [
              event.event_id,
              positionId,
              year,
            ]);
            const stats = statsResult.rows[0];

            appliedCount = parseInt(stats.applied_count) || 0;
            attendedCount = parseInt(stats.attended_count) || 0;
            qualifiedCount = parseInt(stats.qualified_count) || 0;
          } else {
            // Round 2+: Count students selected in previous round for this position
            const prevRoundStatsQuery = `
              SELECT
                COUNT(DISTINCT s.id) as eligible_count,
                COUNT(DISTINCT CASE WHEN ea.status = 'present' THEN s.id END) as attended_count,
                COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' THEN s.id END) as qualified_count
              FROM students s
              INNER JOIN student_round_results prev_srr ON prev_srr.student_id = s.id
              INNER JOIN events prev_event ON prev_event.id = prev_srr.event_id
              INNER JOIN form_responses fr ON fr.student_id = s.id
              INNER JOIN forms f ON f.id = fr.form_id
              LEFT JOIN event_attendance ea ON ea.event_id = $1 AND ea.student_id = s.id
              LEFT JOIN student_round_results srr ON srr.event_id = $1 AND srr.student_id = s.id
              WHERE prev_srr.result_status = 'selected'
                AND prev_event.company_id = $2
                AND prev_event.round_number = $3
                AND (fr.response_data->>'position_id')::int = $4
                AND f.event_id IN (
                  SELECT id FROM events
                  WHERE company_id = $2 AND round_number = 1
                )
            `;

            const statsResult = await db.query(prevRoundStatsQuery, [
              event.event_id,
              event.company_id,
              event.round_number - 1,
              positionId,
            ]);
            const stats = statsResult.rows[0];

            eligibleCount = parseInt(stats.eligible_count) || 0;
            attendedCount = parseInt(stats.attended_count) || 0;
            qualifiedCount = parseInt(stats.qualified_count) || 0;
            appliedCount = 0; // No new applications in subsequent rounds
          }

          statsPerPosition[positionId] = {
            applied_count: appliedCount,
            eligible_count: eligibleCount,
            attended_count: attendedCount,
            qualified_count: qualifiedCount,
          };
        }

        return {
          ...event,
          stats_per_position: statsPerPosition,
        };
      })
    );

    // Group results by company and position
    const companiesMap = new Map();

    companiesResult.rows.forEach((row) => {
      if (!companiesMap.has(row.company_id)) {
        companiesMap.set(row.company_id, {
          id: row.company_id,
          company_name: row.company_name,
          is_marquee: row.is_marquee,
          sector: row.sector,
          positions: new Map(),
        });
      }

      const company = companiesMap.get(row.company_id);

      if (row.position_id && !company.positions.has(row.position_id)) {
        company.positions.set(row.position_id, {
          id: row.position_id,
          position_title: row.position_title,
          job_type: row.job_type,
          package: row.package ? parseFloat(row.package) : null,
          has_range: row.has_range || false,
          package_end: row.package_end ? parseFloat(row.package_end) : null,
          internship_stipend_monthly: row.internship_stipend_monthly || null,
          is_active: row.position_active,
          events: [],
          final_selected_count: 0,
        });
      }
    });

    // Add events to their respective positions
    eventsWithStats.forEach((event) => {
      const company = companiesMap.get(event.company_id);
      if (!company) return;

      (event.position_ids || []).forEach((positionId) => {
        const position = company.positions.get(positionId);
        if (!position) return;

        const stats = event.stats_per_position[positionId] || {
          applied_count: 0,
          eligible_count: 0,
          attended_count: 0,
          qualified_count: 0,
        };

        position.events.push({
          id: event.event_id,
          title: event.event_title,
          event_date: event.event_date,
          start_time: event.start_time,
          end_time: event.end_time,
          venue: event.venue,
          mode: event.mode,
          status: event.event_status,
          round_number: event.round_number,
          applied_count: stats.applied_count,
          eligible_count: stats.eligible_count,
          attended_count: stats.attended_count,
          qualified_count: stats.qualified_count,
        });

        // Count final selections (from last round)
        if (event.event_status === "completed") {
          position.final_selected_count = stats.qualified_count;
        }
      });
    });

    // Convert maps to arrays
    const companies = Array.from(companiesMap.values()).map((company) => {
      const positions = Array.from(company.positions.values());
      return {
        ...company,
        positions,
      };
    });

    res.json({ companies });
  } catch (error) {
    console.error("Error fetching companies with rounds:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch companies with rounds",
      error: error.message,
    });
  }
});

// GET /round-tracking/stats/:year
routes.get("/stats/:year", async (req, res) => {
  let { year } = req.params;
  year = parseInt(year);

  try {
    const statsQuery = `
      WITH batch_data AS (
        SELECT id FROM batches WHERE year = $1
      )
      SELECT 
        (SELECT COUNT(DISTINCT fr.student_id) 
         FROM form_responses fr 
         JOIN forms f ON fr.form_id = f.id
         JOIN events e ON f.event_id = e.id 
         WHERE e.is_placement_event = true 
         AND f.batch_year = $1) as total_applications,
        
        (SELECT COUNT(DISTINCT c.id) 
         FROM companies c 
         JOIN company_batches cb ON c.id = cb.company_id
         JOIN batch_data bd ON cb.batch_id = bd.id
         WHERE EXISTS (
           SELECT 1 FROM events e
           WHERE e.company_id = c.id
           AND e.status IN ('ongoing', 'upcoming')
           AND e.is_placement_event = true
         )) as active_companies,
        
        (SELECT COUNT(DISTINCT srr.student_id)
         FROM student_round_results srr
         JOIN events e ON srr.event_id = e.id
         JOIN event_batches eb ON e.id = eb.event_id
         JOIN batches bd ON eb.batch_id = bd.id
         WHERE srr.result_status = 'selected'
           AND e.is_placement_event = true
           AND e.round_type = 'last'
        ) AS total_placements
    `;

    const result = await db.query(statsQuery, [year]);
    const stats = result.rows[0];

    res.json({
      totalApplications: parseInt(stats.total_applications) || 0,
      activeCompanies: parseInt(stats.active_companies) || 0,
      totalPlacements: parseInt(stats.total_placements) || 0,
    });
  } catch (error) {
    console.error("Error fetching round tracking stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch round tracking stats",
      error: error.message,
    });
  }
});

// GET /round-tracking/events/:eventId/students
routes.get("/events/:eventId/students", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status = "applied", positionId } = req.query;

    // Get event details first
    const eventQuery = `
      SELECT id, round_number, company_id, position_ids, is_placement_event
      FROM events
      WHERE id = $1
    `;
    const eventResult = await db.query(eventQuery, [eventId]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventResult.rows[0];
    let query = "";
    let params = [];

    if (event.round_number === 1) {
      // Round 1: Get students from form responses
      query = `
        SELECT DISTINCT
          s.id,
          s.registration_number,
          s.full_name as name,
          s.enrollment_number,
          s.cgpa,
          s.department,
          s.branch,
          s.batch_year,
          (fr.response_data->>'position_id')::int as applied_position_id,
          fr.id as form_response_id,
          ea.status as attendance_status,
          srr.result_status
        FROM students s
        INNER JOIN form_responses fr ON fr.student_id = s.id
        INNER JOIN forms f ON f.id = fr.form_id
        LEFT JOIN event_attendance ea ON ea.event_id = $1 AND ea.student_id = s.id
        LEFT JOIN student_round_results srr ON srr.event_id = $1 AND srr.student_id = s.id
        WHERE f.event_id = $1
      `;
      params = [eventId];

      // Filter by position if provided
      if (positionId) {
        query += ` AND (fr.response_data->>'position_id')::int = $${
          params.length + 1
        }`;
        params.push(parseInt(positionId));
      }
    } else {
      // Round 2+: Get students selected from previous round
      query = `
        SELECT DISTINCT
          s.id,
          s.registration_number,
          s.full_name as name,
          s.enrollment_number,
          s.cgpa,
          s.department,
          s.branch,
          s.batch_year,
          (initial_fr.response_data->>'position_id')::int as applied_position_id,
          NULL as form_response_id,
          ea.status as attendance_status,
          srr.result_status
        FROM students s
        INNER JOIN student_round_results prev_srr ON prev_srr.student_id = s.id
        INNER JOIN events prev_event ON prev_event.id = prev_srr.event_id
        INNER JOIN form_responses initial_fr ON initial_fr.student_id = s.id
        INNER JOIN forms initial_f ON initial_f.id = initial_fr.form_id
        LEFT JOIN event_attendance ea ON ea.event_id = $1 AND ea.student_id = s.id
        LEFT JOIN student_round_results srr ON srr.event_id = $1 AND srr.student_id = s.id
        WHERE prev_srr.result_status = 'selected'
          AND prev_event.company_id = $2
          AND prev_event.round_number = $3
          AND initial_f.event_id IN (
            SELECT id FROM events WHERE company_id = $2 AND round_number = 1
          )
      `;
      params = [eventId, event.company_id, event.round_number - 1];

      // Filter by position if provided
      if (positionId) {
        query += ` AND (initial_fr.response_data->>'position_id')::int = $${
          params.length + 1
        }`;
        params.push(parseInt(positionId));
      }
    }

    // Apply status filters
    if (status === "applied") {
      // Already filtered by form responses
    } else if (status === "attended") {
      query += " AND ea.status = 'present'";
    } else if (status === "qualified") {
      query += " AND srr.result_status = 'selected'";
    } else if (status === "rejected") {
      query += " AND srr.result_status = 'rejected'";
    } else if (status === "pending") {
      query += " AND srr.result_status = 'pending'";
    }

    query += " ORDER BY s.registration_number";

    const result = await db.query(query, params);

    const students = result.rows.map((row) => ({
      id: row.id,
      registration_number: row.registration_number,
      name: row.name,
      enrollment_number: row.enrollment_number,
      cgpa: row.cgpa ? parseFloat(row.cgpa) : null,
      department: row.department,
      branch: row.branch,
      batch_year: row.batch_year,
      applied_position_id: row.applied_position_id,
      has_applied: !!row.form_response_id || event.round_number > 1,
      attendance_status: row.attendance_status,
      check_in_time: row.check_in_time,
      result_status: row.result_status,
    }));

    res.json({
      success: true,
      students,
      count: students.length,
      event: {
        round_number: event.round_number,
        position_ids: event.position_ids,
      },
    });
  } catch (error) {
    console.error("Error fetching event students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event students",
      error: error.message,
    });
  }
});

// POST /round-tracking/events/:eventId/results - Update round results
routes.post("/events/:eventId/results", async (req, res) => {
  const client = await db.connect();

  try {
    const { eventId } = req.params;
    const { qualifiedRegistrationNumbers = [], method = "manual" } = req.body;

    if (!Array.isArray(qualifiedRegistrationNumbers)) {
      return res.status(400).json({
        success: false,
        message: "qualifiedRegistrationNumbers must be an array",
      });
    }

    await client.query("BEGIN");

    // Fetch event details
    const eventQuery = `
      SELECT id, title, round_number, round_type, company_id, position_ids
      FROM events
      WHERE id = $1
    `;
    const eventResult = await client.query(eventQuery, [eventId]);
    if (eventResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const event = eventResult.rows[0];
    const isLastRound = event.round_type === "last";
    const companyId = event.company_id;

    const positionIds = parseIntegerArray(event.position_ids);

    // Get all students who attended this event
    const attendedStudentsQuery = `
      SELECT s.id, s.registration_number, s.offers_received
      FROM students s
      JOIN event_attendance ea ON s.id = ea.student_id
      WHERE ea.event_id = $1 AND ea.status = 'present'
    `;
    const attendedResult = await client.query(attendedStudentsQuery, [eventId]);
    const attendedStudents = attendedResult.rows;

    const studentMap = Object.fromEntries(
      attendedStudents.map((s) => [s.registration_number, s.id])
    );

    // Fetch existing round results
    const existingResultsQuery = `
      SELECT student_id, result_status
      FROM student_round_results
      WHERE event_id = $1
    `;
    const existingResultsResult = await client.query(existingResultsQuery, [
      eventId,
    ]);
    const existingSelectedStudentIds = existingResultsResult.rows
      .filter((r) => r.result_status === "selected")
      .map((r) => r.student_id);

    // Determine newly selected and removed students
    const newSelectedStudentIds = qualifiedRegistrationNumbers
      .map((regNum) => studentMap[regNum])
      .filter(Boolean);

    const studentsToAddOffer = newSelectedStudentIds.filter(
      (id) => !existingSelectedStudentIds.includes(id)
    );
    const studentsToRemoveOffer = existingSelectedStudentIds.filter(
      (id) => !newSelectedStudentIds.includes(id)
    );

    let selectedCount = 0;
    let rejectedCount = 0;

    // Mark selected students
    for (const studentId of newSelectedStudentIds) {
      await client.query(
        `
        INSERT INTO student_round_results (student_id, event_id, result_status, created_at, updated_at)
        VALUES ($1, $2, 'selected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, event_id)
        DO UPDATE SET result_status = 'selected', updated_at = CURRENT_TIMESTAMP
        `,
        [studentId, eventId]
      );
      selectedCount++;
    }

    // Mark non-selected students as rejected
    const nonSelectedStudentIds = attendedStudents
      .map((s) => s.id)
      .filter((id) => !newSelectedStudentIds.includes(id));

    if (nonSelectedStudentIds.length > 0) {
      const placeholders = nonSelectedStudentIds
        .map((_, i) => `$${i + 2}`)
        .join(",");
      await client.query(
        `
        INSERT INTO student_round_results (student_id, event_id, result_status, created_at, updated_at)
        VALUES ${nonSelectedStudentIds
          .map(
            (_, i) =>
              `($${
                i + 2
              }, $1, 'rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
          )
          .join(",")}
        ON CONFLICT (student_id, event_id)
        DO UPDATE SET result_status = 'rejected', updated_at = CURRENT_TIMESTAMP
        `,
        [eventId, ...nonSelectedStudentIds]
      );
      rejectedCount = nonSelectedStudentIds.length;
    }

    // Add campus offers for newly selected students if last round
    if (isLastRound && companyId && positionIds.length > 0) {
      for (const studentId of studentsToAddOffer) {
        for (const positionId of positionIds) {
          await addCampusOffer(studentId, companyId, positionId, {});
        }
      }
    }

    // Remove campus offers for students deselected in last round
    if (isLastRound && studentsToRemoveOffer.length > 0) {
      for (const studentId of studentsToRemoveOffer) {
        // Fetch student with offers_received and current_offer from DB
        const studentResult = await client.query(
          `SELECT offers_received, current_offer, registration_number FROM students WHERE id = $1`,
          [studentId]
        );

        if (studentResult.rows.length === 0) {
          continue;
        }

        const student = studentResult.rows[0];
        if (!Array.isArray(student.offers_received))
          student.offers_received = [];

        // Remove the campus offer(s) associated with this event/company/positions
        const updatedOffers = student.offers_received.filter(
          (o) => !(o.source === "campus" && o.company_id === event.company_id)
        );

        // Check if current_offer is the one being removed
        let newCurrentOffer = student.current_offer;
        const removedCurrentOffer =
          student.current_offer &&
          student.current_offer.source === "campus" &&
          student.current_offer.company_id === event.company_id;

        if (removedCurrentOffer) {
          newCurrentOffer = updatedOffers.length > 0 ? updatedOffers[0] : null;
        }

        const newStatus = updatedOffers.length > 0 ? "placed" : "unplaced";

        await client.query(
          `UPDATE students
           SET offers_received = $1,
               current_offer = $2,
               placement_status = $3,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          [
            JSON.stringify(updatedOffers),
            JSON.stringify(newCurrentOffer),
            newStatus,
            studentId,
          ]
        );
      }
    }

    // Update event status to completed
    await client.query(
      `UPDATE events SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [eventId]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Round results updated successfully",
      data: {
        eventId: parseInt(eventId),
        totalAttended: attendedStudents.length,
        selectedCount,
        rejectedCount,
        method,
        isLastRound,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating round results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update round results",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// GET /round-tracking/events/:eventId/details - Get detailed event information
routes.get("/events/:eventId/details", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { positionId } = req.query;

    const eventQuery = `
      SELECT 
        e.id,
        e.title,
        e.event_type,
        e.event_date,
        e.start_time,
        e.end_time,
        e.venue,
        e.mode,
        e.status,
        e.is_placement_event,
        e.round_number,
        e.company_id,
        e.position_ids,
        c.company_name
      FROM events e
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE e.id = $1
    `;

    const eventResult = await db.query(eventQuery, [eventId]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventResult.rows[0];
    const countsPerPosition = {};

    // Get counts for each position
    for (const pid of event.position_ids || []) {
      // Skip if filtering by position and this isn't it
      if (positionId && parseInt(positionId) !== pid) continue;

      let countsQuery = "";
      let countsParams = [];

      if (event.round_number === 1) {
        countsQuery = `
          SELECT 
            COUNT(DISTINCT fr.student_id) as applied_count,
            COUNT(DISTINCT CASE WHEN ea.status = 'present' THEN ea.student_id END) as attended_count,
            COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' THEN srr.student_id END) as qualified_count,
            COUNT(DISTINCT CASE WHEN srr.result_status = 'rejected' THEN srr.student_id END) as not_qualified_count
          FROM form_responses fr
          INNER JOIN forms f ON fr.form_id = f.id
          LEFT JOIN event_attendance ea ON ea.event_id = f.event_id AND ea.student_id = fr.student_id
          LEFT JOIN student_round_results srr ON srr.event_id = f.event_id AND srr.student_id = fr.student_id
          WHERE f.event_id = $1
            AND (fr.response_data->>'position_id')::int = $2
        `;
        countsParams = [eventId, pid];
      } else {
        countsQuery = `
          SELECT 
            COUNT(DISTINCT s.id) as eligible_count,
            COUNT(DISTINCT CASE WHEN ea.status = 'present' THEN s.id END) as attended_count,
            COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' THEN s.id END) as qualified_count,
            COUNT(DISTINCT CASE WHEN srr.result_status = 'rejected' THEN s.id END) as not_qualified_count
          FROM students s
          INNER JOIN student_round_results prev_srr ON prev_srr.student_id = s.id
          INNER JOIN events prev_event ON prev_event.id = prev_srr.event_id
          INNER JOIN form_responses fr ON fr.student_id = s.id
          INNER JOIN forms f ON f.id = fr.form_id
          LEFT JOIN event_attendance ea ON ea.event_id = $1 AND ea.student_id = s.id
          LEFT JOIN student_round_results srr ON srr.event_id = $1 AND srr.student_id = s.id
          WHERE prev_srr.result_status = 'selected'
            AND prev_event.company_id = $2
            AND prev_event.round_number = $3
            AND (fr.response_data->>'position_id')::int = $4
            AND f.event_id IN (
              SELECT id FROM events WHERE company_id = $2 AND round_number = 1
            )
        `;
        countsParams = [eventId, event.company_id, event.round_number - 1, pid];
      }

      const countsResult = await db.query(countsQuery, countsParams);
      const counts = countsResult.rows[0];

      // Get position details
      const positionQuery = `
        SELECT 
          position_title, 
          job_type, 
          package,
          has_range,
          package_end,
          internship_stipend_monthly 
        FROM company_positions 
        WHERE id = $1
      `;
      const positionResult = await db.query(positionQuery, [pid]);
      const position = positionResult.rows[0];

      // Update the position details mapping
      countsPerPosition[pid] = {
        position_id: pid,
        position_title: position?.position_title,
        job_type: position?.job_type,
        package: position?.package ? parseFloat(position.package) : null,
        has_range: position?.has_range || false,
        package_end: position?.package_end
          ? parseFloat(position.package_end)
          : null,
        internship_stipend_monthly:
          position?.internship_stipend_monthly || null,
        applied:
          event.round_number === 1 ? parseInt(counts.applied_count) || 0 : 0,
        eligible:
          event.round_number === 1
            ? parseInt(counts.applied_count) || 0
            : parseInt(counts.eligible_count) || 0,
        attended: parseInt(counts.attended_count) || 0,
        qualified: parseInt(counts.qualified_count) || 0,
        not_qualified: parseInt(counts.not_qualified_count) || 0,
      };
    }

    res.json({
      success: true,
      data: {
        id: event.id,
        title: event.title,
        event_type: event.event_type,
        event_date: event.event_date,
        start_time: event.start_time,
        end_time: event.end_time,
        venue: event.venue,
        mode: event.mode,
        status: event.status,
        is_placement_event: event.is_placement_event,
        round_number: event.round_number,
        company_name: event.company_name,
        company_id: event.company_id,
        position_ids: event.position_ids,
        counts_per_position: countsPerPosition,
      },
    });
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event details",
      error: error.message,
    });
  }
});

routes.post(
  "/events/:eventId/upload-results",
  upload.single("file"),
  async (req, res) => {
    const client = await db.connect();

    try {
      const { eventId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded. Please upload a CSV or Excel file.",
        });
      }

      // Read file and extract registration numbers
      let registrationNumbers = [];

      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === ".csv") {
        // Parse CSV
        const csvData = require("fs")
          .readFileSync(file.path, "utf8")
          .split("\n");
        registrationNumbers = csvData
          .map((line) => line.trim())
          .filter(Boolean)
          .map((val) => val.replace(/[^A-Za-z0-9]/g, "")); // clean
      } else if (ext === ".xlsx" || ext === ".xls") {
        // Parse Excel
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
          defval: "",
        });

        registrationNumbers = sheetData
          .map((row) => {
            if (
              row.registration_number &&
              typeof row.registration_number === "string"
            )
              return row.registration_number.trim();
            if (row.reg_number && typeof row.reg_number === "string")
              return row.reg_number.trim();
            if (
              row["Registration Number"] &&
              typeof row["Registration Number"] === "string"
            )
              return row["Registration Number"].trim();
            // If it's a number, convert to string
            if (typeof row.registration_number === "number")
              return String(row.registration_number).trim();
            if (typeof row.reg_number === "number")
              return String(row.reg_number).trim();
            if (typeof row["Registration Number"] === "number")
              return String(row["Registration Number"]).trim();
            return null;
          })
          .filter(Boolean);
      } else {
        require("fs").unlinkSync(file.path);
        return res.status(400).json({
          success: false,
          message: "Unsupported file type. Upload CSV or Excel only.",
        });
      }

      require("fs").unlinkSync(file.path); // clean up temp file

      if (registrationNumbers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid registration numbers found in file.",
        });
      }

      await client.query("BEGIN");

      // Validate registration numbers
      const validStudentsQuery = `
        SELECT id, registration_number, offers_received
        FROM students
        WHERE registration_number = ANY($1::text[])
      `;
      const validResult = await client.query(validStudentsQuery, [
        registrationNumbers,
      ]);
      const validStudents = validResult.rows;

      const validRegistrationNumbers = validStudents.map(
        (s) => s.registration_number
      );
      const invalidNumbers = registrationNumbers.filter(
        (num) => !validRegistrationNumbers.includes(num)
      );

      if (invalidNumbers.length > 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "Invalid registration numbers found in file.",
          invalidNumbers,
        });
      }

      // Fetch event details
      const eventQuery = `
        SELECT id, round_number, round_type, company_id, position_ids
        FROM events
        WHERE id = $1
      `;
      const eventResult = await client.query(eventQuery, [eventId]);
      if (eventResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      const event = eventResult.rows[0];
      const isLastRound = event.round_type === "last";
      const positionIds = parseIntegerArray(event.position_ids);

      // Fetch attended students
      const attendedStudentsQuery = `
        SELECT s.id, s.registration_number, s.offers_received
        FROM students s
        JOIN event_attendance ea ON s.id = ea.student_id
        WHERE ea.event_id = $1 AND ea.status = 'present'
      `;
      const attendedResult = await client.query(attendedStudentsQuery, [
        eventId,
      ]);
      const attendedStudents = attendedResult.rows;

      const studentMap = Object.fromEntries(
        attendedStudents.map((s) => [s.registration_number, s.id])
      );

      // Fetch existing round results
      const existingResultsQuery = `
        SELECT student_id, result_status
        FROM student_round_results
        WHERE event_id = $1
      `;
      const existingResultsResult = await client.query(existingResultsQuery, [
        eventId,
      ]);
      const existingSelectedStudentIds = existingResultsResult.rows
        .filter((r) => r.result_status === "selected")
        .map((r) => r.student_id);

      // Determine new selections
      const newSelectedStudentIds = validRegistrationNumbers
        .map((regNum) => studentMap[regNum])
        .filter(Boolean);

      const studentsToAddOffer = newSelectedStudentIds.filter(
        (id) => !existingSelectedStudentIds.includes(id)
      );
      const studentsToRemoveOffer = existingSelectedStudentIds.filter(
        (id) => !newSelectedStudentIds.includes(id)
      );

      // Update results
      let selectedCount = 0;
      let rejectedCount = 0;

      for (const studentId of newSelectedStudentIds) {
        await client.query(
          `
          INSERT INTO student_round_results (student_id, event_id, result_status, created_at, updated_at)
          VALUES ($1, $2, 'selected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT (student_id, event_id)
          DO UPDATE SET result_status = 'selected', updated_at = CURRENT_TIMESTAMP
        `,
          [studentId, eventId]
        );
        selectedCount++;
      }

      const nonSelectedStudentIds = attendedStudents
        .map((s) => s.id)
        .filter((id) => !newSelectedStudentIds.includes(id));

      if (nonSelectedStudentIds.length > 0) {
        await client.query(
          `
          INSERT INTO student_round_results (student_id, event_id, result_status, created_at, updated_at)
          SELECT unnest($2::int[]), $1, 'rejected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          ON CONFLICT (student_id, event_id)
          DO UPDATE SET result_status = 'rejected', updated_at = CURRENT_TIMESTAMP
        `,
          [eventId, nonSelectedStudentIds]
        );
        rejectedCount = nonSelectedStudentIds.length;
      }

      // ✅ Handle campus offers
      if (isLastRound && event.company_id && positionIds.length > 0) {
        for (const studentId of studentsToAddOffer) {
          for (const posId of positionIds) {
            await addCampusOffer(studentId, event.company_id, posId, {});
          }
        }
      }

      if (isLastRound && studentsToRemoveOffer.length > 0) {
        for (const studentId of studentsToRemoveOffer) {
          // Fetch student with offers_received and current_offer from DB
          const studentResult = await client.query(
            `SELECT offers_received, current_offer, registration_number FROM students WHERE id = $1`,
            [studentId]
          );

          if (studentResult.rows.length === 0) {
            console.warn(
              `[RoundTracking] Student ID ${studentId} not found in DB, skipping.`
            );
            continue;
          }

          const student = studentResult.rows[0];
          if (!Array.isArray(student.offers_received))
            student.offers_received = [];

          console.log(
            `[RoundTracking] Processing student ${studentId} (${student.registration_number})`
          );
          console.log(
            `[RoundTracking] Original offers_received:`,
            student.offers_received
          );

          // Remove the campus offer(s) associated with this event/company/positions
          const updatedOffers = student.offers_received.filter(
            (o) => !(o.source === "campus" && o.company_id === event.company_id)
          );

          console.log(
            `[RoundTracking] Updated offers_received:`,
            updatedOffers
          );

          // Check if current_offer is the one being removed
          let newCurrentOffer = student.current_offer;
          const removedCurrentOffer =
            student.current_offer &&
            student.current_offer.source === "campus" &&
            student.current_offer.company_id === event.company_id;

          if (removedCurrentOffer) {
            console.log(
              `[RoundTracking] Current offer for student ${studentId} is being removed.`
            );
            newCurrentOffer =
              updatedOffers.length > 0 ? updatedOffers[0] : null;
            console.log(`[RoundTracking] New current_offer:`, newCurrentOffer);
          }

          const newStatus = updatedOffers.length > 0 ? "placed" : "unplaced";
          console.log(
            `[RoundTracking] New placement_status for student ${studentId}: ${newStatus}`
          );

          await client.query(
            `UPDATE students
             SET offers_received = $1,
                 current_offer = $2,
                 placement_status = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4`,
            [
              JSON.stringify(updatedOffers),
              JSON.stringify(newCurrentOffer),
              newStatus,
              studentId,
            ]
          );

          console.log(`[RoundTracking] Student ${studentId} updated in DB.`);
        }
      }

      await client.query(
        `UPDATE events SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [eventId]
      );

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "File processed successfully and results updated.",
        data: {
          eventId: parseInt(eventId),
          totalAttended: attendedStudents.length,
          selectedCount,
          rejectedCount,
          isLastRound,
          method: "file-upload",
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error processing file upload:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process file upload",
        error: error.message,
      });
    } finally {
      client.release();
    }
  }
);

// Safely parse Postgres integer[] to JS array
const parseIntegerArray = (pgArray) => {
  if (!pgArray) return [];
  if (Array.isArray(pgArray)) return pgArray; // Already an array
  // fallback if it's a string (rare)
  return pgArray
    .replace("{", "")
    .replace("}", "")
    .split(",")
    .map((x) => parseInt(x, 10))
    .filter((x) => !isNaN(x));
};

module.exports = routes;

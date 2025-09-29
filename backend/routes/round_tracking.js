const express = require("express");
const routes = express.Router();
const db = require("../db");

// GET /api/round-tracking/companies/:year
routes.get("/companies/:year", async (req, res) => {
  const { year } = req.params;

  try {
    const query = `
      SELECT 
        c.id AS company_id,
        c.company_name,
        c.company_type,
        c.is_marquee,
        c.sector,
        cp.id AS position_id,
        cp.position_title,
        cp.job_type,
        cp.package_range,
        cp.internship_stipend_monthly,
        cp.is_active AS position_active,
        e.id AS event_id,
        e.title AS event_title,
        e.status AS event_status,
        e.is_placement_event,
        e.is_final_round,
        COUNT(DISTINCT ea.student_id) AS attended_count,
        COUNT(DISTINCT fr.student_id) AS applied_count,
        COUNT(DISTINCT CASE WHEN srr.result_status IN ('selected') THEN srr.student_id END) AS qualified_count,
        COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' AND e.is_final_round = true THEN srr.student_id END) AS final_selected_count
      FROM companies c
      LEFT JOIN company_positions cp ON c.id = cp.company_id
      LEFT JOIN events e ON cp.id = e.position_id AND e.is_placement_event = true
      LEFT JOIN event_attendance ea ON e.id = ea.event_id AND ea.status = 'present'
      LEFT JOIN form_responses fr ON e.id = fr.form_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      LEFT JOIN event_batches eb ON e.id = eb.event_id
      LEFT JOIN batches b ON eb.batch_id = b.id
      WHERE b.year = $1
      GROUP BY c.id, cp.id, e.id
      ORDER BY c.company_name, cp.position_title, e.event_date
    `;

    const results = await db.query(query, [year]);

    // Group results by company and position
    const companiesMap = new Map();

    results.rows.forEach((row) => {
      if (!companiesMap.has(row.company_id)) {
        companiesMap.set(row.company_id, {
          id: row.company_id,
          company_name: row.company_name,
          company_type: row.company_type,
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
          package_range: row.package_range,
          internship_stipend_monthly: row.internship_stipend_monthly,
          is_active: row.position_active,
          events: [],
          final_selected_count: 0, // aggregate final selections
        });
      }

      if (row.event_id) {
        const position = company.positions.get(row.position_id);

        // Track final selections for this position
        if (row.final_selected_count > 0) {
          position.final_selected_count += parseInt(row.final_selected_count);
        }

        position.events.push({
          id: row.event_id,
          title: row.event_title,
          event_date: row.event_date,
          start_time: row.start_time,
          end_time: row.end_time,
          venue: row.venue,
          mode: row.mode,
          status: row.event_status,
          is_final_round: row.is_final_round,
          attended_count: parseInt(row.attended_count),
          applied_count: parseInt(row.applied_count),
          qualified_count: parseInt(row.qualified_count),
          eligible_count: 0, // Will calculate below
        });
      }
    });

    // Convert maps to arrays
    const companies = Array.from(companiesMap.values()).map((company) => ({
      ...company,
      positions: Array.from(company.positions.values()),
    }));

    // Calculate eligible count for each event
    for (const company of companies) {
      for (const position of company.positions) {
        for (let i = 0; i < position.events.length; i++) {
          const event = position.events[i];
          if (i === 0) {
            // First round → eligible = applied count (form responses)
            event.eligible_count = event.applied_count;
          } else {
            // Subsequent rounds → eligible = qualified from previous round
            event.eligible_count = position.events[i - 1].qualified_count;
          }
        }
      }
    }

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

// GET /api/round-tracking/stats
routes.get("/stats", async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(DISTINCT fr.student_id) 
         FROM form_responses fr 
         JOIN events e ON fr.form_id = e.id 
         WHERE e.is_placement_event = true) as total_applications,
        
        (SELECT COUNT(DISTINCT srr.student_id) 
         FROM student_round_results srr 
         WHERE srr.result_status = 'qualified') as currently_qualified,
        
        (SELECT COUNT(DISTINCT c.id) 
         FROM companies c 
         JOIN company_positions cp ON c.id = cp.company_id 
         JOIN events e ON cp.id = e.position_id 
         WHERE e.status IN ('ongoing', 'upcoming') 
         AND e.is_placement_event = true) as active_companies,
        
        (SELECT COUNT(DISTINCT s.id) 
         FROM students s 
         WHERE s.placement_status = 'placed') as total_placements
    `;

    const result = await db.query(statsQuery);
    const stats = result.rows[0];

    res.json({
      totalApplications: parseInt(stats.total_applications) || 0,
      currentlyQualified: parseInt(stats.currently_qualified) || 0,
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

// GET /api/round-tracking/events/:eventId/students
routes.get("/events/:eventId/students", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status = "all" } = req.query; // all, applied, attended, qualified

    let whereConditions = ["e.id = ?"];
    let params = [eventId];

    let query = `
      SELECT DISTINCT
        s.id,
        s.registration_number,
        s.first_name || ' ' || s.last_name as name,
        s.enrollment_number,
        s.cgpa,
        s.department,
        s.branch,
        s.batch_year,
        fr.id as form_response_id,
        ea.status as attendance_status,
        ea.check_in_time,
        srr.result_status,
        srr.application_status
      FROM events e
      LEFT JOIN form_responses fr ON e.id = fr.form_id
      LEFT JOIN students s ON fr.student_id = s.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id AND s.id = ea.student_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id AND s.id = srr.student_id
      WHERE ${whereConditions.join(" AND ")}
    `;

    if (status === "applied") {
      query += " AND fr.id IS NOT NULL";
    } else if (status === "attended") {
      query += " AND ea.status = 'present'";
    } else if (status === "qualified") {
      query += " AND srr.result_status = 'qualified'";
    }

    query += " ORDER BY s.registration_number";

    const result = await db.query(query, params);

    const students = result.rows.map((row) => ({
      id: row.id,
      registration_number: row.registration_number,
      name: row.name,
      enrollment_number: row.enrollment_number,
      cgpa: parseFloat(row.cgpa),
      department: row.department,
      branch: row.branch,
      batch_year: row.batch_year,
      has_applied: !!row.form_response_id,
      attendance_status: row.attendance_status,
      check_in_time: row.check_in_time,
      result_status: row.result_status,
      application_status: row.application_status,
    }));

    res.json({ students });
  } catch (error) {
    console.error("Error fetching event students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event students",
      error: error.message,
    });
  }
});

// Update round results
routes.post("/events/:eventId/results", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { qualifiedRegistrationNumbers, method = "manual" } = req.body;

    // Start transaction
    await db.query("BEGIN");

    try {
      // First, get all students who attended this event
      const attendedStudentsQuery = `
        SELECT s.id, s.registration_number
        FROM students s
        JOIN event_attendance ea ON s.id = ea.student_id
        WHERE ea.event_id = $1 AND ea.status = 'present'
      `;

      const attendedResult = await db.query(attendedStudentsQuery, [eventId]);
      const attendedStudents = attendedResult.rows;

      // Clear existing results for this event
      await db.query("DELETE FROM student_round_results WHERE event_id = $1", [
        eventId,
      ]);

      // Insert new results
      for (const student of attendedStudents) {
        const isQualified = qualifiedRegistrationNumbers.includes(
          student.registration_number
        );

        await db.query(
          `
          INSERT INTO student_round_results (student_id, event_id, result_status, application_status, updated_at)
          VALUES ($1, $2, $3, 'completed', CURRENT_TIMESTAMP)
          ON CONFLICT (student_id, event_id)
          DO UPDATE SET 
            result_status = EXCLUDED.result_status,
            application_status = EXCLUDED.application_status,
            updated_at = CURRENT_TIMESTAMP
        `,
          [student.id, eventId, isQualified ? "qualified" : "not_qualified"]
        );
      }

      // Update event status to completed
      await db.query(
        `
        UPDATE events 
        SET status = 'completed', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
        [eventId]
      );

      // Get updated counts
      const countsQuery = `
        SELECT 
          COUNT(*) as total_attended,
          COUNT(CASE WHEN result_status = 'qualified' THEN 1 END) as qualified_count
        FROM student_round_results srr
        JOIN event_attendance ea ON srr.student_id = ea.student_id AND srr.event_id = ea.event_id
        WHERE srr.event_id = ? AND ea.status = 'present'
      `;

      const countsResult = await db.query(countsQuery, [eventId]);
      const counts = countsResult.rows[0];

      await db.query("COMMIT");
      res.json({
        success: true,
        message: "Round results updated successfully",
        data: {
          eventId: parseInt(eventId),
          totalAttended: parseInt(counts.total_attended),
          qualifiedCount: parseInt(counts.qualified_count),
          method,
        },
      });
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/events/:eventId/details - Get detailed event information
routes.get("/events/:eventId/details", async (req, res) => {
  try {
    const { eventId } = req.params;

    const query = `
      SELECT 
        e.*,
        cp.position_title,
        cp.job_type,
        cp.package_range,
        c.company_name,
        COUNT(DISTINCT ea_present.student_id) as attended_count,
        COUNT(DISTINCT fr.student_id) as applied_count,
        COUNT(DISTINCT CASE WHEN srr.result_status = 'qualified' THEN srr.student_id END) as qualified_count,
        COUNT(DISTINCT CASE WHEN srr.result_status = 'not_qualified' THEN srr.student_id END) as not_qualified_count
      FROM events e
      LEFT JOIN company_positions cp ON e.position_id = cp.id
      LEFT JOIN companies c ON cp.company_id = c.id
      LEFT JOIN event_attendance ea_present ON e.id = ea_present.event_id AND ea_present.status = 'present'
      LEFT JOIN form_responses fr ON e.id = fr.form_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      WHERE e.id = $1
      GROUP BY e.id, cp.id, c.id
    `;

    const result = await db.query(query, [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = result.rows[0];

    res.json({
      id: eventData.id,
      title: eventData.title,
      event_type: eventData.event_type,
      event_date: eventData.event_date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      venue: eventData.venue,
      mode: eventData.mode,
      status: eventData.status,
      position_title: eventData.position_title,
      job_type: eventData.job_type,
      package_range: eventData.package_range,
      company_name: eventData.company_name,
      counts: {
        applied: parseInt(eventData.applied_count) || 0,
        attended: parseInt(eventData.attended_count) || 0,
        qualified: parseInt(eventData.qualified_count) || 0,
        not_qualified: parseInt(eventData.not_qualified_count) || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/events/:eventId/upload-csv - Handle CSV upload for round results
routes.post("/events/:eventId/upload-csv", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { csvData } = req.body;

    const registrationNumbers = Array.isArray(csvData)
      ? csvData
      : csvData.map((row) => row.registration_number);

    const validStudentsQuery = `
      SELECT registration_number 
      FROM students 
      WHERE registration_number = ANY($1)
    `;

    const validResult = await db.query(validStudentsQuery, [
      registrationNumbers,
    ]);
    const validRegistrationNumbers = validResult.rows.map(
      (row) => row.registration_number
    );

    const invalidNumbers = registrationNumbers.filter(
      (num) => !validRegistrationNumbers.includes(num)
    );

    if (invalidNumbers.length > 0) {
      return res.status(400).json({
        error: "Invalid registration numbers found",
        invalidNumbers,
      });
    }

    // Modify request body to match updateRoundResults format
    req.body.qualifiedRegistrationNumbers = validRegistrationNumbers;
    req.body.method = "csv";

    // Forward to the results endpoint
    await routes.handle(req, res, "/events/:eventId/results");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/companies/:companyId/rounds-summary - Get rounds summary for a specific company
routes.get("/companies/:companyId/rounds-summary", async (req, res) => {
  try {
    const { companyId } = req.params;

    const query = `
      SELECT 
        c.company_name,
        cp.position_title,
        cp.job_type,
        cp.package_range,
        e.title as round_title,
        e.event_date,
        e.status as round_status,
        COUNT(DISTINCT ea.student_id) as attended_count,
        COUNT(DISTINCT CASE WHEN srr.result_status = 'qualified' THEN srr.student_id END) as qualified_count
      FROM companies c
      JOIN company_positions cp ON c.id = cp.company_id
      JOIN events e ON cp.id = e.position_id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id AND ea.status = 'present'
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      WHERE c.id = $1 AND e.is_placement_event = true
      GROUP BY c.id, cp.id, e.id
      ORDER BY cp.position_title, e.event_date
    `;

    const result = await db.query(query, [companyId]);

    res.json({
      company_name: result.rows[0]?.company_name || "",
      rounds: result.rows.map((row) => ({
        position_title: row.position_title,
        job_type: row.job_type,
        package_range: row.package_range,
        round_title: row.round_title,
        event_date: row.event_date,
        round_status: row.round_status,
        attended_count: parseInt(row.attended_count) || 0,
        qualified_count: parseInt(row.qualified_count) || 0,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = routes;

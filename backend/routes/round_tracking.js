const express = require("express");
const routes = express.Router();
const db = require("../db");

// GET /round-tracking/companies/:year
routes.get("/companies/:year", async (req, res) => {
  const { year } = req.params;

  try {
    const query = `
      SELECT 
        c.id AS company_id,
        c.company_name,
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
        e.event_date,
        e.start_time,
        e.end_time,
        e.venue,
        e.mode,
        e.status AS event_status,
        e.is_placement_event,
        COUNT(DISTINCT ea.student_id) FILTER (WHERE ea.status = 'present') AS attended_count,
        COUNT(DISTINCT fr.student_id) AS applied_count,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'selected') AS qualified_count,
        COUNT(DISTINCT srr.student_id) FILTER (WHERE srr.result_status = 'selected') AS final_selected_count
      FROM companies c
      INNER JOIN company_batches cb ON c.id = cb.company_id
      INNER JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN company_positions cp ON c.id = cp.company_id
      LEFT JOIN events e ON cp.id = e.position_id AND e.is_placement_event = true AND e.company_id = c.id
      LEFT JOIN event_batches eb ON e.id = eb.event_id AND eb.batch_id = b.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id
      LEFT JOIN forms f ON e.id = f.event_id AND f.batch_year = b.year
      LEFT JOIN form_responses fr ON f.id = fr.form_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      WHERE b.year = $1
      GROUP BY c.id, cp.id, e.id, e.event_date, e.start_time, e.end_time, e.venue, e.mode
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
          package_range: row.package_range
            ? parseFloat(row.package_range)
            : null,
          internship_stipend_monthly: row.internship_stipend_monthly
            ? parseFloat(row.internship_stipend_monthly)
            : null,
          is_active: row.position_active,
          events: [],
          final_selected_count: 0,
        });
      }

      if (row.event_id && row.position_id) {
        const position = company.positions.get(row.position_id);

        position.events.push({
          id: row.event_id,
          title: row.event_title,
          event_date: row.event_date,
          start_time: row.start_time,
          end_time: row.end_time,
          venue: row.venue,
          mode: row.mode,
          status: row.event_status,
          attended_count: parseInt(row.attended_count) || 0,
          applied_count: parseInt(row.applied_count) || 0,
          qualified_count: parseInt(row.qualified_count) || 0,
          eligible_count: 0, // Will calculate below
        });

        // Aggregate final selections
        if (row.final_selected_count > 0) {
          position.final_selected_count += parseInt(row.final_selected_count);
        }
      }
    });

    // Convert maps to arrays and calculate eligible counts
    const companies = Array.from(companiesMap.values()).map((company) => {
      const positions = Array.from(company.positions.values()).map(
        (position) => {
          // Calculate eligible count for each event
          for (let i = 0; i < position.events.length; i++) {
            const event = position.events[i];
            if (i === 0) {
              // First round → eligible = applied count (from form responses)
              event.eligible_count = event.applied_count;
            } else {
              // Subsequent rounds → eligible = qualified from previous round
              event.eligible_count = position.events[i - 1].qualified_count;
            }
          }
          return position;
        }
      );

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
        
        (SELECT COUNT(DISTINCT srr.student_id) 
         FROM student_round_results srr 
         JOIN events e ON srr.event_id = e.id
         JOIN event_batches eb ON e.id = eb.event_id
         JOIN batch_data bd ON eb.batch_id = bd.id
         WHERE srr.result_status = 'selected') as currently_qualified,
        
        (SELECT COUNT(DISTINCT c.id) 
         FROM companies c 
         JOIN company_batches cb ON c.id = cb.company_id
         JOIN batch_data bd ON cb.batch_id = bd.id
         JOIN company_positions cp ON c.id = cp.company_id 
         JOIN events e ON cp.id = e.position_id 
         WHERE e.status IN ('ongoing', 'upcoming') 
         AND e.is_placement_event = true) as active_companies,
        
        (SELECT COUNT(DISTINCT s.id) 
         FROM students s 
         WHERE s.placement_status = 'placed'
         AND s.batch_year = $1) as total_placements
    `;

    const result = await db.query(statsQuery, [year]);
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

// GET /round-tracking/events/:eventId/students
routes.get("/events/:eventId/students", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status = "applied" } = req.query;

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
      LEFT JOIN forms f ON e.id = f.event_id
      LEFT JOIN form_responses fr ON f.id = fr.form_id
      LEFT JOIN students s ON fr.student_id = s.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id AND s.id = ea.student_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id AND s.id = srr.student_id
      WHERE e.id = $1
    `;

    if (status === "applied") {
      query += " AND fr.id IS NOT NULL";
    } else if (status === "attended") {
      query += " AND ea.status = 'present'";
    } else if (status === "qualified") {
      query += " AND srr.result_status = 'selected'";
    } else if (status === "rejected") {
      query += " AND srr.result_status = 'rejected'";
    }

    query += " ORDER BY s.registration_number";

    const result = await db.query(query, [eventId]);

    const students = result.rows.map((row) => ({
      id: row.id,
      registration_number: row.registration_number,
      name: row.name,
      enrollment_number: row.enrollment_number,
      cgpa: row.cgpa ? parseFloat(row.cgpa) : null,
      department: row.department,
      branch: row.branch,
      batch_year: row.batch_year,
      has_applied: !!row.form_response_id,
      attendance_status: row.attendance_status,
      check_in_time: row.check_in_time,
      result_status: row.result_status,
      application_status: row.application_status,
    }));

    res.json({
      success: true,
      students,
      count: students.length,
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

    await client.query("BEGIN");

    // Get the event and its form
    const eventQuery = `
      SELECT e.id, e.title, f.id as form_id, f.batch_year
      FROM events e
      LEFT JOIN forms f ON e.id = f.event_id
      WHERE e.id = $1
    `;
    const eventResult = await client.query(eventQuery, [eventId]);

    if (eventResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventResult.rows[0];

    // Get all students who attended this event
    const attendedStudentsQuery = `
      SELECT s.id, s.registration_number
      FROM students s
      JOIN event_attendance ea ON s.id = ea.student_id
      WHERE ea.event_id = $1 AND ea.status = 'present'
    `;
    const attendedResult = await client.query(attendedStudentsQuery, [eventId]);
    const attendedStudents = attendedResult.rows;

    console.log(
      `Processing results for ${attendedStudents.length} students who attended`
    );

    // Clear existing results for this event
    await client.query(
      "DELETE FROM student_round_results WHERE event_id = $1",
      [eventId]
    );

    // Insert new results
    let selectedCount = 0;
    let rejectedCount = 0;

    for (const student of attendedStudents) {
      const isQualified = qualifiedRegistrationNumbers.includes(
        student.registration_number
      );

      await client.query(
        `
        INSERT INTO student_round_results (student_id, event_id, result_status, application_status, created_at, updated_at)
        VALUES ($1, $2, $3, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, event_id)
        DO UPDATE SET 
          result_status = EXCLUDED.result_status,
          application_status = EXCLUDED.application_status,
          updated_at = CURRENT_TIMESTAMP
      `,
        [student.id, eventId, isQualified ? "selected" : "rejected"]
      );

      if (isQualified) {
        selectedCount++;
      } else {
        rejectedCount++;
      }
    }

    // Update event status to completed
    await client.query(
      `
      UPDATE events 
      SET status = 'completed', updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `,
      [eventId]
    );

    await client.query("COMMIT");

    console.log(
      `Results updated: ${selectedCount} selected, ${rejectedCount} rejected`
    );

    res.json({
      success: true,
      message: "Round results updated successfully",
      data: {
        eventId: parseInt(eventId),
        totalAttended: attendedStudents.length,
        selectedCount,
        rejectedCount,
        method,
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

    const query = `
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
        cp.position_title,
        cp.job_type,
        cp.package_range,
        c.company_name,
        c.id as company_id,
        COUNT(DISTINCT CASE WHEN ea.status = 'present' THEN ea.student_id END) as attended_count,
        COUNT(DISTINCT fr.student_id) as applied_count,
        COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' THEN srr.student_id END) as qualified_count,
        COUNT(DISTINCT CASE WHEN srr.result_status = 'rejected' THEN srr.student_id END) as not_qualified_count
      FROM events e
      LEFT JOIN company_positions cp ON e.position_id = cp.id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id
      LEFT JOIN forms f ON e.id = f.event_id
      LEFT JOIN form_responses fr ON f.id = fr.form_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      WHERE e.id = $1
      GROUP BY e.id, cp.id, c.id
    `;

    const result = await db.query(query, [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const eventData = result.rows[0];

    res.json({
      success: true,
      data: {
        id: eventData.id,
        title: eventData.title,
        event_type: eventData.event_type,
        event_date: eventData.event_date,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        venue: eventData.venue,
        mode: eventData.mode,
        status: eventData.status,
        is_placement_event: eventData.is_placement_event,
        position_title: eventData.position_title,
        job_type: eventData.job_type,
        package_range: eventData.package_range
          ? parseFloat(eventData.package_range)
          : null,
        company_name: eventData.company_name,
        company_id: eventData.company_id,
        counts: {
          applied: parseInt(eventData.applied_count) || 0,
          attended: parseInt(eventData.attended_count) || 0,
          qualified: parseInt(eventData.qualified_count) || 0,
          not_qualified: parseInt(eventData.not_qualified_count) || 0,
        },
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

// POST /round-tracking/events/:eventId/upload-csv - Handle CSV upload for round results
routes.post("/events/:eventId/upload-csv", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { csvData } = req.body;

    if (!csvData || !Array.isArray(csvData)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CSV data format",
      });
    }

    // Extract registration numbers from CSV data
    const registrationNumbers = csvData
      .map((row) => {
        // Handle both object format and string format
        if (typeof row === "string") return row.trim();
        if (row.registration_number) return row.registration_number.trim();
        if (row.reg_number) return row.reg_number.trim();
        return null;
      })
      .filter(Boolean);

    if (registrationNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid registration numbers found in CSV",
      });
    }

    // Validate registration numbers against database
    const validStudentsQuery = `
      SELECT registration_number 
      FROM students 
      WHERE registration_number = ANY($1::text[])
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
        success: false,
        message: "Invalid registration numbers found in CSV",
        invalidNumbers,
        validCount: validRegistrationNumbers.length,
        invalidCount: invalidNumbers.length,
      });
    }

    // Forward to the results endpoint
    req.body = {
      qualifiedRegistrationNumbers: validRegistrationNumbers,
      method: "csv",
    };

    // Call the results endpoint
    return (
      routes.stack
        .find(
          (layer) =>
            layer.route?.path === "/events/:eventId/results" &&
            layer.route.methods.post
        )
        ?.handle(req, res) ||
      res.status(500).json({
        success: false,
        message: "Results endpoint not found",
      })
    );
  } catch (error) {
    console.error("Error processing CSV upload:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process CSV upload",
      error: error.message,
    });
  }
});

// GET /round-tracking/companies/:companyId/rounds-summary - Get rounds summary for a specific company
routes.get("/companies/:companyId/rounds-summary/:year", async (req, res) => {
  try {
    const { companyId, year } = req.params;

    const query = `
      SELECT 
        c.company_name,
        c.sector,
        c.is_marquee,
        cp.id as position_id,
        cp.position_title,
        cp.job_type,
        cp.package_range,
        e.id as event_id,
        e.title as round_title,
        e.event_date,
        e.status as round_status,
        e.event_type,
        COUNT(DISTINCT CASE WHEN ea.status = 'present' THEN ea.student_id END) as attended_count,
        COUNT(DISTINCT fr.student_id) as applied_count,
        COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' THEN srr.student_id END) as qualified_count
      FROM companies c
      JOIN company_batches cb ON c.id = cb.company_id
      JOIN batches b ON cb.batch_id = b.id
      JOIN company_positions cp ON c.id = cp.company_id
      LEFT JOIN events e ON cp.id = e.position_id AND e.is_placement_event = true
      LEFT JOIN event_batches eb ON e.id = eb.event_id AND eb.batch_id = b.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id
      LEFT JOIN forms f ON e.id = f.event_id AND f.batch_year = b.year
      LEFT JOIN form_responses fr ON f.id = fr.form_id
      LEFT JOIN student_round_results srr ON e.id = srr.event_id
      WHERE c.id = $1 AND b.year = $2
      GROUP BY c.id, cp.id, e.id, e.event_date
      ORDER BY cp.position_title, e.event_date
    `;

    const result = await db.query(query, [companyId, year]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found or has no placement events for this year",
      });
    }

    res.json({
      success: true,
      data: {
        company_name: result.rows[0].company_name,
        sector: result.rows[0].sector,
        is_marquee: result.rows[0].is_marquee,
        rounds: result.rows
          .filter((row) => row.event_id) // Only include rows with actual events
          .map((row) => ({
            position_id: row.position_id,
            position_title: row.position_title,
            job_type: row.job_type,
            package_range: row.package_range
              ? parseFloat(row.package_range)
              : null,
            event_id: row.event_id,
            round_title: row.round_title,
            event_date: row.event_date,
            event_type: row.event_type,
            round_status: row.round_status,
            attended_count: parseInt(row.attended_count) || 0,
            applied_count: parseInt(row.applied_count) || 0,
            qualified_count: parseInt(row.qualified_count) || 0,
          })),
      },
    });
  } catch (error) {
    console.error("Error fetching company rounds summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company rounds summary",
      error: error.message,
    });
  }
});

module.exports = routes;

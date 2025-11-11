// routes/studentAnalytics.js
const express = require("express");
const routes = express.Router();
const db = require("../db");

// Get comprehensive student analytics
routes.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const client = await db.connect();

  try {
    // Get student basic info
    const studentQuery = `
      SELECT 
        s.*,
        sp.name as specialization_name,
        b.year as batch_year
      FROM students s
      LEFT JOIN specializations sp ON s.specialization_id = sp.id
      LEFT JOIN batches b ON s.batch_year = b.year
      WHERE s.id = $1
    `;
    const studentResult = await client.query(studentQuery, [studentId]);

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = studentResult.rows[0];

    // Get all companies student was eligible for
    const eligibleCompaniesQuery = `
      SELECT DISTINCT
        c.id,
        c.company_name,
        c.is_marquee,
        c.sector,
        ce.eligible_student_ids,
        ce.dream_company_student_ids,
        CASE 
          WHEN ce.eligible_student_ids::jsonb ? $1::text THEN true
          ELSE false
        END as was_eligible,
        CASE 
          WHEN ce.dream_company_student_ids::jsonb ? $1::text THEN true
          ELSE false
        END as was_dream_company
      FROM companies c
      INNER JOIN company_eligibility ce ON c.id = ce.company_id
      INNER JOIN company_batches cb ON c.id = cb.company_id
      WHERE cb.batch_id = (SELECT id FROM batches WHERE year = $2)
      AND (ce.eligible_student_ids::jsonb ? $1::text 
           OR ce.ineligible_student_ids::jsonb ? $1::text)
      ORDER BY c.company_name
    `;
    const eligibleCompanies = await client.query(eligibleCompaniesQuery, [
      studentId.toString(),
      student.batch_year,
    ]);

    // Get all positions for eligible companies
    const positionsQuery = `
      SELECT 
        cp.*,
        c.company_name,
        c.is_marquee,
        c.sector
      FROM company_positions cp
      INNER JOIN companies c ON cp.company_id = c.id
      INNER JOIN company_batches cb ON c.id = cb.company_id
      WHERE cb.batch_id = (SELECT id FROM batches WHERE year = $1)
      ORDER BY c.company_name, cp.position_title
    `;
    const positions = await client.query(positionsQuery, [student.batch_year]);

    // Get all events (rounds) student participated in
    const eventsQuery = `
      SELECT 
        e.*,
        c.company_name,
        c.id as company_id,
        ea.status as attendance_status,
        ea.marked_at as attendance_marked_at,
        srr.result_status,
        srr.updated_at as result_updated_at
      FROM events e
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN event_attendance ea ON e.id = ea.event_id AND ea.student_id = $1
      LEFT JOIN student_round_results srr ON e.id = srr.event_id AND srr.student_id = $1
      INNER JOIN event_batches eb ON e.id = eb.event_id
      WHERE eb.batch_id = (SELECT id FROM batches WHERE year = $2)
      AND e.is_placement_event = true
      ORDER BY e.event_date DESC, e.start_time DESC
    `;
    const events = await client.query(eventsQuery, [
      studentId,
      student.batch_year,
    ]);

    // Get form responses (applications)
    const formResponsesQuery = `
      SELECT 
        fr.*,
        f.title as form_title,
        f.event_id,
        e.company_id,
        c.company_name
      FROM form_responses fr
      INNER JOIN forms f ON fr.form_id = f.id
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE fr.student_id = $1
      ORDER BY fr.uploaded_at DESC
    `;
    const formResponses = await client.query(formResponsesQuery, [studentId]);

    // Get penalties
    const penaltiesQuery = `
      SELECT 
        sp.*,
        pt.category,
        pt.penalty_name,
        pt.severity,
        u1.username as imposed_by_username,
        u2.username as resolved_by_username
      FROM student_penalties sp
      INNER JOIN penalty_types pt ON sp.penalty_type_id = pt.id
      LEFT JOIN users u1 ON sp.imposed_by = u1.id
      LEFT JOIN users u2 ON sp.resolved_by = u2.id
      WHERE sp.student_id = $1
      ORDER BY sp.created_at DESC
    `;
    const penalties = await client.query(penaltiesQuery, [studentId]);

    // Process company application data
    const companyApplications = {};

    // Group events by company
    events.rows.forEach((event) => {
      if (!event.company_id) return;

      if (!companyApplications[event.company_id]) {
        companyApplications[event.company_id] = {
          company_id: event.company_id,
          company_name: event.company_name,
          rounds: [],
          final_result: null,
          applied: false,
        };
      }

      companyApplications[event.company_id].rounds.push({
        event_id: event.id,
        title: event.title,
        event_type: event.event_type,
        event_date: event.event_date,
        round_type: event.round_type,
        round_number: event.round_number,
        attendance_status: event.attendance_status,
        result_status: event.result_status,
        attended: event.attendance_status === "present",
        result_date: event.result_updated_at,
      });
    });

    // Mark companies where student applied via forms
    formResponses.rows.forEach((response) => {
      if (response.company_id && companyApplications[response.company_id]) {
        companyApplications[response.company_id].applied = true;
        companyApplications[response.company_id].application_date =
          response.uploaded_at;
      }
    });

    // Determine final result for each company
    Object.keys(companyApplications).forEach((companyId) => {
      const app = companyApplications[companyId];
      app.rounds.sort((a, b) => {
        if (a.event_date !== b.event_date) {
          return new Date(b.event_date) - new Date(a.event_date);
        }
        return (b.round_number || 0) - (a.round_number || 0);
      });

      const lastRound = app.rounds[0];
      if (lastRound && lastRound.result_status) {
        app.final_result = lastRound.result_status;
        app.last_round_reached = lastRound.round_number || 1;
      }
    });

    // Get companies student didn't apply to but was eligible
    const notAppliedCompanies = eligibleCompanies.rows
      .filter((ec) => ec.was_eligible && !companyApplications[ec.id])
      .map((ec) => ({
        company_id: ec.id,
        company_name: ec.company_name,
        is_marquee: ec.is_marquee,
        sector: ec.sector,
        was_dream_company: ec.was_dream_company,
      }));

    // Calculate statistics
    const stats = {
      total_eligible_companies: eligibleCompanies.rows.filter(
        (r) => r.was_eligible
      ).length,
      total_applied: Object.keys(companyApplications).length,
      not_applied: notAppliedCompanies.length,
      total_rounds_attended: events.rows.filter(
        (e) => e.attendance_status === "present"
      ).length,
      total_rounds_scheduled: events.rows.length,
      companies_selected: Object.values(companyApplications).filter(
        (a) => a.final_result === "selected"
      ).length,
      companies_rejected: Object.values(companyApplications).filter(
        (a) => a.final_result === "rejected"
      ).length,
      companies_pending: Object.values(companyApplications).filter(
        (a) => !a.final_result || a.final_result === "pending"
      ).length,
      total_offers: (student.offers_received || []).length,
      accepted_offers: (student.offers_received || []).filter(
        (o) => o.is_accepted
      ).length,
      active_penalties: penalties.rows.filter((p) => p.is_active).length,
      dream_opportunities_left: !student.dream_opportunity_used,
      dream_company_used: student.dream_company_used,
    };

    // Prepare response
    const analyticsData = {
      student: {
        id: student.id,
        full_name: student.full_name,
        enrollment_number: student.enrollment_number,
        email: student.college_email,
        specialization: student.specialization_name,
        batch_year: student.batch_year,
        cgpa: student.cgpa,
        backlogs: student.backlogs,
        placement_status: student.placement_status,
        drives_skipped: student.drives_skipped,
      },
      statistics: stats,
      applications: Object.values(companyApplications),
      not_applied: notAppliedCompanies,
      all_positions: positions.rows,
      offers: student.offers_received || [],
      current_offer: student.current_offer || null,
      penalties: penalties.rows,
      form_responses: formResponses.rows,
    };

    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching student analytics:", error);
    res.status(500).json({ error: "Failed to fetch student analytics" });
  } finally {
    client.release();
  }
});

// Get analytics summary for multiple students (for comparison)
routes.post("/bulk", async (req, res) => {
  const { studentIds } = req.body;

  if (!studentIds || !Array.isArray(studentIds)) {
    return res.status(400).json({ error: "Invalid student IDs" });
  }

  const client = await db.connect();

  try {
    const summaries = await Promise.all(
      studentIds.map(async (studentId) => {
        const studentQuery = `
          SELECT 
            s.id,
            s.full_name,
            s.enrollment_number,
            s.placement_status,
            s.cgpa,
            s.offers_received,
            COUNT(DISTINCT ea.event_id) as rounds_attended,
            COUNT(DISTINCT CASE WHEN srr.result_status = 'selected' THEN e.company_id END) as companies_selected
          FROM students s
          LEFT JOIN event_attendance ea ON s.id = ea.student_id AND ea.status = 'present'
          LEFT JOIN student_round_results srr ON s.id = srr.student_id
          LEFT JOIN events e ON srr.event_id = e.id
          WHERE s.id = $1
          GROUP BY s.id
        `;

        const result = await client.query(studentQuery, [studentId]);
        return result.rows[0];
      })
    );

    res.json({ students: summaries });
  } catch (error) {
    console.error("Error fetching bulk analytics:", error);
    res.status(500).json({ error: "Failed to fetch bulk analytics" });
  } finally {
    client.release();
  }
});

// Export student analytics to Excel-ready JSON
routes.get("/:studentId/export", async (req, res) => {
  const { studentId } = req.params;
  const client = await db.connect();

  try {
    // Fetch the same data as main analytics endpoint
    const mainEndpointData = await fetch(
      `http://localhost:${
        process.env.PORT || 3000
      }/api/student-analytics/${studentId}`
    ).then((r) => r.json());

    // Format for Excel export
    const exportData = {
      student_info: {
        "Full Name": mainEndpointData.student.full_name,
        "Enrollment Number": mainEndpointData.student.enrollment_number,
        Email: mainEndpointData.student.email,
        Specialization: mainEndpointData.student.specialization,
        "Batch Year": mainEndpointData.student.batch_year,
        CGPA: mainEndpointData.student.cgpa,
        Backlogs: mainEndpointData.student.backlogs,
        "Placement Status": mainEndpointData.student.placement_status,
      },
      statistics: mainEndpointData.statistics,
      applications: mainEndpointData.applications.map((app) => ({
        "Company Name": app.company_name,
        Applied: app.applied ? "Yes" : "No",
        "Total Rounds": app.rounds.length,
        "Rounds Attended": app.rounds.filter((r) => r.attended).length,
        "Last Round Reached": app.last_round_reached || "N/A",
        "Final Result": app.final_result || "Pending",
      })),
      not_applied: mainEndpointData.not_applied.map((c) => ({
        "Company Name": c.company_name,
        "Is Marquee": c.is_marquee ? "Yes" : "No",
        Sector: c.sector,
      })),
      offers: mainEndpointData.offers.map((offer) => ({
        Company: offer.company_name || "Campus Offer",
        Position: offer.position_title || "N/A",
        "Package (LPA)": offer.package || "N/A",
        "Job Type": offer.job_type,
        "Offer Date": offer.offer_date,
        Accepted: offer.is_accepted ? "Yes" : "No",
      })),
    };

    res.json(exportData);
  } catch (error) {
    console.error("Error exporting analytics:", error);
    res.status(500).json({ error: "Failed to export analytics" });
  } finally {
    client.release();
  }
});

module.exports = routes;

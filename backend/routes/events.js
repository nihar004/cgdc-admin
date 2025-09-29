// routes/events.js
const express = require("express");
const routes = express.Router();
const db = require("../db");

// Get all events with attendance data for a specific batch year
routes.get("/batch/:batch_year", async (req, res) => {
  try {
    const { batch_year } = req.params;

    const query = `
      SELECT 
      e.id,
      c.id as company_id,
      cp.id as position_id,
      e.title,
      e.event_type,
      e.event_date,
      e.start_time,
      e.end_time,
      e.venue,
      e.mode,
      e.is_mandatory,
      e.status as event_status,
      e.is_placement_event,
      e.target_specializations,
      e.speaker_details,
      c.company_name,
      c.allowed_specializations,
      cp.job_type,
      cp.position_title,
      cp.package_range,
      cp.internship_stipend_monthly,
      COALESCE(array_agg(DISTINCT b.year) FILTER (WHERE b.id IS NOT NULL), '{}') AS target_academic_years,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object(
          'student_id', s.id,
          'name', CONCAT(s.first_name, ' ', s.last_name),
          'registration_number', s.registration_number,
          'enrollment_number', s.enrollment_number,
          'department', CONCAT(s.department, ' ', s.branch),
          'batch_year', s.batch_year,
          'attendance_status', COALESCE(ea.status, 'absent'),
          'marked_at', ea.marked_at,
          'reason_for_change', ea.reason_for_change
        )) FILTER (WHERE s.id IS NOT NULL),
        '[]'::json
      ) AS attendance_data
  FROM events e
  LEFT JOIN companies c ON e.company_id = c.id
  LEFT JOIN company_positions cp ON e.position_id = cp.id
  LEFT JOIN event_batches eb ON e.id = eb.event_id
  LEFT JOIN batches b ON eb.batch_id = b.id
  LEFT JOIN (
      SELECT DISTINCT ON (event_id, student_id)
          event_id, 
          student_id, 
          status, 
          marked_at,
          reason_for_change
      FROM event_attendance
  ) ea ON e.id = ea.event_id
  LEFT JOIN students s ON s.id = ea.student_id AND s.batch_year = $1
  WHERE EXISTS (
      SELECT 1 
      FROM event_batches eb2 
      JOIN batches b2 ON eb2.batch_id = b2.id 
      WHERE eb2.event_id = e.id AND b2.year = $1
  )
  GROUP BY 
      e.id, c.id, cp.id, c.company_name, c.allowed_specializations,
      cp.job_type, cp.position_title, cp.package_range, cp.internship_stipend_monthly
  ORDER BY e.event_date DESC, e.start_time DESC;

    `;

    const result = await db.query(query, [batch_year]);

    // Transform rows into frontend-friendly JSON
    const events = result.rows.map((row) => {
      const targetSpecializations = row.is_placement_event
        ? row.allowed_specializations || []
        : row.target_specializations || [];

      // Format time for frontend
      const formatTime = (time) => {
        if (!time) return null;
        // If time is already a string (e.g., '09:00:00'), just return it in HH:MM format
        if (typeof time === "string") {
          // Optionally, format to HH:MM AM/PM
          const [hour, minute] = time.split(":");
          const dateObj = new Date();
          dateObj.setHours(Number(hour), Number(minute), 0);
          return dateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
        // If time is a Date object
        if (time instanceof Date) {
          return time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
        return null;
      };

      return {
        id: row.id,
        company_id: row.company_id,
        position_id: row.position_id,
        title: row.title,
        type: row.is_placement_event ? "company_round" : "cdgc_event",
        event_type: row.event_type,
        company: row.company_name,
        date: row.event_date
          ? row.event_date.toISOString().split("T")[0]
          : null,
        time: formatTime(row.start_time),
        endTime: formatTime(row.end_time),
        venue: row.venue,
        mode: row.mode,
        status: row.event_status,
        isMandatory: row.is_mandatory,
        jobType: row.job_type,
        positionTitle: row.position_title,
        packageRange: row.package_range,
        stipend: row.internship_stipend_monthly,
        speakerDetails: row.speaker_details || {},
        targetSpecializations,
        targetAcademicYears: row.target_academic_years || [],
        attendance: (row.attendance_data || []).map((student) => ({
          studentId: student.student_id,
          name: student.name,
          registrationNumber: student.registration_number,
          enrollmentNumber: student.enrollment_number,
          department: student.department,
          batchYear: student.batch_year,
          status: student.attendance_status,
          checkInTime: student.marked_at
            ? new Date(student.marked_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : null,
          reasonForChange: student.reason_for_change || null,
        })),
      };
    });

    res.json({
      success: true,
      data: events,
      batch_year: batch_year,
    });
  } catch (error) {
    console.error("Error fetching events with attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events with attendance",
      error: error.message,
    });
  }
});

// Create new event
routes.post("/", async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const {
      title,
      eventType,
      date, // Changed from startDatetime
      startTime, // New field
      endTime, // New field
      venue,
      mode,
      isPlacementEvent,
      isMandatory,
      companyId,
      positionId,
      targetSpecializations,
      targetAcademicYears,
      speakerDetails,
    } = req.body;

    // 🔹 Validation
    if (!title || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, eventType.",
      });
    }

    if (!targetAcademicYears || targetAcademicYears.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one target academic year must be specified.",
      });
    }

    if (
      !Array.isArray(targetSpecializations) ||
      targetSpecializations.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one target specialization/branch must be specified.",
      });
    }

    if (isPlacementEvent && (!companyId || !positionId)) {
      return res.status(400).json({
        success: false,
        message: "Company and position are required for placement events.",
      });
    }

    // 🔹 Insert event
    const insertEventQuery = `
      INSERT INTO events (
        title, 
        event_type, 
        event_date, 
        start_time,
        end_time,
        venue, 
        mode, 
        is_placement_event, 
        is_mandatory,
        company_id, 
        position_id,
        target_specializations, 
        speaker_details, 
        status,
        created_at,
        updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'upcoming',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const eventValues = [
      title,
      eventType,
      date,
      startTime,
      endTime,
      venue?.trim() || null,
      mode || null,
      isPlacementEvent || false,
      isMandatory || false,
      isPlacementEvent ? companyId : null,
      isPlacementEvent ? positionId : null,
      !isPlacementEvent && targetSpecializations?.length > 0
        ? targetSpecializations
        : null,
      speakerDetails &&
      Object.values(speakerDetails).some((val) => val && val.toString().trim())
        ? speakerDetails
        : null,
    ];

    const eventResult = await client.query(insertEventQuery, eventValues);
    const eventId = eventResult.rows[0].id;

    // 🔹 Insert event-batch relationships (optimized)
    const batchResult = await client.query(
      `SELECT id FROM batches WHERE year = ANY($1::int[])`,
      [targetAcademicYears.map(Number)]
    );

    if (batchResult.rows.length !== targetAcademicYears.length) {
      throw new Error("One or more batch years not found");
    }

    const values = batchResult.rows
      .map((b) => `(${eventId}, ${b.id})`)
      .join(",");

    await client.query(
      `INSERT INTO event_batches (event_id, batch_id) VALUES ${values}`
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        ...eventResult.rows[0],
        targetAcademicYears,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// Update event details
routes.put("/:id", async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const {
      title,
      eventType,
      date, // Changed from startDatetime
      startTime, // New field
      endTime, // New field
      venue,
      mode,
      isPlacementEvent,
      isMandatory,
      companyId,
      positionId,
      targetSpecializations,
      targetAcademicYears,
      speakerDetails,
    } = req.body;

    if (!title || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, eventType.",
      });
    }
    if (!targetAcademicYears || targetAcademicYears.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one target academic year must be specified.",
      });
    }
    if (
      !Array.isArray(targetSpecializations) ||
      targetSpecializations.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one target specialization/branch must be specified.",
      });
    }
    if (isPlacementEvent && (!companyId || !positionId)) {
      return res.status(400).json({
        success: false,
        message: "Company and position are required for placement events.",
      });
    }

    // Check if event exists
    const existingEvent = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );
    if (existingEvent.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 3. Update event
    const updateEventQuery = `
      UPDATE events SET
        title = $1,
        event_type = $2,
        event_date = $3,
        start_time = $4,
        end_time = $5,
        venue = $6,
        mode = $7,
        is_placement_event = $8,
        is_mandatory = $9,
        company_id = $10,
        position_id = $11,
        target_specializations = $12,
        speaker_details = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;
    const eventValues = [
      title,
      eventType,
      date,
      startTime,
      endTime,
      venue?.trim() || null,
      mode || null,
      isPlacementEvent || false,
      isMandatory || false,
      isPlacementEvent ? companyId : null,
      isPlacementEvent ? positionId : null,
      !isPlacementEvent && targetSpecializations?.length > 0
        ? targetSpecializations
        : null,
      speakerDetails &&
      Object.values(speakerDetails).some((val) => val && val.toString().trim())
        ? speakerDetails
        : null,
      id,
    ];

    const eventResult = await client.query(updateEventQuery, eventValues);

    // Update event-batch relationships
    if (targetAcademicYears && targetAcademicYears.length > 0) {
      // Delete old mappings
      await client.query("DELETE FROM event_batches WHERE event_id = $1", [id]);

      // Get batch IDs in ONE query
      const batchResult = await client.query(
        `SELECT id FROM batches WHERE year = ANY($1::int[])`,
        [targetAcademicYears.map(Number)]
      );

      if (batchResult.rows.length !== targetAcademicYears.length) {
        throw new Error("One or more batch years not found");
      }

      // Build bulk insert
      const values = batchResult.rows.map((b) => `(${id}, ${b.id})`).join(",");

      await client.query(
        `INSERT INTO event_batches (event_id, batch_id) VALUES ${values}`
      );
    }

    await client.query("COMMIT");

    const response = {
      success: true,
      message: "Event updated successfully",
      data: {
        ...eventResult.rows[0],
        targetAcademicYears: targetAcademicYears || [],
      },
    };

    res.json(response);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// Delete event
routes.delete("/:id", async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;

    // Delete event and return deleted row
    const deletedEvent = await client.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedEvent.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// GET STUDENTS WHO RESPONDED TO EVENT FORMS (For Attendance)
routes.get("/:eventId/responses", async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Valid event ID is required",
      });
    }

    // Get essential student info for attendance marking
    const query = `
      SELECT DISTINCT
        s.id,
        s.registration_number,
        s.enrollment_number,
        s.first_name,
        s.last_name,
        s.department,
        s.batch_year
      FROM students s
      INNER JOIN form_responses fr ON fr.student_id = s.id
      INNER JOIN forms f ON f.id = fr.form_id
      WHERE f.event_id = $1
      ORDER BY s.batch_year, s.department, s.first_name, s.last_name
    `;

    const result = await db.query(query, [eventId]);

    res.json({
      success: true,
      data: {
        students: result.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching event responses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event responses",
      error: error.message,
    });
  }
});

// Update event status with business rules
routes.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed statuses
    const validStatuses = ["upcoming", "ongoing", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: upcoming, ongoing, completed",
      });
    }

    // Fetch event with calculated fields
    const eventQuery = `
      SELECT 
        id, title, event_date, start_time, end_time, status,
        CURRENT_TIMESTAMP >= (event_date + start_time)::timestamp AS can_mark_ongoing,
        CURRENT_TIMESTAMP >= (event_date + end_time)::timestamp AS can_mark_completed
      FROM events 
      WHERE id = $1
    `;
    const eventResult = await db.query(eventQuery, [id]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventResult.rows[0];

    // Business rules for transitions
    if (event.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of a completed event",
      });
    }

    if (status === "ongoing" && !event.can_mark_ongoing) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark event as ongoing before its start time",
      });
    }

    if (status === "completed" && !event.can_mark_completed) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark event as completed before its end time",
      });
    }

    // Enforce forward-only flow
    const order = { upcoming: 1, ongoing: 2, completed: 3 };
    if (order[status] < order[event.status]) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition: cannot move from ${event.status} back to ${status}`,
      });
    }

    // Update status
    const updateQuery = `
      UPDATE events 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING id, title, status, updated_at
    `;
    const result = await db.query(updateQuery, [status, id]);

    res.json({
      success: true,
      message: `Event status updated to ${status}`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event status",
      error: error.message,
    });
  }
});

// POST /api/events/:id/attendance
routes.post("/:id/attendance", async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { id: eventId } = req.params;
    const { registration_numbers, status = "present" } = req.body;

    if (!registration_numbers || registration_numbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No registration numbers provided",
      });
    }

    const validStatuses = ["present", "absent", "late"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Check event status
    const eventResult = await client.query(
      `SELECT id, title, status FROM events WHERE id = $1`,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventResult.rows[0];
    if (event.status !== "ongoing") {
      return res.status(400).json({
        success: false,
        message: "Attendance can only be taken for ongoing events",
      });
    }

    // Fetch matching students
    const studentResult = await client.query(
      `SELECT id, registration_number 
       FROM students 
       WHERE registration_number = ANY($1)`,
      [registration_numbers]
    );

    if (studentResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid students found for provided registration numbers",
      });
    }

    const studentMap = new Map(
      studentResult.rows.map((s) => [s.registration_number, s.id])
    );

    const successful = [];
    const errors = [];

    // Insert or update attendance
    for (const reg of registration_numbers) {
      const studentId = studentMap.get(reg);

      if (!studentId) {
        errors.push({
          regNumber: reg,
          reason: "Student not found",
        });
        continue;
      }

      try {
        const result = await client.query(
          `INSERT INTO event_attendance (event_id, student_id, status, marked_at)
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
           ON CONFLICT (event_id, student_id)
           DO UPDATE SET 
             status = EXCLUDED.status,
             marked_at = CURRENT_TIMESTAMP
           RETURNING id, student_id, status, marked_at`,
          [eventId, studentId, status]
        );

        successful.push({
          regNumber: reg,
          data: result.rows[0],
        });
      } catch (err) {
        console.error(`Failed to record attendance for ${reg}:`, err);
        errors.push({
          regNumber: reg,
          reason: "Database insertion failed",
        });
      }
    }

    await client.query("COMMIT");

    const response = {
      success: true,
      message: "Attendance processed",
      summary: {
        total: registration_numbers.length,
        marked: successful.length,
        failed: errors.length,
      },
      successful,
      errors,
    };

    res.json(response);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error marking attendance:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// PUT /:eventId/attendance
routes.put("/:eventId/attendance", async (req, res) => {
  const client = await db.connect();

  try {
    const { eventId } = req.params;
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No attendance records provided" });
    }

    // Check event status
    const eventRes = await client.query(
      "SELECT status FROM events WHERE id = $1",
      [eventId]
    );

    if (eventRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    const eventStatus = eventRes.rows[0].status;

    const updated = [];
    const errors = [];

    for (const record of records) {
      const { studentId, status, reasonForChange } = record;

      try {
        // Fixed query with explicit type casting
        const updateRes = await client.query(
          `
          UPDATE event_attendance
          SET 
            status = $1,
            reason_for_change = CASE 
              WHEN $2::text IS NOT NULL THEN $2::text 
              ELSE reason_for_change 
            END,
            marked_at = CURRENT_TIMESTAMP
          WHERE event_id = $3 AND student_id = $4
          RETURNING *;
          `,
          [status, reasonForChange || null, eventId, studentId]
        );

        if (updateRes.rows.length === 0) {
          errors.push({ studentId, reason: "Attendance record not found" });
        } else {
          updated.push(updateRes.rows[0]);
        }
      } catch (err) {
        errors.push({ studentId, reason: "Database update failed" });
      }
    }

    const response = {
      success: true,
      updatedCount: updated.length,
      errorsCount: errors.length,
      updated,
      errors,
    };

    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating attendance" });
  } finally {
    client.release();
  }
});

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

module.exports = routes;

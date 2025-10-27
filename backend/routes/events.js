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
        e.round_type,
        e.round_number,
        e.position_ids,
        e.target_specializations,
        e.speaker_details,
        c.company_name,
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
          e.id, c.id, c.company_name
      ORDER BY e.event_date DESC, e.start_time DESC;
    `;

    const result = await db.query(query, [batch_year]);

    // Transform rows into frontend-friendly JSON
    const events = result.rows.map((row) => {
      const targetSpecializations = row.is_placement_event
        ? null
        : row.target_specializations || [];

      const formatTime = (time) => {
        if (!time) return null;
        if (typeof time === "string") {
          const [hour, minute] = time.split(":");
          const dateObj = new Date();
          dateObj.setHours(Number(hour), Number(minute), 0);
          return dateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
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
        position_ids: row.position_ids || [],
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
        roundType: row.round_type,
        roundNumber: row.is_placement_event ? row.round_number : null, // included roundNumber
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
      date,
      startTime,
      endTime,
      venue,
      mode,
      isPlacementEvent,
      isMandatory,
      companyId,
      positionIds,
      roundType, // frontend-provided
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

    let finalTargetSpecializations = targetSpecializations;

    if (isPlacementEvent && companyId) {
      if (!positionIds || positionIds.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "At least one position must be specified for placement events.",
        });
      }

      // Fetch allowed specializations from company
      const companyResult = await client.query(
        "SELECT allowed_specializations FROM companies WHERE id = $1",
        [companyId]
      );

      if (companyResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      finalTargetSpecializations =
        companyResult.rows[0].allowed_specializations;

      if (
        !finalTargetSpecializations ||
        finalTargetSpecializations.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Company has no specified target specializations",
        });
      }
    } else {
      if (
        !Array.isArray(targetSpecializations) ||
        targetSpecializations.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one target specialization/branch must be specified for non-company events.",
        });
      }
    }

    // Compute roundNumber automatically for placement events
    let roundNumber = null;
    if (isPlacementEvent && companyId && positionIds) {
      const lastRoundRes = await client.query(
        `SELECT MAX(round_number) AS last_round
         FROM events
         WHERE company_id = $1
           AND position_ids && $2::int[]
           AND is_placement_event = true`,
        [companyId, positionIds]
      );

      roundNumber = lastRoundRes.rows[0].last_round
        ? parseInt(lastRoundRes.rows[0].last_round) + 1
        : 1;
    }

    // Insert event
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
        position_ids,
        round_type,
        round_number,
        target_specializations, 
        speaker_details, 
        status,
        created_at,
        updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'upcoming',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const eventValues = [
      title,
      eventType,
      date || null,
      startTime || null,
      endTime || null,
      venue?.trim() || null,
      mode || null,
      isPlacementEvent || false,
      isMandatory || false,
      isPlacementEvent ? companyId : null,
      isPlacementEvent ? positionIds : null,
      roundType || null,
      roundNumber,
      finalTargetSpecializations,
      speakerDetails &&
      Object.values(speakerDetails).some((val) => val && val.toString().trim())
        ? speakerDetails
        : null,
    ];

    const eventResult = await client.query(insertEventQuery, eventValues);
    const eventId = eventResult.rows[0].id;

    // Insert batch relationships
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
        targetSpecializations: finalTargetSpecializations,
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

// helper function for Update event details
function arraysEqualIgnoringOrder(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;

  const sortedA = a.map(String).sort();
  const sortedB = b.map(String).sort();

  return sortedA.every((val, idx) => val === sortedB[idx]);
}

// Update event details
routes.put("/:id", async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const {
      title,
      eventType,
      date,
      startTime,
      endTime,
      venue,
      mode,
      isPlacementEvent,
      isMandatory,
      companyId,
      positionIds,
      roundType,
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

    // Prevent changing company/positions for placement events
    if (existingEvent.rows[0].is_placement_event) {
      if (
        companyId &&
        String(companyId) !== String(existingEvent.rows[0].company_id)
      ) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message:
            "Cannot change company for existing placement events. Please delete and create a new event.",
        });
      }

      if (
        positionIds &&
        !arraysEqualIgnoringOrder(
          positionIds,
          existingEvent.rows[0].position_ids
        )
      ) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message:
            "Cannot change positions for existing placement events. Please delete and create a new event.",
        });
      }
    }

    let finalTargetSpecializations = targetSpecializations;

    if (isPlacementEvent && companyId) {
      if (!positionIds || positionIds.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "At least one position must be specified for placement events.",
        });
      }

      // Fetch allowed specializations from company
      const companyResult = await client.query(
        "SELECT allowed_specializations FROM companies WHERE id = $1",
        [companyId]
      );

      if (companyResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      finalTargetSpecializations =
        companyResult.rows[0].allowed_specializations;

      if (
        !finalTargetSpecializations ||
        finalTargetSpecializations.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Company has no specified target specializations",
        });
      }
    } else {
      if (
        !Array.isArray(targetSpecializations) ||
        targetSpecializations.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one target specialization/branch must be specified for non-company events.",
        });
      }
    }

    // Update event - keep original round_number and company/position data
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
        round_type = $10,
        target_specializations = $11,
        speaker_details = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `;

    const eventValues = [
      title,
      eventType,
      date || null,
      startTime || null,
      endTime || null,
      venue?.trim() || null,
      mode || null,
      isPlacementEvent || false,
      isMandatory || false,
      roundType || null,
      finalTargetSpecializations,
      speakerDetails &&
      Object.values(speakerDetails).some((val) => val && val.toString().trim())
        ? speakerDetails
        : null,
      id,
    ];

    const eventResult = await client.query(updateEventQuery, eventValues);

    // Update batch mappings
    await client.query("DELETE FROM event_batches WHERE event_id = $1", [id]);

    const batchResult = await client.query(
      `SELECT id FROM batches WHERE year = ANY($1::int[])`,
      [targetAcademicYears.map(Number)]
    );

    if (batchResult.rows.length !== targetAcademicYears.length) {
      throw new Error("One or more batch years not found");
    }

    const values = batchResult.rows.map((b) => `(${id}, ${b.id})`).join(",");

    await client.query(
      `INSERT INTO event_batches (event_id, batch_id) VALUES ${values}`
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Event updated successfully",
      data: {
        ...eventResult.rows[0],
        targetAcademicYears,
        targetSpecializations: finalTargetSpecializations,
      },
    });
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

    // Get the event to check if it's a placement event
    const eventResult = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventResult.rows[0];

    // Delete event
    await client.query("DELETE FROM events WHERE id = $1", [id]);

    // If it was a placement event, re-adjust round numbers
    if (event.is_placement_event && event.company_id && event.position_ids) {
      // Fetch remaining rounds for same company & overlapping positions
      const remainingEvents = await client.query(
        `SELECT id, round_number
         FROM events
         WHERE is_placement_event = true
           AND company_id = $1
           AND position_ids && $2::int[]
         ORDER BY round_number ASC`,
        [event.company_id, event.position_ids]
      );

      // Update round numbers sequentially starting from 1
      for (let i = 0; i < remainingEvents.rows.length; i++) {
        const e = remainingEvents.rows[i];
        const newRoundNumber = i + 1;
        if (e.round_number !== newRoundNumber) {
          await client.query(
            "UPDATE events SET round_number = $1 WHERE id = $2",
            [newRoundNumber, e.id]
          );
        }
      }
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

// GET eligible students for attendance (placement or non-placement, all rounds)
routes.get("/:eventId/eligibleStudents", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { positionIds } = req.query; // comma-separated array: ?positionIds=1,2,3

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Valid event ID is required",
      });
    }

    const positionIdArray = positionIds
      ? positionIds
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id)) // Filter out NaN values
      : [];

    // Fetch event info
    const eventRes = await db.query(
      `SELECT id, is_placement_event, round_number, company_id, position_ids
       FROM events
       WHERE id = $1`,
      [eventId]
    );

    if (eventRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const event = eventRes.rows[0];
    let studentQuery = "";
    let studentParams = [];

    if (event.is_placement_event) {
      if (event.round_number === 1) {
        // First round: fetch students who applied via forms for the given positions
        if (positionIdArray.length > 0) {
          // Filter by specific positions
          studentQuery = `
            SELECT DISTINCT
              s.id,
              s.registration_number,
              s.enrollment_number,
              s.first_name,
              s.last_name,
              s.department,
              s.batch_year,
              (fr.response_data->>'position_id')::int AS applied_position_id
            FROM students s
            INNER JOIN form_responses fr ON fr.student_id = s.id
            INNER JOIN forms f ON f.id = fr.form_id
            WHERE f.event_id = $1
              AND (fr.response_data->>'position_id')::int = ANY($2::int[])
            ORDER BY s.batch_year, s.department, s.first_name, s.last_name
          `;
          studentParams = [eventId, positionIdArray];
        } else {
          // No position filter - get all students who applied
          studentQuery = `
            SELECT DISTINCT
              s.id,
              s.registration_number,
              s.enrollment_number,
              s.first_name,
              s.last_name,
              s.department,
              s.batch_year,
              (fr.response_data->>'position_id')::int AS applied_position_id
            FROM students s
            INNER JOIN form_responses fr ON fr.student_id = s.id
            INNER JOIN forms f ON f.id = fr.form_id
            WHERE f.event_id = $1
            ORDER BY s.batch_year, s.department, s.first_name, s.last_name
          `;
          studentParams = [eventId];
        }
      } else {
        // Subsequent rounds: fetch students selected in previous round(s) for these positions
        if (positionIdArray.length > 0) {
          // Filter by specific positions - get students who applied for these positions AND were selected in previous round
          studentQuery = `
            SELECT DISTINCT
              s.id,
              s.registration_number,
              s.enrollment_number,
              s.first_name,
              s.last_name,
              s.department,
              s.batch_year,
              (fr.response_data->>'position_id')::int AS applied_position_id
            FROM students s
            INNER JOIN student_round_results srr ON srr.student_id = s.id
            INNER JOIN events prev_event ON prev_event.id = srr.event_id
            INNER JOIN form_responses fr ON fr.student_id = s.id
            INNER JOIN forms f ON f.id = fr.form_id
            WHERE srr.result_status = 'selected'
              AND prev_event.company_id = $1
              AND prev_event.round_number = $2
              AND s.registration_number IS NOT NULL
              AND f.event_id IN (
                SELECT id FROM events 
                WHERE company_id = $1 AND round_number = 1
              )
              AND (fr.response_data->>'position_id')::int = ANY($3::int[])
            ORDER BY s.batch_year, s.department, s.first_name, s.last_name
          `;
          studentParams = [
            event.company_id,
            event.round_number - 1,
            positionIdArray,
          ];
        } else {
          // No position filter - get all selected students from previous round
          studentQuery = `
            SELECT DISTINCT
              s.id,
              s.registration_number,
              s.enrollment_number,
              s.first_name,
              s.last_name,
              s.department,
              s.batch_year,
              (
                SELECT (fr.response_data->>'position_id')::int
                FROM form_responses fr
                INNER JOIN forms f ON f.id = fr.form_id
                WHERE fr.student_id = s.id
                  AND f.event_id IN (
                    SELECT id FROM events 
                    WHERE company_id = $1 AND round_number = 1
                  )
                LIMIT 1
              ) AS applied_position_id
            FROM students s
            INNER JOIN student_round_results srr ON srr.student_id = s.id
            INNER JOIN events prev_event ON prev_event.id = srr.event_id
            WHERE srr.result_status = 'selected'
              AND prev_event.company_id = $1
              AND prev_event.round_number = $2
              AND s.registration_number IS NOT NULL
            ORDER BY s.batch_year, s.department, s.first_name, s.last_name
          `;
          studentParams = [event.company_id, event.round_number - 1];
        }
      }
    } else {
      // Non-placement events: fetch all students registered for the event
      studentQuery = `
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
      studentParams = [eventId];
    }

    const result = await db.query(studentQuery, studentParams);

    res.json({
      success: true,
      data: {
        students: result.rows,
        filteredByPositions: positionIdArray.length ? positionIdArray : null,
        totalCount: result.rows.length,
        roundNumber: event.round_number,
        isPlacementEvent: event.is_placement_event,
      },
    });
  } catch (error) {
    console.error("Error fetching eligible students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch eligible students",
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

    // Fetch event details including round_number
    const eventResult = await client.query(
      `SELECT 
        e.id, 
        e.title, 
        e.status, 
        e.is_placement_event, 
        e.position_ids,
        e.round_type,
        e.company_id,
        e.round_number
      FROM events e 
      WHERE e.id = $1`,
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

    let studentQuery;
    let studentParams;
    let isFirstRound = false;

    if (event.is_placement_event) {
      // ✅ Use round_number instead of event_date
      if (event.round_number === 1) {
        // 🎯 First round — students from form_responses
        isFirstRound = true;

        studentQuery = `
          SELECT DISTINCT 
            s.id, 
            s.registration_number,
            (fr.response_data->>'position_id')::int AS applied_position_id
          FROM students s
          INNER JOIN form_responses fr ON fr.student_id = s.id
          INNER JOIN forms f ON f.id = fr.form_id
          WHERE s.registration_number = ANY($1)
            AND f.event_id = $2
            AND (fr.response_data->>'position_id')::int = ANY($3::int[])
        `;
        studentParams = [registration_numbers, eventId, event.position_ids];
      } else {
        // 🔁 Subsequent rounds — students selected in the previous round
        const prevRoundQuery = await client.query(
          `SELECT id FROM events 
           WHERE company_id = $1
             AND position_ids && $2::int[]
             AND round_number = $3 - 1
             AND is_placement_event = true
           LIMIT 1`,
          [event.company_id, event.position_ids, event.round_number]
        );

        if (prevRoundQuery.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Previous round not found for this event",
          });
        }

        const prevEventId = prevRoundQuery.rows[0].id;

        studentQuery = `
          SELECT DISTINCT 
            s.id, 
            s.registration_number
          FROM students s
          INNER JOIN student_round_results srr ON srr.student_id = s.id
          WHERE srr.event_id = $1
            AND srr.result_status = 'selected'
            AND s.registration_number = ANY($2)
        `;
        studentParams = [prevEventId, registration_numbers];
      }
    } else {
      // 📋 Non-placement event — directly from students table
      studentQuery = `
        SELECT id, registration_number 
        FROM students 
        WHERE registration_number = ANY($1)
      `;
      studentParams = [registration_numbers];
    }

    const studentResult = await client.query(studentQuery, studentParams);

    if (studentResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: event.is_placement_event
          ? isFirstRound
            ? "No students found who applied for this position through forms"
            : "No students found who were selected in previous rounds"
          : "No valid students found for provided registration numbers",
      });
    }

    const studentMap = new Map(
      studentResult.rows.map((s) => [s.registration_number, s.id])
    );

    const successful = [];
    const errors = [];

    // 🟩 Mark attendance and initialize student_round_results
    for (const reg of registration_numbers) {
      const studentId = studentMap.get(reg);

      if (!studentId) {
        errors.push({
          regNumber: reg,
          reason: event.is_placement_event
            ? isFirstRound
              ? "Student did not apply through form"
              : "Student not selected in previous round"
            : "Student not found",
        });
        continue;
      }

      try {
        // ✅ Mark attendance
        const attendanceResult = await client.query(
          `INSERT INTO event_attendance (event_id, student_id, status, marked_at)
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
           ON CONFLICT (event_id, student_id)
           DO UPDATE SET 
             status = EXCLUDED.status,
             marked_at = CURRENT_TIMESTAMP
           RETURNING id, student_id, status, marked_at`,
          [eventId, studentId, status]
        );

        // ✅ Add entry to student_round_results (simple version)
        if (event.is_placement_event) {
          await client.query(
            `INSERT INTO student_round_results (student_id, event_id, result_status)
             VALUES ($1, $2, 'pending')
             ON CONFLICT (student_id, event_id) DO NOTHING`,
            [studentId, eventId]
          );
        }

        successful.push({
          regNumber: reg,
          data: attendanceResult.rows[0],
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

    res.json({
      success: true,
      message: "Attendance processed",
      roundInfo: {
        roundNumber: event.round_number,
        isFirstRound: event.round_number === 1,
        roundType: event.round_type,
        source: event.is_placement_event
          ? event.round_number === 1
            ? "form_responses"
            : "previous_round_selected"
          : "all_students",
      },
      summary: {
        total: registration_numbers.length,
        marked: successful.length,
        failed: errors.length,
      },
      successful,
      errors,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error marking attendance:", error);
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
// Only used to update reasonForChange and optionally correct status.
// No inserting new attendance records—POST still handles marking attendance.
routes.put("/:id/attendance", async (req, res) => {
  const client = await db.connect();

  try {
    const { id: eventId } = req.params;
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No attendance records provided",
      });
    }

    // Validate event existence
    const eventRes = await client.query(
      "SELECT status FROM events WHERE id = $1",
      [eventId]
    );

    if (eventRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updated = [];
    const errors = [];

    for (const record of records) {
      const { studentId, status, reasonForChange } = record;

      if (!studentId) {
        errors.push({ studentId: null, reason: "studentId is required" });
        continue;
      }

      try {
        // Only update existing attendance records
        const updateRes = await client.query(
          `
          UPDATE event_attendance
          SET 
            status = COALESCE($1, status),
            reason_for_change = COALESCE($2, reason_for_change),
            marked_at = CURRENT_TIMESTAMP
          WHERE event_id = $3 AND student_id = $4
          RETURNING *
          `,
          [status || null, reasonForChange || null, eventId, studentId]
        );

        if (updateRes.rows.length === 0) {
          errors.push({ studentId, reason: "Attendance record not found" });
        } else {
          updated.push(updateRes.rows[0]);
        }
      } catch (err) {
        console.error(
          `Failed to update attendance for student ${studentId}:`,
          err
        );
        errors.push({ studentId, reason: "Database update failed" });
      }
    }

    res.json({
      success: true,
      updatedCount: updated.length,
      errorsCount: errors.length,
      updated,
      errors,
    });
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({
      success: false,
      message: "Error updating attendance",
      error: err.message,
    });
  } finally {
    client.release();
  }
});

// GET /events/positions/by-ids
routes.get("/positions/by-ids", async (req, res) => {
  try {
    // Accept IDs via query (?ids=1,2,3) or request body { ids: [1,2,3] }
    let ids = req.query.ids
      ? req.query.ids.split(",").map((id) => parseInt(id.trim()))
      : req.body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No position IDs provided",
      });
    }

    const result = await db.query(
      `
      SELECT 
        id,
        company_id,
        position_title,
        job_type,
        package_range,
        is_active,
        internship_stipend_monthly,
        rounds_start_date,
        rounds_end_date,
        created_at,
        updated_at
      FROM company_positions
      WHERE id = ANY($1)
      ORDER BY id;
      `,
      [ids]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No company positions found for provided IDs",
      });
    }

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching company positions by IDs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company positions",
      error: error.message,
    });
  }
});

module.exports = routes;

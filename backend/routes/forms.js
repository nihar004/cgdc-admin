const express = require("express");
const routes = express.Router();
const db = require("../db");
const multer = require("multer");
const XLSX = require("xlsx");
const Papa = require("papaparse");
const fs = require("fs");

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed!"), false);
    }
  },
});

// Helper function to parse uploaded file
const parseUploadedFile = async (filePath, mimetype) => {
  let data = [];

  if (mimetype === "text/csv") {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    data = parsed.data;
  } else {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    data = XLSX.utils.sheet_to_json(worksheet);
  }

  return data;
};

// Helper function to detect registration number column
const detectRegistrationColumn = (headers) => {
  const regPatterns = [
    /^reg(istration)?[-_]?(number|no|num)?$/i,
    /^student[-_]?id$/i,
    /^roll[-_]?(number|no|num)?$/i,
    /^id[-_]?(number|no|num)?$/i,
  ];

  for (let i = 0; i < headers.length; i++) {
    const original = headers[i];
    const normalized = original.replace(/\s+/g, "_").toLowerCase();

    if (regPatterns.some((pattern) => pattern.test(normalized))) {
      return original; // return actual header key
    }
  }

  return null;
};

// 1. CREATE NEW FORM
routes.post("/", async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { title, type, event_id, batch_year } = req.body;

    // 1️ Validate required fields
    if (!title || !type || !batch_year) {
      return res.status(400).json({
        success: false,
        message: "Title, type, and batch_year are required fields",
      });
    }

    // 2 Validate form type
    const validTypes = [
      "application",
      "feedback",
      "survey",
      "attendance",
      "custom",
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid form type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    // 3️ Validate batch year
    const currentYear = new Date().getFullYear();
    if (batch_year < 2020 || batch_year > currentYear + 5) {
      return res.status(400).json({
        success: false,
        message: `Invalid batch year. Must be between 2020 and ${
          currentYear + 5
        }`,
      });
    }

    // 4️ Validate event_id and ensure it's linked to the batch year
    if (event_id) {
      const eventCheck = await client.query(
        `
        SELECT e.id, e.position_ids
        FROM events e
        INNER JOIN event_batches eb ON eb.event_id = e.id
        INNER JOIN batches b ON b.id = eb.batch_id
        WHERE e.id = $1 AND b.year = $2
      `,
        [event_id, batch_year]
      );

      if (eventCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Invalid event_id or the event is not available for batch year ${batch_year}`,
        });
      }

      // Validate event has positions
      const positionIds = eventCheck.rows[0].position_ids || [];
      if (positionIds.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message:
            "Event has no positions associated. Please add positions to the event first.",
        });
      }

      // 5️ Ensure one form per event per batch year
      const formExists = await client.query(
        "SELECT id FROM forms WHERE event_id = $1 AND batch_year = $2",
        [event_id, batch_year]
      );

      if (formExists.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "A form already exists for this event and batch year",
        });
      }
    }

    // 6️ Insert new form
    const insertQuery = `
      INSERT INTO forms (
        title, 
        type, 
        event_id, 
        batch_year, 
        created_at
      )
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, title, type, event_id, batch_year, created_at
    `;
    const result = await client.query(insertQuery, [
      title,
      type,
      event_id || null,
      batch_year,
    ]);

    const newForm = result.rows[0];

    // 7 Fetch full details with joins
    const detailQuery = `
      SELECT 
        f.id,
        f.title,
        f.type,
        f.batch_year,
        f.created_at,
        e.title AS event_title,
        e.event_date,
        e.position_ids,
        c.company_name,
        CASE 
          WHEN array_length(e.position_ids, 1) = 1 THEN 
            (SELECT position_title FROM company_positions WHERE id = e.position_ids[1])
          WHEN array_length(e.position_ids, 1) > 1 THEN 
            'Multiple Positions'
          ELSE 
            NULL
        END as position_info,
        0 AS total_responses
      FROM forms f
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE f.id = $1
    `;
    const detailResult = await client.query(detailQuery, [newForm.id]);

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: detailResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating form:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "A form with this title already exists for this batch year",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create form",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// 2. UPDATE FORM
routes.put("/:id", async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { title, type, event_id, batch_year } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid form ID is required",
      });
    }

    // Check if form exists
    const existingForm = await client.query(
      "SELECT id, event_id FROM forms WHERE id = $1",
      [id]
    );
    if (existingForm.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCounter}`);
      values.push(title);
      paramCounter++;
    }

    if (type !== undefined) {
      const validTypes = [
        "application",
        "feedback",
        "survey",
        "attendance",
        "custom",
      ];
      if (!validTypes.includes(type)) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Invalid form type. Must be one of: ${validTypes.join(
            ", "
          )}`,
        });
      }
      updates.push(`type = $${paramCounter}`);
      values.push(type);
      paramCounter++;
    }

    if (event_id !== undefined) {
      if (event_id !== null) {
        // Validate event exists and has positions
        const eventCheck = await client.query(
          "SELECT id, position_ids FROM events WHERE id = $1",
          [event_id]
        );

        if (eventCheck.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: "Invalid event_id. Event does not exist",
          });
        }

        const positionIds = eventCheck.rows[0].position_ids || [];

        if (positionIds.length === 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message:
              "Event has no positions associated. Please add positions to the event first.",
          });
        }

        // If changing event_id, check if form has responses
        if (existingForm.rows[0].event_id !== event_id) {
          const responseCount = await client.query(
            "SELECT COUNT(*) as count FROM form_responses WHERE form_id = $1",
            [id]
          );

          if (parseInt(responseCount.rows[0].count) > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({
              success: false,
              message:
                "Cannot change event for a form that already has responses. Please delete all responses first.",
            });
          }
        }
      }
      updates.push(`event_id = $${paramCounter}`);
      values.push(event_id);
      paramCounter++;
    }

    if (batch_year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (batch_year < 2020 || batch_year > currentYear + 5) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Invalid batch year. Must be between 2020 and ${
            currentYear + 5
          }`,
        });
      }
      updates.push(`batch_year = $${paramCounter}`);
      values.push(batch_year);
      paramCounter++;
    }

    if (updates.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    values.push(id);

    const updateQuery = `
      UPDATE forms 
      SET ${updates.join(", ")}
      WHERE id = $${paramCounter}
      RETURNING id, title, type, batch_year, event_id, created_at
    `;

    const result = await client.query(updateQuery, values);

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Form updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update form",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// 3. GET ALL FORMS
routes.get("/:year", async (req, res) => {
  try {
    const { year } = req.params;

    // Validate year parameter
    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year parameter is required",
      });
    }

    const query = `
      SELECT 
        f.id,
        f.title,
        f.type,
        f.batch_year,
        f.created_at,
        e.title AS event_title,
        e.id AS event_id,
        e.position_ids,
        c.company_name,
        CASE 
          WHEN array_length(e.position_ids, 1) = 1 THEN 
            (SELECT position_title FROM company_positions WHERE id = e.position_ids[1])
          WHEN array_length(e.position_ids, 1) > 1 THEN 
            'Multiple Positions'
          ELSE 
            NULL
        END as position_info,
        COUNT(fr.id) AS total_responses
      FROM forms f
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN form_responses fr ON fr.form_id = f.id
      WHERE f.batch_year = $1
      GROUP BY f.id, e.id, e.title, e.position_ids, c.company_name
      ORDER BY f.created_at DESC
    `;

    const result = await db.query(query, [year]);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch forms",
      error: error.message,
    });
  }
});

// 4. Upload route with proper company_id fetching
routes.post("/:id/upload", upload.single("file"), async (req, res) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const { id: formId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get form details including batch_year AND event_id
    const formResult = await client.query(
      `SELECT id, title, batch_year, type, event_id FROM forms WHERE id = $1`,
      [formId]
    );

    if (formResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    const form = formResult.rows[0];
    const formBatchYear = form.batch_year;

    // Get event positions and company_id
    let eventPositions = [];
    let autoAssignPositionId = null;
    let companyId = null;

    if (form.event_id) {
      const eventQuery = `
        SELECT e.position_ids, e.company_id 
        FROM events e 
        WHERE e.id = $1
      `;
      const eventResult = await client.query(eventQuery, [form.event_id]);

      if (eventResult.rows.length > 0) {
        eventPositions = eventResult.rows[0].position_ids || [];
        companyId = eventResult.rows[0].company_id;

        // Auto-assign if only one position
        if (eventPositions.length === 1) {
          autoAssignPositionId = eventPositions[0];
        }
      }
    }

    // Check eligibility snapshot exists if company is linked
    if (companyId) {
      const batchQuery = `SELECT id FROM batches WHERE year = $1`;
      const batchResult = await client.query(batchQuery, [formBatchYear]);

      if (batchResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Batch ${formBatchYear} not found in database`,
        });
      }

      const batchId = batchResult.rows[0].id;

      const eligibilityCheck = `
        SELECT id, eligible_student_ids, ineligible_student_ids 
        FROM company_eligibility 
        WHERE company_id = $1 AND batch_id = $2
      `;
      const eligibilityResult = await client.query(eligibilityCheck, [
        companyId,
        batchId,
      ]);

      if (eligibilityResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Eligibility snapshot not created for this company and batch. Please create company eligibility before uploading form data.`,
          requiresAction: "create_eligibility",
          companyId: companyId,
          batchYear: formBatchYear,
        });
      }
    }

    // Parse the uploaded file
    const data = await parseUploadedFile(file.path, file.mimetype);

    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data found in file",
      });
    }

    // Detect registration number column
    const headers = Object.keys(data[0]);
    const regColumn = detectRegistrationColumn(headers);

    if (!regColumn) {
      return res.status(400).json({
        success: false,
        message:
          "Registration number column not found. Expected columns: registration_number, reg_no etc.",
      });
    }

    // Check for position_title column if multiple positions
    if (eventPositions.length > 1) {
      const hasPositionColumn = headers.some((h) =>
        h
          .toLowerCase()
          .replace(/\s+/g, "_")
          .match(/position[_-]?(title|name)?/)
      );

      if (!hasPositionColumn) {
        const availablePositions = await client.query(
          `SELECT id, position_title FROM company_positions WHERE id = ANY($1)`,
          [eventPositions]
        );

        return res.status(400).json({
          success: false,
          message:
            "Event has multiple positions. CSV must contain 'position_title' column to specify which position each student applied for.",
          availablePositions: availablePositions.rows,
        });
      }
    }

    // Extract and clean registration numbers
    const registrationNumbers = data
      .map((row) => row[regColumn])
      .filter((reg) => reg && reg.toString().trim())
      .map((reg) => reg.toString().trim());

    // Find duplicates within file
    const duplicates = [];
    const seen = new Set();
    const uniqueRegistrations = [];

    data.forEach((row, index) => {
      const regNum = row[regColumn]?.toString().trim();
      if (!regNum) return;

      if (seen.has(regNum)) {
        duplicates.push({
          row: index + 2,
          regNumber: regNum,
          reason: "Duplicate entry in file",
        });
      } else {
        seen.add(regNum);
        uniqueRegistrations.push(regNum);
      }
    });

    // Validate students
    const studentMap = await validateStudents(
      uniqueRegistrations,
      formBatchYear,
      companyId,
      client
    );

    // Detect position_title column for multi-position events
    let positionTitleColumn = null;
    if (eventPositions.length > 1) {
      positionTitleColumn = headers.find((h) =>
        h
          .toLowerCase()
          .replace(/\s+/g, "_")
          .match(/position[_-]?(title|name)?/)
      );
    }

    // Process each row
    const results = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;
      const regNum = row[regColumn]?.toString().trim();

      if (!regNum) {
        results.push({
          row: rowNumber,
          regNumber: "",
          status: "error",
          reason: "Empty registration number",
        });
        continue;
      }

      if (duplicates.some((d) => d.row === rowNumber)) {
        results.push({
          row: rowNumber,
          regNumber: regNum,
          status: "duplicate",
          reason: "Duplicate entry in file",
        });
        continue;
      }

      const validationResult = studentMap.get(regNum);
      if (!validationResult) {
        results.push({
          row: rowNumber,
          regNumber: regNum,
          status: "error",
          reason: "Registration number not found in database",
        });
        continue;
      }

      if (validationResult.error) {
        results.push({
          row: rowNumber,
          regNumber: regNum,
          status: "error",
          reason: validationResult.error,
        });
        continue;
      }

      const student = validationResult.student;

      // Handle position_id
      let positionIdForResponse = null;

      if (autoAssignPositionId) {
        // Single position - auto assign
        positionIdForResponse = autoAssignPositionId;
      } else if (eventPositions.length > 1) {
        // Multiple positions - get from CSV
        const positionTitle = row[positionTitleColumn]?.toString().trim();

        if (!positionTitle) {
          results.push({
            row: rowNumber,
            regNumber: regNum,
            status: "error",
            reason: "Missing position_title for multi-position event",
          });
          continue;
        }

        // Match position title to position_id
        const positionMatch = await client.query(
          `SELECT id FROM company_positions 
           WHERE id = ANY($1) 
           AND LOWER(position_title) = LOWER($2)`,
          [eventPositions, positionTitle]
        );

        if (positionMatch.rows.length === 0) {
          results.push({
            row: rowNumber,
            regNumber: regNum,
            status: "error",
            reason: `Invalid position_title: '${positionTitle}'. Not found in event's available positions.`,
          });
          continue;
        }

        positionIdForResponse = positionMatch.rows[0].id;
      }

      const enrichedRow = {
        ...row,
        student_name: student.full_name,
        enrollment_number: student.enrollment_number,
        registration_number: regNum,
        batch_year: student.batch_year,
        department: student.department,
        branch: student.branch,
        position_id: positionIdForResponse, // Always include position_id
      };

      try {
        await client.query(
          `
          INSERT INTO form_responses (form_id, student_id, response_data)
          VALUES ($1, $2, $3)
          ON CONFLICT (form_id, student_id) 
          DO UPDATE SET 
            response_data = EXCLUDED.response_data,
            uploaded_at = CURRENT_TIMESTAMP
          `,
          [formId, student.id, JSON.stringify(enrichedRow)]
        );

        results.push({
          row: rowNumber,
          regNumber: regNum,
          status: "success",
          reason: "Inserted/Updated successfully",
        });
      } catch (insertError) {
        results.push({
          row: rowNumber,
          regNumber: regNum,
          status: "error",
          reason: "Database insertion failed",
        });
      }
    }

    await client.query("COMMIT");
    fs.unlinkSync(file.path);

    const summary = {
      total: data.length,
      successful: results.filter((r) => r.status === "success").length,
      duplicates: results.filter((r) => r.status === "duplicate").length,
      invalid: results.filter((r) => r.status === "error").length,
      form_batch_year: formBatchYear,
      year_mismatches: results.filter(
        (r) => r.reason && r.reason.includes("batch year")
      ).length,
      eligibility_failures: results.filter(
        (r) => r.reason && r.reason.includes("not eligible")
      ).length,
      position_errors: results.filter(
        (r) => r.reason && r.reason.includes("position")
      ).length,
      has_company_eligibility: companyId !== null,
      event_has_multiple_positions: eventPositions.length > 1,
    };

    res.json({
      success: true,
      message: `Upload completed for form: ${form.title} (Batch ${formBatchYear})`,
      summary,
      details: results,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error uploading data:", error);

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error("File cleanup failed:", e);
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to process upload",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// 5. GET FORM DATA -- get all responsis
routes.get("/:id/data", async (req, res) => {
  try {
    const { id: formId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const query = `
      SELECT 
        fr.id,
        fr.response_data,
        s.registration_number,
        s.full_name,
        s.enrollment_number,
        fr.uploaded_at
      FROM form_responses fr
      JOIN students s ON fr.student_id = s.id
      WHERE fr.form_id = $1
      ORDER BY fr.uploaded_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM form_responses 
      WHERE form_id = $1
    `;

    const [dataResult, countResult] = await Promise.all([
      db.query(query, [formId, limit, offset]),
      db.query(countQuery, [formId]),
    ]);

    const formattedData = dataResult.rows.map((row) => ({
      id: row.id,
      registration_number: row.registration_number,
      student_name: row.full_name,
      enrollment_number: row.enrollment_number,
      uploaded_at: row.uploaded_at,
      ...row.response_data,
    }));

    res.json({
      success: true,
      data: formattedData,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countResult.rows[0].total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch form data",
    });
  }
});

// 6. DELETE FORM RESPONSE
routes.delete("/:formId/responses/:responseId", async (req, res) => {
  try {
    const { formId, responseId } = req.params;

    const query = `
      DELETE FROM form_responses 
      WHERE id = $1 AND form_id = $2
      RETURNING id
    `;

    const result = await db.query(query, [responseId, formId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Response not found",
      });
    }

    res.json({
      success: true,
      message: "Response deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting response:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete response",
    });
  }
});

// 7. DELETE FORM
routes.delete("/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM forms WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    res.json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete form",
      error: error.message,
    });
  }
});

// 8. GET EVENTS FOR FORM CREATION (One form per year per event)
routes.get("/events/:year", async (req, res) => {
  try {
    let { year } = req.params;
    year = parseInt(year);
    const { include_event } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year parameter is required",
      });
    }

    if (include_event) {
      // When editing: Get ONLY the specific event + all unlinked events
      const query = `
        SELECT
          e.id,
          e.title,
          e.event_date,
          e.event_type,
          e.position_ids,
          c.company_name,
          CASE 
            WHEN array_length(e.position_ids, 1) = 1 THEN 
              (SELECT position_title FROM company_positions WHERE id = e.position_ids[1])
            WHEN array_length(e.position_ids, 1) > 1 THEN 
              array_length(e.position_ids, 1) || ' Positions'
            ELSE 
              NULL
          END as position_info
        FROM events e
        INNER JOIN event_batches eb ON eb.event_id = e.id
        INNER JOIN batches b ON b.id = eb.batch_id
        LEFT JOIN companies c ON e.company_id = c.id
        LEFT JOIN forms f ON f.event_id = e.id AND f.batch_year = b.year
        WHERE b.year = $1
        AND (f.id IS NULL OR e.id = $2)
        AND array_length(e.position_ids, 1) > 0
        GROUP BY e.id, e.title, e.event_date, e.event_type, e.position_ids, c.company_name
        ORDER BY
          CASE WHEN c.company_name IS NULL THEN 1 ELSE 0 END,
          e.event_date DESC NULLS LAST
      `;

      const result = await db.query(query, [year, include_event]);

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    } else {
      // When creating new: Only show events without existing forms
      const query = `
        SELECT
          e.id,
          e.title,
          e.event_date,
          e.event_type,
          e.position_ids,
          c.company_name,
          CASE 
            WHEN array_length(e.position_ids, 1) = 1 THEN 
              (SELECT position_title FROM company_positions WHERE id = e.position_ids[1])
            WHEN array_length(e.position_ids, 1) > 1 THEN 
              array_length(e.position_ids, 1) || ' Positions'
            ELSE 
              NULL
          END as position_info
        FROM events e
        INNER JOIN event_batches eb ON eb.event_id = e.id
        INNER JOIN batches b ON b.id = eb.batch_id
        LEFT JOIN companies c ON e.company_id = c.id
        LEFT JOIN forms f ON f.event_id = e.id AND f.batch_year = b.year
        WHERE b.year = $1
        AND f.id IS NULL
        AND array_length(e.position_ids, 1) > 0
        GROUP BY e.id, e.title, e.event_date, e.event_type, e.position_ids, c.company_name
        ORDER BY
          CASE WHEN c.company_name IS NULL THEN 1 ELSE 0 END,
          e.event_date DESC NULLS LAST
      `;

      const result = await db.query(query, [year]);

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
      });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});

// validateStudents function with better logging
async function validateStudents(
  registrationNumbers,
  formBatchYear,
  companyId,
  client
) {
  if (registrationNumbers.length === 0) {
    return new Map();
  }

  // Eligibility Check Setup
  let eligibleStudentIds = [];
  let ineligibleStudentIds = [];

  if (companyId) {
    const batchResult = await client.query(
      `SELECT id FROM batches WHERE year = $1`,
      [formBatchYear]
    );

    if (batchResult.rows.length > 0) {
      const batchId = batchResult.rows[0].id;

      const eligResult = await client.query(
        `
        SELECT eligible_student_ids, ineligible_student_ids 
        FROM company_eligibility 
        WHERE company_id = $1 AND batch_id = $2`,
        [companyId, batchId]
      );

      if (eligResult.rows.length > 0) {
        const eligData = eligResult.rows[0];

        // FIXED: Better parsing of PostgreSQL arrays
        const parsePgArray = (value) => {
          if (!value) return [];
          if (Array.isArray(value)) return value.map((id) => parseInt(id));

          // Handle PostgreSQL array string format: {1,2,3} or [1,2,3]
          const stringValue = value.toString().trim();
          if (stringValue === "{}" || stringValue === "[]") return [];

          return stringValue
            .replace(/^[\[{]/, "")
            .replace(/[\]}]$/, "")
            .split(",")
            .filter((v) => v.trim() !== "")
            .map((v) => parseInt(v.trim()));
        };

        eligibleStudentIds = parsePgArray(eligData.eligible_student_ids);
        ineligibleStudentIds = parsePgArray(eligData.ineligible_student_ids);
      }
    }
  }

  // Student Data Validation
  const placeholders = registrationNumbers.map((_, i) => `$${i + 1}`).join(",");

  const query = `
    SELECT 
      id, 
      enrollment_number, 
      full_name, 
      registration_number,
      batch_year,
      department,
      branch,
      placement_status
    FROM students 
    WHERE registration_number IN (${placeholders})
      AND registration_number IS NOT NULL
      AND registration_number != ''
  `;

  const result = await client.query(query, registrationNumbers);

  const studentMap = new Map();
  const validationStats = {
    total: result.rows.length,
    batchMismatch: 0,
    eligibilityFailed: 0,
    ineligible: 0,
    valid: 0,
  };

  // Process each student
  result.rows.forEach((student) => {
    const studentId = parseInt(student.id);

    // Check 1: Batch Year
    if (student.batch_year !== formBatchYear) {
      validationStats.batchMismatch++;

      studentMap.set(student.registration_number, {
        error: `Student batch year (${student.batch_year}) doesn't match form batch year (${formBatchYear})`,
        student: null,
      });
      return;
    }

    // Check 2: Company Eligibility (only if companyId exists)
    if (companyId) {
      if (ineligibleStudentIds.includes(studentId)) {
        validationStats.ineligible++;
        studentMap.set(student.registration_number, {
          error: "Student is not eligible for this company",
          student: null,
        });
        return;
      }

      if (!eligibleStudentIds.includes(studentId)) {
        validationStats.eligibilityFailed++;
        studentMap.set(student.registration_number, {
          error: "Student eligibility status not found for this company",
          student: null,
        });
        return;
      }
    }

    // All checks passed
    validationStats.valid++;
    studentMap.set(student.registration_number, {
      error: null,
      student: student,
    });
  });

  return studentMap;
}

module.exports = routes;

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

// Enhanced validation function with year checking
async function validateStudentsWithYear(
  registrationNumbers,
  formBatchYear,
  client
) {
  if (registrationNumbers.length === 0) {
    return new Map();
  }

  // Start placeholders from $1 since we're not using formBatchYear in WHERE clause
  const placeholders = registrationNumbers.map((_, i) => `$${i + 1}`).join(",");

  const query = `
    SELECT 
      id, 
      enrollment_number, 
      first_name, 
      last_name, 
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

  // Remove formBatchYear from parameters since we're checking it after query
  const result = await client.query(query, registrationNumbers);
  const studentMap = new Map();

  // Create map with validation results
  result.rows.forEach((student) => {
    if (student.batch_year !== formBatchYear) {
      // Year mismatch
      studentMap.set(student.registration_number, {
        error: `Student batch year (${student.batch_year}) doesn't match form batch year (${formBatchYear})`,
        student: null,
      });
    } else {
      // Valid student
      studentMap.set(student.registration_number, {
        error: null,
        student: student,
      });
    }
  });

  return studentMap;
}

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
        SELECT e.id
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
        c.company_name,
        cp.position_title,
        0 AS total_responses
      FROM forms f
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN company_positions cp ON e.position_id = cp.id
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
      "SELECT id FROM forms WHERE id = $1",
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
        const eventCheck = await client.query(
          "SELECT id FROM events WHERE id = $1",
          [event_id]
        );
        if (eventCheck.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: "Invalid event_id. Event does not exist",
          });
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
        c.company_name,
        cp.position_title,
        COUNT(fr.id) AS total_responses
      FROM forms f
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN company_positions cp ON e.position_id = cp.id
      LEFT JOIN form_responses fr ON fr.form_id = f.id
      WHERE f.batch_year = $1
      GROUP BY f.id,e.id, e.title, c.company_name, cp.position_title
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

// 4. UPLOAD DATA TO FORM (with detailed report and year validation)
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

    // First, get form details including batch_year
    const formResult = await client.query(
      `SELECT id, title, batch_year, type FROM forms WHERE id = $1`,
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
          row: index + 2, // +2 for header + 1-based indexing
          regNumber: regNum,
          reason: "Duplicate entry in file",
        });
      } else {
        seen.add(regNum);
        uniqueRegistrations.push(regNum);
      }
    });

    // Validate students against database WITH BATCH YEAR CHECK
    const studentMap = await validateStudentsWithYear(
      uniqueRegistrations,
      formBatchYear,
      client
    );

    // Process each row
    const results = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;
      const regNum = row[regColumn]?.toString().trim();

      // Case 1: Empty reg number
      if (!regNum) {
        results.push({
          row: rowNumber,
          regNumber: "",
          status: "error",
          reason: "Empty registration number",
        });
        continue;
      }

      // Case 2: Duplicate within file
      if (duplicates.some((d) => d.row === rowNumber)) {
        results.push({
          row: rowNumber,
          regNumber: regNum,
          status: "duplicate",
          reason: "Duplicate entry in file",
        });
        continue;
      }

      // Case 3: Student validation (includes batch year check)
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

      // Enrich row with student data
      const enrichedRow = {
        ...row,
        student_name: `${student.first_name} ${student.last_name}`,
        enrollment_number: student.enrollment_number,
        registration_number: regNum,
        batch_year: student.batch_year,
        department: student.department,
        branch: student.branch,
      };

      // Try insert
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

    // Cleanup
    fs.unlinkSync(file.path);

    // Summary with additional year info
    const summary = {
      total: data.length,
      successful: results.filter((r) => r.status === "success").length,
      duplicates: results.filter((r) => r.status === "duplicate").length,
      invalid: results.filter((r) => r.status === "error").length,
      form_batch_year: formBatchYear,
      year_mismatches: results.filter(
        (r) => r.reason && r.reason.includes("batch year")
      ).length,
    };

    // Response
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
        s.first_name,
        s.last_name,
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
      student_name: `${row.first_name} ${row.last_name}`,
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
    const { year } = req.params;
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
          c.company_name,
          cp.position_title
        FROM events e
        INNER JOIN event_batches eb ON eb.event_id = e.id
        INNER JOIN batches b ON b.id = eb.batch_id
        LEFT JOIN companies c ON e.company_id = c.id
        LEFT JOIN company_positions cp ON e.position_id = cp.id
        LEFT JOIN forms f ON f.event_id = e.id AND f.batch_year = b.year
        WHERE b.year = $1
        AND (f.id IS NULL OR e.id = $2)
        GROUP BY e.id, e.title, e.event_date, e.event_type, c.company_name, cp.position_title
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
          c.company_name,
          cp.position_title
        FROM events e
        INNER JOIN event_batches eb ON eb.event_id = e.id
        INNER JOIN batches b ON b.id = eb.batch_id
        LEFT JOIN companies c ON e.company_id = c.id
        LEFT JOIN company_positions cp ON e.position_id = cp.id
        LEFT JOIN forms f ON f.event_id = e.id AND f.batch_year = b.year
        WHERE b.year = $1
        AND f.id IS NULL
        GROUP BY e.id, e.title, e.event_date, e.event_type, c.company_name, cp.position_title
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

// ------------------------------------------------------------------------------
// --------------------------- Think these are not needed ---------------------------
// ------------------------------------------------------------------------------

// // Helper function to get form eligibility info
// async function getFormEligibilityInfo(formId, client) {
//   const query = `
//     SELECT
//       f.id,
//       f.title,
//       f.batch_year,
//       f.type,
//       f.description,
//       COUNT(fr.id) as total_responses,
//       COUNT(DISTINCT fr.student_id) as unique_respondents
//     FROM forms f
//     LEFT JOIN form_responses fr ON f.id = fr.form_id
//     WHERE f.id = $1
//     GROUP BY f.id, f.title, f.batch_year, f.type, f.description
//   `;

//   const result = await client.query(query, [formId]);
//   return result.rows[0] || null;
// }

// // Additional endpoint to check form eligibility before upload
// routes.get("/hello/:id/eligibility", async (req, res) => {
//   const client = await db.connect();

//   try {
//     const { id: formId } = req.params;
//     const formInfo = await getFormEligibilityInfo(formId, client);

//     if (!formInfo) {
//       return res.status(404).json({
//         success: false,
//         message: "Form not found",
//       });
//     }

//     // Get count of eligible students for this batch year
//     const eligibleStudentsResult = await client.query(
//       `SELECT COUNT(*) as count FROM students WHERE batch_year = $1 AND placement_status != 'debarred'`,
//       [formInfo.batch_year]
//     );

//     res.json({
//       success: true,
//       data: {
//         form: formInfo,
//         eligible_students_count: parseInt(eligibleStudentsResult.rows[0].count),
//         batch_year: formInfo.batch_year,
//         current_responses: formInfo.total_responses,
//         unique_respondents: formInfo.unique_respondents,
//       },
//     });
//   } catch (error) {
//     console.error("Error getting form eligibility:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get form eligibility info",
//       error: error.message,
//     });
//   } finally {
//     client.release();
//   }
// });

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

module.exports = routes;

const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const db = require("../db");

const routes = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/forms");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed"));
    }
  },
});

// Parse CSV file
function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// Parse Excel file
function parseExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
  } catch (error) {
    throw new Error("Error parsing Excel file: " + error.message);
  }
}

// Validate student data from file
function validateStudentData(studentData) {
  const errors = [];
  const validatedData = [];

  studentData.forEach((row, index) => {
    const rowNumber = index + 1;
    const student = {};

    // Check required fields and normalize column names
    const requiredFields = [
      {
        key: "enrollment_number",
        alternatives: ["enrollment", "enroll_no", "registration_no"],
      },
      {
        key: "first_name",
        alternatives: ["firstname", "name", "student_name"],
      },
      { key: "last_name", alternatives: ["lastname", "surname"] },
      {
        key: "email",
        alternatives: ["college_email", "personal_email", "email_id"],
      },
      { key: "department", alternatives: ["dept", "branch"] },
    ];

    for (const field of requiredFields) {
      let value = row[field.key];

      // Try alternative column names if primary key not found
      if (!value) {
        for (const alt of field.alternatives) {
          if (row[alt]) {
            value = row[alt];
            break;
          }
        }
      }

      if (!value && field.key !== "last_name") {
        // last_name can be optional
        errors.push(`Row ${rowNumber}: Missing ${field.key}`);
      } else {
        student[field.key] = value || "";
      }
    }

    // Optional fields
    student.batch_year = row.batch_year || row.batch || row.year || null;
    student.cgpa = row.cgpa || row.gpa || null;
    student.backlogs = row.backlogs || row.backlog || 0;

    if (Object.keys(student).length > 0) {
      validatedData.push(student);
    }
  });

  return { validatedData, errors };
}

// Create a new form
routes.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      form_url,
      type,
      event_id,
      company_id,
      deadline,
      allow_edit = false,
      target_departments = [],
      target_batch_years = [],
    } = req.body;

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Create form
      const formResult = await client.query(
        `
        INSERT INTO forms (title, description, form_url, type, company_id, event_id, deadline, allow_edit, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
        RETURNING id
      `,
        [
          title,
          description,
          form_url,
          type,
          company_id || null,
          event_id || null,
          deadline || null,
          allow_edit,
        ]
      );

      const formId = formResult.rows[0].id;

      // Add form targets
      for (const department of target_departments) {
        for (const batchYear of target_batch_years) {
          await client.query(
            `
            INSERT INTO form_targets (form_id, department, batch_year)
            VALUES ($1, $2, $3)
          `,
            [formId, department, batchYear]
          );
        }
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Form created successfully",
        formId: formId,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create form",
      error: error.message,
    });
  }
});

// Upload student data CSV/Excel for a form
routes.post(
  "/:id/upload-students",
  upload.single("studentFile"),
  async (req, res) => {
    try {
      const formId = req.params.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Check if form exists
      const formResult = await db.query("SELECT * FROM forms WHERE id = $1", [
        formId,
      ]);
      if (formResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Form not found",
        });
      }

      const form = formResult.rows[0];

      // Parse file based on extension
      let studentData;
      const ext = path.extname(file.originalname).toLowerCase();

      if (ext === ".csv") {
        studentData = await parseCSVFile(file.path);
      } else if (ext === ".xlsx" || ext === ".xls") {
        studentData = parseExcelFile(file.path);
      } else {
        return res.status(400).json({
          success: false,
          message: "Unsupported file format",
        });
      }

      // Validate student data
      const { validatedData, errors } = validateStudentData(studentData);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation errors in uploaded file",
          errors: errors,
          validCount: validatedData.length,
          totalCount: studentData.length,
        });
      }

      const client = await db.connect();

      try {
        await client.query("BEGIN");

        // Process each student
        let addedCount = 0;
        let skippedCount = 0;
        const processingErrors = [];

        for (const studentInfo of validatedData) {
          try {
            // First, try to find existing student by enrollment number
            let studentResult = await client.query(
              `
            SELECT id FROM students WHERE enrollment_number = $1
          `,
              [studentInfo.enrollment_number]
            );

            let studentId;

            if (studentResult.rows.length > 0) {
              // Student exists
              studentId = studentResult.rows[0].id;
            } else {
              // Check if we have enough info to find by name and email
              if (studentInfo.email) {
                studentResult = await client.query(
                  `
                SELECT id FROM students
                WHERE (college_email = $1 OR personal_email = $1)
                AND first_name ILIKE $2
              `,
                  [studentInfo.email, studentInfo.first_name]
                );

                if (studentResult.rows.length > 0) {
                  studentId = studentResult.rows[0].id;
                }
              }
            }

            if (!studentId) {
              // Create new student record with limited info
              const insertResult = await client.query(
                `
              INSERT INTO students (
                enrollment_number, first_name, last_name, college_email,
                department, batch_year, cgpa, backlogs, placement_status
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'eligible')
              RETURNING id
            `,
                [
                  studentInfo.enrollment_number,
                  studentInfo.first_name,
                  studentInfo.last_name || "",
                  studentInfo.email,
                  studentInfo.department,
                  studentInfo.batch_year || new Date().getFullYear(),
                  studentInfo.cgpa || null,
                  studentInfo.backlogs || 0,
                ]
              );

              studentId = insertResult.rows[0].id;
            }

            // Add student to form responses (indicating they are registered)
            await client.query(
              `
            INSERT INTO form_responses (form_id, student_id, response_data, status)
            VALUES ($1, $2, $3, 'registered')
            ON CONFLICT (form_id, student_id) DO NOTHING
          `,
              [formId, studentId, JSON.stringify(studentInfo)]
            );

            addedCount++;
          } catch (studentError) {
            console.error("Error processing student:", studentError);
            processingErrors.push(
              `Error processing ${studentInfo.enrollment_number}: ${studentError.message}`
            );
            skippedCount++;
          }
        }

        // Update form with CSV file path
        await client.query(
          `
        UPDATE forms SET csv_file_url = $1 WHERE id = $2
      `,
          [file.path, formId]
        );

        await client.query("COMMIT");

        // Clean up uploaded file
        fs.unlinkSync(file.path);

        res.json({
          success: true,
          message: "Student data uploaded successfully",
          summary: {
            totalRows: studentData.length,
            addedCount: addedCount,
            skippedCount: skippedCount,
            processingErrors: processingErrors,
          },
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error uploading student data:", error);

      // Clean up uploaded file in case of error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: "Failed to upload student data",
        error: error.message,
      });
    }
  }
);

// Get all forms
routes.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, event_id } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT f.*,
             e.title as event_title, e.start_datetime as event_date,
             c.company_name,
             COUNT(fr.id) as total_responses
      FROM forms f
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN companies c ON f.company_id = c.id
      LEFT JOIN form_responses fr ON f.id = fr.form_id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND f.status = $${paramCount}`;
      params.push(status);
    }

    if (type) {
      paramCount++;
      query += ` AND f.type = $${paramCount}`;
      params.push(type);
    }

    if (event_id) {
      paramCount++;
      query += ` AND f.event_id = $${paramCount}`;
      params.push(event_id);
    }

    query += ` GROUP BY f.id, e.title, e.start_datetime, c.company_name
               ORDER BY f.created_at DESC
               LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;

    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM forms f WHERE 1=1`;
    const countParams = [];
    let countParamCount = 0;

    if (status) {
      countParamCount++;
      countQuery += ` AND f.status = $${countParamCount}`;
      countParams.push(status);
    }

    if (type) {
      countParamCount++;
      countQuery += ` AND f.type = $${countParamCount}`;
      countParams.push(type);
    }

    if (event_id) {
      countParamCount++;
      countQuery += ` AND f.event_id = $${countParamCount}`;
      countParams.push(event_id);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: parseInt(limit),
      },
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

// Get form details
routes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT f.*,
             e.title as event_title, e.start_datetime as event_date, e.venue,
             c.company_name,
             COUNT(fr.id) as total_responses,
             COUNT(CASE WHEN fr.status = 'submitted' THEN 1 END) as submitted_responses,
             COUNT(CASE WHEN fr.status = 'registered' THEN 1 END) as registered_responses
      FROM forms f
      LEFT JOIN events e ON f.event_id = e.id
      LEFT JOIN companies c ON f.company_id = c.id
      LEFT JOIN form_responses fr ON f.id = fr.form_id
      WHERE f.id = $1
      GROUP BY f.id, e.title, e.start_datetime, e.venue, c.company_name
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    // Get form targets
    const targetsResult = await db.query(
      `
      SELECT department, batch_year FROM form_targets WHERE form_id = $1
    `,
      [id]
    );

    const formData = {
      ...result.rows[0],
      targets: targetsResult.rows,
    };

    res.json({
      success: true,
      data: formData,
    });
  } catch (error) {
    console.error("Error fetching form details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch form details",
      error: error.message,
    });
  }
});

// Get form responses/registrations
routes.get("/:id/responses", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT fr.*, s.enrollment_number, s.first_name, s.last_name,
             s.college_email, s.personal_email, s.department, s.batch_year,
             s.cgpa, s.backlogs, s.placement_status
      FROM form_responses fr
      JOIN students s ON fr.student_id = s.id
      WHERE fr.form_id = $1
    `;

    const params = [id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND fr.status = ${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY fr.uploaded_at DESC LIMIT ${paramCount + 1} OFFSET ${
      paramCount + 2
    }`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM form_responses fr WHERE fr.form_id = $1`;
    const countParams = [id];

    if (status) {
      countQuery += ` AND fr.status = $2`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching form responses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch form responses",
      error: error.message,
    });
  }
});

// Update form status
routes.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "closed", "draft"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const result = await db.query(
      `
      UPDATE forms SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id
    `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.json({
      success: true,
      message: "Form status updated successfully",
    });
  } catch (error) {
    console.error("Error updating form status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update form status",
      error: error.message,
    });
  }
});

// Delete form
routes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Delete form targets
      await client.query("DELETE FROM form_targets WHERE form_id = $1", [id]);

      // Delete form responses
      await client.query("DELETE FROM form_responses WHERE form_id = $1", [id]);

      // Delete the form
      const result = await client.query(
        "DELETE FROM forms WHERE id = $1 RETURNING id",
        [id]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "Form not found",
        });
      }

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Form deleted successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete form",
      error: error.message,
    });
  }
});

// Export form responses as CSV
routes.get("/:id/export", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT fr.*, s.enrollment_number, s.first_name, s.last_name,
             s.college_email, s.personal_email, s.department, s.batch_year,
             s.cgpa, s.backlogs, s.placement_status,
             f.title as form_title
      FROM form_responses fr
      JOIN students s ON fr.student_id = s.id
      JOIN forms f ON fr.form_id = f.id
      WHERE fr.form_id = $1
      ORDER BY fr.uploaded_at DESC
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No responses found for this form",
      });
    }

    // Convert to CSV format
    const headers = [
      "Enrollment Number",
      "First Name",
      "Last Name",
      "College Email",
      "Personal Email",
      "Department",
      "Batch Year",
      "CGPA",
      "Backlogs",
      "Placement Status",
      "Response Status",
      "Registration Date",
    ];

    let csv = headers.join(",") + "\n";

    result.rows.forEach((row) => {
      const csvRow = [
        row.enrollment_number || "",
        row.first_name || "",
        row.last_name || "",
        row.college_email || "",
        row.personal_email || "",
        row.department || "",
        row.batch_year || "",
        row.cgpa || "",
        row.backlogs || "",
        row.placement_status || "",
        row.status || "",
        new Date(row.uploaded_at).toLocaleDateString(),
      ]
        .map((field) => `"${field}"`)
        .join(",");

      csv += csvRow + "\n";
    });

    const formTitle = result.rows[0].form_title || "Form";
    const filename = `${formTitle.replace(/[^a-zA-Z0-9]/g, "_")}_responses_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error("Error exporting form responses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export form responses",
      error: error.message,
    });
  }
});

// Get form statistics
routes.get("/:id/stats", async (req, res) => {
  try {
    const { id } = req.params;

    const statsResult = await db.query(
      `
      SELECT
        COUNT(*) as total_responses,
        COUNT(CASE WHEN status = 'registered' THEN 1 END) as registered_count,
        COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_count,
        COUNT(CASE WHEN status = 'reviewed' THEN 1 END) as reviewed_count
      FROM form_responses
      WHERE form_id = $1
    `,
      [id]
    );

    const departmentStatsResult = await db.query(
      `
      SELECT s.department, COUNT(*) as count
      FROM form_responses fr
      JOIN students s ON fr.student_id = s.id
      WHERE fr.form_id = $1
      GROUP BY s.department
      ORDER BY count DESC
    `,
      [id]
    );

    const batchStatsResult = await db.query(
      `
      SELECT s.batch_year, COUNT(*) as count
      FROM form_responses fr
      JOIN students s ON fr.student_id = s.id
      WHERE fr.form_id = $1
      GROUP BY s.batch_year
      ORDER BY s.batch_year DESC
    `,
      [id]
    );

    res.json({
      success: true,
      data: {
        overall: statsResult.rows[0],
        byDepartment: departmentStatsResult.rows,
        byBatch: batchStatsResult.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching form statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch form statistics",
      error: error.message,
    });
  }
});

module.exports = routes;

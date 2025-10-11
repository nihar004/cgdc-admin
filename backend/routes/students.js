const express = require("express");
const routes = express.Router();
const db = require("../db");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");

const REQUIRED_FIELDS = [
  "registration_number",
  "first_name",
  "department",
  "branch",
  "batch_year",
  "college_email",
];

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

// Get all students
routes.get("/", async (req, res) => {
  const { batch } = req.query; // e.g. ?batch=2024
  try {
    if (!batch) {
      return res.status(400).json({
        error: "Batch year is required in query parameters (e.g. ?batch=2024)",
      });
    }

    const query = "SELECT * FROM students WHERE batch_year = $1";
    const values = [batch];

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Download import template
routes.get("/template", (req, res) => {
  try {
    const templateData = [
      {
        first_name: "John",
        last_name: "Doe",
        registration_number: "220C20300XX",
        enrollment_number: "220XXX",
        phone: "9876543210",
        alternate_phone: "9876543211",
        college_email: "john.doe@example.edu",
        personal_email: "john.doe@gmail.com",
        department: "B.Tech",
        branch: "CSE",
        batch_year: 2022,
        current_semester: 7,
        cgpa: 8.5,
        backlogs: 0,
        date_of_birth: "2000-01-15",
        gender: "Male",
        class_10_percentage: 90.5,
        class_12_percentage: 88.0,
        permanent_address: "123 Main St",
        permanent_city: "Delhi",
        permanent_state: "Delhi",
        ps2_company_name: "Tech Corp",
        ps2_project_title: "Web Development Project",
        ps2_certificate_url: "http://example.com/certificate",
        resume_url: "http://example.com/resume",
        placement_status: "Not Placed",
        linkedin_url: "http://linkedin.com/in/johndoe",
        github_url: "http://github.com/johndoe",
      },
      {
        first_name: "REQUIRED",
        last_name: "",
        registration_number: "REQUIRED",
        enrollment_number: "",
        phone: "",
        alternate_phone: "",
        college_email: "REQUIRED",
        personal_email: "",
        department: "REQUIRED",
        branch: "REQUIRED",
        batch_year: "REQUIRED",
        current_semester: "",
        cgpa: "",
        backlogs: "",
        date_of_birth: "",
        gender: "",
        class_10_percentage: "",
        class_12_percentage: "",
        permanent_address: "",
        permanent_city: "",
        permanent_state: "",
        ps2_company_name: "",
        ps2_project_title: "",
        ps2_certificate_url: "",
        resume_url: "",
        placement_status: "",
        linkedin_url: "",
        github_url: "",
      },
    ];

    const ws = xlsx.utils.json_to_sheet(templateData);

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Students");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student_import_template.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error generating template:", error);
    res.status(500).json({ error: "Error generating template" });
  }
});

// Import students from file
routes.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const results = {
      successful: 0,
      existing: 0,
      invalid: 0,
      successfulStudents: [],
      existingStudents: [],
      invalidStudents: [],
    };

    for (const row of data) {
      // Clean up the row data
      const cleanRow = {};
      Object.keys(row).forEach((key) => {
        const cleanKey = key.trim().toLowerCase().replace(/\s+/g, "_");
        cleanRow[cleanKey] = row[key];
      });

      // Check required fields
      const missingFields = REQUIRED_FIELDS.filter(
        (field) => !cleanRow[field] || cleanRow[field].toString().trim() === ""
      );

      if (missingFields.length > 0) {
        results.invalid++;
        results.invalidStudents.push({
          ...cleanRow,
          missingFields,
        });
        continue;
      }

      // Check if student already exists
      const existingStudent = await db.query(
        "SELECT id, first_name, last_name FROM students WHERE registration_number = $1",
        [cleanRow.registration_number]
      );

      if (existingStudent.rows.length > 0) {
        results.existing++;
        results.existingStudents.push({
          ...cleanRow,
          existing_id: existingStudent.rows[0].id,
        });
        continue;
      }

      // Insert new student
      try {
        const insertQuery = `
          INSERT INTO students (
            registration_number, first_name, last_name, phone, college_email,
            personal_email, department, branch, batch_year, current_semester,
            cgpa, backlogs, date_of_birth, gender, class_10_percentage,
            class_12_percentage, permanent_address, permanent_city, permanent_state,
            ps2_company_name, ps2_project_title, alternate_phone
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
          RETURNING id, first_name, last_name, registration_number, branch, batch_year
        `;

        const values = [
          cleanRow.registration_number,
          cleanRow.first_name,
          cleanRow.last_name || null,
          cleanRow.phone || null,
          cleanRow.college_email,
          cleanRow.personal_email || null,
          cleanRow.department,
          cleanRow.branch,
          parseInt(cleanRow.batch_year),
          cleanRow.current_semester
            ? parseInt(cleanRow.current_semester)
            : null,
          cleanRow.cgpa ? parseFloat(cleanRow.cgpa) : null,
          cleanRow.backlogs ? parseInt(cleanRow.backlogs) : 0,
          cleanRow.date_of_birth || null,
          cleanRow.gender || null,
          cleanRow.class_10_percentage
            ? parseFloat(cleanRow.class_10_percentage)
            : null,
          cleanRow.class_12_percentage
            ? parseFloat(cleanRow.class_12_percentage)
            : null,
          cleanRow.permanent_address || null,
          cleanRow.permanent_city || null,
          cleanRow.permanent_state || null,
          cleanRow.ps2_company_name || null,
          cleanRow.ps2_project_title || null,
          cleanRow.alternate_phone || null,
        ];

        const result = await db.query(insertQuery, values);
        results.successful++;
        results.successfulStudents.push(result.rows[0]);
      } catch (insertError) {
        console.error("Error inserting student:", insertError);
        results.invalid++;
        results.invalidStudents.push({
          ...cleanRow,
          error: "Database insertion failed",
        });
      }
    }

    // Clean up uploaded file
    require("fs").unlinkSync(req.file.path);

    res.json(results);
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ error: "Error processing import file" });
  }
});

// Bulk update students
routes.put("/bulk-update", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const results = {
      updated: 0,
      notFound: 0,
      errors: 0,
      updatedStudents: [],
      notFoundStudents: [],
      errorStudents: [],
    };

    for (const row of data) {
      // Clean up the row data
      const cleanRow = {};
      Object.keys(row).forEach((key) => {
        const cleanKey = key.trim().toLowerCase().replace(/\s+/g, "_");
        cleanRow[cleanKey] = row[key];
      });

      if (!cleanRow.registration_number) {
        results.errors++;
        results.errorStudents.push({
          ...cleanRow,
          error: "Missing registration number",
        });
        continue;
      }

      // Check if student exists
      const existingStudent = await db.query(
        "SELECT id FROM students WHERE registration_number = $1",
        [cleanRow.registration_number]
      );

      if (existingStudent.rows.length === 0) {
        results.notFound++;
        results.notFoundStudents.push(cleanRow);
        continue;
      }

      // Build dynamic update query
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      // List of updatable fields
      const updatableFields = {
        first_name: cleanRow.first_name,
        last_name: cleanRow.last_name,
        phone: cleanRow.phone,
        college_email: cleanRow.college_email,
        personal_email: cleanRow.personal_email,
        department: cleanRow.department,
        branch: cleanRow.branch,
        batch_year: cleanRow.batch_year ? parseInt(cleanRow.batch_year) : null,
        current_semester: cleanRow.current_semester
          ? parseInt(cleanRow.current_semester)
          : null,
        cgpa: cleanRow.cgpa ? parseFloat(cleanRow.cgpa) : null,
        backlogs: cleanRow.backlogs ? parseInt(cleanRow.backlogs) : null,
        date_of_birth: cleanRow.date_of_birth
          ? new Date(cleanRow.date_of_birth).toISOString().split("T")[0]
          : null,
        gender: cleanRow.gender,
        class_10_percentage: cleanRow.class_10_percentage
          ? parseFloat(cleanRow.class_10_percentage)
          : null,
        class_12_percentage: cleanRow.class_12_percentage
          ? parseFloat(cleanRow.class_12_percentage)
          : null,
        permanent_address: cleanRow.permanent_address,
        permanent_city: cleanRow.permanent_city,
        permanent_state: cleanRow.permanent_state,
        ps2_company_name: cleanRow.ps2_company_name,
        ps2_project_title: cleanRow.ps2_project_title,
        alternate_phone: cleanRow.alternate_phone,
        placement_status: cleanRow.placement_status,
      };

      // Only update fields that are provided in the file
      Object.entries(updatableFields).forEach(([field, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (updateFields.length === 0) {
        results.errors++;
        results.errorStudents.push({
          ...cleanRow,
          error: "No valid fields to update",
        });
        continue;
      }

      // Add updated_at field
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      // Add WHERE condition
      values.push(cleanRow.registration_number);

      try {
        const updateQuery = `
          UPDATE students
          SET ${updateFields.join(", ")}
          WHERE registration_number = $${paramIndex}
          RETURNING id, first_name, last_name, registration_number, branch, batch_year
        `;

        const result = await db.query(updateQuery, values);
        results.updated++;
        results.updatedStudents.push(result.rows[0]);
      } catch (updateError) {
        console.error("Error updating student:", updateError);
        results.errors++;
        results.errorStudents.push({
          ...cleanRow,
          error: "Database update failed",
        });
      }
    }

    // Clean up uploaded file
    require("fs").unlinkSync(req.file.path);

    res.json(results);
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ error: "Error processing update file" });
  }
});

// Update existing single student endpoint to check for duplicates
routes.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const studentData = req.body;

    // Duplicate registration_number check
    if (studentData.registration_number) {
      const duplicateCheck = await db.query(
        "SELECT id FROM students WHERE registration_number = $1 AND id != $2",
        [studentData.registration_number, id]
      );

      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({
          error: "A student with this registration number already exists",
        });
      }
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    const updatableFields = {
      registration_number: studentData.registration_number,
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      phone: studentData.phone,
      college_email: studentData.college_email,
      personal_email: studentData.personal_email,
      department: studentData.department,
      branch: studentData.branch,
      batch_year: studentData.batch_year,
      current_semester: studentData.current_semester,
      cgpa: studentData.cgpa,
      backlogs: studentData.backlogs,
      date_of_birth: studentData.date_of_birth,
      gender: studentData.gender,
      class_10_percentage: studentData.class_10_percentage,
      class_12_percentage: studentData.class_12_percentage,
      permanent_address: studentData.permanent_address,
      permanent_city: studentData.permanent_city,
      permanent_state: studentData.permanent_state,
      ps2_company_name: studentData.ps2_company_name,
      ps2_project_title: studentData.ps2_project_title,
      alternate_phone: studentData.alternate_phone,
      placement_status: studentData.placement_status,
      offers_received: studentData.offers_received,
      current_offer: studentData.current_offer,
    };

    Object.entries(updatableFields).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const updateQuery = `
      UPDATE students
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    console.log("QUERY:", updateQuery);
    console.log("VALUES:", values);

    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a student (and all related details)
routes.delete("/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await db.query("DELETE FROM students WHERE id = $1", [
      studentId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: "Student and all related records deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

module.exports = routes;

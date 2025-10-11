// const express = require("express");
// const routes = express.Router();
// const nodemailer = require("nodemailer");
// const db = require("../db");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // ==================== EMAIL TEMPLATES ====================

// // GET /api/email-templates - Get all templates
// routes.get("/email-templates", async (req, res) => {
//   try {
//     const result = await db.query(`
//       SELECT * FROM email_templates
//       ORDER BY created_at DESC
//     `);

//     res.json({
//       success: true,
//       templates: result.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching templates:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to fetch templates",
//     });
//   }
// });

// // POST /api/email-templates - Create new template
// routes.post("/email-templates", async (req, res) => {
//   try {
//     const { template_name, subject, body, category } = req.body;

//     if (!template_name || !subject || !body) {
//       return res.status(400).json({
//         success: false,
//         error: "Template name, subject, and body are required",
//       });
//     }

//     const result = await db.query(
//       `
//       INSERT INTO email_templates (template_name, subject, body, category)
//       VALUES ($1, $2, $3, $4)
//       RETURNING *
//     `,
//       [template_name, subject, body, category || null]
//     );

//     res.status(201).json({
//       success: true,
//       template: result.rows[0],
//       message: "Template created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating template:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to create template",
//     });
//   }
// });

// // PUT /api/email-templates/:id - Update template
// routes.put("/email-templates/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { template_name, subject, body, category } = req.body;

//     if (!template_name || !subject || !body) {
//       return res.status(400).json({
//         success: false,
//         error: "Template name, subject, and body are required",
//       });
//     }

//     const result = await db.query(
//       `
//       UPDATE email_templates
//       SET template_name = $1, subject = $2, body = $3, category = $4
//       WHERE id = $5
//       RETURNING *
//     `,
//       [template_name, subject, body, category || null, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Template not found",
//       });
//     }

//     res.json({
//       success: true,
//       template: result.rows[0],
//       message: "Template updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating template:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to update template",
//     });
//   }
// });

// // DELETE /api/email-templates/:id - Delete template
// routes.delete("/email-templates/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await db.query(
//       `
//       DELETE FROM email_templates WHERE id = $1 RETURNING id
//     `,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Template not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Template deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting template:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to delete template",
//     });
//   }
// });

// // ==================== EMAIL CAMPAIGNS ====================

// // GET /api/email-campaigns - Get all campaigns with pagination
// routes.get("/email-campaigns", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

//     const result = await db.query(
//       `
//       SELECT ec.*, e.title as event_title
//       FROM email_campaigns ec
//       LEFT JOIN events e ON ec.event_id = e.id
//       ORDER BY ec.created_at DESC
//       LIMIT $1 OFFSET $2
//     `,
//       [limit, offset]
//     );

//     const countResult = await db.query("SELECT COUNT(*) FROM email_campaigns");
//     const total = parseInt(countResult.rows[0].count);

//     res.json({
//       success: true,
//       campaigns: result.rows,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching campaigns:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to fetch campaigns",
//     });
//   }
// });

// // Helper function to replace variables in text
// function replaceVariables(text, studentData) {
//   if (!text || !studentData) return text;

//   return text
//     .replace(/{first_name}/g, studentData.first_name || "")
//     .replace(/{last_name}/g, studentData.last_name || "")
//     .replace(
//       /{full_name}/g,
//       `${studentData.first_name || ""} ${studentData.last_name || ""}`.trim()
//     )
//     .replace(/{enrollment_number}/g, studentData.enrollment_number || "")
//     .replace(/{department}/g, studentData.department || "")
//     .replace(/{branch}/g, studentData.branch || "")
//     .replace(/{cgpa}/g, studentData.cgpa || "")
//     .replace(/{batch_year}/g, studentData.batch_year || "");
// }

// // Helper function to build student query based on filters
// function buildStudentQuery(filter) {
//   let query = `
//     SELECT id, college_email, personal_email, first_name, last_name,
//            enrollment_number, department, branch, cgpa, batch_year
//     FROM students
//     WHERE college_email IS NOT NULL AND college_email != ''
//   `;
//   const params = [];

//   if (filter.department && filter.department.length > 0) {
//     params.push(filter.department);
//     query += ` AND department = ANY($${params.length})`;
//   }

//   if (filter.batch_year) {
//     params.push(filter.batch_year);
//     query += ` AND batch_year = $${params.length}`;
//   }

//   if (filter.min_cgpa) {
//     params.push(filter.min_cgpa);
//     query += ` AND cgpa >= $${params.length}`;
//   }

//   if (filter.max_cgpa) {
//     params.push(filter.max_cgpa);
//     query += ` AND cgpa <= $${params.length}`;
//   }

//   if (filter.placement_status) {
//     params.push(filter.placement_status);
//     query += ` AND placement_status = $${params.length}`;
//   }

//   if (filter.gender) {
//     params.push(filter.gender);
//     query += ` AND gender = $${params.length}`;
//   }

//   return { query, params };
// }

// // Helper function to send bulk emails
// async function sendBulkEmails(students, subject, body) {
//   console.log("\n📧 Starting bulk email send...");
//   console.log(`📋 Total recipients: ${students.length}`);

//   const results = {
//     successful: 0,
//     failed: 0,
//     errors: [],
//   };

//   for (const student of students) {
//     try {
//       const personalizedSubject = replaceVariables(subject, student);
//       const personalizedBody = replaceVariables(body, student);

//       console.log(`\n📤 Sending email to: ${student.college_email}`);
//       console.log(`👤 Student: ${student.first_name} ${student.last_name}`);

//       await transporter.sendMail({
//         from: process.env.SMTP_USER,
//         to: student.college_email,
//         subject: personalizedSubject,
//         html: personalizedBody,
//       });

//       results.successful++;
//       console.log(`✅ Email sent successfully to ${student.college_email}`);
//     } catch (error) {
//       results.failed++;
//       results.errors.push({
//         email: student.college_email,
//         error: error.message,
//       });
//       console.error(
//         `❌ Failed to send email to ${student.college_email}:`,
//         error.message
//       );
//     }
//   }

//   console.log("\n📊 Email Campaign Results:");
//   console.log(`✅ Successful: ${results.successful}`);
//   console.log(`❌ Failed: ${results.failed}`);
//   if (results.errors.length > 0) {
//     console.log("\n❌ Errors:");
//     results.errors.forEach((err) => {
//       console.log(`   ${err.email}: ${err.error}`);
//     });
//   }

//   return results;
// }

// // POST /api/email-campaigns/send - Send new email campaign
// routes.post("/email-campaigns/send", async (req, res) => {
//   console.log("\n🚀 Starting new email campaign...");

//   try {
//     const {
//       title,
//       subject,
//       body,
//       sender_email,
//       recipient_filter,
//       recipient_emails,
//       event_id,
//     } = req.body;

//     console.log(`📑 Campaign: ${title}`);
//     console.log(`👤 Sender: ${sender_email}`);

//     if (!title || !subject || !body) {
//       return res.status(400).json({
//         success: false,
//         error: "Title, subject, and body are required",
//       });
//     }

//     let students = [];
//     let finalRecipientEmails = [];

//     // Get recipients based on filter or manual emails
//     if (recipient_filter && Object.keys(recipient_filter).length > 0) {
//       console.log("🎯 Using recipient filter:", recipient_filter);
//       const { query, params } = buildStudentQuery(recipient_filter);
//       const result = await db.query(query, params);
//       students = result.rows;
//       finalRecipientEmails = students.map((s) => s.college_email);
//     } else if (recipient_emails && recipient_emails.length > 0) {
//       console.log(
//         `📋 Using manual recipient list (${recipient_emails.length} emails)`
//       );
//       // For manual emails, create student objects directly
//       students = recipient_emails.map((email) => ({
//         college_email: email,
//         first_name: "",
//         last_name: "",
//         enrollment_number: "",
//         department: "",
//         branch: "",
//         cgpa: "",
//         batch_year: "",
//       }));
//       finalRecipientEmails = recipient_emails;
//     } else {
//       return res.status(400).json({
//         success: false,
//         error: "Either recipient_filter or recipient_emails is required",
//       });
//     }

//     if (finalRecipientEmails.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "No recipients found",
//       });
//     }

//     console.log(`\n📊 Found ${finalRecipientEmails.length} recipients`);
//     console.log("Recipients:", finalRecipientEmails); // Add this for debugging

//     // Send emails
//     const emailResults = await sendBulkEmails(students, subject, body);

//     // Save campaign to database
//     const campaignResult = await db.query(
//       `INSERT INTO email_campaigns
//        (title, subject, body, recipient_filter, recipient_emails, sender_email, sent_at, total_recipients, event_id)
//        VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
//        RETURNING *`,
//       [
//         title,
//         subject,
//         body,
//         recipient_filter ? JSON.stringify(recipient_filter) : null,
//         finalRecipientEmails,
//         sender_email,
//         finalRecipientEmails.length,
//         event_id || null,
//       ]
//     );

//     console.log("✅ Campaign completed successfully");

//     res.json({
//       success: true,
//       campaign: campaignResult.rows[0],
//       emailResults,
//       message: `Email sent successfully to ${emailResults.successful} of ${finalRecipientEmails.length} recipients`,
//     });
//   } catch (error) {
//     console.error("\n❌ Campaign failed:", error.message);
//     console.error("Stack:", error.stack);

//     res.status(500).json({
//       success: false,
//       error: "Failed to send email campaign",
//     });
//   }
// });

// // POST /api/email-campaigns/preview - Preview email with sample data
// routes.post("/email-campaigns/preview", async (req, res) => {
//   try {
//     const { subject, body, sample_student_id } = req.body;

//     if (!subject || !body) {
//       return res.status(400).json({
//         success: false,
//         error: "Subject and body are required",
//       });
//     }

//     let sampleStudent;

//     if (sample_student_id) {
//       // Use specific student data
//       const result = await db.query(
//         `
//         SELECT first_name, last_name, enrollment_number, department,
//                branch, cgpa, batch_year
//         FROM students WHERE id = $1
//       `,
//         [sample_student_id]
//       );

//       if (result.rows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           error: "Student not found",
//         });
//       }

//       sampleStudent = result.rows[0];
//     } else {
//       // Use dummy data
//       sampleStudent = {
//         first_name: "John",
//         last_name: "Doe",
//         enrollment_number: "2021A7PS001G",
//         department: "Computer Science",
//         branch: "CSE",
//         cgpa: "8.50",
//         batch_year: 2021,
//       };
//     }

//     const previewSubject = replaceVariables(subject, sampleStudent);
//     const previewBody = replaceVariables(body, sampleStudent);

//     res.json({
//       success: true,
//       preview: {
//         subject: previewSubject,
//         body: previewBody,
//         sample_data: sampleStudent,
//       },
//     });
//   } catch (error) {
//     console.error("Error previewing email:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to preview email",
//     });
//   }
// });

// // DELETE /api/email-campaigns/:id - Delete campaign
// routes.delete("/email-campaigns/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await db.query(
//       `
//       DELETE FROM email_campaigns WHERE id = $1 RETURNING id
//     `,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Campaign not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Campaign deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting campaign:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to delete campaign",
//     });
//   }
// });

// // POST /api/email-campaigns/send/event/:eventId - Send to event participants
// routes.post("/email-campaigns/send/event/:eventId", async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const {
//       title,
//       subject,
//       body,
//       sender_email,
//       recipient_type = "registered", // 'registered', 'attended', 'absent', 'selected'
//     } = req.body;

//     if (!title || !subject || !body) {
//       return res.status(400).json({
//         success: false,
//         error: "Title, subject, and body are required",
//       });
//     }

//     // Build query based on recipient type
//     let studentQuery;

//     if (recipient_type === "registered") {
//       studentQuery = `
//         SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name,
//                s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
//         FROM students s
//         INNER JOIN student_round_results srr ON s.id = srr.student_id
//         WHERE srr.event_id = $1 AND s.college_email IS NOT NULL
//       `;
//     } else if (recipient_type === "attended") {
//       studentQuery = `
//         SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name,
//                s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
//         FROM students s
//         INNER JOIN event_attendance ea ON s.id = ea.student_id
//         WHERE ea.event_id = $1 AND ea.status = 'present' AND s.college_email IS NOT NULL
//       `;
//     } else if (recipient_type === "absent") {
//       studentQuery = `
//         SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name,
//                s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
//         FROM students s
//         INNER JOIN event_attendance ea ON s.id = ea.student_id
//         WHERE ea.event_id = $1 AND ea.status = 'absent' AND s.college_email IS NOT NULL
//       `;
//     } else if (recipient_type === "selected") {
//       studentQuery = `
//         SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name,
//                s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
//         FROM students s
//         INNER JOIN student_round_results srr ON s.id = srr.student_id
//         WHERE srr.event_id = $1 AND srr.result_status = 'selected'
//               AND s.college_email IS NOT NULL
//       `;
//     } else {
//       return res.status(400).json({
//         success: false,
//         error:
//           "Invalid recipient_type. Use: registered, attended, absent, or selected",
//       });
//     }

//     const result = await db.query(studentQuery, [eventId]);
//     const students = result.rows;

//     if (students.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: `No ${recipient_type} students found for this event`,
//       });
//     }

//     // Send emails
//     const emailResults = await sendBulkEmails(students, subject, body);

//     // Save campaign
//     const recipientEmails = students.map((s) => s.college_email);
//     const campaignResult = await db.query(
//       `
//       INSERT INTO email_campaigns
//       (title, subject, body, recipient_emails, sender_email,
//        sent_at, total_recipients, event_id)
//       VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
//       RETURNING *
//     `,
//       [
//         title,
//         subject,
//         body,
//         recipientEmails,
//         sender_email,
//         students.length,
//         eventId,
//       ]
//     );

//     res.json({
//       success: true,
//       campaign: campaignResult.rows[0],
//       emailResults,
//       message: `Email sent to ${emailResults.successful} of ${students.length} ${recipient_type} students`,
//     });
//   } catch (error) {
//     console.error("Error sending event email:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to send email to event participants",
//     });
//   }
// });

// // POST /api/email-campaigns/send/students - Send to filtered students
// routes.post("/email-campaigns/send/students", async (req, res) => {
//   try {
//     const { title, subject, body, sender_email, student_ids } = req.body;

//     if (!title || !subject || !body) {
//       return res.status(400).json({
//         success: false,
//         error: "Title, subject, and body are required",
//       });
//     }

//     if (!student_ids || student_ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "student_ids array is required",
//       });
//     }

//     // Fetch students by IDs
//     const result = await db.query(
//       `
//       SELECT id, college_email, first_name, last_name, enrollment_number,
//              department, branch, cgpa, batch_year
//       FROM students
//       WHERE id = ANY($1) AND college_email IS NOT NULL
//     `,
//       [student_ids]
//     );

//     const students = result.rows;

//     if (students.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "No valid students found with provided IDs",
//       });
//     }

//     // Send emails
//     const emailResults = await sendBulkEmails(students, subject, body);

//     // Save campaign
//     const recipientEmails = students.map((s) => s.college_email);
//     const campaignResult = await db.query(
//       `
//       INSERT INTO email_campaigns
//       (title, subject, body, recipient_emails, sender_email,
//        sent_at, total_recipients)
//       VALUES ($1, $2, $3, $4, $5, NOW(), $6)
//       RETURNING *
//     `,
//       [title, subject, body, recipientEmails, sender_email, students.length]
//     );

//     res.json({
//       success: true,
//       campaign: campaignResult.rows[0],
//       emailResults,
//       message: `Email sent to ${emailResults.successful} of ${students.length} students`,
//     });
//   } catch (error) {
//     console.error("Error sending student email:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to send email to students",
//     });
//   }
// });

// module.exports = routes;

// ==================== EMAIL CAMPAIGNS ====================

// GET /api/email-campaigns - Get all campaigns with pagination
routes.get("/email-campaigns", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `
      SELECT ec.*, e.title as event_title
      FROM email_campaigns ec
      LEFT JOIN events e ON ec.event_id = e.id
      ORDER BY ec.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const countResult = await db.query("SELECT COUNT(*) FROM email_campaigns");
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      campaigns: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch campaigns",
    });
  }
});

// Helper function to replace variables in text
function replaceVariables(text, studentData) {
  if (!text || !studentData) return text;

  return text
    .replace(/{first_name}/g, studentData.first_name || "")
    .replace(/{last_name}/g, studentData.last_name || "")
    .replace(
      /{full_name}/g,
      `${studentData.first_name || ""} ${studentData.last_name || ""}`.trim()
    )
    .replace(/{enrollment_number}/g, studentData.enrollment_number || "")
    .replace(/{department}/g, studentData.department || "")
    .replace(/{branch}/g, studentData.branch || "")
    .replace(/{cgpa}/g, studentData.cgpa || "")
    .replace(/{batch_year}/g, studentData.batch_year || "");
}

// Helper function to build student query based on filters
function buildStudentQuery(filter) {
  let query = `
    SELECT id, college_email, personal_email, first_name, last_name, 
           enrollment_number, department, branch, cgpa, batch_year
    FROM students 
    WHERE college_email IS NOT NULL AND college_email != ''
  `;
  const params = [];

  if (filter.department && filter.department.length > 0) {
    params.push(filter.department);
    query += ` AND department = ANY($${params.length})`;
  }

  if (filter.batch_year) {
    params.push(filter.batch_year);
    query += ` AND batch_year = $${params.length}`;
  }

  if (filter.min_cgpa) {
    params.push(filter.min_cgpa);
    query += ` AND cgpa >= $${params.length}`;
  }

  if (filter.max_cgpa) {
    params.push(filter.max_cgpa);
    query += ` AND cgpa <= $${params.length}`;
  }

  if (filter.placement_status) {
    params.push(filter.placement_status);
    query += ` AND placement_status = $${params.length}`;
  }

  if (filter.gender) {
    params.push(filter.gender);
    query += ` AND gender = $${params.length}`;
  }

  return { query, params };
}

// Helper function to get attachments for email
async function getEmailAttachments(attachmentData, position_id = null) {
  const attachments = [];

  // Add template attachments
  if (attachmentData) {
    try {
      const templateAttachments = JSON.parse(attachmentData);
      for (const attachment of templateAttachments) {
        try {
          const fileContent = await fsPromises.readFile(attachment.filepath);
          attachments.push({
            filename: attachment.filename,
            content: fileContent,
            contentType: attachment.mimetype,
          });
        } catch (err) {
          console.error(
            `Error reading template attachment ${attachment.filename}:`,
            err
          );
        }
      }
    } catch (err) {
      console.error("Error parsing template attachments:", err);
    }
  }

  // Add position documents if position_id is provided
  if (position_id) {
    try {
      const docsResult = await db.query(
        `SELECT document_path, document_title, file_type 
         FROM position_documents 
         WHERE position_id = $1 AND is_active = TRUE 
         ORDER BY display_order`,
        [position_id]
      );

      for (const doc of docsResult.rows) {
        try {
          const fileContent = await fsPromises.readFile(doc.document_path);
          attachments.push({
            filename: doc.document_title,
            content: fileContent,
            contentType: getMimeType(doc.file_type),
          });
        } catch (err) {
          console.error(
            `Error reading position document ${doc.document_title}:`,
            err
          );
        }
      }
    } catch (err) {
      console.error("Error fetching position documents:", err);
    }
  }

  return attachments;
}

// Helper function to determine MIME type
function getMimeType(fileType) {
  const mimeTypes = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  return mimeTypes[fileType.toLowerCase()] || "application/octet-stream";
}

// Helper function to send bulk emails with attachments
async function sendBulkEmails(students, subject, body, attachments = []) {
  console.log("\n📧 Starting bulk email send...");
  console.log(`📋 Total recipients: ${students.length}`);
  console.log(`📎 Attachments: ${attachments.length}`);

  const results = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  for (const student of students) {
    try {
      const personalizedSubject = replaceVariables(subject, student);
      const personalizedBody = replaceVariables(body, student);

      console.log(`\n📤 Sending email to: ${student.college_email}`);
      console.log(`👤 Student: ${student.first_name} ${student.last_name}`);

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: student.college_email,
        subject: personalizedSubject,
        html: personalizedBody,
      };

      if (attachments.length > 0) {
        mailOptions.attachments = attachments;
      }

      await transporter.sendMail(mailOptions);

      results.successful++;
      console.log(`✅ Email sent successfully to ${student.college_email}`);
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: student.college_email,
        error: error.message,
      });
      console.error(
        `❌ Failed to send email to ${student.college_email}:`,
        error.message
      );
    }
  }

  console.log("\n📊 Email Campaign Results:");
  console.log(`✅ Successful: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log("\n❌ Errors:");
    results.errors.forEach((err) => {
      console.log(`   ${err.email}: ${err.error}`);
    });
  }

  return results;
}

// POST /api/email-campaigns/send - Send new email campaign
routes.post("/email-campaigns/send", async (req, res) => {
  console.log("\n🚀 Starting new email campaign...");

  try {
    const {
      title,
      subject,
      body,
      sender_email,
      recipient_filter,
      recipient_emails,
      event_id,
      position_id,
      template_id,
    } = req.body;

    console.log(`📑 Campaign: ${title}`);
    console.log(`👤 Sender: ${sender_email}`);

    if (!title || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Title, subject, and body are required",
      });
    }

    let students = [];
    let finalRecipientEmails = [];
    let attachments = [];

    // Get template attachments if template_id is provided
    if (template_id) {
      const templateResult = await db.query(
        "SELECT attachments FROM email_templates WHERE id = $1",
        [template_id]
      );
      if (
        templateResult.rows.length > 0 &&
        templateResult.rows[0].attachments
      ) {
        attachments = await getEmailAttachments(
          templateResult.rows[0].attachments,
          position_id
        );
      }
    } else if (position_id) {
      // Get only position documents if no template
      attachments = await getEmailAttachments(null, position_id);
    }

    // Get recipients based on filter or manual emails
    if (recipient_filter && Object.keys(recipient_filter).length > 0) {
      console.log("🎯 Using recipient filter:", recipient_filter);
      const { query, params } = buildStudentQuery(recipient_filter);
      const result = await db.query(query, params);
      students = result.rows;
      finalRecipientEmails = students.map((s) => s.college_email);
    } else if (recipient_emails && recipient_emails.length > 0) {
      console.log(
        `📋 Using manual recipient list (${recipient_emails.length} emails)`
      );
      students = recipient_emails.map((email) => ({
        college_email: email,
        first_name: "",
        last_name: "",
        enrollment_number: "",
        department: "",
        branch: "",
        cgpa: "",
        batch_year: "",
      }));
      finalRecipientEmails = recipient_emails;
    } else {
      return res.status(400).json({
        success: false,
        error: "Either recipient_filter or recipient_emails is required",
      });
    }

    if (finalRecipientEmails.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No recipients found",
      });
    }

    console.log(`\n📊 Found ${finalRecipientEmails.length} recipients`);

    // Send emails
    const emailResults = await sendBulkEmails(
      students,
      subject,
      body,
      attachments
    );

    // Save campaign to database
    const campaignResult = await db.query(
      `INSERT INTO email_campaigns 
       (title, subject, body, recipient_filter, recipient_emails, sender_email, 
        sent_at, total_recipients, event_id, position_id, template_id)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        subject,
        body,
        recipient_filter ? JSON.stringify(recipient_filter) : null,
        finalRecipientEmails,
        sender_email,
        finalRecipientEmails.length,
        event_id || null,
        position_id || null,
        template_id || null,
      ]
    );

    console.log("✅ Campaign completed successfully");

    res.json({
      success: true,
      campaign: campaignResult.rows[0],
      emailResults,
      message: `Email sent successfully to ${emailResults.successful} of ${finalRecipientEmails.length} recipients`,
    });
  } catch (error) {
    console.error("\n❌ Campaign failed:", error.message);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      error: "Failed to send email campaign",
    });
  }
});

// POST /api/email-campaigns/preview - Preview email with sample data
routes.post("/email-campaigns/preview", async (req, res) => {
  try {
    const { subject, body, sample_student_id, template_id, position_id } =
      req.body;

    if (!subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Subject and body are required",
      });
    }

    let sampleStudent;

    if (sample_student_id) {
      const result = await db.query(
        `
        SELECT first_name, last_name, enrollment_number, department, 
               branch, cgpa, batch_year
        FROM students WHERE id = $1
      `,
        [sample_student_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Student not found",
        });
      }

      sampleStudent = result.rows[0];
    } else {
      sampleStudent = {
        first_name: "John",
        last_name: "Doe",
        enrollment_number: "2021A7PS001G",
        department: "Computer Science",
        branch: "CSE",
        cgpa: "8.50",
        batch_year: 2021,
      };
    }

    const previewSubject = replaceVariables(subject, sampleStudent);
    const previewBody = replaceVariables(body, sampleStudent);

    // Get attachment info for preview
    let attachmentInfo = [];
    if (template_id) {
      const templateResult = await db.query(
        "SELECT attachments FROM email_templates WHERE id = $1",
        [template_id]
      );
      if (
        templateResult.rows.length > 0 &&
        templateResult.rows[0].attachments
      ) {
        const templateAttachments = JSON.parse(
          templateResult.rows[0].attachments
        );
        attachmentInfo.push(
          ...templateAttachments.map((a) => ({
            name: a.filename,
            type: "template",
          }))
        );
      }
    }

    if (position_id) {
      const docsResult = await db.query(
        `SELECT document_title FROM position_documents 
         WHERE position_id = $1 AND is_active = TRUE`,
        [position_id]
      );
      attachmentInfo.push(
        ...docsResult.rows.map((d) => ({
          name: d.document_title,
          type: "position_document",
        }))
      );
    }

    res.json({
      success: true,
      preview: {
        subject: previewSubject,
        body: previewBody,
        sample_data: sampleStudent,
        attachments: attachmentInfo,
      },
    });
  } catch (error) {
    console.error("Error previewing email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to preview email",
    });
  }
});

// DELETE /api/email-campaigns/:id - Delete campaign
routes.delete("/email-campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM email_campaigns WHERE id = $1 RETURNING id
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }

    res.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete campaign",
    });
  }
});

// POST /api/email-campaigns/send/event/:eventId - Send to event participants
routes.post("/email-campaigns/send/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      title,
      subject,
      body,
      sender_email,
      recipient_type = "registered",
      position_id,
      template_id,
    } = req.body;

    if (!title || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Title, subject, and body are required",
      });
    }

    // Get attachments
    let attachments = [];
    if (template_id) {
      const templateResult = await db.query(
        "SELECT attachments FROM email_templates WHERE id = $1",
        [template_id]
      );
      if (
        templateResult.rows.length > 0 &&
        templateResult.rows[0].attachments
      ) {
        attachments = await getEmailAttachments(
          templateResult.rows[0].attachments,
          position_id
        );
      }
    } else if (position_id) {
      attachments = await getEmailAttachments(null, position_id);
    }

    // Build query based on recipient type
    let studentQuery;

    if (recipient_type === "registered") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name, 
               s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
        FROM students s
        INNER JOIN student_round_results srr ON s.id = srr.student_id
        WHERE srr.event_id = $1 AND s.college_email IS NOT NULL
      `;
    } else if (recipient_type === "attended") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name, 
               s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
        FROM students s
        INNER JOIN event_attendance ea ON s.id = ea.student_id
        WHERE ea.event_id = $1 AND ea.status = 'present' AND s.college_email IS NOT NULL
      `;
    } else if (recipient_type === "absent") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name, 
               s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
        FROM students s
        INNER JOIN event_attendance ea ON s.id = ea.student_id
        WHERE ea.event_id = $1 AND ea.status = 'absent' AND s.college_email IS NOT NULL
      `;
    } else if (recipient_type === "selected") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.first_name, s.last_name, 
               s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
        FROM students s
        INNER JOIN student_round_results srr ON s.id = srr.student_id
        WHERE srr.event_id = $1 AND srr.result_status = 'selected' 
              AND s.college_email IS NOT NULL
      `;
    } else {
      return res.status(400).json({
        success: false,
        error:
          "Invalid recipient_type. Use: registered, attended, absent, or selected",
      });
    }

    const result = await db.query(studentQuery, [eventId]);
    const students = result.rows;

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        error: `No ${recipient_type} students found for this event`,
      });
    }

    const emailResults = await sendBulkEmails(
      students,
      subject,
      body,
      attachments
    );

    const recipientEmails = students.map((s) => s.college_email);
    const campaignResult = await db.query(
      `
      INSERT INTO email_campaigns 
      (title, subject, body, recipient_emails, sender_email, 
       sent_at, total_recipients, event_id, position_id, template_id)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9)
      RETURNING *
    `,
      [
        title,
        subject,
        body,
        recipientEmails,
        sender_email,
        students.length,
        eventId,
        position_id || null,
        template_id || null,
      ]
    );

    res.json({
      success: true,
      campaign: campaignResult.rows[0],
      emailResults,
      message: `Email sent to ${emailResults.successful} of ${students.length} ${recipient_type} students`,
    });
  } catch (error) {
    console.error("Error sending event email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email to event participants",
    });
  }
});

// POST /api/email-campaigns/send/students - Send to filtered students
routes.post("/email-campaigns/send/students", async (req, res) => {
  try {
    const {
      title,
      subject,
      body,
      sender_email,
      student_ids,
      position_id,
      template_id,
    } = req.body;

    if (!title || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Title, subject, and body are required",
      });
    }

    if (!student_ids || student_ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: "student_ids array is required",
      });
    }

    // Fetch students by IDs
    const result = await db.query(
      `
      SELECT id, college_email, first_name, last_name, enrollment_number, 
             department, branch, cgpa, batch_year
      FROM students 
      WHERE id = ANY($1) AND college_email IS NOT NULL
    `,
      [student_ids]
    );

    const students = result.rows;

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid students found with provided IDs",
      });
    }

    // Get attachments from template and position documents
    let attachments = [];

    if (template_id) {
      const templateResult = await db.query(
        "SELECT attachments FROM email_templates WHERE id = $1",
        [template_id]
      );
      if (
        templateResult.rows.length > 0 &&
        templateResult.rows[0].attachments
      ) {
        const templateAttachments = JSON.parse(
          templateResult.rows[0].attachments
        );
        for (const attachment of templateAttachments) {
          try {
            const fileContent = await fsPromises.readFile(attachment.filepath);
            attachments.push({
              filename: attachment.filename,
              content: fileContent,
              contentType: attachment.mimetype,
            });
          } catch (err) {
            console.error(`Error reading template attachment:`, err);
          }
        }
      }
    }

    if (position_id) {
      const docsResult = await db.query(
        `SELECT document_path, document_title, file_type 
         FROM position_documents 
         WHERE position_id = $1 AND is_active = TRUE 
         ORDER BY display_order`,
        [position_id]
      );

      for (const doc of docsResult.rows) {
        try {
          const fileContent = await fsPromises.readFile(doc.document_path);
          attachments.push({
            filename: doc.document_title,
            content: fileContent,
            contentType: getMimeType(doc.file_type),
          });
        } catch (err) {
          console.error(`Error reading position document:`, err);
        }
      }
    }

    // Send emails
    const emailResults = await sendBulkEmails(
      students,
      subject,
      body,
      attachments
    );

    // Save campaign
    const recipientEmails = students.map((s) => s.college_email);
    const campaignResult = await db.query(
      `
      INSERT INTO email_campaigns 
      (title, subject, body, recipient_emails, sender_email, 
       sent_at, total_recipients, position_id, template_id)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8)
      RETURNING *
    `,
      [
        title,
        subject,
        body,
        recipientEmails,
        sender_email,
        students.length,
        position_id || null,
        template_id || null,
      ]
    );

    res.json({
      success: true,
      campaign: campaignResult.rows[0],
      emailResults,
      message: `Email sent to ${emailResults.successful} of ${students.length} students`,
    });
  } catch (error) {
    console.error("Error sending student email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email to students",
    });
  }
});

// Error handling middleware
routes.use((error, req, res, next) => {
  console.error("Error in email routes:", error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: `File upload error: ${error.message}`,
    });
  }
  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

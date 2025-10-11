const express = require("express");
const routes = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const db = require("../db");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/email-attachments");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
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
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG"
        ),
        false
      );
    }
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to safely parse attachments
function parseAttachments(attachmentData) {
  if (!attachmentData) return [];
  if (Array.isArray(attachmentData)) return attachmentData;
  try {
    return JSON.parse(attachmentData);
  } catch (err) {
    console.error("Error parsing attachments:", err);
    return [];
  }
}

// ==================== EMAIL TEMPLATES ====================

// GET /api/email-templates - Get all templates
routes.get("/email-templates", async (req, res) => {
  console.log("\n📋 Fetching all email templates grouped by category...");
  try {
    const result = await db.query(`
      SELECT 
        category,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', id,
            'template_name', template_name,
            'subject', subject,
            'body', body,
            'sender_email', sender_email,
            'cc_emails', cc_emails,
            'attachments', attachments,
            'created_at', created_at
          ) ORDER BY created_at DESC
        ) AS templates
      FROM email_templates
      GROUP BY category
      ORDER BY category;
    `);

    console.log(
      `✅ Successfully fetched ${result.rows.length} category groups`
    );
    res.json({
      success: true,
      groupedTemplates: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching templates:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch templates",
    });
  }
});

// POST /api/email-templates - Create new template with attachments
routes.post(
  "/email-templates",
  upload.array("attachments", 5),
  async (req, res) => {
    console.log("\n📝 Creating new email template...");
    try {
      const {
        template_name,
        subject,
        body,
        category,
        sender_email,
        cc_emails,
      } = req.body;
      console.log("Template Details:", {
        name: template_name,
        subject,
        category,
        sender: sender_email,
        cc: cc_emails,
        bodyLength: body?.length,
      });

      if (req.files) {
        console.log(
          "📎 Attachments received:",
          req.files.map((f) => ({
            name: f.originalname,
            size: `${(f.size / 1024).toFixed(2)}KB`,
            type: f.mimetype,
          }))
        );
      }

      if (!template_name || !subject || !body) {
        console.log("❌ Validation failed: Missing required fields");
        if (req.files) {
          for (const file of req.files) {
            console.log(`🗑️ Cleaning up file: ${file.originalname}`);
            await fsPromises.unlink(file.path);
          }
        }
        return res.status(400).json({
          success: false,
          error: "Template name, subject, and body are required",
        });
      }

      const attachments = req.files
        ? req.files.map((file) => ({
            filename: file.originalname,
            filepath: file.path,
            mimetype: file.mimetype,
          }))
        : [];

      console.log(
        `💾 Saving template with ${attachments.length} attachments...`
      );
      const result = await db.query(
        `INSERT INTO email_templates 
         (template_name, subject, body, category, attachments, sender_email, cc_emails)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          template_name,
          subject,
          body,
          category,
          attachments.length > 0 ? JSON.stringify(attachments) : null,
          sender_email || null,
          cc_emails
            ? Array.isArray(cc_emails)
              ? cc_emails
              : JSON.parse(cc_emails)
            : null,
        ]
      );

      console.log(
        "✅ Template created successfully with ID:",
        result.rows[0].id
      );
      res.status(201).json({
        success: true,
        template: result.rows[0],
        message: "Template created successfully",
      });
    } catch (error) {
      console.error("\n❌ Error creating template:", error);
      console.error("Stack:", error.stack);

      if (req.files) {
        for (const file of req.files) {
          try {
            console.log(`🗑️ Cleaning up file on error: ${file.originalname}`);
            await fsPromises.unlink(file.path);
          } catch (err) {
            console.error("Error deleting file:", err);
          }
        }
      }

      res.status(500).json({
        success: false,
        error: "Failed to create template",
      });
    }
  }
);

// PUT /api/email-templates/:id - Update template with attachments
routes.put(
  "/email-templates/:id",
  upload.array("attachments", 5),
  async (req, res) => {
    console.log("\n📝 Updating email template...");
    try {
      const { id } = req.params;
      console.log(`Template ID: ${id}`);

      const {
        template_name,
        subject,
        body,
        category,
        sender_email,
        cc_emails,
        keep_existing_attachments,
        removed_attachments,
      } = req.body;

      console.log("Update Details:", {
        name: template_name,
        subject,
        category,
        bodyLength: body?.length,
        keepAttachments: keep_existing_attachments,
      });

      if (req.files) {
        console.log(
          "📎 New attachments:",
          req.files.map((f) => ({
            name: f.originalname,
            size: `${(f.size / 1024).toFixed(2)}KB`,
            type: f.mimetype,
          }))
        );
      }

      if (!template_name || !subject || !body) {
        if (req.files) {
          for (const file of req.files) {
            await fsPromises.unlink(file.path);
          }
        }
        return res.status(400).json({
          success: false,
          error: "Template name, subject, and body are required",
        });
      }

      // Get existing template
      const existingTemplate = await db.query(
        "SELECT attachments FROM email_templates WHERE id = $1",
        [id]
      );

      if (existingTemplate.rows.length === 0) {
        if (req.files) {
          for (const file of req.files) {
            await fsPromises.unlink(file.path);
          }
        }
        return res.status(404).json({
          success: false,
          error: "Template not found",
        });
      }

      // Parse existing attachments
      let finalAttachments = parseAttachments(
        existingTemplate.rows[0].attachments
      );

      // Handle removed attachments
      if (removed_attachments) {
        try {
          // Safety check: ensure it's a valid string before parsing
          let removedList = [];
          if (
            typeof removed_attachments === "string" &&
            removed_attachments.trim() !== ""
          ) {
            removedList = JSON.parse(removed_attachments);
          } else if (Array.isArray(removed_attachments)) {
            removedList = removed_attachments;
          }

          console.log(`Removing ${removedList.length} attachments...`);

          for (const filename of removedList) {
            const attachment = finalAttachments.find(
              (a) => a.filename === filename
            );
            if (attachment) {
              try {
                console.log(`Deleting file: ${filename}`);
                await fsPromises.unlink(attachment.filepath);
              } catch (err) {
                console.error(`Error deleting file ${filename}:`, err);
              }
            }
          }

          // Remove from final attachments list
          finalAttachments = finalAttachments.filter(
            (a) => !removedList.includes(a.filename)
          );
        } catch (err) {
          console.error("Error processing removed attachments:", err);
        }
      }

      // If not keeping existing attachments, delete all remaining old files
      // Only delete if explicitly NOT keeping attachments AND we're not adding new ones
      if (
        !keep_existing_attachments &&
        finalAttachments.length > 0 &&
        !req.files?.length
      ) {
        console.log(
          `Deleting ${finalAttachments.length} existing attachments...`
        );
        for (const attachment of finalAttachments) {
          try {
            console.log(`Deleting file: ${attachment.filename}`);
            await fsPromises.unlink(attachment.filepath);
          } catch (err) {
            console.error(
              `Error deleting attachment ${attachment.filename}:`,
              err
            );
          }
        }
        finalAttachments = [];
      }

      // Add new attachments
      if (req.files) {
        const newAttachments = req.files.map((file) => ({
          filename: file.originalname,
          filepath: file.path,
          mimetype: file.mimetype,
        }));
        finalAttachments = [...finalAttachments, ...newAttachments];
      }

      console.log(
        `💾 Updating template with ${finalAttachments.length} attachments...`
      );

      const result = await db.query(
        `
        UPDATE email_templates 
        SET template_name = $1, subject = $2, body = $3, category = $4, 
            attachments = $5, sender_email = $6, cc_emails = $7
        WHERE id = $8
        RETURNING *
      `,
        [
          template_name,
          subject,
          body,
          category || "general",
          finalAttachments.length > 0 ? JSON.stringify(finalAttachments) : null,
          sender_email || null,
          cc_emails
            ? Array.isArray(cc_emails)
              ? cc_emails
              : JSON.parse(cc_emails)
            : null,
          id,
        ]
      );

      console.log("✅ Template updated successfully");
      res.json({
        success: true,
        template: result.rows[0],
        message: "Template updated successfully",
      });
    } catch (error) {
      console.error("\n❌ Error updating template:", error);
      console.error("Stack:", error.stack);
      if (req.files) {
        for (const file of req.files) {
          try {
            await fsPromises.unlink(file.path);
          } catch (err) {
            console.error("Error deleting file:", err);
          }
        }
      }
      res.status(500).json({
        success: false,
        error: "Failed to update template",
      });
    }
  }
);

// DELETE /api/email-templates/:id - Delete template
routes.delete("/email-templates/:id", async (req, res) => {
  console.log("\n🗑️ Deleting email template...");
  try {
    const { id } = req.params;
    console.log(`Template ID: ${id}`);

    const template = await db.query(
      "SELECT attachments FROM email_templates WHERE id = $1",
      [id]
    );

    if (template.rows.length === 0) {
      console.log("❌ Template not found");
      return res.status(404).json({
        success: false,
        error: "Template not found",
      });
    }

    // Delete associated files
    if (template.rows[0].attachments) {
      const attachments = parseAttachments(template.rows[0].attachments);
      console.log(`Found ${attachments.length} attachments to delete`);

      for (const attachment of attachments) {
        try {
          console.log(`Deleting file: ${attachment.filename}`);
          await fsPromises.unlink(attachment.filepath);
        } catch (err) {
          console.error(
            `Error deleting attachment ${attachment.filename}:`,
            err
          );
        }
      }
    }

    const result = await db.query(
      "DELETE FROM email_templates WHERE id = $1 RETURNING id",
      [id]
    );

    console.log("✅ Template deleted successfully");
    res.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("\n❌ Error deleting template:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Failed to delete template",
    });
  }
});

// ==================== EMAIL logs ====================

// GET /api/email-logs - Get all logs with pagination
routes.get("/email-logs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `
      SELECT ec.*, e.title as event_title
      FROM email_logs ec
      LEFT JOIN events e ON ec.event_id = e.id
      ORDER BY ec.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    const countResult = await db.query("SELECT COUNT(*) FROM email_logs");
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      logs: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch logs",
    });
  }
});

// DELETE /api/email-logs/:id - Delete campaign
routes.delete("/email-logs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM email_logs WHERE id = $1 RETURNING id
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

//====================================================================================================================================

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
async function getEmailAttachments(
  attachmentData,
  position_id = null,
  excludedAttachments = []
) {
  const attachments = [];

  if (attachmentData) {
    try {
      const templateAttachments =
        typeof attachmentData === "string"
          ? JSON.parse(attachmentData)
          : attachmentData;
      for (const attachment of templateAttachments) {
        // Skip excluded attachments
        if (excludedAttachments.includes(attachment.filename)) {
          console.log(
            `⏭️ Skipping excluded attachment: ${attachment.filename}`
          );
          continue;
        }
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
async function sendBulkEmails(
  students,
  subject,
  body,
  attachments = [],
  cc_emails = [],
  bcc_emails = []
) {
  console.log("\n📧 Starting bulk email send...");
  console.log(`📋 Total recipients: ${students.length}`);
  console.log(`📎 Attachments: ${attachments.length}`);
  console.log(`👥 CC Recipients: ${cc_emails?.length || 0}`);
  console.log(`🕶️ BCC Recipients: ${bcc_emails?.length || 0}`);

  const results = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  for (const student of students) {
    try {
      const personalizedSubject = replaceVariables(subject, student);
      const personalizedBody = replaceVariables(body, student);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.college_email,
        subject: personalizedSubject,
        html: personalizedBody,
      };

      // Add CC only if exists
      if (cc_emails && cc_emails.length > 0) {
        mailOptions.cc = cc_emails;
      }

      // Add BCC only if exists
      if (bcc_emails && bcc_emails.length > 0) {
        mailOptions.bcc = bcc_emails;
      }

      // Add attachments only if exists
      if (attachments.length > 0) {
        mailOptions.attachments = attachments;
      }

      console.log("Sending email with options:", {
        to: student.college_email,
        cc: mailOptions.cc,
        bcc: mailOptions.bcc,
        attachments: attachments.length,
      });

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

  // Add summary logs
  console.log("\n📊 Email Campaign Results:");
  console.log(`✅ Successful: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`👥 CC Recipients: ${cc_emails?.length || 0}`);
  console.log(`🕶️ BCC Recipients: ${bcc_emails?.length || 0}`);

  return results;
}

// // POST /api/email-logs/send - Send new email campaign
routes.post(
  "/email-logs/send",
  upload.array("manual_attachments", 5),
  async (req, res) => {
    console.log("\n🚀 Starting new email campaign...");

    try {
      const {
        title,
        subject,
        body,
        sender_email,
        recipient_filter,
        recipient_emails,
        cc_emails,
        bcc_emails,
        event_id,
        position_id,
        template_id,
      } = req.body;

      // Add after parsing other data:
      const excluded_template_attachments = req.body
        .excluded_template_attachments
        ? JSON.parse(req.body.excluded_template_attachments)
        : [];

      // Parse CC and BCC emails
      const parsedCcEmails = cc_emails ? JSON.parse(cc_emails) : [];
      const parsedBccEmails = bcc_emails ? JSON.parse(bcc_emails) : [];

      console.log(`📑 Campaign: ${title}`);
      console.log(`👤 Sender: ${sender_email}`);

      if (req.files) {
        console.log(
          "📎 Manual attachments received:",
          req.files.map((f) => ({
            name: f.originalname,
            size: `${(f.size / 1024).toFixed(2)}KB`,
          }))
        );
      }

      if (!title || !subject || !body) {
        // Clean up uploaded files
        if (req.files) {
          for (const file of req.files) {
            await fsPromises.unlink(file.path);
          }
        }
        return res.status(400).json({
          success: false,
          error: "Title, subject, and body are required",
        });
      }

      // Add after const checks
      if (!sender_email) {
        return res.status(400).json({
          success: false,
          error: "Sender email is required",
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
            position_id,
            excluded_template_attachments // ADD THIS LINE
          );
        }
      } else if (position_id) {
        // Get only position documents if no template
        attachments = await getEmailAttachments(null, position_id);
      }

      // Add manual attachments
      if (req.files && req.files.length > 0) {
        console.log(`📎 Adding ${req.files.length} manual attachments...`);
        for (const file of req.files) {
          try {
            const fileContent = await fsPromises.readFile(file.path);
            attachments.push({
              filename: file.originalname,
              content: fileContent,
              contentType: file.mimetype,
            });
          } catch (err) {
            console.error(
              `Error reading manual attachment ${file.originalname}:`,
              err
            );
          }
        }
      }

      // Parse recipient_filter if it's a string
      let parsedRecipientFilter = recipient_filter;
      if (typeof recipient_filter === "string") {
        try {
          parsedRecipientFilter = JSON.parse(recipient_filter);
        } catch (err) {
          console.error("Error parsing recipient_filter:", err);
        }
      }

      // Parse recipient_emails if it's a string
      let parsedRecipientEmails = recipient_emails;
      if (typeof recipient_emails === "string") {
        try {
          parsedRecipientEmails = JSON.parse(recipient_emails);
        } catch (err) {
          console.error("Error parsing recipient_emails:", err);
        }
      }

      // Get recipients based on filter or manual emails
      if (
        parsedRecipientFilter &&
        Object.keys(parsedRecipientFilter).length > 0
      ) {
        console.log("🎯 Using recipient filter:", parsedRecipientFilter);
        const { query, params } = buildStudentQuery(parsedRecipientFilter);
        const result = await db.query(query, params);
        students = result.rows;
        finalRecipientEmails = students.map((s) => s.college_email);
      } else if (parsedRecipientEmails && parsedRecipientEmails.length > 0) {
        console.log(
          `📋 Using manual recipient list (${parsedRecipientEmails.length} emails)`
        );
        students = parsedRecipientEmails.map((email) => ({
          college_email: email,
          first_name: "",
          last_name: "",
          enrollment_number: "",
          department: "",
          branch: "",
          cgpa: "",
          batch_year: "",
        }));
        finalRecipientEmails = parsedRecipientEmails;
      } else {
        // Clean up uploaded files
        if (req.files) {
          for (const file of req.files) {
            await fsPromises.unlink(file.path);
          }
        }
        return res.status(400).json({
          success: false,
          error: "Either recipient_filter or recipient_emails is required",
        });
      }

      if (finalRecipientEmails.length === 0) {
        // Clean up uploaded files
        if (req.files) {
          for (const file of req.files) {
            await fsPromises.unlink(file.path);
          }
        }
        return res.status(400).json({
          success: false,
          error: "No recipients found",
        });
      }

      console.log(`\n📊 Found ${finalRecipientEmails.length} recipients`);
      console.log(`📎 Total attachments: ${attachments.length}`);

      // Send emails
      const emailResults = await sendBulkEmails(
        students,
        subject,
        body,
        attachments,
        parsedCcEmails,
        parsedBccEmails
      );

      // Save campaign to database
      const campaignResult = await db.query(
        `INSERT INTO email_logs 
       (title, subject, body, recipient_filter, recipient_emails, sender_email, 
        cc_emails, bcc_emails, sent_at, total_recipients, event_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10)
       RETURNING *`,
        [
          title,
          subject,
          body,
          parsedRecipientFilter ? JSON.stringify(parsedRecipientFilter) : null,
          finalRecipientEmails,
          sender_email,
          parsedCcEmails,
          parsedBccEmails,
          finalRecipientEmails.length,
          event_id || null,
        ]
      );

      // Clean up manual attachment files after sending
      if (req.files) {
        for (const file of req.files) {
          try {
            await fsPromises.unlink(file.path);
            console.log(
              `🗑️ Cleaned up manual attachment: ${file.originalname}`
            );
          } catch (err) {
            console.error(
              `Error deleting manual attachment ${file.originalname}:`,
              err
            );
          }
        }
      }

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

      // Clean up uploaded files on error
      if (req.files) {
        for (const file of req.files) {
          try {
            await fsPromises.unlink(file.path);
          } catch (err) {
            console.error("Error deleting file:", err);
          }
        }
      }

      res.status(500).json({
        success: false,
        error: "Failed to send email campaign",
      });
    }
  }
);

// POST /api/email-logs/preview - Preview email with sample data
routes.post("/email-logs/preview", async (req, res) => {
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
        const templateAttachments =
          typeof templateResult.rows[0].attachments === "string"
            ? JSON.parse(templateResult.rows[0].attachments)
            : templateResult.rows[0].attachments;
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

// POST /api/email-logs/send/event/:eventId - Send to event participants
routes.post("/email-logs/send/event/:eventId", async (req, res) => {
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
      INSERT INTO email_logs 
      (title, subject, body, recipient_emails, sender_email, 
       sent_at, total_recipients, event_id)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
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

// POST /api/email-logs/send/students - Send to filtered students
routes.post("/email-logs/send/students", async (req, res) => {
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
        const templateAttachments =
          typeof templateResult.rows[0].attachments === "string"
            ? JSON.parse(templateResult.rows[0].attachments)
            : templateResult.rows[0].attachments;
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
      INSERT INTO email_logs 
      (title, subject, body, recipient_emails, sender_email, 
       sent_at, total_recipients)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      RETURNING *
    `,
      [title, subject, body, recipientEmails, sender_email, students.length]
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

module.exports = routes;

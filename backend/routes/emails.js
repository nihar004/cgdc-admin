const express = require("express");
const routes = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const db = require("../db");

// Configure multer for file uploads - SINGLE CONFIGURATION
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
    files: 10, // Increased to 10 files per request
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

const EMAIL_ACCOUNTS = {
  [process.env.EMAIL_USER]: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  [process.env.SECONDARY_EMAIL_USER]: {
    user: process.env.SECONDARY_EMAIL_USER,
    pass: process.env.SECONDARY_EMAIL_PASS,
  },
};

// Function to get appropriate transporter based on sender email
function getTransporter(senderEmail) {
  const account = EMAIL_ACCOUNTS[senderEmail];

  // If sender email is registered, use its credentials
  if (account) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  // Otherwise, use default credentials
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

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

    res.json({
      success: true,
      groupedTemplates: result.rows,
    });
  } catch (error) {
    console.error(" Error fetching templates:", error);
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
    try {
      const {
        template_name,
        subject,
        body,
        category,
        sender_email,
        cc_emails,
      } = req.body;

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

      const attachments = req.files
        ? req.files.map((file) => ({
            filename: file.originalname,
            filepath: file.path,
            mimetype: file.mimetype,
          }))
        : [];

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

      res.status(201).json({
        success: true,
        template: result.rows[0],
        message: "Template created successfully",
      });
    } catch (error) {
      console.error("\n Error creating template:", error);
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
    try {
      const { id } = req.params;

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

          for (const filename of removedList) {
            const attachment = finalAttachments.find(
              (a) => a.filename === filename
            );
            if (attachment) {
              try {
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
        for (const attachment of finalAttachments) {
          try {
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

      res.json({
        success: true,
        template: result.rows[0],
        message: "Template updated successfully",
      });
    } catch (error) {
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
  try {
    const { id } = req.params;

    const template = await db.query(
      "SELECT attachments FROM email_templates WHERE id = $1",
      [id]
    );

    if (template.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Template not found",
      });
    }

    // Delete associated files
    if (template.rows[0].attachments) {
      const attachments = parseAttachments(template.rows[0].attachments);

      for (const attachment of attachments) {
        try {
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

    res.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete template",
    });
  }
});

// ==================== EMAIL logs ====================

// GET /api/email-logs - Updated to include tracking columns
routes.get("/email-logs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `
      SELECT 
        el.*,
        e.title as event_title
      FROM email_logs el
      LEFT JOIN events e ON el.event_id = e.id
      ORDER BY el.created_at DESC
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

// POST Send new email campaign with message tracking
routes.post(
  "/email-logs/send",
  upload.array("manual_attachments", 10), // Changed from 5 to 10
  async (req, res) => {
    try {
      const {
        title,
        subject,
        body,
        sender_email,
        to_emails,
        recipient_filter,
        recipient_emails,
        cc_emails,
        event_id,
        position_id,
        template_id,
        message_id,
        parent_message_id,
      } = req.body;

      const excluded_template_attachments = req.body
        .excluded_template_attachments
        ? JSON.parse(req.body.excluded_template_attachments)
        : [];

      const parsedToEmails = to_emails ? JSON.parse(to_emails) : [];
      const parsedCcEmails = cc_emails ? JSON.parse(cc_emails) : [];

      if (!title || !subject || !body) {
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

      if (!sender_email) {
        return res.status(400).json({
          success: false,
          error: "Sender email is required",
        });
      }

      let students = [];
      let finalRecipientEmails = [];
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
            position_id,
            excluded_template_attachments
          );
        }
      } else if (position_id) {
        attachments = await getEmailAttachments(null, position_id);
      }

      if (req.files && req.files.length > 0) {
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

      let parsedRecipientFilter = recipient_filter;
      if (typeof recipient_filter === "string") {
        try {
          parsedRecipientFilter = JSON.parse(recipient_filter);
        } catch (err) {
          console.error("Error parsing recipient_filter:", err);
        }
      }

      let parsedRecipientEmails = recipient_emails;
      if (typeof recipient_emails === "string") {
        try {
          parsedRecipientEmails = JSON.parse(recipient_emails);
        } catch (err) {
          console.error("Error parsing recipient_emails:", err);
        }
      }

      if (
        parsedRecipientFilter &&
        Object.keys(parsedRecipientFilter).length > 0
      ) {
        const { query, params } = buildStudentQuery(parsedRecipientFilter);
        const result = await db.query(query, params);
        students = result.rows;
        finalRecipientEmails = students.map((s) => s.college_email);
      } else if (parsedRecipientEmails && parsedRecipientEmails.length > 0) {
        students = parsedRecipientEmails.map((email) => ({
          college_email: email,
          full_name: "",
          enrollment_number: "",
          department: "",
          branch: "",
          cgpa: "",
          batch_year: "",
        }));
        finalRecipientEmails = parsedRecipientEmails;
      } else {
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

      // Generate message_id first
      const finalMessageId = message_id || generateMessageId();

      // Send emails with the message ID
      const emailResults = await sendBulkEmails(
        students,
        subject,
        body,
        attachments,
        parsedToEmails,
        parsedCcEmails,
        finalMessageId,
        parent_message_id,
        sender_email
      );

      // Save to database with the same message ID
      const campaignResult = await db.query(
        `INSERT INTO email_logs 
        (title, subject, body, recipient_filter, recipient_emails, sender_email, 
          to_emails, cc_emails, sent_at, total_recipients, event_id, 
          message_id, parent_message_id, total_successful, total_failed, failed_emails)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          title,
          subject,
          body,
          parsedRecipientFilter ? JSON.stringify(parsedRecipientFilter) : null,
          finalRecipientEmails,
          sender_email,
          parsedToEmails,
          parsedCcEmails,
          finalRecipientEmails.length,
          event_id || null,
          finalMessageId,
          parent_message_id || null,
          emailResults.successful,
          emailResults.failed,
          emailResults.failed_emails || [],
        ]
      );

      if (req.files) {
        for (const file of req.files) {
          try {
            await fsPromises.unlink(file.path);
          } catch (err) {
            console.error(
              `Error deleting manual attachment ${file.originalname}:`,
              err
            );
          }
        }
      }

      res.json({
        success: true,
        campaign: campaignResult.rows[0],
        emailResults,
        message_id: finalMessageId,
        message: `Email sent successfully to ${emailResults.successful} of ${finalRecipientEmails.length} recipients`,
      });
    } catch (error) {
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

function buildStudentQuery(filter) {
  let query = `
    SELECT id, college_email, personal_email, full_name, 
           enrollment_number, registration_number, department, branch, cgpa, batch_year,
           class_10_percentage, class_12_percentage, 
           PS2_company_name, PS2_project_title
    FROM students 
    WHERE college_email IS NOT NULL AND college_email != ''
  `;
  const params = [];

  // branch filter - flatten if nested array
  if (filter.branch && filter.branch.length > 0) {
    const depts = Array.isArray(filter.branch[0])
      ? filter.branch.flat()
      : filter.branch;
    params.push(depts);
    query += ` AND branch = ANY($${params.length})`;
  }

  // Batch year filter - flatten if nested array and convert to strings
  if (filter.batch_year && filter.batch_year.length > 0) {
    const years = Array.isArray(filter.batch_year[0])
      ? filter.batch_year.flat()
      : filter.batch_year;
    const yearStrings = years.map((y) => String(y));
    params.push(yearStrings);
    query += ` AND batch_year::TEXT = ANY($${params.length})`;
  }

  // Placement status filter
  if (filter.placement_status) {
    if (filter.placement_status === "unplaced") {
      params.push("unplaced");
    } else if (filter.placement_status === "placed") {
      params.push("placed");
    }
    query += ` AND placement_status = $${params.length}`;
  }

  query += ` ORDER BY batch_year DESC, department ASC`;

  return { query, params };
}

function generateMessageId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const domain = process.env.EMAIL_USER.split("@")[1] || "example.com";
  return `<${timestamp}.${random}@${domain}>`;
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

async function sendBulkEmails(
  students,
  subject,
  body,
  attachments = [],
  to_emails = [],
  cc_emails = [],
  message_id = null,
  parent_message_id = null,
  sender_email = null // ADD this parameter
) {
  const results = {
    successful: 0,
    failed: 0,
    errors: [],
    failed_emails: [],
  };

  const bcc_emails = students.map((s) => s.college_email);

  // Get appropriate transporter using sender_email
  const transporter = getTransporter(sender_email);

  const mailOptions = {
    from: sender_email || process.env.EMAIL_USER, // FIX: Use sender_email instead of process.env.EMAIL_USER
    to: to_emails,
    bcc: bcc_emails,
    cc: cc_emails?.length > 0 ? cc_emails : undefined,
    subject,
    html: body,
    attachments: attachments.length > 0 ? attachments : undefined,
    headers: {},
  };

  if (message_id) {
    mailOptions.headers["Message-ID"] = message_id;
  }

  if (parent_message_id) {
    mailOptions.headers["In-Reply-To"] = parent_message_id;
    mailOptions.headers["References"] = parent_message_id;
  }

  try {
    await transporter.sendMail(mailOptions);
    results.successful = bcc_emails.length;
  } catch (error) {
    results.failed = bcc_emails.length;
    results.errors.push({ error: error.message });
    console.error("Failed to send bulk email:", error.message);
  }

  return results;
}

// POST /api/email-logs/send/event/:eventId - Send to event participants
routes.post("/email-logs/send/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      title,
      subject,
      body,
      sender_email,
      to_emails,
      cc_emails,
      recipient_type = "registered",
      position_id,
      template_id,
      message_id,
      parent_message_id,
    } = req.body;

    if (!title || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Title, subject, and body are required",
      });
    }

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

    let studentQuery;

    if (recipient_type === "registered") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.full_name, 
               s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
        FROM students s
        INNER JOIN student_round_results srr ON s.id = srr.student_id
        WHERE srr.event_id = $1 AND s.college_email IS NOT NULL
      `;
    } else if (recipient_type === "attended") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.full_name, 
               s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
        FROM students s
        INNER JOIN event_attendance ea ON s.id = ea.student_id
        WHERE ea.event_id = $1 AND ea.status = 'present' AND s.college_email IS NOT NULL
      `;
    } else if (recipient_type === "absent") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.full_name, 
               s.enrollment_number, s.department, s.branch, s.cgpa, s.batch_year
        FROM students s
        INNER JOIN event_attendance ea ON s.id = ea.student_id
        WHERE ea.event_id = $1 AND ea.status = 'absent' AND s.college_email IS NOT NULL
      `;
    } else if (recipient_type === "selected") {
      studentQuery = `
        SELECT DISTINCT s.id, s.college_email, s.full_name, 
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

    const parsedToEmails = to_emails
      ? typeof to_emails === "string"
        ? JSON.parse(to_emails)
        : to_emails
      : [];
    const parsedCcEmails = cc_emails
      ? typeof cc_emails === "string"
        ? JSON.parse(cc_emails)
        : cc_emails
      : [];

    const emailResults = await sendBulkEmails(
      students,
      subject,
      body,
      attachments,
      parsedToEmails,
      parsedCcEmails,
      message_id || generateMessageId(),
      parent_message_id,
      sender_email
    );

    const recipientEmails = students.map((s) => s.college_email);

    // Generate or use provided message_id
    const finalMessageId =
      message_id ||
      `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const campaignResult = await db.query(
      `
      INSERT INTO email_logs 
      (title, subject, body, recipient_emails, sender_email, 
      to_emails, cc_emails, sent_at, total_recipients, event_id,
      message_id, parent_message_id, total_successful, total_failed, failed_emails)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `,
      [
        title,
        subject,
        body,
        recipientEmails,
        sender_email,
        parsedToEmails,
        parsedCcEmails,
        students.length,
        eventId,
        finalMessageId,
        parent_message_id || null,
        emailResults.successful,
        emailResults.failed,
        emailResults.failed_emails || [],
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
routes.post(
  "/email-logs/send/students",
  upload.array("manual_attachments", 10), // Changed from 10 to 10 (consistent)
  async (req, res) => {
    const startTime = Date.now();
    const requestId = `req-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      const {
        title,
        subject,
        body,
        sender_email,
        to_emails,
        cc_emails,
        student_ids,
        position_id,
        template_id,
        message_id,
        parent_message_id,
      } = req.body;

      // --- Parse student IDs ---
      let parsedStudentIds = [];
      try {
        parsedStudentIds = student_ids
          ? typeof student_ids === "string"
            ? JSON.parse(student_ids)
            : student_ids
          : [];
      } catch (err) {
        console.error(`[${requestId}] Error parsing student_ids:`, err.message);
      }

      // --- Parse email arrays ---
      let parsedToEmails = [];
      let parsedCcEmails = [];

      try {
        parsedToEmails = to_emails
          ? typeof to_emails === "string"
            ? JSON.parse(to_emails)
            : to_emails
          : [];
      } catch (err) {
        console.error(`[${requestId}] Error parsing to_emails:`, err.message);
      }

      try {
        parsedCcEmails = cc_emails
          ? typeof cc_emails === "string"
            ? JSON.parse(cc_emails)
            : cc_emails
          : [];
      } catch (err) {
        console.error(`[${requestId}] Error parsing cc_emails:`, err.message);
      }

      // --- Validation ---
      if (!title || !subject || !body) {
        return res.status(400).json({
          success: false,
          error: "Title, subject, and body are required",
        });
      }

      if (!parsedStudentIds || parsedStudentIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: "student_ids array is required",
        });
      }

      // --- Fetch students from database ---
      const result = await db.query(
        `
        SELECT id, college_email, full_name , enrollment_number, 
               department, branch, cgpa, batch_year
        FROM students 
        WHERE id = ANY($1) AND college_email IS NOT NULL
        `,
        [parsedStudentIds]
      );

      const students = result.rows;

      if (students.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No valid students found with provided IDs",
        });
      }

      // --- Process attachments ---
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
              const fileContent = await fsPromises.readFile(
                attachment.filepath
              );
              attachments.push({
                filename: attachment.filename,
                content: fileContent,
                contentType: attachment.mimetype,
              });
            } catch (err) {
              console.error(
                `[${requestId}] Error reading template attachment ${attachment.filename}:`,
                err.message
              );
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
            console.error(
              `[${requestId}] Error reading position document ${doc.document_title}:`,
              err.message
            );
          }
        }
      }

      // --- Send bulk emails ---
      const emailResults = await sendBulkEmails(
        students,
        subject,
        body,
        attachments,
        parsedToEmails,
        parsedCcEmails,
        message_id || generateMessageId(),
        parent_message_id,
        sender_email
      );

      // --- Log to database ---
      const recipientEmails = students.map((s) => s.college_email);
      const finalMessageId =
        message_id ||
        `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const campaignResult = await db.query(
        `
        INSERT INTO email_logs 
        (title, subject, body, recipient_emails, sender_email, 
        to_emails, cc_emails, sent_at, total_recipients,
        message_id, parent_message_id, total_successful, total_failed, failed_emails)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10, $11, $12, $13)
        RETURNING *
        `,
        [
          title,
          subject,
          body,
          recipientEmails,
          sender_email,
          parsedToEmails,
          parsedCcEmails,
          students.length,
          finalMessageId,
          parent_message_id || null,
          emailResults.successful,
          emailResults.failed,
          emailResults.failed_emails || [],
        ]
      );

      res.json({
        success: true,
        campaign: campaignResult.rows[0],
        emailResults,
        message: `Email sent to ${emailResults.successful} of ${students.length} students`,
      });
    } catch (error) {
      console.error(`[${requestId}] CRITICAL ERROR:`, error.stack);
      res.status(500).json({
        success: false,
        error: "Failed to send email to students",
        requestId,
      });
    }
  }
);

// Error handling middleware
routes.use((error, req, res, next) => {
  console.error("Error in email routes:", error);
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: `File upload error: Expected field 'manual_attachments' but got '${error.field}'`,
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "File upload error: Maximum 10 files allowed",
      });
    }
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File upload error: File size exceeds 10MB limit",
      });
    }
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

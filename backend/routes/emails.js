const express = require("express");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const db = require("../db");

const routes = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const EMAIL_TEMPLATES = {
  company_notification: {
    subject: "🏢 {company_name} - Campus Recruitment Opportunity",
    body: `Dear Student,

We are excited to announce that {company_name} is visiting our campus for recruitment!

📅 Event Date: {event_date}
📍 Venue: {venue}
⏰ Time: {time}

Company Details:
- Website: {company_website}
- Sector: {company_sector}
- Type: {company_type}

Eligibility Criteria:
- Minimum CGPA: {min_cgpa}
- Maximum Backlogs: {max_backlogs}
- Eligible Departments: {departments}

{additional_details}

Please ensure you meet the eligibility criteria before applying.

Best regards,
Placement Cell`,
  },
  event_notification: {
    subject: "📅 Important Event: {event_title}",
    body: `Dear Student,

You are invited to attend: {event_title}

📅 Date: {event_date}
📍 Venue: {venue}
⏰ Time: {time}
👤 Speaker: {speaker}

Event Description:
{event_description}

{additional_details}

Please mark your calendar and attend on time.

Best regards,
Placement Cell`,
  },
  interview_schedule: {
    subject: "📋 Interview Schedule - {company_name}",
    body: `Dear Student,

Your interview with {company_name} has been scheduled.

Interview Details:
📅 Date: {interview_date}
⏰ Time: {interview_time}
📍 Venue: {venue}
💼 Position: {position}

Please arrive 15 minutes before your scheduled time.

Required Documents:
- Resume
- All academic certificates
- Photo ID

{additional_instructions}

Best of luck!

Placement Cell`,
  },
  general: {
    subject: "📢 Important Notice from Placement Cell",
    body: `Dear Student,

{message_content}

For any queries, please contact the placement cell.

Best regards,
Placement Cell`,
  },
};

// Get eligible students based on criteria
async function getEligibleStudents(criteria = {}) {
  try {
    let query = `
      SELECT DISTINCT s.id, s.first_name, s.last_name, s.college_email, s.personal_email, 
             s.department, s.batch_year, s.cgpa, s.backlogs, s.placement_status
      FROM students s
      WHERE s.placement_status IN ('eligible', 'placed')
    `;

    const params = [];
    let paramCount = 0;

    // Department filter
    if (criteria.departments && criteria.departments.length > 0) {
      paramCount++;
      query += ` AND s.department = ANY($${paramCount})`;
      params.push(criteria.departments);
    }

    // Batch year filter
    if (criteria.batch_years && criteria.batch_years.length > 0) {
      paramCount++;
      query += ` AND s.batch_year = ANY($${paramCount})`;
      params.push(criteria.batch_years);
    }

    // CGPA filter
    if (criteria.min_cgpa) {
      paramCount++;
      query += ` AND s.cgpa >= $${paramCount}`;
      params.push(criteria.min_cgpa);
    }

    // Backlogs filter
    if (criteria.max_backlogs !== undefined) {
      paramCount++;
      query += ` AND s.backlogs <= $${paramCount}`;
      params.push(criteria.max_backlogs);
    }

    // Placement status filter
    if (criteria.placement_status) {
      paramCount++;
      query += ` AND s.placement_status = $${paramCount}`;
      params.push(criteria.placement_status);
    }

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error fetching eligible students:", error);
    throw error;
  }
}

// Send individual email
async function sendEmail(to, subject, body, attachments = []) {
  try {
    const mailOptions = {
      from: `"CGDC " <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// Process email template
function processEmailTemplate(template, data) {
  let processedSubject = template.subject;
  let processedBody = template.body;

  // Replace placeholders in subject and body
  Object.keys(data).forEach((key) => {
    const placeholder = `{${key}}`;
    processedSubject = processedSubject.replace(
      new RegExp(placeholder, "g"),
      data[key] || ""
    );
    processedBody = processedBody.replace(
      new RegExp(placeholder, "g"),
      data[key] || ""
    );
  });

  return {
    subject: processedSubject,
    body: processedBody,
  };
}

// Create email campaign
routes.post("/campaigns", async (req, res) => {
  try {
    const {
      title,
      email_type,
      template_data = {},
      recipient_criteria = {},
      additional_emails = [],
      scheduled_at,
      event_id,
      custom_subject,
      custom_body,
    } = req.body;

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Get email template and process it
      let emailContent;
      if (custom_subject && custom_body) {
        emailContent = {
          subject: custom_subject,
          body: custom_body,
        };
      } else {
        const template = EMAIL_TEMPLATES[email_type] || EMAIL_TEMPLATES.general;
        emailContent = processEmailTemplate(template, template_data);
      }

      // Get eligible students
      const eligibleStudents = await getEligibleStudents(recipient_criteria);
      const totalRecipients =
        eligibleStudents.length + additional_emails.length;

      // Create campaign record
      const campaignResult = await client.query(
        `
        INSERT INTO email_campaigns (
  title, subject, body_template, email_type, event_id, scheduled_at,
  total_recipients, status, created_by, recipient_criteria, additional_emails
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id

      `,
        [
          title,
          emailContent.subject,
          emailContent.body,
          email_type,
          event_id || null,
          scheduled_at || null,
          totalRecipients,
          scheduled_at ? "scheduled" : "sending",
          req.user?.id || 1, // Assuming user ID from auth middleware
        ]
      );

      const campaignId = campaignResult.rows[0].id;

      if (scheduled_at) {
        const date = new Date(scheduled_at);

        schedule.scheduleJob(date, () => {
          console.log(`Running scheduled campaign: ${campaignId} at ${date}`);
          sendScheduledCampaign(campaignId, emailContent);
        });
      } else {
        // immediate send
        sendCampaignEmails(
          campaignId,
          eligibleStudents,
          additionalEmails,
          emailContent
        );
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating email campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create email campaign",
      error: error.message,
    });
  }
});

// Send campaign emails
async function sendCampaignEmails(
  campaignId,
  eligibleStudents,
  additionalEmails,
  emailContent
) {
  let successCount = 0;
  let failureCount = 0;

  try {
    // Update campaign status
    await db.query(
      `
      UPDATE email_campaigns 
      SET status = 'sending', sent_at = NOW() 
      WHERE id = $1
    `,
      [campaignId]
    );

    // Send to eligible students
    for (const student of eligibleStudents) {
      const email = student.college_email || student.personal_email;
      if (email) {
        const personalizedContent = {
          subject: emailContent.subject.replace(
            "{student_name}",
            `${student.first_name} ${student.last_name}`
          ),
          body: emailContent.body.replace(
            "{student_name}",
            `${student.first_name} ${student.last_name}`
          ),
        };

        const result = await sendEmail(
          email,
          personalizedContent.subject,
          personalizedContent.body
        );
        if (result.success) {
          successCount++;
        } else {
          failureCount++;
        }
      }

      // Small delay to avoid overwhelming the SMTP server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Send to additional emails
    for (const email of additionalEmails) {
      const result = await sendEmail(
        email,
        emailContent.subject,
        emailContent.body
      );
      if (result.success) {
        successCount++;
      } else {
        failureCount++;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Update campaign with results
    await db.query(
      `
      UPDATE email_campaigns 
      SET status = 'completed', successful_sends = $1, failed_sends = $2
      WHERE id = $3
    `,
      [successCount, failureCount, campaignId]
    );
  } catch (error) {
    console.error("Error sending campaign emails:", error);

    await db.query(
      `
      UPDATE email_campaigns 
      SET status = 'failed', successful_sends = $1, failed_sends = $2
      WHERE id = $3
    `,
      [successCount, failureCount, campaignId]
    );
  }
}

// Send scheduled campaign
async function sendScheduledCampaign(campaignId) {
  const res = await db.query("SELECT * FROM email_campaigns WHERE id = $1", [
    campaignId,
  ]);
  if (!res.rows.length) return;
  const campaign = res.rows[0];
  const recipientCriteria = campaign.recipient_criteria || {};
  const additionalEmails = campaign.additional_emails || [];
  const eligibleStudents = await getEligibleStudents(recipientCriteria);
  const emailContent = {
    subject: campaign.subject,
    body: campaign.body_template,
  };
  await sendCampaignEmails(
    campaignId,
    eligibleStudents,
    additionalEmails,
    emailContent
  );
}

// Get all campaigns
routes.get("/campaigns", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, email_type } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT ec.*, e.title as event_title, e.start_datetime as event_date
      FROM email_campaigns ec
      LEFT JOIN events e ON ec.event_id = e.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND ec.status = $${paramCount}`;
      params.push(status);
    }

    if (email_type) {
      paramCount++;
      query += ` AND ec.email_type = $${paramCount}`;
      params.push(email_type);
    }

    query += ` ORDER BY ec.created_at DESC LIMIT $${paramCount + 1} OFFSET $${
      paramCount + 2
    }`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM email_campaigns ec
      WHERE 1=1
      ${status ? `AND ec.status = '${status}'` : ""}
      ${email_type ? `AND ec.email_type = '${email_type}'` : ""}
    `;

    const countResult = await db.query(countQuery);
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
    console.error("Error fetching campaigns:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.message,
    });
  }
});

// Get campaign details
routes.get("/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT ec.*, e.title as event_title, e.start_datetime as event_date,
             e.venue, e.description as event_description
      FROM email_campaigns ec
      LEFT JOIN events e ON ec.event_id = e.id
      WHERE ec.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign details",
      error: error.message,
    });
  }
});

// Get email templates
routes.get("/templates", (req, res) => {
  res.json({
    success: true,
    data: EMAIL_TEMPLATES,
  });
});

// Get eligible students count for criteria
routes.post("/eligible-count", async (req, res) => {
  try {
    const { recipient_criteria = {} } = req.body;
    const eligibleStudents = await getEligibleStudents(recipient_criteria);

    res.json({
      success: true,
      count: eligibleStudents.length,
      students: eligibleStudents.map((s) => ({
        id: s.id,
        name: `${s.first_name} ${s.last_name}`,
        email: s.college_email || s.personal_email,
        department: s.department,
        batch_year: s.batch_year,
        cgpa: s.cgpa,
        backlogs: s.backlogs,
      })),
    });
  } catch (error) {
    console.error("Error fetching eligible students count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch eligible students count",
      error: error.message,
    });
  }
});

// Delete campaign
routes.delete("/campaigns/:id", async (req, res) => {
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
        message: "Campaign not found",
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
      message: "Failed to delete campaign",
      error: error.message,
    });
  }
});

// Get active events for dropdown
routes.get("/active-events", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, title, start_datetime, venue, event_type, company_id
      FROM events 
      WHERE status IN ('upcoming', 'ongoing') 
      AND start_datetime >= NOW()
      ORDER BY start_datetime ASC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching active events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active events",
      error: error.message,
    });
  }
});

module.exports = routes;

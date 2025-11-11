// routes/auth.js
const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../db");
const { isAuthenticated } = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup - Send verification email
routes.post("/signup", async (req, res) => {
  const client = await db.connect();
  try {
    let { username, password, email } = req.body;

    username = username?.trim();
    email = email?.trim();

    // Validation
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    await client.query("BEGIN");

    // Check if username or email already exists
    const checkUser = await client.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (checkUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user with is_active = false (unverified)
    const result = await client.query(
      `INSERT INTO users (username, password_hash, email, role, is_active) 
       VALUES ($1, $2, $3, $4, false) 
       RETURNING id, username, email, role`,
      [username, password_hash, email, "pending"]
    );

    const user = result.rows[0];

    // Generate 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store verification code in password_resets table
    await client.query(
      `INSERT INTO password_resets (user_id, reset_code, expires_at) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) 
       DO UPDATE SET reset_code = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP`,
      [user.id, verificationCode, expiresAt]
    );

    await client.query("COMMIT");

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification - CGDC Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Welcome to CGDC Portal!</h2>
          <p>Hello ${username},</p>
          <p>Thank you for signing up. Please verify your email address using the code below:</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1e293b; font-size: 32px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #64748b; font-size: 12px;">Career Guidance & Development Cell</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message:
        "Account created! Please check your email for verification code.",
      requiresVerification: true,
      email: email,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

// Verify email with code
routes.post("/verify-email", async (req, res) => {
  const client = await db.connect();
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    await client.query("BEGIN");

    // Check verification code
    const result = await client.query(
      `SELECT pr.user_id, u.username, u.role, u.is_active
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.id
       WHERE u.email = $1 AND pr.reset_code = $2 AND pr.expires_at > NOW()`,
      [email, code]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const user = result.rows[0];

    // Activate user account
    await client.query("UPDATE users SET is_active = true WHERE id = $1", [
      user.user_id,
    ]);

    // Delete verification code
    await client.query("DELETE FROM password_resets WHERE user_id = $1", [
      user.user_id,
    ]);

    await client.query("COMMIT");

    // Create session
    req.session.userId = user.user_id;
    req.session.username = user.username;
    req.session.userRole = user.role;

    return res.json({
      success: true,
      message: "Email verified successfully!",
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Verify email error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

// Resend verification code
routes.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists and is not verified
    const userResult = await db.query(
      "SELECT id, username, email, is_active FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    if (user.is_active) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Update verification code
    await db.query(
      `INSERT INTO password_resets (user_id, reset_code, expires_at) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) 
       DO UPDATE SET reset_code = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP`,
      [user.id, verificationCode, expiresAt]
    );

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification - CGDC Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Email Verification</h2>
          <p>Hello ${user.username},</p>
          <p>Here's your new verification code:</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1e293b; font-size: 32px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
          </div>
          <p>This code will expire in 30 minutes.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #64748b; font-size: 12px;">Career Guidance & Development Cell</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Verification code resent to your email",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend verification code",
    });
  }
});

// Request password reset (send code)
routes.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const result = await db.query(
      "SELECT id, username, email FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if email exists or not (security)
      return res.json({
        success: true,
        message: "If the email exists, a reset code has been sent",
      });
    }

    const user = result.rows[0];

    // Generate 6-digit code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset code in database
    await db.query(
      `INSERT INTO password_resets (user_id, reset_code, expires_at) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) 
       DO UPDATE SET reset_code = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP`,
      [user.id, resetCode, expiresAt]
    );

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code - CGDC Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Password Reset Request</h2>
          <p>Hello ${user.username},</p>
          <p>You requested to reset your password. Use the code below to proceed:</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1e293b; font-size: 32px; letter-spacing: 8px; margin: 0;">${resetCode}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #64748b; font-size: 12px;">Career Guidance & Development Cell</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reset code",
    });
  }
});

// Verify reset code
routes.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and code are required",
      });
    }

    const result = await db.query(
      `SELECT pr.reset_code, pr.expires_at, u.id 
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.id
       WHERE u.email = $1 AND pr.reset_code = $2 AND pr.expires_at > NOW()`,
      [email, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    return res.json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Reset password
routes.post("/reset-password", async (req, res) => {
  const client = await db.connect();
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    await client.query("BEGIN");

    // Verify code again
    const result = await client.query(
      `SELECT pr.user_id 
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.id
       WHERE u.email = $1 AND pr.reset_code = $2 AND pr.expires_at > NOW()`,
      [email, code]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    const userId = result.rows[0].user_id;

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update password
    await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      password_hash,
      userId,
    ]);

    // Delete used reset code
    await client.query("DELETE FROM password_resets WHERE user_id = $1", [
      userId,
    ]);

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

// Get all users (admin only)
routes.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, email, role, is_active, last_login, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update user role/status (admin only)
routes.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    // Prevent users from editing their own account
    if (parseInt(id) === req.session.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot modify your own account",
      });
    }

    // Only admins can change roles
    if (role && req.session.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can modify user roles",
      });
    }

    if (role) {
      updates.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }

    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    values.push(id);

    const result = await db.query(
      `UPDATE users SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING id, username, email, role, is_active`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete user (admin only)
routes.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.session.userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING username",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = routes;

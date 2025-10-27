// Simple Authentication Middleware

const bcrypt = require("bcrypt");
const db = require("../db");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Authentication required",
  });
};

// Login handler
// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and password are required",
//       });
//     }

//     // Get user from database
//     const result = await db.query(
//       "SELECT id, username, password_hash, email, role, is_active FROM users WHERE username = $1",
//       [username]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const user = result.rows[0];

//     // Check if user is active
//     if (!user.is_active) {
//       return res.status(403).json({
//         success: false,
//         message: "Account is inactive",
//       });
//     }

//     // Verify password
//     const isValid = await bcrypt.compare(password, user.password_hash);

//     if (!isValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Check if user has pending role
//     if (user.role === "pending") {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Your account is pending approval. Please contact an administrator for access.",
//       });
//     }

//     // Update last login
//     await db.query(
//       "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
//       [user.id]
//     );

//     // Create session
//     req.session.userId = user.id;
//     req.session.username = user.username;
//     req.session.userRole = user.role;

//     return res.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

const login = async (req, res) => {
  try {
    let { username, password } = req.body;

    // Trim and normalize
    username = username?.trim();
    password = password?.trim();

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username or email and password are required",
      });
    }

    // Determine if input is email or username
    const isEmail = username.includes("@");

    // Query user by either username OR email
    const result = await db.query(
      `SELECT id, username, password_hash, email, role, is_active 
       FROM users 
       WHERE ${isEmail ? "LOWER(email)" : "username"} = LOWER($1)`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user has pending role
    if (user.role === "pending") {
      return res.status(403).json({
        success: false,
        message:
          "Your account is pending approval. Please contact an administrator for access.",
      });
    }

    // Update last login timestamp
    await db.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [user.id]
    );

    // Create session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.userRole = user.role;

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout handler
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
    res.clearCookie("connect.sid");
    return res.json({
      success: true,
      message: "Logout successful",
    });
  });
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const result = await db.query(
      "SELECT id, username, email, role, last_login FROM users WHERE id = $1",
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  isAuthenticated,
  login,
  logout,
  getCurrentUser,
};

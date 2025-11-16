const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const {
  isAuthenticated,
  login,
  logout,
  getCurrentUser,
} = require("./middleware/auth");

const students = require("./routes/students");
const batches = require("./routes/batches");
const companies = require("./routes/companies");
const forms = require("./routes/forms");
const events = require("./routes/events");
const round_tracking = require("./routes/round_tracking");
const emails = require("./routes/emails");
const eligibility = require("./routes/eligibility");
const offers = require("./routes/offers");
const users = require("./routes/users");
const student_analytics = require("./routes/student_analytics");

const app = express();

// Trust proxy - MUST be first
app.set("trust proxy", 1);

// CORS configuration - IMPORTANT: credentials must be true for sessions
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// Session middleware - MUST be before routes
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax", // Add this
    },
    proxy: true,
  })
);

// Health check endpoint (for debugging)
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// ============ PUBLIC ROUTES (No Authentication) ============
app.post("/api/auth/login", login);

// ============ AUTHENTICATED ROUTES ============
app.post("/api/auth/logout", isAuthenticated, logout);
app.get("/api/auth/me", isAuthenticated, getCurrentUser);

// ============ PROTECTED ROUTES ============
// All routes below require authentication

app.use("/api/students", isAuthenticated, students);
app.use("/api/batches", isAuthenticated, batches);
app.use("/api/companies", isAuthenticated, companies);
app.use("/api/forms", isAuthenticated, forms);
app.use("/api/events", isAuthenticated, events);
app.use("/api/round-tracking", isAuthenticated, round_tracking);
app.use("/api/emails", isAuthenticated, emails);
app.use("/api/eligibility", isAuthenticated, eligibility);
app.use("/api/offers", isAuthenticated, offers);
app.use("/api/student-analytics", student_analytics);

// ============ PUBLIC + AUTH ROUTES ============
app.use("/api/users", users); // NO isAuthenticated here!

//  ONLY for /api/* routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ===== Serve Next.js Static Export =====
const frontendPath = path.join(__dirname, "../frontend/out");

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(frontendPath));

// Catch-all for Next.js pages
app.get("*", (req, res) => {
  let requestedPath = req.path;

  // Remove trailing slash for processing (Next.js adds it back)
  const cleanPath = requestedPath.replace(/\/$/, "") || "/";

  // Try different file locations in order
  const possiblePaths = [
    path.join(frontendPath, cleanPath, "index.html"), // /page/helloworld/index.html
    path.join(frontendPath, cleanPath + ".html"), // /page/helloworld.html
    path.join(frontendPath, requestedPath, "index.html"), // with trailing slash
    path.join(frontendPath, requestedPath + "index.html"), // edge case
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  // Fallback to 404.html or root index.html
  const notFoundPage = path.join(frontendPath, "404.html");
  if (fs.existsSync(notFoundPage)) {
    return res.status(404).sendFile(notFoundPage);
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

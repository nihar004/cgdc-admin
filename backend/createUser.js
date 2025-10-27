// Script to manually create users in the database
// Usage: node createUser.js <username> <password> <email> <role>
// e.g., node createUser.js admin admin123 admin@college.edu admin

const bcrypt = require("bcrypt");
const db = require("./db");
require("dotenv").config();

async function createUser(username, password, email, role) {
  try {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = await db.query(
      `INSERT INTO users (username, password_hash, email, role, is_active) 
             VALUES ($1, $2, $3, $4, TRUE) 
             RETURNING id, username, email, role, created_at`,
      [username, passwordHash, email, role]
    );

    console.log("✅ User created successfully:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`ID:       ${result.rows[0].id}`);
    console.log(`Username: ${result.rows[0].username}`);
    console.log(`Email:    ${result.rows[0].email}`);
    console.log(`Role:     ${result.rows[0].role}`);
    console.log(`Created:  ${result.rows[0].created_at}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🔑 Login Credentials:");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    if (error.code === "23505") {
      console.error("❌ Error: Username or email already exists");
    } else {
      console.error("❌ Error creating user:", error.message);
    }
  } finally {
    await db.end();
  }
}

// Run this script from command line with arguments
const args = process.argv.slice(2);

if (args.length < 4) {
  console.log("Usage: node createUser.js <username> <password> <email> <role>");
  console.log("\nRoles: admin, placement_officer, faculty");
  console.log("\nExamples:");
  console.log("  node createUser.js admin admin123 admin@college.edu admin");
  console.log(
    "  node createUser.js officer01 pass123 officer@college.edu placement_officer"
  );
  console.log(
    "  node createUser.js prof_john prof123 john@college.edu faculty"
  );
  process.exit(1);
}

const [username, password, email, role] = args;
const validRoles = ["admin", "placement_officer", "faculty"];

if (!validRoles.includes(role)) {
  console.error(`❌ Invalid role. Must be one of: ${validRoles.join(", ")}`);
  process.exit(1);
}

createUser(username, password, email, role);

const express = require("express");
const routes = express.Router();
const db = require("../db");
const {
  calculateEligibleStudents,
  getCompanyEligibility,
  getCompanyEligibilityWithStudents,
  manuallyAddEligibleStudent,
  removeManuallyAddedStudent,
} = require("../services/eligibilityService");

/**
 * Helper function to get batch ID from year
 */
async function getBatchIdFromYear(year) {
  const query = `SELECT id FROM batches WHERE year = $1`;
  const result = await db.query(query, [parseInt(year)]);

  if (result.rows.length === 0) {
    throw new Error(`Batch not found for year ${year}`);
  }

  return result.rows[0].id;
}

/**
 * GET /api/eligibility/:companyId/:batchYear
 * Get company eligibility record (without full student details)
 */
routes.get("/:companyId/:batchYear", async (req, res) => {
  try {
    const { companyId, batchYear } = req.params;
    const batchId = await getBatchIdFromYear(batchYear);

    const eligibility = await getCompanyEligibility(
      db,
      parseInt(companyId),
      batchId
    );

    if (!eligibility) {
      return res.status(404).json({
        error: "No eligibility record found for this company-batch combination",
      });
    }

    res.json(eligibility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/eligibility/:companyId/:batchYear/details
 * Get company eligibility with full student details (joined with students table)
 */
routes.get("/:companyId/:batchYear/details", async (req, res) => {
  try {
    const { companyId, batchYear } = req.params;
    const batchId = await getBatchIdFromYear(batchYear);

    const eligibility = await getCompanyEligibilityWithStudents(
      db,
      parseInt(companyId),
      batchId
    );

    if (!eligibility) {
      return res.status(404).json({
        error: "No eligibility record found for this company-batch combination",
      });
    }

    res.json(eligibility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/eligibility/:companyId/:batchYear/calculate
 * Calculate and set initial eligible students
 */
routes.post("/:companyId/:batchYear/calculate", async (req, res) => {
  try {
    const { companyId, batchYear } = req.params;
    const batchId = await getBatchIdFromYear(batchYear);

    // const { eligibleStudents, criteria } = await calculateEligibleStudents(
    //   db,
    //   parseInt(companyId),
    //   batchId
    // );

    const { eligibleStudents, placedStudents, ineligibleStudents, criteria } =
      await calculateEligibleStudents(db, parseInt(companyId), batchId);

    // const ineligibleQuery = `
    //   SELECT id FROM students WHERE batch_year = $1
    // `;
    // const allStudents = await db.query(ineligibleQuery, [parseInt(batchYear)]);
    // const eligibleIds = new Set(eligibleStudents);
    // const ineligibleIds = allStudents.rows
    //   .map((s) => s.id)
    //   .filter((id) => !eligibleIds.has(id));

    // const insertQuery = `
    //   INSERT INTO company_eligibility
    //     (company_id, batch_id, eligible_student_ids, ineligible_student_ids,
    //      dream_company_student_ids, total_eligible_count, total_ineligible_count,
    //      eligibility_criteria)
    //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    //   ON CONFLICT (company_id, batch_id)
    //   DO UPDATE SET
    //     eligible_student_ids = $3,
    //     ineligible_student_ids = $4,
    //     total_eligible_count = $6,
    //     total_ineligible_count = $7,
    //     updated_at = CURRENT_TIMESTAMP
    //   RETURNING *
    // `;

    // await db.query(insertQuery, [
    //   companyId,
    //   batchId,
    //   JSON.stringify(eligibleStudents),
    //   JSON.stringify(ineligibleIds),
    //   JSON.stringify([]),
    //   eligibleStudents.length,
    //   ineligibleIds.length,
    //   JSON.stringify(criteria),
    // ]);

    const insertQuery = `
      INSERT INTO company_eligibility 
        (company_id, batch_id, eligible_student_ids, placed_student_ids, ineligible_student_ids, 
        dream_company_student_ids, total_eligible_count, total_placed_count, total_ineligible_count, 
        eligibility_criteria)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (company_id, batch_id) 
      DO UPDATE SET 
        eligible_student_ids = $3,
        placed_student_ids = $4,
        ineligible_student_ids = $5,
        total_eligible_count = $7,
        total_placed_count = $8,
        total_ineligible_count = $9,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    await db.query(insertQuery, [
      companyId,
      batchId,
      JSON.stringify(eligibleStudents),
      JSON.stringify(placedStudents),
      JSON.stringify(ineligibleStudents),
      JSON.stringify([]),
      eligibleStudents.length,
      placedStudents.length,
      ineligibleStudents.length,
      JSON.stringify(criteria),
    ]);

    // res.json({
    //   success: true,
    //   message: "Initial eligibility calculated",
    //   eligible_count: eligibleStudents.length,
    //   ineligible_count: ineligibleIds.length,
    // });
    res.json({
      success: true,
      message: "Initial eligibility calculated",
      eligible_count: eligibleStudents.length,
      placed_count: placedStudents.length,
      ineligible_count: ineligibleStudents.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// /**
//  * PUT /api/eligibility/:companyId/:batchYear/students/:studentId
//  * Update student status (e.g., mark/unmark dream company usage)
//  */
routes.put("/:companyId/:batchYear/students/:studentId", async (req, res) => {
  try {
    const { companyId, batchYear, studentId } = req.params;
    const { action, type } = req.body;
    // action = "add" | "remove"
    // type = "dream" | "upgrade" (only when action = "add")

    const batchId = await getBatchIdFromYear(batchYear);
    const sid = parseInt(studentId);

    // Fetch student upgrade counters & dream-used flag
    const stuResult = await db.query(
      `SELECT upgrade_opportunities_used, dream_company_used
       FROM students WHERE id = $1`,
      [sid]
    );

    if (stuResult.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });

    const student = stuResult.rows[0];

    // Fetch eligibility record
    const getQuery = `
      SELECT eligible_student_ids, placed_student_ids, ineligible_student_ids,
             dream_company_student_ids, manual_override_reasons
      FROM company_eligibility
      WHERE company_id = $1 AND batch_id = $2
    `;

    const recResult = await db.query(getQuery, [companyId, batchId]);
    if (recResult.rows.length === 0) {
      return res.status(404).json({ error: "Eligibility record not found" });
    }

    const record = recResult.rows[0];

    let eligible = record.eligible_student_ids || [];
    let placed = record.placed_student_ids || [];
    let ineligible = record.ineligible_student_ids || [];
    let dreamIds = record.dream_company_student_ids || [];
    let manualReasons = record.manual_override_reasons || {};

    const sidStr = sid.toString();

    // -------------------------------------------------------
    // ACTION = ADD  (dream or upgrade)
    // -------------------------------------------------------
    if (action === "add") {
      if (!placed.includes(sid)) {
        return res.status(400).json({ error: "Student is not in placed list" });
      }

      if (type === "dream") {
        if (student.dream_company_used) {
          return res.status(400).json({ error: "Dream already used globally" });
        }

        // Move placed → eligible
        placed = placed.filter((x) => x !== sid);
        if (!eligible.includes(sid)) eligible.push(sid);
        if (!dreamIds.includes(sid)) dreamIds.push(sid);

        // Set manual reason
        manualReasons[sidStr] = { reason: "used_dream", from: "placed" };

        // Update student table
        await db.query(
          `UPDATE students SET dream_company_used = true WHERE id = $1`,
          [sid]
        );
      } else if (type === "upgrade") {
        if (student.upgrade_opportunities_used >= 3) {
          return res.status(400).json({
            error: "Maximum upgrade opportunities used (3)",
          });
        }

        // Move placed → eligible
        placed = placed.filter((x) => x !== sid);
        if (!eligible.includes(sid)) eligible.push(sid);

        // Set manual reason
        manualReasons[sidStr] = { reason: "used_upgrade", from: "placed" };

        // Increment upgrade counter
        await db.query(
          `UPDATE students
           SET upgrade_opportunities_used = upgrade_opportunities_used + 1
           WHERE id = $1`,
          [sid]
        );
      }

      // Update eligibility table
      await db.query(
        `UPDATE company_eligibility
         SET eligible_student_ids = $3,
             placed_student_ids = $4,
             ineligible_student_ids = $5,
             dream_company_student_ids = $6,
             manual_override_reasons = $7,
             total_eligible_count = $8,
             total_placed_count = $9,
             total_ineligible_count = $10,
             updated_at = NOW()
         WHERE company_id = $1 AND batch_id = $2`,
        [
          companyId,
          batchId,
          JSON.stringify(eligible),
          JSON.stringify(placed),
          JSON.stringify(ineligible),
          JSON.stringify(dreamIds),
          JSON.stringify(manualReasons),
          eligible.length,
          placed.length,
          ineligible.length,
        ]
      );

      return res.json({
        success: true,
        message: `Student added using ${type}`,
      });
    }

    // -------------------------------------------------------
    // ACTION = REMOVE (detect reason automatically)
    // -------------------------------------------------------
    if (action === "remove") {
      if (!manualReasons[sidStr]) {
        return res.status(400).json({
          error: "Student was not added via dream or upgrade",
        });
      }

      const reason = manualReasons[sidStr].reason;

      // Remove from eligible
      eligible = eligible.filter((x) => x !== sid);
      delete manualReasons[sidStr];

      if (reason === "used_dream") {
        dreamIds = dreamIds.filter((x) => x !== sid);

        // Move back to placed
        if (!placed.includes(sid)) placed.push(sid);

        // Reset global dream flag
        await db.query(
          `UPDATE students SET dream_company_used = false WHERE id = $1`,
          [sid]
        );
      } else if (reason === "used_upgrade") {
        // Move back to placed
        if (!placed.includes(sid)) placed.push(sid);

        // Decrement upgrade count
        await db.query(
          `UPDATE students
           SET upgrade_opportunities_used = GREATEST(upgrade_opportunities_used - 1, 0)
           WHERE id = $1`,
          [sid]
        );
      }

      // Save updated state
      await db.query(
        `UPDATE company_eligibility
         SET eligible_student_ids = $3,
             placed_student_ids = $4,
             ineligible_student_ids = $5,
             dream_company_student_ids = $6,
             manual_override_reasons = $7,
             total_eligible_count = $8,
             total_placed_count = $9,
             total_ineligible_count = $10,
             updated_at = NOW()
         WHERE company_id = $1 AND batch_id = $2`,
        [
          companyId,
          batchId,
          JSON.stringify(eligible),
          JSON.stringify(placed),
          JSON.stringify(ineligible),
          JSON.stringify(dreamIds),
          JSON.stringify(manualReasons),
          eligible.length,
          placed.length,
          ineligible.length,
        ]
      );

      return res.json({
        success: true,
        message: `Student removed from ${reason}`,
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /api/eligibility/manual/:companyId/:batchYear/students/:studentId
 * Add or remove a manually added student
 * Body: { action: "add" | "remove", reason?: "string" }
 */
routes.put(
  "/manual/:companyId/:batchYear/students/:studentId",
  async (req, res) => {
    try {
      const { companyId, batchYear, studentId } = req.params;
      const { action, reason } = req.body;

      if (!action || !["add", "remove"].includes(action)) {
        return res.status(400).json({
          error: "Action is required and must be 'add' or 'remove'.",
        });
      }

      // Get batchId using helper
      const batchId = await getBatchIdFromYear(batchYear);

      let result;

      if (action === "add") {
        if (!reason || reason.trim().length === 0) {
          return res.status(400).json({
            error: "Reason is required for manual eligibility override.",
          });
        }

        result = await manuallyAddEligibleStudent(
          db,
          parseInt(companyId),
          batchId,
          parseInt(studentId),
          reason
        );
      } else {
        // action === "remove"
        result = await removeManuallyAddedStudent(
          db,
          parseInt(companyId),
          batchId,
          parseInt(studentId)
        );
      }

      if (!result.success) {
        return res.status(400).json({
          error: result.message,
        });
      }

      res.json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Error in manual eligibility route:", error);
      res.status(500).json({
        error: error.message || "Internal server error.",
      });
    }
  }
);

// GET /eligibility/companies/:companyId/batch/:batchYear/email-targets/eligible-only
routes.get(
  "/companies/:companyId/batch/:batchYear/email-targets/eligible-only",
  async (req, res) => {
    const { companyId, batchYear } = req.params;

    try {
      if (!companyId || isNaN(companyId)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      if (!batchYear || isNaN(batchYear)) {
        return res.status(400).json({ error: "Invalid batch year" });
      }

      // Get batch ID from batch year
      const batchResult = await db.query(
        "SELECT id FROM batches WHERE year = $1",
        [parseInt(batchYear)]
      );

      if (batchResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Batch not found for the given year",
          students: [],
          student_ids: [],
        });
      }

      const batchId = batchResult.rows[0].id;

      const eligibilityQuery = `
      SELECT 
        eligible_student_ids
      FROM company_eligibility
      WHERE company_id = $1 AND batch_id = $2
    `;

      const eligibilityResult = await db.query(eligibilityQuery, [
        companyId,
        batchId,
      ]);

      if (eligibilityResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No eligibility record found",
          students: [],
          student_ids: [],
        });
      }

      const eligibleIds = eligibilityResult.rows[0].eligible_student_ids || [];

      if (eligibleIds.length === 0) {
        return res.json({
          success: true,
          students: [],
          student_ids: [],
          total_count: 0,
        });
      }

      const query = `
      SELECT 
        s.id,
        s.full_name,
        s.college_email
      FROM students s
      WHERE s.id = ANY($1::int[])
        AND s.college_email IS NOT NULL
      ORDER BY s.full_name 
    `;

      const result = await db.query(query, [eligibleIds]);

      const students = result.rows.map((student) => ({
        id: student.id,
        full_name: student.full_name,
        college_email: student.college_email,
      }));

      res.json({
        success: true,
        company_id: parseInt(companyId),
        batch_year: parseInt(batchYear),
        batch_id: batchId,
        students: students,
        student_ids: students.map((s) => s.id),
        total_count: students.length,
      });
    } catch (error) {
      console.error("Error fetching eligible students:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch eligible students",
        details: error.message,
      });
    }
  }
);

// GET /eligibility/companies/:companyId/batch/:batchYear/email-targets/dream-only
routes.get(
  "/companies/:companyId/batch/:batchYear/email-targets/dream-only",
  async (req, res) => {
    const { companyId, batchYear } = req.params;

    try {
      if (!companyId || isNaN(companyId)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      if (!batchYear || isNaN(batchYear)) {
        return res.status(400).json({ error: "Invalid batch year" });
      }

      // Get batch ID from batch year
      const batchResult = await db.query(
        "SELECT id FROM batches WHERE year = $1",
        [parseInt(batchYear)]
      );

      if (batchResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Batch not found for the given year",
          students: [],
          student_ids: [],
        });
      }

      const batchId = batchResult.rows[0].id;

      const eligibilityQuery = `
        SELECT 
          placed_student_ids,
          dream_company_student_ids
        FROM company_eligibility
        WHERE company_id = $1 AND batch_id = $2
      `;

      const eligibilityResult = await db.query(eligibilityQuery, [
        companyId,
        batchId,
      ]);

      if (eligibilityResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No eligibility record found",
          students: [],
          student_ids: [],
        });
      }

      const placedIds = eligibilityResult.rows[0].placed_student_ids || [];
      const dreamCompanyIds =
        eligibilityResult.rows[0].dream_company_student_ids || [];

      // Find placed students who haven't used dream company
      const dreamOpportunityIds = placedIds.filter(
        (id) => !dreamCompanyIds.includes(id)
      );

      if (dreamOpportunityIds.length === 0) {
        return res.json({
          success: true,
          students: [],
          student_ids: [],
          total_count: 0,
        });
      }

      // No package constraint for dream company - just check if placed and haven't used it
      const query = `
        SELECT 
          s.id,
          s.full_name,
          s.college_email
        FROM students s
        WHERE s.id = ANY($1::int[])
          AND s.college_email IS NOT NULL
          AND s.placement_status = 'placed'
          AND s.dream_opportunity_used = false
        ORDER BY s.full_name
      `;

      const result = await db.query(query, [dreamOpportunityIds]);

      const students = result.rows.map((student) => ({
        id: student.id,
        full_name: student.full_name,
        college_email: student.college_email,
      }));

      res.json({
        success: true,
        company_id: parseInt(companyId),
        batch_year: parseInt(batchYear),
        batch_id: batchId,
        students: students,
        student_ids: students.map((s) => s.id),
        total_count: students.length,
      });
    } catch (error) {
      console.error("Error fetching dream opportunity students:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch dream opportunity students",
        details: error.message,
      });
    }
  }
);

// NEW: GET /eligibility/companies/:companyId/batch/:batchYear/email-targets/upgrade-only
routes.get(
  "/companies/:companyId/batch/:batchYear/email-targets/upgrade-only",
  async (req, res) => {
    const { companyId, batchYear } = req.params;

    try {
      if (!companyId || isNaN(companyId)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      if (!batchYear || isNaN(batchYear)) {
        return res.status(400).json({ error: "Invalid batch year" });
      }

      // Get batch ID from batch year
      const batchResult = await db.query(
        "SELECT id FROM batches WHERE year = $1",
        [parseInt(batchYear)]
      );

      if (batchResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Batch not found for the given year",
          students: [],
          student_ids: [],
        });
      }

      const batchId = batchResult.rows[0].id;

      const eligibilityQuery = `
        SELECT 
          placed_student_ids
        FROM company_eligibility
        WHERE company_id = $1 AND batch_id = $2
      `;

      const eligibilityResult = await db.query(eligibilityQuery, [
        companyId,
        batchId,
      ]);

      if (eligibilityResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No eligibility record found",
          students: [],
          student_ids: [],
        });
      }

      const placedIds = eligibilityResult.rows[0].placed_student_ids || [];

      if (placedIds.length === 0) {
        return res.json({
          success: true,
          students: [],
          student_ids: [],
          total_count: 0,
        });
      }

      // Get student details with package info using proper joins
      const query = `
        SELECT 
          s.id,
          s.full_name,
          s.college_email,
          s.upgrade_opportunities_used,
          cp.package AS package
        FROM students s
        LEFT JOIN company_positions cp
          ON cp.id = (s.current_offer->>'position_id')::int
        WHERE s.id = ANY($1::int[])
          AND s.college_email IS NOT NULL
          AND s.placement_status = 'placed'
          AND cp.package IS NOT NULL
          AND cp.package <= 6
          AND COALESCE(s.upgrade_opportunities_used, 0) < 3
        ORDER BY s.full_name
      `;

      const result = await db.query(query, [placedIds]);

      const students = result.rows.map((student) => ({
        id: student.id,
        full_name: student.full_name,
        college_email: student.college_email,
      }));

      res.json({
        success: true,
        company_id: parseInt(companyId),
        batch_year: parseInt(batchYear),
        batch_id: batchId,
        students: students,
        student_ids: students.map((s) => s.id),
        total_count: students.length,
      });
    } catch (error) {
      console.error("Error fetching upgrade opportunity students:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch upgrade opportunity students",
        details: error.message,
      });
    }
  }
);

module.exports = routes;

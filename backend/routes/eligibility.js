const express = require("express");
const routes = express.Router();
const db = require("../db");
const {
  calculateEligibleStudents,
  isStudentEligible,
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

    const { eligibleStudents, criteria } = await calculateEligibleStudents(
      db,
      parseInt(companyId),
      batchId
    );

    const ineligibleQuery = `
      SELECT id FROM students WHERE batch_year = $1
    `;
    const allStudents = await db.query(ineligibleQuery, [parseInt(batchYear)]);
    const eligibleIds = new Set(eligibleStudents);
    const ineligibleIds = allStudents.rows
      .map((s) => s.id)
      .filter((id) => !eligibleIds.has(id));

    const insertQuery = `
      INSERT INTO company_eligibility 
        (company_id, batch_id, eligible_student_ids, ineligible_student_ids, 
         dream_company_student_ids, total_eligible_count, total_ineligible_count, 
         eligibility_criteria)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (company_id, batch_id) 
      DO UPDATE SET 
        eligible_student_ids = $3,
        ineligible_student_ids = $4,
        total_eligible_count = $6,
        total_ineligible_count = $7,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    await db.query(insertQuery, [
      companyId,
      batchId,
      JSON.stringify(eligibleStudents),
      JSON.stringify(ineligibleIds),
      JSON.stringify([]),
      eligibleStudents.length,
      ineligibleIds.length,
      JSON.stringify(criteria),
    ]);

    res.json({
      success: true,
      message: "Initial eligibility calculated",
      eligible_count: eligibleStudents.length,
      ineligible_count: ineligibleIds.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/eligibility/:companyId/:batchYear/students/:studentId
 * Update student status (e.g., mark/unmark dream company usage)
 */
routes.put("/:companyId/:batchYear/students/:studentId", async (req, res) => {
  try {
    const { companyId, batchYear, studentId } = req.params;
    const { action } = req.body; // 'add' or 'remove'
    const batchId = await getBatchIdFromYear(batchYear);

    // Validate student eligibility before proceeding
    const { isEligible, dreamCompanyUsed } = await isStudentEligible(
      db,
      parseInt(companyId),
      parseInt(studentId)
    );

    if (action === "add") {
      // For dream company add, we allow ineligible students
      // But we check they haven't already used it globally
      if (dreamCompanyUsed) {
        return res.status(400).json({
          error: "Student has already used dream company globally",
        });
      }
    }

    const getQuery = `
      SELECT eligible_student_ids, ineligible_student_ids, dream_company_student_ids, 
             total_eligible_count, total_ineligible_count
      FROM company_eligibility
      WHERE company_id = $1 AND batch_id = $2
    `;
    const getResult = await db.query(getQuery, [companyId, batchId]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({ error: "Eligibility record not found" });
    }

    const record = getResult.rows[0];
    let eligibleIds = record.eligible_student_ids || [];
    let ineligibleIds = record.ineligible_student_ids || [];
    let dreamCompanyIds = record.dream_company_student_ids || [];

    if (action === "add") {
      if (!ineligibleIds.includes(parseInt(studentId))) {
        return res
          .status(400)
          .json({ error: "Student not in ineligible list" });
      }

      ineligibleIds = ineligibleIds.filter((id) => id !== parseInt(studentId));
      if (!eligibleIds.includes(parseInt(studentId))) {
        eligibleIds.push(parseInt(studentId));
      }
      if (!dreamCompanyIds.includes(parseInt(studentId))) {
        dreamCompanyIds.push(parseInt(studentId));
      }

      // Update student's dream_company_used flag globally
      const updateStudentQuery = `
        UPDATE students 
        SET dream_company_used = true 
        WHERE id = $1
      `;
      await db.query(updateStudentQuery, [studentId]);
    } else if (action === "remove") {
      if (!eligibleIds.includes(parseInt(studentId))) {
        return res.status(400).json({ error: "Student not in eligible list" });
      }

      // Check if this student is in dreamCompanyIds
      if (!dreamCompanyIds.includes(parseInt(studentId))) {
        return res.status(400).json({
          error: "Student was not added via dream company",
        });
      }

      dreamCompanyIds = dreamCompanyIds.filter(
        (id) => id !== parseInt(studentId)
      );

      // Move student back to ineligible
      eligibleIds = eligibleIds.filter((id) => id !== parseInt(studentId));
      if (!ineligibleIds.includes(parseInt(studentId))) {
        ineligibleIds.push(parseInt(studentId));
      }

      // Update student's dream_company_used flag globally back to false
      const updateStudentQuery = `
        UPDATE students 
        SET dream_company_used = false 
        WHERE id = $1
      `;
      await db.query(updateStudentQuery, [studentId]);
    } else {
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'add' or 'remove'" });
    }

    const updateQuery = `
      UPDATE company_eligibility
      SET eligible_student_ids = $1,
          ineligible_student_ids = $2,
          dream_company_student_ids = $3,
          total_eligible_count = $4,
          total_ineligible_count = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE company_id = $6 AND batch_id = $7
      RETURNING *
    `;

    await db.query(updateQuery, [
      JSON.stringify(eligibleIds),
      JSON.stringify(ineligibleIds),
      JSON.stringify(dreamCompanyIds),
      eligibleIds.length,
      ineligibleIds.length,
      companyId,
      batchId,
    ]);

    res.json({
      success: true,
      message:
        action === "add"
          ? `Student added via dream company`
          : `Student removed from dream company`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
        eligible_student_ids,
        dream_company_student_ids,
        manual_override_reasons
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
      const dreamCompanyIds =
        eligibilityResult.rows[0].dream_company_student_ids || [];
      const manualReasons =
        eligibilityResult.rows[0].manual_override_reasons || {};

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
        ineligible_student_ids,
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

      const ineligibleIds =
        eligibilityResult.rows[0].ineligible_student_ids || [];
      const dreamCompanyIds =
        eligibilityResult.rows[0].dream_company_student_ids || [];

      // Find ineligible students who haven't used dream company
      const dreamOpportunityIds = ineligibleIds.filter(
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

module.exports = routes;

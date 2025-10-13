const express = require("express");
const routes = express.Router();
const db = require("../db");
const {
  calculateEligibleStudents,
  isStudentEligible,
  getCompanyEligibility,
  getCompanyEligibilityWithStudents,
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

module.exports = routes;

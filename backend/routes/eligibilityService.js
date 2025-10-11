// eligibilityService.js

/**
 * Calculate eligible students for a company based on eligibility criteria
 * @param {Object} db - Database connection pool
 * @param {number} companyId - Company ID
 * @param {number} batchId - Batch ID
 * @returns {Object} - { eligibleStudents: Array, totalCount: number, criteria: Object }
 */
async function calculateEligibleStudents(db, companyId, batchId) {
  try {
    // Step 1: Fetch company eligibility criteria
    const companyQuery = `
      SELECT 
        min_cgpa,
        max_backlogs,
        allowed_specializations,
        sector,
        ps_type
      FROM companies 
      WHERE id = $1
    `;
    const companyResult = await db.query(companyQuery, [companyId]);

    if (companyResult.rows.length === 0) {
      throw new Error(`Company with ID ${companyId} not found`);
    }

    const company = companyResult.rows[0];

    // Step 2: Fetch batch year
    const batchQuery = `SELECT year FROM batches WHERE id = $1`;
    const batchResult = await db.query(batchQuery, [batchId]);

    if (batchResult.rows.length === 0) {
      throw new Error(`Batch with ID ${batchId} not found`);
    }

    const batchYear = batchResult.rows[0].year;

    // Step 3: Build eligibility query
    const eligibilityQuery = `
      SELECT 
        s.id as student_id,
        s.registration_number,
        s.enrollment_number,
        CONCAT(s.first_name, ' ', s.last_name) as full_name,
        s.branch,
        s.batch_year,
        s.cgpa,
        s.backlogs,
        s.department,
        s.placement_status,
        s.drives_skipped,
        s.dream_company_used,
        s.upgrade_opportunities_used,
        s.current_offer,
        s.PS2_company_name
      FROM students s
      WHERE 
        s.batch_year = $1
        AND s.placement_status IN ('eligible', 'unplaced')
        AND s.cgpa >= $2
        AND s.backlogs <= $3
        AND s.drives_skipped < 3
        AND s.PS2_company_name IS NOT NULL
        AND s.PS2_company_name != ''
    `;

    const params = [
      batchYear,
      company.min_cgpa || 0,
      company.max_backlogs || 999,
    ];
    const studentsResult = await db.query(eligibilityQuery, params);

    // Step 4: Apply additional filtering logic
    const eligibleStudents = studentsResult.rows.filter((student) => {
      // Check allowed specializations if specified
      if (
        company.allowed_specializations &&
        company.allowed_specializations.length > 0 &&
        !company.allowed_specializations.includes(student.branch)
      ) {
        return false;
      }

      // Check if student has already used dream company opportunity
      // (assuming marquee companies count as dream companies)
      if (student.dream_company_used && company.sector === "dream_sector") {
        return false;
      }

      // Check package upgrade opportunities
      if (student.current_offer) {
        const currentPackage = student.current_offer.package || 0;

        // If student has package <= 6L, they can use up to 3 upgrade opportunities
        if (
          currentPackage <= 600000 &&
          student.upgrade_opportunities_used >= 3
        ) {
          return false;
        }

        // If student has package > 6L, they cannot upgrade
        if (currentPackage > 600000) {
          return false;
        }
      }

      return true;
    });

    // Step 5: Format eligible students data for JSON storage
    const formattedStudents = eligibleStudents.map((student) => ({
      student_id: student.student_id,
      registration_number: student.registration_number,
      enrollment_number: student.enrollment_number,
      full_name: student.full_name,
      branch: student.branch,
      batch_year: student.batch_year,
    }));

    // Step 6: Return results with criteria used
    return {
      eligibleStudents: formattedStudents,
      totalCount: formattedStudents.length,
      criteria: {
        min_cgpa: company.min_cgpa,
        max_backlogs: company.max_backlogs,
        allowed_specializations: company.allowed_specializations,
        sector: company.sector,
        ps_type: company.ps_type,
        batch_year: batchYear,
        calculated_at: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error calculating eligible students:", error);
    throw error;
  }
}

/**
 * Get or create company eligible students snapshot
 * This function checks if a snapshot exists, if not creates one
 * @param {Object} db - Database connection pool
 * @param {number} companyId - Company ID
 * @param {number} batchId - Batch ID
 * @param {boolean} forceRecalculate - Force recalculation even if snapshot exists
 * @returns {Object} - Eligible students data
 */
async function getOrCreateEligibleStudentsSnapshot(
  db,
  companyId,
  batchId,
  forceRecalculate = false
) {
  try {
    // Check if snapshot already exists
    if (!forceRecalculate) {
      const snapshotQuery = `
        SELECT 
          eligible_students,
          total_count,
          eligibility_criteria,
          snapshot_date
        FROM company_eligible_students
        WHERE company_id = $1 AND batch_id = $2 AND is_active = true
      `;

      const snapshotResult = await db.query(snapshotQuery, [
        companyId,
        batchId,
      ]);

      if (snapshotResult.rows.length > 0) {
        console.log(
          `Using existing eligibility snapshot for company ${companyId}, batch ${batchId}`
        );
        return {
          eligibleStudents: snapshotResult.rows[0].eligible_students,
          totalCount: snapshotResult.rows[0].total_count,
          criteria: snapshotResult.rows[0].eligibility_criteria,
          snapshotDate: snapshotResult.rows[0].snapshot_date,
          isNew: false,
        };
      }
    }

    // Calculate eligible students
    console.log(
      `Calculating new eligibility snapshot for company ${companyId}, batch ${batchId}`
    );
    const { eligibleStudents, totalCount, criteria } =
      await calculateEligibleStudents(db, companyId, batchId);

    // If forceRecalculate, deactivate old snapshot
    if (forceRecalculate) {
      await db.query(
        `UPDATE company_eligible_students 
         SET is_active = false 
         WHERE company_id = $1 AND batch_id = $2`,
        [companyId, batchId]
      );
    }

    // Save snapshot to database
    const insertQuery = `
      INSERT INTO company_eligible_students (
        company_id,
        batch_id,
        eligible_students,
        total_count,
        eligibility_criteria,
        snapshot_trigger,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING id, snapshot_date
    `;

    const insertResult = await db.query(insertQuery, [
      companyId,
      batchId,
      JSON.stringify(eligibleStudents),
      totalCount,
      JSON.stringify(criteria),
      forceRecalculate ? "manual_recalculation" : "auto_created",
    ]);

    console.log(
      `Created eligibility snapshot with ID ${insertResult.rows[0].id}`
    );

    return {
      eligibleStudents,
      totalCount,
      criteria,
      snapshotDate: insertResult.rows[0].snapshot_date,
      isNew: true,
    };
  } catch (error) {
    console.error("Error getting/creating eligible students snapshot:", error);
    throw error;
  }
}

/**
 * Check if a specific student is in the eligible students list
 * @param {Object} db - Database connection pool
 * @param {number} companyId - Company ID
 * @param {number} batchId - Batch ID
 * @param {number} studentId - Student ID to check
 * @returns {boolean} - True if student is eligible
 */
async function isStudentEligible(db, companyId, batchId, studentId) {
  try {
    const query = `
      SELECT eligible_students
      FROM company_eligible_students
      WHERE company_id = $1 AND batch_id = $2 AND is_active = true
    `;

    const result = await db.query(query, [companyId, batchId]);

    if (result.rows.length === 0) {
      // No snapshot exists, calculate on the fly
      const { eligibleStudents } = await getOrCreateEligibleStudentsSnapshot(
        db,
        companyId,
        batchId
      );
      return eligibleStudents.some((s) => s.student_id === studentId);
    }

    const eligibleStudents = result.rows[0].eligible_students;
    return eligibleStudents.some((s) => s.student_id === studentId);
  } catch (error) {
    console.error("Error checking student eligibility:", error);
    throw error;
  }
}

/**
 * Get eligible students count without full data
 * @param {Object} db - Database connection pool
 * @param {number} companyId - Company ID
 * @param {number} batchId - Batch ID
 * @returns {number} - Count of eligible students
 */
async function getEligibleStudentsCount(db, companyId, batchId) {
  try {
    const query = `
      SELECT total_count
      FROM company_eligible_students
      WHERE company_id = $1 AND batch_id = $2 AND is_active = true
    `;

    const result = await db.query(query, [companyId, batchId]);

    if (result.rows.length === 0) {
      const { totalCount } = await getOrCreateEligibleStudentsSnapshot(
        db,
        companyId,
        batchId
      );
      return totalCount;
    }

    return result.rows[0].total_count;
  } catch (error) {
    console.error("Error getting eligible students count:", error);
    throw error;
  }
}

module.exports = {
  calculateEligibleStudents,
  getOrCreateEligibleStudentsSnapshot,
  isStudentEligible,
  getEligibleStudentsCount,
};

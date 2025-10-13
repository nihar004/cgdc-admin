// Calculate eligible students based on company criteria -- initial eligibility calculation
async function calculateEligibleStudents(db, companyId, batchId) {
  try {
    const companyQuery = `
      SELECT 
        is_marquee, 
        min_cgpa,
        max_backlogs,
        allowed_specializations
      FROM companies 
      WHERE id = $1
    `;
    const companyResult = await db.query(companyQuery, [companyId]);

    if (companyResult.rows.length === 0) {
      throw new Error(`Company with ID ${companyId} not found`);
    }

    const company = companyResult.rows[0];

    const batchQuery = `SELECT year FROM batches WHERE id = $1`;
    const batchResult = await db.query(batchQuery, [batchId]);

    if (batchResult.rows.length === 0) {
      throw new Error(`Batch with ID ${batchId} not found`);
    }

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
        s.current_offer,
        s.upgrade_opportunities_used
      FROM students s
      WHERE 
        s.batch_year = $1
        AND s.placement_status IN ('placed', 'unplaced')
        AND s.cgpa >= $2
        AND s.backlogs <= $3
    `;

    const params = [
      batchResult.rows[0].year,
      company.min_cgpa || 0,
      company.max_backlogs || 999,
    ];

    const studentsResult = await db.query(eligibilityQuery, params);

    const eligibleStudents = studentsResult.rows.filter((student) => {
      // Check branch/specialization eligibility
      if (
        company.allowed_specializations &&
        company.allowed_specializations.length > 0 &&
        !company.allowed_specializations.includes(student.branch)
      ) {
        return false;
      }

      // If unplaced, eligible to sit (passes CGPA, backlogs, branch check)
      if (student.placement_status === "unplaced") {
        return true;
      }

      // Student is placed - check placement restrictions
      if (student.current_offer) {
        const companyType = student.current_offer.company_type; // 'tech' or 'nontech'
        const currentPackage = student.current_offer.package || 0;

        // If placed at non-tech company, can sit
        if (companyType === "nontech") {
          return true;
        }

        // If placed at tech company
        if (companyType === "tech") {
          // If package > 6L, cannot sit
          if (currentPackage > 600000) {
            return false;
          }

          // If package <= 6L, can sit only if upgrade opportunities remain
          if (currentPackage <= 600000) {
            return student.upgrade_opportunities_used < 3;
          }
        }
      }

      // If marquee company, allow (already passed CGPA, backlogs, branch)
      if (company.is_marquee) {
        return true;
      }

      return false;
    });

    return {
      eligibleStudents: eligibleStudents.map((s) => s.student_id),
      criteria: {
        min_cgpa: company.min_cgpa,
        max_backlogs: company.max_backlogs,
        allowed_specializations: company.allowed_specializations,
        is_marquee: company.is_marquee,
        batch_year: batchResult.rows[0].year,
      },
    };
  } catch (error) {
    console.error("Error calculating eligible students:", error);
    throw error;
  }
}

// Check if a specific student is eligible based on company criteria
async function isStudentEligible(db, companyId, studentId) {
  try {
    const query = `
      SELECT 
        c.min_cgpa,
        c.max_backlogs,
        c.allowed_specializations,
        c.is_marquee,
        s.cgpa,
        s.backlogs,
        s.branch,
        s.placement_status,
        s.current_offer,
        s.upgrade_opportunities_used,
        s.dream_company_used
      FROM students s
      JOIN companies c ON c.id = $1
      WHERE s.id = $2
    `;

    const result = await db.query(query, [companyId, studentId]);

    if (result.rows.length === 0) {
      return { isEligible: false, reason: "Student or company not found" };
    }

    const {
      min_cgpa,
      max_backlogs,
      allowed_specializations,
      is_marquee,
      cgpa,
      backlogs,
      branch,
      placement_status,
      current_offer,
      upgrade_opportunities_used,
      dream_company_used,
    } = result.rows[0];

    // Check placement status
    if (!["placed", "unplaced"].includes(placement_status)) {
      return {
        isEligible: false,
        reason: "Student placement status not eligible",
      };
    }

    // Check CGPA
    if (cgpa < (min_cgpa || 0)) {
      return {
        isEligible: false,
        reason: `CGPA ${cgpa} below minimum ${min_cgpa}`,
      };
    }

    // Check backlogs
    if (backlogs > (max_backlogs || 999)) {
      return {
        isEligible: false,
        reason: `Backlogs ${backlogs} exceed maximum ${max_backlogs}`,
      };
    }

    // Check branch/specialization
    if (
      allowed_specializations &&
      allowed_specializations.length > 0 &&
      !allowed_specializations.includes(branch)
    ) {
      return {
        isEligible: false,
        reason: `Branch ${branch} not allowed`,
      };
    }

    // If unplaced, eligible
    if (placement_status === "unplaced") {
      return { isEligible: true, dreamCompanyUsed };
    }

    // Student is placed - check placement restrictions
    if (current_offer) {
      const companyType = current_offer.company_type; // 'tech' or 'nontech'
      const currentPackage = current_offer.package || 0;

      // If placed at non-tech company, eligible
      if (companyType === "nontech") {
        return { isEligible: true, dreamCompanyUsed };
      }

      // If placed at tech company
      if (companyType === "tech") {
        // If package > 6L, cannot sit
        if (currentPackage > 600000) {
          return {
            isEligible: false,
            reason: "Already has package > 6L",
            dreamCompanyUsed,
          };
        }

        // If package <= 6L, check upgrade opportunities
        if (currentPackage <= 600000) {
          if (upgrade_opportunities_used >= 3) {
            return {
              isEligible: false,
              reason: "Used all 3 upgrade opportunities",
              dreamCompanyUsed,
            };
          }
          return { isEligible: true, dreamCompanyUsed };
        }
      }
    }

    // If marquee company and passed all basic checks, eligible
    if (is_marquee) {
      return { isEligible: true, dreamCompanyUsed };
    }

    return {
      isEligible: false,
      reason: "Student does not meet eligibility criteria",
      dreamCompanyUsed,
    };
  } catch (error) {
    console.error("Error checking student eligibility:", error);
    throw error;
  }
}

// Get company eligibility record in good format
async function getCompanyEligibility(db, companyId, batchId) {
  try {
    const query = `
      SELECT 
        id,
        company_id,
        batch_id,
        total_eligible_count,
        total_ineligible_count,
        (jsonb_array_length(dream_company_student_ids)) as dream_company_count,
        eligibility_criteria,
        snapshot_date,
        created_at,
        updated_at
      FROM company_eligibility
      WHERE company_id = $1 AND batch_id = $2
    `;

    const result = await db.query(query, [companyId, batchId]);

    if (result.rows.length === 0) {
      return null;
    }

    const eligibility = result.rows[0];

    return {
      id: eligibility.id,
      company_id: eligibility.company_id,
      batch_id: eligibility.batch_id,
      total_eligible_count: eligibility.total_eligible_count,
      total_ineligible_count: eligibility.total_ineligible_count,
      dream_company_count: eligibility.dream_company_count,
      eligibility_criteria: eligibility.eligibility_criteria,
      snapshot_date: eligibility.snapshot_date,
      created_at: eligibility.created_at,
      updated_at: eligibility.updated_at,
    };
  } catch (error) {
    console.error("Error getting company eligibility:", error);
    throw error;
  }
}

// Get company eligibility with full student details
async function getCompanyEligibilityWithStudents(db, companyId, batchId) {
  try {
    // Get eligibility record with JSON arrays
    const eligibilityQuery = `
      SELECT 
        id,
        company_id,
        batch_id,
        eligible_student_ids,
        ineligible_student_ids,
        dream_company_student_ids,
        total_eligible_count,
        total_ineligible_count,
        eligibility_criteria,
        snapshot_date,
        created_at,
        updated_at
      FROM company_eligibility
      WHERE company_id = $1 AND batch_id = $2
    `;

    const eligibilityResult = await db.query(eligibilityQuery, [
      companyId,
      batchId,
    ]);

    if (eligibilityResult.rows.length === 0) {
      return null;
    }

    const eligibilityRecord = eligibilityResult.rows[0];
    const eligibleIds = eligibilityRecord.eligible_student_ids || [];
    const ineligibleIds = eligibilityRecord.ineligible_student_ids || [];
    const dreamCompanyIds = eligibilityRecord.dream_company_student_ids || [];

    // Fetch eligible students details
    let eligibleStudents = [];
    if (eligibleIds.length > 0) {
      const query = `
        SELECT 
          id, registration_number, enrollment_number, first_name, last_name,
          branch, batch_year, cgpa, backlogs, department, class_10_percentage, 
          class_12_percentage
        FROM students
        WHERE id = ANY($1::int[])
        ORDER BY cgpa DESC
      `;
      const result = await db.query(query, [eligibleIds]);
      eligibleStudents = result.rows.map((s) => ({
        ...s,
        used_dream_company: dreamCompanyIds.includes(s.id),
      }));
    }

    // Fetch ineligible students details
    let ineligibleStudents = [];
    if (ineligibleIds.length > 0) {
      const query = `
        SELECT 
          id, registration_number, enrollment_number, first_name, last_name,
          branch, batch_year, cgpa, backlogs, department, class_10_percentage, 
          class_12_percentage
        FROM students
        WHERE id = ANY($1::int[])
        ORDER BY cgpa DESC
      `;
      const result = await db.query(query, [ineligibleIds]);
      ineligibleStudents = result.rows.map((s) => ({
        ...s,
        used_dream_company: dreamCompanyIds.includes(s.id),
      }));
    }

    return {
      id: eligibilityRecord.id,
      company_id: eligibilityRecord.company_id,
      batch_id: eligibilityRecord.batch_id,
      eligible_students: eligibleStudents,
      ineligible_students: ineligibleStudents,
      total_eligible_count: eligibilityRecord.total_eligible_count,
      total_ineligible_count: eligibilityRecord.total_ineligible_count,
      dream_company_usage_count: dreamCompanyIds.length,
      eligibility_criteria: eligibilityRecord.eligibility_criteria,
      snapshot_date: eligibilityRecord.snapshot_date,
      updated_at: eligibilityRecord.updated_at,
    };
  } catch (error) {
    console.error("Error getting company eligibility with students:", error);
    throw error;
  }
}

module.exports = {
  calculateEligibleStudents,
  isStudentEligible,
  getCompanyEligibility,
  getCompanyEligibilityWithStudents,
};

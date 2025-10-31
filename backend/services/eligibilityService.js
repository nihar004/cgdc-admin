// Calculate eligible students based on company criteria -- initial eligibility calculation
async function calculateEligibleStudents(db, companyId, batchId) {
  try {
    // 1️⃣ Fetch all positions of this company
    const positionsQuery = `
      SELECT 
        p.id AS position_id,
        c.id AS company_id,
        c.is_marquee,
        c.min_cgpa,
        c.max_backlogs,
        c.allowed_specializations,
        p.package_range,
        p.job_type,
        p.company_type
      FROM companies c
      JOIN company_positions p ON c.id = p.company_id
      WHERE c.id = $1
    `;
    const positionsRes = await db.query(positionsQuery, [companyId]);
    if (positionsRes.rows.length === 0)
      throw new Error("No positions found for this company");

    // 2️⃣ Fetch batch year
    const batchQuery = `SELECT year FROM batches WHERE id = $1`;
    const batchRes = await db.query(batchQuery, [batchId]);
    if (batchRes.rows.length === 0)
      throw new Error(`Batch with ID ${batchId} not found`);

    const batchYear = batchRes.rows[0].year;

    // 3️⃣ Get all students of that batch
    const studentsQuery = `
      SELECT 
        s.id AS student_id,
        s.registration_number,
        s.enrollment_number,
        s.full_name,
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
    `;
    const studentsRes = await db.query(studentsQuery, [batchYear]);

    // 4️⃣ Process all positions and combine eligible students
    const combinedEligible = new Set();

    for (const company of positionsRes.rows) {
      for (const student of studentsRes.rows) {
        // Academic filters
        if (
          student.cgpa < (company.min_cgpa || 0) ||
          student.backlogs > (company.max_backlogs || 999)
        )
          continue;

        // Branch / specialization filter
        if (
          company.allowed_specializations?.length > 0 &&
          !company.allowed_specializations.includes(student.branch)
        )
          continue;

        // Unplaced → directly eligible
        if (student.placement_status === "unplaced") {
          combinedEligible.add(student.student_id);
          continue;
        }

        // Parse current offer JSON if string
        if (typeof student.current_offer === "string") {
          try {
            student.current_offer = JSON.parse(student.current_offer);
          } catch {
            student.current_offer = null;
          }
        }

        const offer = student.current_offer;

        // No offer → eligible if marquee
        if (!offer) {
          if (company.is_marquee) combinedEligible.add(student.student_id);
          continue;
        }

        const currentPackage = offer.package || 0;
        const currentType = offer.company_type;

        // If placed at non-tech → eligible
        if (currentType === "nontech") {
          combinedEligible.add(student.student_id);
          continue;
        }

        // ---- MAIN RULE ----
        if (
          currentType === "tech" &&
          currentPackage <= 600000 &&
          student.upgrade_opportunities_used < 3 &&
          company.company_type === "tech" &&
          company.package_range >= 800000 &&
          ["internship_plus_ppo", "full_time"].includes(company.job_type)
        ) {
          combinedEligible.add(student.student_id);

          await db.query(
            `UPDATE students
             SET upgrade_opportunities_used = upgrade_opportunities_used + 1
             WHERE id = $1`,
            [student.student_id]
          );
          continue;
        }

        // Marquee exception
        if (company.is_marquee) {
          combinedEligible.add(student.student_id);
        }
      }
    }

    // 5️⃣ Collect all criteria from all positions for reference
    const criteria = positionsRes.rows.map((p) => ({
      position_id: p.position_id,
      min_cgpa: p.min_cgpa,
      max_backlogs: p.max_backlogs,
      allowed_specializations: p.allowed_specializations,
      is_marquee: p.is_marquee,
      package_range: p.package_range,
      job_type: p.job_type,
      company_type: p.company_type,
      batch_year: batchYear,
    }));

    // 6️⃣ Return single combined result
    return {
      eligibleStudents: Array.from(combinedEligible),
      criteria,
    };
  } catch (error) {
    console.error("Error calculating eligible students:", error);
    throw error;
  }
}

// Check if a specific student is eligible based on company criteria
async function isStudentEligible(db, companyId, studentId) {
  try {
    // Fetch all positions of this company
    const positionsQuery = `
      SELECT 
        p.id AS position_id,
        p.package_range AS position_package,
        p.job_type,
        p.company_type AS position_company_type,
        c.min_cgpa,
        c.max_backlogs,
        c.allowed_specializations,
        c.is_marquee
      FROM companies c
      JOIN company_positions p ON p.company_id = c.id
      WHERE c.id = $1
    `;
    const positionsRes = await db.query(positionsQuery, [companyId]);
    if (positionsRes.rows.length === 0)
      return {
        isEligible: false,
        reason: "No positions found for this company",
      };

    // Fetch student info
    const studentQuery = `
      SELECT 
        s.id,
        s.cgpa,
        s.backlogs,
        s.branch,
        s.placement_status,
        s.current_offer,
        s.upgrade_opportunities_used,
        s.dream_company_used
      FROM students s
      WHERE s.id = $1
    `;
    const studentRes = await db.query(studentQuery, [studentId]);
    if (studentRes.rows.length === 0)
      return { isEligible: false, reason: "Student not found" };

    const student = studentRes.rows[0];
    const {
      cgpa,
      backlogs,
      branch,
      placement_status,
      current_offer,
      upgrade_opportunities_used,
      dream_company_used,
    } = student;

    // --- BASIC CHECKS ---
    if (!["placed", "unplaced"].includes(placement_status))
      return {
        isEligible: false,
        reason: "Invalid placement status",
        dreamCompanyUsed: dream_company_used,
      };

    // --- UNPLACED STUDENT ---
    if (placement_status === "unplaced") {
      return {
        isEligible: true,
        reason: "Unplaced student",
        dreamCompanyUsed: dream_company_used,
      };
    }

    // --- PARSE CURRENT OFFER ---
    let offer = current_offer;
    if (typeof offer === "string") {
      try {
        offer = JSON.parse(offer);
      } catch {
        offer = null;
      }
    }

    const currentPackage = offer?.package || 0;
    const currentType = offer?.company_type || null;

    // --- LOOP THROUGH ALL POSITIONS ---
    for (const pos of positionsRes.rows) {
      const {
        position_id,
        position_package,
        job_type,
        position_company_type,
        min_cgpa,
        max_backlogs,
        allowed_specializations,
        is_marquee,
      } = pos;

      // Academic + branch filters
      if (cgpa < (min_cgpa || 0)) continue;
      if (backlogs > (max_backlogs || 999)) continue;
      if (
        allowed_specializations?.length > 0 &&
        !allowed_specializations.includes(branch)
      )
        continue;

      // Marquee → eligible directly
      if (is_marquee)
        return {
          isEligible: true,
          reason: `Marquee company exception (Position ID: ${position_id})`,
          dreamCompanyUsed: dream_company_used,
        };

      // --- UNPLACED already handled above, now handle PLACED cases ---
      if (currentType === "nontech") {
        return {
          isEligible: true,
          reason: `Current offer is non-tech, Position ID: ${position_id}`,
          dreamCompanyUsed: dream_company_used,
        };
      }

      // Tech + package ≤6L + upgrade <3 + new ≥8L (PPO/full-time)
      if (
        currentType === "tech" &&
        currentPackage <= 600000 &&
        upgrade_opportunities_used < 3 &&
        position_company_type === "tech" &&
        position_package >= 800000 &&
        ["internship_plus_ppo", "full_time"].includes(job_type)
      ) {
        // Increment upgrade usage
        await db.query(
          `UPDATE students 
           SET upgrade_opportunities_used = upgrade_opportunities_used + 1 
           WHERE id = $1`,
          [studentId]
        );

        return {
          isEligible: true,
          reason: `Eligible via upgrade rule (Position ID: ${position_id})`,
          dreamCompanyUsed: dream_company_used,
          upgradeIncremented: true,
        };
      }
    }

    // If none matched
    return {
      isEligible: false,
      reason: "Does not meet eligibility criteria for any position",
      dreamCompanyUsed: dream_company_used,
    };
  } catch (error) {
    console.error("Error checking student eligibility:", error);
    throw error;
  }
}

// Get company eligibility record in good format
async function manuallyAddEligibleStudent(
  db,
  companyId,
  batchId,
  studentId,
  reason
) {
  try {
    // Ensure the record exists first
    await db.query(
      `
      INSERT INTO company_eligibility (
        company_id, 
        batch_id, 
        eligible_student_ids, 
        ineligible_student_ids,
        manual_override_reasons
      )
      VALUES ($1, $2, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb)
      ON CONFLICT (company_id, batch_id) DO NOTHING
      `,
      [companyId, batchId]
    );

    // First, get the current state
    const getCurrentQuery = `
      SELECT 
        eligible_student_ids,
        ineligible_student_ids,
        manual_override_reasons
      FROM company_eligibility
      WHERE company_id = $1 AND batch_id = $2
    `;

    const currentResult = await db.query(getCurrentQuery, [companyId, batchId]);

    if (currentResult.rows.length === 0) {
      return {
        success: false,
        message: "No record found for company and batch.",
      };
    }

    const current = currentResult.rows[0];
    let eligibleIds = current.eligible_student_ids || [];
    let ineligibleIds = current.ineligible_student_ids || [];
    let manualReasons = current.manual_override_reasons || {};

    // Remove from ineligible if present
    ineligibleIds = ineligibleIds.filter((id) => id !== parseInt(studentId));

    // Add to eligible if not already present
    if (!eligibleIds.includes(parseInt(studentId))) {
      eligibleIds.push(parseInt(studentId));
    }

    // Add manual override reason
    manualReasons[studentId.toString()] = reason;

    // Update the record
    const updateQuery = `
      UPDATE company_eligibility
      SET 
        eligible_student_ids = $3::jsonb,
        ineligible_student_ids = $4::jsonb,
        manual_override_reasons = $5::jsonb,
        total_eligible_count = $6,
        total_ineligible_count = $7,
        updated_at = NOW()
      WHERE company_id = $1 AND batch_id = $2
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      companyId,
      batchId,
      JSON.stringify(eligibleIds),
      JSON.stringify(ineligibleIds),
      JSON.stringify(manualReasons),
      eligibleIds.length,
      ineligibleIds.length,
    ]);

    if (result.rowCount === 0) {
      return {
        success: false,
        message: "Failed to update record.",
      };
    }

    return {
      success: true,
      message: `Student ${studentId} manually added to eligible list.`,
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error in manuallyAddEligibleStudent:", error);
    throw new Error("Failed to manually add eligible student.");
  }
}

async function removeManuallyAddedStudent(db, companyId, batchId, studentId) {
  try {
    // Get the current state
    const getCurrentQuery = `
      SELECT 
        eligible_student_ids,
        ineligible_student_ids,
        manual_override_reasons,
        dream_company_student_ids
      FROM company_eligibility
      WHERE company_id = $1 AND batch_id = $2
    `;

    const currentResult = await db.query(getCurrentQuery, [companyId, batchId]);

    if (currentResult.rows.length === 0) {
      return {
        success: false,
        message: "No eligibility record found for company and batch.",
      };
    }

    const current = currentResult.rows[0];
    let eligibleIds = current.eligible_student_ids || [];
    let ineligibleIds = current.ineligible_student_ids || [];
    let manualReasons = current.manual_override_reasons || {};
    let dreamCompanyIds = current.dream_company_student_ids || [];

    // Check if student was manually added
    const studentIdStr = studentId.toString();
    if (!manualReasons[studentIdStr]) {
      return {
        success: false,
        message: "Student was not manually added (no override reason found).",
      };
    }

    // Remove from eligible
    eligibleIds = eligibleIds.filter((id) => id !== parseInt(studentId));

    // Add back to ineligible if not already there
    if (!ineligibleIds.includes(parseInt(studentId))) {
      ineligibleIds.push(parseInt(studentId));
    }

    // Remove manual override reason
    delete manualReasons[studentIdStr];

    // Update the record
    const updateQuery = `
      UPDATE company_eligibility
      SET 
        eligible_student_ids = $3::jsonb,
        ineligible_student_ids = $4::jsonb,
        manual_override_reasons = $5::jsonb,
        total_eligible_count = $6,
        total_ineligible_count = $7,
        updated_at = NOW()
      WHERE company_id = $1 AND batch_id = $2
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      companyId,
      batchId,
      JSON.stringify(eligibleIds),
      JSON.stringify(ineligibleIds),
      JSON.stringify(manualReasons),
      eligibleIds.length,
      ineligibleIds.length,
    ]);

    if (result.rowCount === 0) {
      return {
        success: false,
        message: "Failed to update record.",
      };
    }

    return {
      success: true,
      message: `Student ${studentId} removed from eligible list and manual override cleared.`,
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error in removeManuallyAddedStudent:", error);
    throw new Error("Failed to remove manually added student.");
  }
}

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

// Get company eligibility with full student details, including manual override reasons
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
        manual_override_reasons,
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
    const manualReasons = eligibilityRecord.manual_override_reasons || {};

    // Helper function to fetch student details
    const fetchStudents = async (ids) => {
      if (ids.length === 0) return [];
      const query = `
        SELECT 
          id, registration_number, enrollment_number, full_name,
          branch, batch_year, cgpa, backlogs, department, class_10_percentage, 
          class_12_percentage
        FROM students
        WHERE id = ANY($1::int[])
        ORDER BY cgpa DESC
      `;
      const result = await db.query(query, [ids]);
      return result.rows.map((s) => ({
        ...s,
        used_dream_company: dreamCompanyIds.includes(s.id),
        manual_override_reason: manualReasons[s.id] || null,
      }));
    };

    const eligibleStudents = await fetchStudents(eligibleIds);
    const ineligibleStudents = await fetchStudents(ineligibleIds);

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
  manuallyAddEligibleStudent,
  removeManuallyAddedStudent,
};

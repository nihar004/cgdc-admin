// Helper function to enrich offer with company and position details
async function enrichOfferWithDetails(db, offer) {
  if (!offer || (offer.source === "manual" && offer.company_name)) {
    return offer; // Manual offers already have all details
  }

  if (offer.source !== "campus" || !offer.company_id || !offer.position_id) {
    return {
      ...offer,
      company_name: "Unknown Company",
      package: 0,
      company_type: "unknown",
      _fetch_error: true,
    };
  }

  try {
    const result = await db.query(
      `SELECT 
        c.company_name,
        c.is_marquee,
        p.position_title,
        p.package,
        p.has_range,
        p.package_end,
        p.company_type,
        p.job_type
       FROM companies c
       JOIN company_positions p ON p.company_id = c.id
       WHERE c.id = $1 AND p.id = $2`,
      [offer.company_id, offer.position_id]
    );

    if (result.rows.length > 0) {
      const positionData = result.rows[0];
      return {
        ...offer,
        company_name: positionData.company_name,
        position_title: positionData.position_title,
        package: parseFloat(positionData.package) || 0,
        has_range: positionData.has_range,
        package_end: positionData.package_end
          ? parseFloat(positionData.package_end)
          : null,
        company_type: positionData.company_type || "unknown",
        job_type: positionData.job_type,
        is_marquee: positionData.is_marquee,
      };
    }

    return {
      ...offer,
      company_name: "Unknown Company",
      package: 0,
      company_type: "unknown",
      _fetch_error: true,
    };
  } catch (error) {
    console.error("Error enriching offer:", error);
    return {
      ...offer,
      company_name: "Unknown Company",
      package: 0,
      company_type: "unknown",
      _fetch_error: true,
    };
  }
}

// Calculate eligible students based on company criteria -- initial eligibility calculation
async function calculateEligibleStudents(db, companyId, batchId) {
  try {
    const positionsQuery = `
      SELECT 
        p.id AS position_id,
        c.id AS company_id,
        c.is_marquee,
        c.min_cgpa,
        c.max_backlogs,
        c.allowed_specializations,
        c.eligibility_10th,
        c.eligibility_12th,
        p.package,
        p.job_type,
        p.company_type
      FROM companies c
      JOIN company_positions p ON c.id = p.company_id
      WHERE c.id = $1
    `;

    const positionsRes = await db.query(positionsQuery, [companyId]);
    if (positionsRes.rows.length === 0)
      throw new Error("No positions found for this company");

    // Fetch batch year
    const batchQuery = `SELECT year FROM batches WHERE id = $1`;
    const batchRes = await db.query(batchQuery, [batchId]);
    if (batchRes.rows.length === 0)
      throw new Error(`Batch with ID ${batchId} not found`);

    const batchYear = batchRes.rows[0].year;

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
        s.upgrade_opportunities_used,
        s.class_10_percentage,
        s.class_12_percentage
      FROM students s
      WHERE s.batch_year = $1
    `;

    const studentsRes = await db.query(studentsQuery, [batchYear]);

    // Separate students into three categories
    const eligibleIds = new Set();
    const placedIds = new Set();
    const ineligibleIds = new Set();

    for (const company of positionsRes.rows) {
      for (const student of studentsRes.rows) {
        let passesAcademicCriteria = true;

        // Academic filters - if ANY fail, student is ineligible
        if (student.cgpa < (company.min_cgpa || 0)) {
          passesAcademicCriteria = false;
        }

        if (company.max_backlogs === true && student.backlogs > 0) {
          passesAcademicCriteria = false;
        }

        if (
          company.eligibility_10th &&
          student.class_10_percentage < company.eligibility_10th
        ) {
          passesAcademicCriteria = false;
        }

        if (
          company.eligibility_12th &&
          student.class_12_percentage < company.eligibility_12th
        ) {
          passesAcademicCriteria = false;
        }

        if (
          company.allowed_specializations?.length > 0 &&
          !company.allowed_specializations.includes(student.branch)
        ) {
          passesAcademicCriteria = false;
        }

        // If fails academic criteria, mark as ineligible and skip
        if (!passesAcademicCriteria) {
          ineligibleIds.add(student.student_id);
          continue;
        }

        // Student passes academic criteria, now check placement status

        // If student is not placed or unplaced → directly ineligible
        // (e.g. higher studies, entrepreneurship, debarred, etc.)
        const validStatuses = ["placed", "unplaced"];
        if (!validStatuses.includes(student.placement_status)) {
          // e.g. higher_studies, entrepreneurship, debarred, etc.
          ineligibleIds.add(student.student_id);
          continue;
        }

        // If the company is marquee, all academically eligible students are eligible
        if (company.is_marquee) {
          eligibleIds.add(student.student_id);
          continue;
        }

        // Unplaced → directly eligible
        if (student.placement_status === "unplaced") {
          eligibleIds.add(student.student_id);
          continue;
        }

        // At this point student.placement_status === "placed"
        // Parse and enrich current offer
        let offer = student.current_offer;
        if (typeof offer === "string") {
          try {
            offer = JSON.parse(offer);
          } catch {
            offer = null;
          }
        }

        // Enrich the offer with company/position details
        if (offer) {
          offer = await enrichOfferWithDetails(db, offer);
        }

        // No offer or failed to enrich → add to placed list (they need dream company)
        if (!offer || offer._fetch_error) {
          placedIds.add(student.student_id);
          continue;
        }

        // Now we have enriched offer with package and company_type
        const currentPackage = Number(offer.package) || 0;
        const currentType = offer.company_type || "unknown";

        // If placed at non-tech → eligible directly without using dream company
        if (currentType === "nontech") {
          eligibleIds.add(student.student_id);
          continue;
        }

        // Tech placement ≤6L with upgrade opportunities
        if (
          currentType === "tech" &&
          currentPackage <= 6 &&
          student.upgrade_opportunities_used < 3 &&
          company.company_type === "tech" &&
          company.package >= 8 &&
          ["internship_plus_ppo", "full_time"].includes(company.job_type)
        ) {
          placedIds.add(student.student_id); // They can use upgrade button
          continue;
        }

        // Otherwise, they're placed and need dream company
        placedIds.add(student.student_id);
      }
    }

    // Get company-level criteria (same for all positions)
    const criteria = {
      company_id: companyId,
      batch_year: batchYear,
      min_cgpa: positionsRes.rows[0].min_cgpa,
      max_backlogs: positionsRes.rows[0].max_backlogs,
      allowed_specializations: positionsRes.rows[0].allowed_specializations,
      eligibility_10th: positionsRes.rows[0].eligibility_10th,
      eligibility_12th: positionsRes.rows[0].eligibility_12th,
      is_marquee: positionsRes.rows[0].is_marquee,
    };

    // Return three separate lists
    return {
      eligibleStudents: Array.from(eligibleIds),
      placedStudents: Array.from(placedIds),
      ineligibleStudents: Array.from(ineligibleIds),
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
    const positionsQuery = `
      SELECT 
        p.id AS position_id,
        p.package AS position_package,
        p.job_type,
        p.company_type AS position_company_type,
        c.min_cgpa,
        c.max_backlogs,
        c.allowed_specializations,
        c.is_marquee,
        c.eligibility_10th,
        c.eligibility_12th
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

    const studentQuery = `
      SELECT 
        s.id,
        s.cgpa,
        s.backlogs,
        s.branch,
        s.placement_status,
        s.current_offer,
        s.upgrade_opportunities_used,
        s.dream_company_used,
        s.class_10_percentage,
        s.class_12_percentage
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
      class_10_percentage,
      class_12_percentage,
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
      // Still check academic criteria
      for (const pos of positionsRes.rows) {
        if (cgpa < (pos.min_cgpa || 0)) continue;
        if (pos.max_backlogs === true && backlogs > 0) continue;
        if (pos.eligibility_10th && class_10_percentage < pos.eligibility_10th)
          continue;
        if (pos.eligibility_12th && class_12_percentage < pos.eligibility_12th)
          continue;
        if (
          pos.allowed_specializations?.length > 0 &&
          !pos.allowed_specializations.includes(branch)
        )
          continue;

        return {
          isEligible: true,
          reason: "Unplaced student meeting academic criteria",
          dreamCompanyUsed: dream_company_used,
        };
      }

      return {
        isEligible: false,
        reason: "Does not meet academic criteria",
        dreamCompanyUsed: dream_company_used,
      };
    }

    // --- PARSE AND ENRICH CURRENT OFFER ---
    let offer = current_offer;
    if (typeof offer === "string") {
      try {
        offer = JSON.parse(offer);
      } catch {
        offer = null;
      }
    }

    // Enrich offer with details
    if (offer) {
      offer = await enrichOfferWithDetails(db, offer);
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

      // max_backlogs is now BOOLEAN: true = no backlogs allowed
      if (max_backlogs === true && backlogs > 0) continue;

      // 10th marks check
      if (pos.eligibility_10th && class_10_percentage < pos.eligibility_10th)
        continue;

      // 12th marks check
      if (pos.eligibility_12th && class_12_percentage < pos.eligibility_12th)
        continue;

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

      // --- PLACED STUDENT CHECKS ---
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
        currentPackage <= 6 &&
        upgrade_opportunities_used < 3 &&
        position_company_type === "tech" &&
        position_package >= 8 &&
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

async function manuallyAddEligibleStudent(
  db,
  companyId,
  batchId,
  studentId,
  reason
) {
  try {
    await db.query(
      `
      INSERT INTO company_eligibility (
        company_id, 
        batch_id, 
        eligible_student_ids,
        placed_student_ids,
        ineligible_student_ids,
        manual_override_reasons
      )
      VALUES ($1, $2, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb)
      ON CONFLICT (company_id, batch_id) DO NOTHING
      `,
      [companyId, batchId]
    );

    const getCurrentQuery = `
      SELECT 
        eligible_student_ids,
        placed_student_ids,
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
    let placedIds = current.placed_student_ids || [];
    let ineligibleIds = current.ineligible_student_ids || [];
    let manualReasons = current.manual_override_reasons || {};

    const sid = parseInt(studentId);

    // Detect origin before removing
    let origin = null;
    if (placedIds.includes(sid)) origin = "placed";
    else if (ineligibleIds.includes(sid)) origin = "ineligible";

    // Remove student from other lists
    placedIds = placedIds.filter((id) => id !== sid);
    ineligibleIds = ineligibleIds.filter((id) => id !== sid);

    // Add to eligible if not already there
    if (!eligibleIds.includes(sid)) eligibleIds.push(sid);

    // Record reason + origin
    manualReasons[sid.toString()] = { reason, from: origin };

    // Update DB
    const updateQuery = `
      UPDATE company_eligibility
      SET 
        eligible_student_ids = $3::jsonb,
        placed_student_ids = $4::jsonb,
        ineligible_student_ids = $5::jsonb,
        manual_override_reasons = $6::jsonb,
        total_eligible_count = $7,
        total_placed_count = $8,
        total_ineligible_count = $9,
        updated_at = NOW()
      WHERE company_id = $1 AND batch_id = $2
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      companyId,
      batchId,
      JSON.stringify(eligibleIds),
      JSON.stringify(placedIds),
      JSON.stringify(ineligibleIds),
      JSON.stringify(manualReasons),
      eligibleIds.length,
      placedIds.length,
      ineligibleIds.length,
    ]);

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
        placed_student_ids,
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
    let placedIds = current.placed_student_ids || [];
    let ineligibleIds = current.ineligible_student_ids || [];
    let manualReasons = current.manual_override_reasons || {};

    const studentIdStr = studentId.toString();

    // Check if student was manually added
    if (!manualReasons[studentIdStr]) {
      return {
        success: false,
        message: "Student was not manually added (no override reason found).",
      };
    }

    // Determine origin (where the student was before manual add)
    const origin = manualReasons[studentIdStr]?.from;

    // Remove from eligible list
    eligibleIds = eligibleIds.filter((id) => id !== parseInt(studentId));

    // Remove manual override reason
    delete manualReasons[studentIdStr];

    // Put student back to the original list
    if (origin === "placed") {
      if (!placedIds.includes(parseInt(studentId)))
        placedIds.push(parseInt(studentId));
    } else {
      // Default to ineligible if origin unknown or was "ineligible"
      if (!ineligibleIds.includes(parseInt(studentId)))
        ineligibleIds.push(parseInt(studentId));
    }

    // Update the record in DB
    const updateQuery = `
      UPDATE company_eligibility
      SET
        eligible_student_ids = $3::jsonb,
        placed_student_ids = $4::jsonb,
        ineligible_student_ids = $5::jsonb,
        manual_override_reasons = $6::jsonb,
        total_eligible_count = $7,
        total_placed_count = $8,
        total_ineligible_count = $9,
        updated_at = NOW()
      WHERE company_id = $1 AND batch_id = $2
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      companyId,
      batchId,
      JSON.stringify(eligibleIds),
      JSON.stringify(placedIds),
      JSON.stringify(ineligibleIds),
      JSON.stringify(manualReasons),
      eligibleIds.length,
      placedIds.length,
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
      message: `Student ${studentId} removed from eligible list and returned to original list.`,
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
        total_placed_count,
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
      total_placed_count: eligibility.total_placed_count,
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

// async function getCompanyEligibilityWithStudents(db, companyId, batchId) {
//   try {
//     // Get eligibility record with JSON arrays
//     const eligibilityQuery = `
//       SELECT
//         id,
//         company_id,
//         batch_id,
//         eligible_student_ids,
//         placed_student_ids,
//         ineligible_student_ids,
//         dream_company_student_ids,
//         manual_override_reasons,
//         total_eligible_count,
//         total_placed_count,
//         total_ineligible_count,
//         eligibility_criteria,
//         snapshot_date,
//         created_at,
//         updated_at
//       FROM company_eligibility
//       WHERE company_id = $1 AND batch_id = $2
//     `;

//     const eligibilityResult = await db.query(eligibilityQuery, [
//       companyId,
//       batchId,
//     ]);

//     if (eligibilityResult.rows.length === 0) {
//       return null;
//     }

//     const eligibilityRecord = eligibilityResult.rows[0];
//     const eligibleIds = eligibilityRecord.eligible_student_ids || [];
//     const placedIds = eligibilityRecord.placed_student_ids || [];
//     const ineligibleIds = eligibilityRecord.ineligible_student_ids || [];
//     const dreamCompanyIds = eligibilityRecord.dream_company_student_ids || [];
//     const manualReasons = eligibilityRecord.manual_override_reasons || {};

//     // Helper function to fetch student details
//     const fetchStudents = async (ids) => {
//       if (ids.length === 0) return [];
//       const query = `
//         SELECT
//           id, registration_number, enrollment_number, full_name,
//           branch, batch_year, cgpa, backlogs, department, class_10_percentage,
//           class_12_percentage, placement_status, current_offer, upgrade_opportunities_used
//         FROM students
//         WHERE id = ANY($1::int[])
//         ORDER BY cgpa DESC
//       `;
//       const result = await db.query(query, [ids]);
//       return result.rows.map((s) => ({
//         ...s,
//         used_dream_company: dreamCompanyIds.includes(s.id),
//         manual_override_reason: manualReasons[s.id] || null,
//       }));
//     };

//     const eligibleStudents = await fetchStudents(eligibleIds);
//     const placedStudents = await fetchStudents(placedIds);
//     const ineligibleStudents = await fetchStudents(ineligibleIds);

//     return {
//       id: eligibilityRecord.id,
//       company_id: eligibilityRecord.company_id,
//       batch_id: eligibilityRecord.batch_id,
//       eligible_students: eligibleStudents,
//       placed_students: placedStudents,
//       ineligible_students: ineligibleStudents,
//       total_eligible_count: eligibilityRecord.total_eligible_count,
//       total_placed_count: eligibilityRecord.total_placed_count,
//       total_ineligible_count: eligibilityRecord.total_ineligible_count,
//       dream_company_usage_count: dreamCompanyIds.length,
//       eligibility_criteria: eligibilityRecord.eligibility_criteria,
//       snapshot_date: eligibilityRecord.snapshot_date,
//       updated_at: eligibilityRecord.updated_at,
//     };
//   } catch (error) {
//     console.error("Error getting company eligibility with students:", error);
//     throw error;
//   }
// }
async function getCompanyEligibilityWithStudents(db, companyId, batchId) {
  try {
    // Get eligibility record with JSON arrays
    const eligibilityQuery = `
      SELECT 
        id,
        company_id,
        batch_id,
        eligible_student_ids,
        placed_student_ids,
        ineligible_student_ids,
        dream_company_student_ids,
        manual_override_reasons,
        total_eligible_count,
        total_placed_count,
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

    if (eligibilityResult.rows.length === 0) return null;

    const eligibilityRecord = eligibilityResult.rows[0];
    const eligibleIds = eligibilityRecord.eligible_student_ids || [];
    const placedIds = eligibilityRecord.placed_student_ids || [];
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
          class_12_percentage, placement_status, current_offer, upgrade_opportunities_used
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
    const placedStudents = await fetchStudents(placedIds);
    const ineligibleStudents = await fetchStudents(ineligibleIds);

    // Initialize counters
    let manualOverrideCount = 0;
    let upgradeUsageCount = 0;
    let dreamCompanyUsageCount = 0;

    Object.values(manualReasons).forEach((reason) => {
      if (reason.reason === "used_upgrade") {
        upgradeUsageCount++;
      } else if (reason.reason === "used_dream") {
        dreamCompanyUsageCount++;
      } else {
        manualOverrideCount++;
      }
    });

    return {
      id: eligibilityRecord.id,
      company_id: eligibilityRecord.company_id,
      batch_id: eligibilityRecord.batch_id,
      eligible_students: eligibleStudents,
      placed_students: placedStudents,
      ineligible_students: ineligibleStudents,
      total_eligible_count: eligibilityRecord.total_eligible_count,
      total_placed_count: eligibilityRecord.total_placed_count,
      total_ineligible_count: eligibilityRecord.total_ineligible_count,
      dream_company_usage_count: dreamCompanyUsageCount,
      upgrade_usage_count: upgradeUsageCount,
      manual_override_count: manualOverrideCount,
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
  enrichOfferWithDetails,
  calculateEligibleStudents,
  isStudentEligible,
  getCompanyEligibility,
  getCompanyEligibilityWithStudents,
  manuallyAddEligibleStudent,
  removeManuallyAddedStudent,
};

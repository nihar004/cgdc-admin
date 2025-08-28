const express = require("express");
const db = require("../db");
const routes = express.Router();

async function getBatchIdFromYear(year) {
  try {
    const query = `SELECT id FROM batches WHERE year = $1 LIMIT 1`;
    const result = await db.query(query, [year]);

    if (result.rows.length === 0) {
      throw new Error(`No batch found for year ${year}`);
    }

    return result.rows[0].id;
  } catch (err) {
    throw new Error(`Error getting batch id: ${err.message}`);
  }
}

// GET all companies for a specific batch with positions and documents
routes.get("/batch/:batchYear", async (req, res) => {
  const { batchYear } = req.params;

  if (!batchYear || isNaN(batchYear)) {
    return res.status(400).json({ error: "Invalid batch year" });
  }

  try {
    // Convert batchYear to integer to ensure proper comparison
    const batchId = await getBatchIdFromYear(parseInt(batchYear));

    const query = `
      SELECT 
        c.*,
        cb.batch_id,
        b.year as batch_year,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', cp.id,
            'position_title', cp.position_title,
            'job_type', cp.job_type,
            'package_range', cp.package_range,
            'is_active', cp.is_active,
            'documents', (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', pd.id,
                  'document_type', pd.document_type,
                  'document_title', pd.document_title,
                  'document_url', pd.document_url,
                  'file_type', pd.file_type,
                  'display_order', pd.display_order,
                  'uploaded_at', pd.uploaded_at
                ) ORDER BY pd.display_order, pd.uploaded_at
              )
              FROM position_documents pd 
              WHERE pd.position_id = cp.id
            )
          )
        ) FILTER (WHERE cp.id IS NOT NULL) as positions
      FROM companies c
      JOIN company_batches cb ON c.id = cb.company_id
      LEFT JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN company_positions cp ON c.id = cp.company_id AND cp.is_active = true
      WHERE cb.batch_id = $1
      GROUP BY c.id, cb.batch_id, b.year
      ORDER BY c.scheduled_visit DESC
    `;

    const result = await db.query(query, [batchId]);

    // NEW TODO: Get applications count for each company
    // Transform the data to include applications count
    const companiesWithStats = await Promise.all(
      result.rows.map(async (company) => {
        const applicationsQuery = `
          SELECT COUNT(*) as count 
          FROM student_applications sa
          JOIN company_positions cp ON sa.position_id = cp.id
          WHERE cp.company_id = $1
        `;

        let applicationsCount = 0;
        try {
          const applicationsResult = await db.query(applicationsQuery, [
            company.id,
          ]);
          applicationsCount = parseInt(applicationsResult.rows[0]?.count || 0);
        } catch (err) {
          // TODO NEW
          // console.log("Applications table not found, defaulting to 0");
        }

        return {
          ...company,
          applications_count: applicationsCount,
        };
      })
    );

    res.json(companiesWithStats);
  } catch (err) {
    console.error("Error fetching companies by batch:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single company with all details (batch-specific)
routes.get("/:id/batch/:batchYear", async (req, res) => {
  const { id, batchYear } = req.params;

  if (!id || isNaN(id) || !batchYear || isNaN(batchYear)) {
    return res.status(400).json({ error: "Invalid company ID or batch year" });
  }

  try {
    const batchId = await getBatchIdFromYear(batchYear);

    const query = `
      SELECT 
        c.*,
        cb.batch_id,
        b.year as batch_year,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', cp.id,
            'position_title', cp.position_title,
            'job_type', cp.job_type,
            'package_range', cp.package_range,
            'is_active', cp.is_active,
            'documents', (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', pd.id,
                  'document_type', pd.document_type,
                  'document_title', pd.document_title,
                  'document_url', pd.document_url,
                  'file_type', pd.file_type,
                  'display_order', pd.display_order,
                  'uploaded_at', pd.uploaded_at
                ) ORDER BY pd.display_order, pd.uploaded_at
              )
              FROM position_documents pd 
              WHERE pd.position_id = cp.id
            )
          )
        ) FILTER (WHERE cp.id IS NOT NULL) as positions
      FROM companies c
      JOIN company_batches cb ON c.id = cb.company_id
      LEFT JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN company_positions cp ON c.id = cp.company_id AND cp.is_active = true
      WHERE c.id = $1 AND cb.batch_id = $2
      GROUP BY c.id, cb.batch_id, b.year
    `;

    const result = await db.query(query, [id, batchId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Company not found in specified batch" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching company:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST - Create new company with positions and documents for a specific batch
routes.post("/batch/:batchYear", async (req, res) => {
  const { batchYear } = req.params;
  const {
    company_name,
    company_description,
    company_type,
    sector,
    is_marquee = false,
    website_url,
    linkedin_url,
    primary_hr_name,
    primary_hr_designation,
    primary_hr_email,
    primary_hr_phone,
    scheduled_visit,
    actual_arrival,
    glassdoor_rating,
    work_locations,
    min_cgpa = 0.0,
    max_backlogs = 999,
    bond_required = false,
    positions = [],
  } = req.body;

  // Validation
  if (!company_name || !company_type || !scheduled_visit || !batchYear) {
    return res.status(400).json({
      error:
        "Missing required fields: company_name, company_type, scheduled_visit, batchYear",
    });
  }

  if (isNaN(batchYear)) {
    return res.status(400).json({ error: "Invalid batch year" });
  }

  // Validate company_type enum
  const validCompanyTypes = ["tech", "nontech"];
  if (!validCompanyTypes.includes(company_type)) {
    return res
      .status(400)
      .json({ error: "Invalid company_type. Must be 'tech' or 'nontech'" });
  }

  // Validate email format if provided
  if (
    primary_hr_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary_hr_email)
  ) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate glassdoor_rating range
  if (glassdoor_rating && (glassdoor_rating < 0 || glassdoor_rating > 5)) {
    return res
      .status(400)
      .json({ error: "Glassdoor rating must be between 0 and 5" });
  }

  // Validate CGPA range
  if (min_cgpa && (min_cgpa < 0 || min_cgpa > 10)) {
    return res.status(400).json({ error: "CGPA must be between 0 and 10" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Insert company
    const companyInsertQuery = `
      INSERT INTO companies (
        company_name, company_description, company_type, sector, is_marquee,
        website_url, linkedin_url, primary_hr_name, primary_hr_designation,
        primary_hr_email, primary_hr_phone, scheduled_visit, actual_arrival,
        glassdoor_rating, work_locations, min_cgpa, max_backlogs, bond_required
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const companyValues = [
      company_name,
      company_description,
      company_type,
      sector,
      is_marquee,
      website_url,
      linkedin_url,
      primary_hr_name,
      primary_hr_designation,
      primary_hr_email,
      primary_hr_phone,
      scheduled_visit,
      actual_arrival,
      glassdoor_rating,
      work_locations,
      min_cgpa,
      max_backlogs,
      bond_required,
    ];

    const companyResult = await client.query(companyInsertQuery, companyValues);
    const newCompany = companyResult.rows[0];

    // Insert company-batch relationship
    const batchRelationQuery = `
      INSERT INTO company_batches (company_id, batch_id) 
      VALUES ($1, $2)
    `;
    await client.query(batchRelationQuery, [newCompany.id, batchId]);

    // Insert positions with documents
    const insertedPositions = await createPositionsWithDocuments(
      client,
      newCompany.id,
      positions
    );

    await client.query("COMMIT");

    res.status(201).json({
      ...newCompany,
      batch_id: parseInt(batchId),
      positions: insertedPositions,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating company:", err);
    res.status(500).json({ error: err.message || "Failed to create company" });
  } finally {
    client.release();
  }
});

// PUT - Update company for a specific batch
routes.put("/:id/batch/:batchYear", async (req, res) => {
  const { id, batchYear } = req.params;
  const {
    company_name,
    company_description,
    company_type,
    sector,
    is_marquee,
    website_url,
    linkedin_url,
    primary_hr_name,
    primary_hr_designation,
    primary_hr_email,
    primary_hr_phone,
    scheduled_visit,
    actual_arrival,
    glassdoor_rating,
    work_locations,
    min_cgpa,
    max_backlogs,
    bond_required,
    positions = [],
  } = req.body;

  if (!id || isNaN(id) || !batchYear || isNaN(batchYear)) {
    return res.status(400).json({ error: "Invalid company ID or batch year" });
  }

  // Validation
  if (company_type) {
    const validCompanyTypes = ["tech", "nontech"];
    if (!validCompanyTypes.includes(company_type)) {
      return res
        .status(400)
        .json({ error: "Invalid company_type. Must be 'tech' or 'nontech'" });
    }
  }

  // Validate email format if provided
  if (
    primary_hr_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary_hr_email)
  ) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate glassdoor_rating range
  if (glassdoor_rating && (glassdoor_rating < 0 || glassdoor_rating > 5)) {
    return res
      .status(400)
      .json({ error: "Glassdoor rating must be between 0 and 5" });
  }

  // Validate CGPA range
  if (min_cgpa && (min_cgpa < 0 || min_cgpa > 10)) {
    return res.status(400).json({ error: "CGPA must be between 0 and 10" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Check if company exists in the specified batch
    const existingCompanyQuery = `
      SELECT c.* FROM companies c
      JOIN company_batches cb ON c.id = cb.company_id
      WHERE c.id = $1 AND cb.batch_id = $2
    `;
    const existingCompany = await client.query(existingCompanyQuery, [
      id,
      batchYear,
    ]);

    if (existingCompany.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Company not found in specified batch" });
    }

    // Update company
    const updateQuery = `
      UPDATE companies SET
        company_name = COALESCE($2, company_name),
        company_description = COALESCE($3, company_description),
        company_type = COALESCE($4, company_type),
        sector = COALESCE($5, sector),
        is_marquee = COALESCE($6, is_marquee),
        website_url = COALESCE($7, website_url),
        linkedin_url = COALESCE($8, linkedin_url),
        primary_hr_name = COALESCE($9, primary_hr_name),
        primary_hr_designation = COALESCE($10, primary_hr_designation),
        primary_hr_email = COALESCE($11, primary_hr_email),
        primary_hr_phone = COALESCE($12, primary_hr_phone),
        scheduled_visit = COALESCE($13, scheduled_visit),
        actual_arrival = COALESCE($14, actual_arrival),
        glassdoor_rating = COALESCE($15, glassdoor_rating),
        work_locations = COALESCE($16, work_locations),
        min_cgpa = COALESCE($17, min_cgpa),
        max_backlogs = COALESCE($18, max_backlogs),
        bond_required = COALESCE($19, bond_required),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const updateValues = [
      id,
      company_name,
      company_description,
      company_type,
      sector,
      is_marquee,
      website_url,
      linkedin_url,
      primary_hr_name,
      primary_hr_designation,
      primary_hr_email,
      primary_hr_phone,
      scheduled_visit,
      actual_arrival,
      glassdoor_rating,
      work_locations,
      min_cgpa,
      max_backlogs,
      bond_required,
    ];

    const updateResult = await client.query(updateQuery, updateValues);
    const updatedCompany = updateResult.rows[0];

    // Update positions if provided
    let updatedPositions = [];
    if (positions && positions.length > 0) {
      // Deactivate existing positions (soft delete)
      await client.query(
        "UPDATE company_positions SET is_active = false WHERE company_id = $1",
        [id]
      );

      // Insert new positions with documents
      updatedPositions = await createPositionsWithDocuments(
        client,
        id,
        positions
      );
    }

    await client.query("COMMIT");
    res.json({
      ...updatedCompany,
      batch_id: parseInt(batchYear),
      positions: updatedPositions,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating company:", err);
    res.status(500).json({ error: "Failed to update company" });
  } finally {
    client.release();
  }
});

// DELETE entire company (including all positions and documents)
routes.delete("/:id/batch/:batchYear", async (req, res) => {
  const { id, batchYear } = req.params;

  if (!id || isNaN(id) || !batchYear || isNaN(batchYear)) {
    return res.status(400).json({ error: "Invalid company ID or batch year" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Check if company exists in the specified batch
    const existingCompanyQuery = `
      SELECT c.* FROM companies c
      JOIN company_batches cb ON c.id = cb.company_id
      WHERE c.id = $1 AND cb.batch_id = $2
    `;
    const existingCompany = await client.query(existingCompanyQuery, [
      id,
      batchYear,
    ]);

    if (existingCompany.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Company not found in specified batch" });
    }

    // Delete all position documents for this company
    await client.query(
      `DELETE FROM position_documents 
       WHERE position_id IN (
         SELECT id FROM company_positions WHERE company_id = $1
       )`,
      [id]
    );

    // Delete all company positions
    await client.query("DELETE FROM company_positions WHERE company_id = $1", [
      id,
    ]);

    // Delete company-batch relationship
    await client.query(
      "DELETE FROM company_batches WHERE company_id = $1 AND batch_id = $2",
      [id, batchYear]
    );

    // Delete the company (since each company visit is an independent entity)
    await client.query("DELETE FROM companies WHERE id = $1", [id]);

    await client.query("COMMIT");
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting company:", err);
    res.status(500).json({ error: "Failed to delete company" });
  } finally {
    client.release();
  }
});

// DELETE specific position and its documents
routes.delete("/position/:positionId", async (req, res) => {
  const { positionId } = req.params;

  if (!positionId || isNaN(positionId)) {
    return res.status(400).json({ error: "Invalid position ID" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Check if position exists
    const existingPosition = await client.query(
      "SELECT * FROM company_positions WHERE id = $1",
      [positionId]
    );

    if (existingPosition.rows.length === 0) {
      return res.status(404).json({ error: "Position not found" });
    }

    // Delete position documents
    await client.query(
      "DELETE FROM position_documents WHERE position_id = $1",
      [positionId]
    );

    // Delete position
    await client.query("DELETE FROM company_positions WHERE id = $1", [
      positionId,
    ]);

    await client.query("COMMIT");
    res.json({ message: "Position and its documents deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting position:", err);
    res.status(500).json({ error: "Failed to delete position" });
  } finally {
    client.release();
  }
});

// Helper function to create positions with documents
async function createPositionsWithDocuments(client, companyId, positions) {
  const insertedPositions = [];

  if (positions && positions.length > 0) {
    for (const position of positions) {
      const {
        position_title,
        job_type = "full_time",
        package_range,
        documents = [],
      } = position;

      // Validate job_type enum
      const validJobTypes = ["internship", "full_time", "internship_plus_ppo"];
      if (!validJobTypes.includes(job_type)) {
        throw new Error(`Invalid job_type: ${job_type}`);
      }

      if (!position_title) {
        throw new Error("Position title is required");
      }

      // Insert position
      const positionInsertQuery = `
        INSERT INTO company_positions (company_id, position_title, job_type, package_range)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const positionResult = await client.query(positionInsertQuery, [
        companyId,
        position_title,
        job_type,
        package_range,
      ]);

      const newPosition = positionResult.rows[0];

      // Insert documents for this position
      const insertedDocuments = [];
      if (documents && documents.length > 0) {
        for (const doc of documents) {
          const {
            document_type,
            document_title,
            document_url,
            file_type,
            display_order = 1,
            uploaded_by,
          } = doc;

          if (
            !document_type ||
            !document_title ||
            !document_url ||
            !file_type
          ) {
            throw new Error("Missing required document fields");
          }

          // Validate document_type enum
          const validDocumentTypes = [
            "job_description",
            "salary_breakdown",
            "company_presentation",
            "bond_details",
            "eligibility_criteria",
            "other",
          ];

          if (!validDocumentTypes.includes(document_type)) {
            throw new Error(`Invalid document_type: ${document_type}`);
          }

          const documentInsertQuery = `
            INSERT INTO position_documents (
              position_id, document_type, document_title, document_url, 
              file_type, display_order, uploaded_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
          `;

          const documentResult = await client.query(documentInsertQuery, [
            newPosition.id,
            document_type,
            document_title,
            document_url,
            file_type,
            display_order,
            uploaded_by,
          ]);

          insertedDocuments.push(documentResult.rows[0]);
        }
      }

      insertedPositions.push({
        ...newPosition,
        documents: insertedDocuments,
      });
    }
  }

  return insertedPositions;
}

module.exports = routes;

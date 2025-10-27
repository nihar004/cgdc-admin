const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const routes = express.Router();

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Create directory structure: cgdc-docs/documents/{year}/
    const { batchYear } = req.params;
    const uploadDir = path.join(
      process.cwd(),
      "cgdc-docs",
      "documents",
      batchYear.toString()
    );

    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: {timestamp}_{uuid}_{original_name}
    const timestamp = Date.now();
    const uniqueId = uuidv4().split("-")[0]; // First part of UUID
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const filename = `${timestamp}_${uniqueId}_${basename}${extension}`;
    cb(null, filename);
  },
});

// File filter for allowed document types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileExtension} not allowed`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// **************************************************
// **************** Helper functions ****************

// Helper function to get batch ID from year
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

// Helper function to create positions without documents (documents uploaded separately)
async function createPositionsWithoutDocuments(client, companyId, positions) {
  const insertedPositions = [];

  if (positions && positions.length > 0) {
    for (const position of positions) {
      const {
        position_title,
        job_type,
        company_type, // Add this
        package_range,
        internship_stipend_monthly,
        rounds_start_date,
        rounds_end_date,
      } = position;

      // Process optional fields to handle empty strings
      const processedPosition = {
        position_title: position_title?.trim() || null,
        job_type: job_type || "full_time",
        company_type: company_type || "tech", // Add default
        package_range:
          package_range && package_range !== "" && !isNaN(package_range)
            ? parseFloat(package_range)
            : -1,
        internship_stipend_monthly:
          internship_stipend_monthly &&
          internship_stipend_monthly !== "" &&
          !isNaN(internship_stipend_monthly)
            ? parseFloat(internship_stipend_monthly)
            : -1,
        rounds_start_date:
          rounds_start_date?.trim() && rounds_start_date.trim() !== ""
            ? rounds_start_date.trim()
            : null,
        rounds_end_date:
          rounds_end_date?.trim() && rounds_end_date.trim() !== ""
            ? rounds_end_date.trim()
            : null,
      };

      // Relaxed compensation validation - only validate if values are provided
      // This allows positions to be created without compensation details initially
      if (
        processedPosition.job_type === "internship" &&
        processedPosition.package_range !== null &&
        processedPosition.internship_stipend_monthly === null
      ) {
        throw new Error(
          "internship_stipend_monthly should be provided for internship positions when compensation is specified"
        );
      }

      if (
        processedPosition.job_type === "full_time" &&
        processedPosition.internship_stipend_monthly !== null &&
        processedPosition.package_range === null
      ) {
        throw new Error(
          "package_range should be provided for full_time positions when compensation is specified"
        );
      }

      // Insert position
      const positionInsertQuery = `
        INSERT INTO company_positions (
          company_id, position_title, job_type, company_type,
          package_range, internship_stipend_monthly, 
          rounds_start_date, rounds_end_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      try {
        const positionResult = await client.query(positionInsertQuery, [
          companyId,
          processedPosition.position_title,
          processedPosition.job_type,
          processedPosition.company_type,
          processedPosition.package_range,
          processedPosition.internship_stipend_monthly,
          processedPosition.rounds_start_date,
          processedPosition.rounds_end_date,
        ]);
        insertedPositions.push(positionResult.rows[0]);
      } catch (err) {
        console.error("Error inserting position:", err);
        throw err;
      }
    }
  }

  return insertedPositions;
}

// Helper function to update positions efficiently
async function updatePositionsEfficiently(
  client,
  companyId,
  existingPositions,
  newPositions
) {
  const updatedPositions = [];

  // Create a map of existing positions by BOTH id and position_title
  const existingMapById = new Map(
    existingPositions.map((pos) => [pos.id, pos])
  );
  const existingMapByTitle = new Map(
    existingPositions.map((pos) => [pos.position_title, pos])
  );

  // Track which existing position IDs are being kept
  const processedIds = new Set();

  // Step 1: Process each position from the request
  for (const position of newPositions) {
    let existingPosition = null;

    // Try to match by ID first
    if (position.id && existingMapById.has(position.id)) {
      existingPosition = existingMapById.get(position.id);
    }
    // If no ID or ID doesn't match, try to match by position_title
    else if (
      position.position_title &&
      existingMapByTitle.has(position.position_title)
    ) {
      existingPosition = existingMapByTitle.get(position.position_title);
    }

    if (existingPosition) {
      // UPDATE existing position
      processedIds.add(existingPosition.id);

      const processedPosition = processPositionData(position);

      const updateQuery = `
        UPDATE company_positions SET
          position_title = $2,
          job_type = $3,
          company_type = $4,
          package_range = $5,
          internship_stipend_monthly = $6,
          rounds_start_date = $7,
          rounds_end_date = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND company_id = $9
        RETURNING *
      `;

      try {
        const result = await client.query(updateQuery, [
          existingPosition.id, // Use the existing position's ID
          processedPosition.position_title,
          processedPosition.job_type,
          processedPosition.company_type,
          processedPosition.package_range,
          processedPosition.internship_stipend_monthly,
          processedPosition.rounds_start_date,
          processedPosition.rounds_end_date,
          companyId,
        ]);

        updatedPositions.push(result.rows[0]);
      } catch (err) {
        console.error(`Error updating position ${existingPosition.id}:`, err);
        throw err;
      }
    } else {
      // CREATE new position (no match found)
      const processedPosition = processPositionData(position);

      const insertQuery = `
        INSERT INTO company_positions (
          company_id, position_title, job_type, company_type, 
          package_range, internship_stipend_monthly, 
          rounds_start_date, rounds_end_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      try {
        const result = await client.query(insertQuery, [
          companyId,
          processedPosition.position_title,
          processedPosition.job_type,
          processedPosition.company_type,
          processedPosition.package_range,
          processedPosition.internship_stipend_monthly,
          processedPosition.rounds_start_date,
          processedPosition.rounds_end_date,
        ]);
        updatedPositions.push(result.rows[0]);
      } catch (err) {
        console.error("Error inserting new position:", err);
        throw err;
      }
    }
  }

  // Step 2: DELETE positions that were not in the request
  const positionIdsToDelete = existingPositions
    .map((pos) => pos.id)
    .filter((id) => !processedIds.has(id));

  for (const positionId of positionIdsToDelete) {
    // First delete associated documents and their files
    const documentsQuery =
      "SELECT * FROM position_documents WHERE position_id = $1";
    const docsResult = await client.query(documentsQuery, [positionId]);

    for (const doc of docsResult.rows) {
      try {
        const filePath = path.join(process.cwd(), doc.document_path);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
      }
    }

    // Delete the position (cascade will handle documents table)
    try {
      await client.query(
        "DELETE FROM company_positions WHERE id = $1 AND company_id = $2",
        [positionId, companyId]
      );
    } catch (err) {
      console.error(`Error deleting position ${positionId}:`, err);
      throw err;
    }
  }
  return updatedPositions;
}

// Helper function to process position data
function processPositionData(position) {
  const processedPosition = {
    position_title: position.position_title?.trim() || null,
    job_type: position.job_type || "full_time",
    company_type: position.company_type || "tech",
    package_range:
      position.package_range &&
      position.package_range !== "" &&
      !isNaN(position.package_range)
        ? parseFloat(position.package_range)
        : -1,
    internship_stipend_monthly:
      position.internship_stipend_monthly &&
      position.internship_stipend_monthly !== "" &&
      !isNaN(position.internship_stipend_monthly)
        ? parseFloat(position.internship_stipend_monthly)
        : -1,
    rounds_start_date:
      position.rounds_start_date?.trim() &&
      position.rounds_start_date.trim() !== ""
        ? position.rounds_start_date.trim()
        : null,
    rounds_end_date:
      position.rounds_end_date?.trim() && position.rounds_end_date.trim() !== ""
        ? position.rounds_end_date.trim()
        : null,
  };

  // Validation
  if (
    processedPosition.job_type === "internship" &&
    processedPosition.package_range !== null &&
    processedPosition.internship_stipend_monthly === null
  ) {
    throw new Error(
      "internship_stipend_monthly should be provided for internship positions when compensation is specified"
    );
  }

  if (
    processedPosition.job_type === "full_time" &&
    processedPosition.internship_stipend_monthly !== null &&
    processedPosition.package_range === null
  ) {
    throw new Error(
      "package_range should be provided for full_time positions when compensation is specified"
    );
  }

  return processedPosition;
}

// ************** END Helper functions **************
// **************************************************

// GET all companies for a specific batch with positions, documents
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
        COALESCE(ce.total_eligible_count, -1) as total_eligible,
        -- Count total registered students for this company across all positions
        (
          SELECT COUNT(DISTINCT fr.student_id)
          FROM form_responses fr
          INNER JOIN forms f ON fr.form_id = f.id
          INNER JOIN company_positions cp_inner ON (fr.response_data->>'position_id')::INTEGER = cp_inner.id
          WHERE cp_inner.company_id = c.id 
            AND f.batch_year = $1
            AND f.type = 'application'
        ) as total_registered,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', cp.id,
            'position_title', cp.position_title,
            'job_type', cp.job_type,
            'company_type', cp.company_type,
            'package_range', cp.package_range,
            'internship_stipend_monthly', cp.internship_stipend_monthly,
            'rounds_start_date', cp.rounds_start_date,
            'rounds_end_date', cp.rounds_end_date,
            -- Count selected students from final round results
            'selected_students', (
              SELECT COUNT(DISTINCT srr.student_id)
              FROM student_round_results srr
              INNER JOIN events e ON srr.event_id = e.id
              WHERE e.position_ids @> ARRAY[cp.id]
                AND e.round_type = 'last'
                AND srr.result_status = 'selected'
            ),
            -- Count registered students for this specific position
            'registered_students', (
              SELECT COUNT(DISTINCT fr.student_id)
              FROM form_responses fr
              INNER JOIN forms f ON fr.form_id = f.id
              WHERE (fr.response_data->>'position_id')::INTEGER = cp.id
                AND f.batch_year = $1
                AND f.type = 'application'
            ),
            'documents', (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', pd.id,
                  'document_type', pd.document_type,
                  'document_title', pd.document_title,
                  'document_path', pd.document_path,
                  'file_type', pd.file_type,
                  'display_order', pd.display_order,
                  'uploaded_at', pd.uploaded_at,
                  'original_filename', pd.original_filename,
                  'download_url', CONCAT('${req.protocol}://${req.get(
      "host"
    )}/companies/documents/', REPLACE(pd.document_path, 'cgdc-docs/documents/', ''))
                ) ORDER BY pd.display_order, pd.uploaded_at
              )
              FROM position_documents pd 
              WHERE pd.position_id = cp.id
            )
          )
        ) FILTER (WHERE cp.id IS NOT NULL) as positions
      FROM companies c
      INNER JOIN company_batches cb ON c.id = cb.company_id
      LEFT JOIN batches b ON cb.batch_id = b.id
      LEFT JOIN company_positions cp ON c.id = cp.company_id
      LEFT JOIN company_eligibility ce ON c.id = ce.company_id AND cb.batch_id = ce.batch_id
      WHERE cb.batch_id = $2
      GROUP BY c.id, cb.batch_id, b.year, ce.total_eligible_count
      ORDER BY c.scheduled_visit DESC NULLS LAST, c.company_name
    `;

    const result = await db.query(query, [parseInt(batchYear), batchId]);

    // Calculate total selected students across all positions for each company
    const companiesWithStats = result.rows.map((company) => {
      const totalSelected = company.positions
        ? company.positions.reduce(
            (sum, pos) => sum + (pos.selected_students || 0),
            0
          )
        : 0;

      return {
        ...company,
        total_selected: totalSelected,
      };
    });

    res.json(companiesWithStats);
  } catch (err) {
    console.error("Error fetching companies by batch:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST - Create new company with positions (documents uploaded separately)
routes.post("/batch/:batchYear", upload.none(), async (req, res) => {
  const { batchYear } = req.params;
  const {
    company_name,
    company_description,
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
    min_cgpa,
    max_backlogs,
    bond_required = false,
    allowed_specializations = [],
    positions = [],
  } = req.body;

  // Basic validation - only truly required fields
  if (!company_name || !scheduled_visit || !batchYear) {
    return res.status(400).json({
      error:
        "Missing required fields: company_name, scheduled_visit, batchYear",
    });
  }

  if (isNaN(batchYear)) {
    return res.status(400).json({ error: "Invalid batch year" });
  }

  // Convert empty strings to null for optional fields and set defaults
  const processedData = {
    company_description: company_description?.trim() || null,
    sector: sector || "Others*",
    website_url: website_url?.trim() || null,
    linkedin_url: linkedin_url?.trim() || null,
    primary_hr_name: primary_hr_name?.trim() || null,
    primary_hr_designation: primary_hr_designation?.trim() || null,
    primary_hr_email: primary_hr_email?.trim() || null,
    primary_hr_phone: primary_hr_phone?.trim() || null,
    scheduled_visit: scheduled_visit,
    actual_arrival: actual_arrival,
    glassdoor_rating:
      glassdoor_rating && glassdoor_rating !== ""
        ? parseFloat(glassdoor_rating)
        : null,
    work_locations: work_locations?.trim() || null,
    min_cgpa: min_cgpa && min_cgpa !== "" ? parseFloat(min_cgpa) : 0.0,
    max_backlogs:
      max_backlogs && max_backlogs !== "" ? parseInt(max_backlogs) : 999,
  };

  // Validate allowed_specializations
  if (allowed_specializations && !Array.isArray(allowed_specializations)) {
    return res
      .status(400)
      .json({ error: "allowed_specializations must be an array" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Get batch ID
    const batchId = await getBatchIdFromYear(parseInt(batchYear));

    // Insert company
    const companyInsertQuery = `
      INSERT INTO companies (
        company_name, company_description, sector, is_marquee,
        website_url, linkedin_url, primary_hr_name, primary_hr_designation,
        primary_hr_email, primary_hr_phone, scheduled_visit, actual_arrival,
        glassdoor_rating, work_locations, min_cgpa, max_backlogs, bond_required,
        allowed_specializations, account_owner
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const companyValues = [
      company_name.trim(),
      processedData.company_description,
      processedData.sector,
      is_marquee,
      processedData.website_url,
      processedData.linkedin_url,
      processedData.primary_hr_name,
      processedData.primary_hr_designation,
      processedData.primary_hr_email,
      processedData.primary_hr_phone,
      processedData.scheduled_visit,
      processedData.actual_arrival,
      processedData.glassdoor_rating,
      processedData.work_locations,
      processedData.min_cgpa,
      processedData.max_backlogs,
      bond_required,
      allowed_specializations,
      req.body.account_owner || null,
    ];

    const companyResult = await client.query(companyInsertQuery, companyValues);
    const newCompany = companyResult.rows[0];

    // Insert company-batch relationship
    const batchRelationQuery = `
      INSERT INTO company_batches (company_id, batch_id) 
      VALUES ($1, $2)
    `;
    await client.query(batchRelationQuery, [newCompany.id, batchId]);

    // Insert positions without documents (documents uploaded separately)
    const insertedPositions = await createPositionsWithoutDocuments(
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

// PUT - Update company for a specific batch (documents handled separately)
routes.put("/:id/batch/:batchYear", async (req, res) => {
  const { id, batchYear } = req.params;
  const {
    company_name,
    company_description,
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
    return res.status(400).json({ error: "Invalid company or batch year" });
  }

  // Use processedData for consistency
  const processedData = {
    company_name: company_name?.trim() || null,
    company_description: company_description?.trim() || null,
    sector: sector || null,
    is_marquee: is_marquee,
    website_url: website_url?.trim() || null,
    linkedin_url: linkedin_url?.trim() || null,
    primary_hr_name: primary_hr_name?.trim() || null,
    primary_hr_designation: primary_hr_designation?.trim() || null,
    primary_hr_email: primary_hr_email?.trim() || null,
    primary_hr_phone: primary_hr_phone?.trim() || null,
    scheduled_visit: scheduled_visit,
    actual_arrival: actual_arrival,
    glassdoor_rating:
      glassdoor_rating && glassdoor_rating !== ""
        ? parseFloat(glassdoor_rating)
        : null,
    work_locations: work_locations?.trim() || null,
    min_cgpa: min_cgpa && min_cgpa !== "" ? parseFloat(min_cgpa) : null,
    max_backlogs:
      max_backlogs && max_backlogs !== "" ? parseInt(max_backlogs) : null,
    bond_required: bond_required,
  };

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Check if company exists in the specified batch
    const existingCompanyQuery = `
      SELECT c.* FROM companies c
      JOIN company_batches cb ON c.id = cb.company_id
      WHERE c.id = $1 AND cb.batch_id = $2
    `;

    // Get batch ID
    const batchId = await getBatchIdFromYear(parseInt(batchYear));

    const existingCompany = await client.query(existingCompanyQuery, [
      id,
      batchId,
    ]);

    if (existingCompany.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Company not found in specified batch" });
    }

    // Update company using processedData
    const updateQuery = `
      UPDATE companies SET
        company_name = $2,
        company_description = $3,
        sector = $4,
        is_marquee = $5,
        website_url = $6,
        linkedin_url = $7,
        primary_hr_name = $8,
        primary_hr_designation = $9,
        primary_hr_email = $10,
        primary_hr_phone = $11,
        scheduled_visit = $12,
        actual_arrival = $13,
        glassdoor_rating = $14,
        work_locations = $15,
        min_cgpa = $16,
        max_backlogs = $17,
        bond_required = $18,
        account_owner = $19,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const updateValues = [
      id,
      processedData.company_name,
      processedData.company_description,
      processedData.sector,
      processedData.is_marquee,
      processedData.website_url,
      processedData.linkedin_url,
      processedData.primary_hr_name,
      processedData.primary_hr_designation,
      processedData.primary_hr_email,
      processedData.primary_hr_phone,
      processedData.scheduled_visit,
      processedData.actual_arrival,
      processedData.glassdoor_rating,
      processedData.work_locations,
      processedData.min_cgpa,
      processedData.max_backlogs,
      processedData.bond_required,
      req.body.account_owner || null,
    ];

    const updateResult = await client.query(updateQuery, updateValues);

    // Handle positions efficiently
    let updatedPositions = [];
    if (positions && positions.length > 0) {
      // Get existing positions
      const existingPositionsQuery =
        "SELECT * FROM company_positions WHERE company_id = $1";
      const existingPositionsResult = await client.query(
        existingPositionsQuery,
        [id]
      );

      // Update positions efficiently
      updatedPositions = await updatePositionsEfficiently(
        client,
        id,
        existingPositionsResult.rows,
        positions
      );
    }

    await client.query("COMMIT");
    res.json({
      batch_id: parseInt(batchYear),
      positions: updatedPositions,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating company:", err);
    res.status(500).json({ error: err.message || "Failed to update company" });
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

    const batchId = await getBatchIdFromYear(parseInt(batchYear));

    // Check if company exists in this batch
    const existingCompany = await client.query(
      `
      SELECT c.* 
      FROM companies c
      JOIN company_batches cb ON c.id = cb.company_id
      WHERE c.id = $1 AND cb.batch_id = $2
      `,
      [id, batchId]
    );

    if (existingCompany.rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: "Company not found in specified batch" });
    }

    // Get all documents to delete physical files
    const documentsQuery = `
      SELECT pd.document_path
      FROM position_documents pd
      JOIN company_positions cp ON pd.position_id = cp.id
      WHERE cp.company_id = $1
    `;
    const documentsResult = await client.query(documentsQuery, [id]);

    // Delete physical files
    for (const doc of documentsResult.rows) {
      try {
        const filePath = path.join(process.cwd(), doc.document_path);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue even if file deletion fails
      }
    }

    // Delete the company → cascade handles everything else
    await client.query("DELETE FROM companies WHERE id = $1", [id]);

    await client.query("COMMIT");
    res
      .status(200)
      .json({ message: "Company (and related data) deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting company:", err);
    res.status(500).json({
      error: "Failed to delete company",
    });
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

    // Ensure position exists and get documents
    const existingPosition = await client.query(
      "SELECT * FROM company_positions WHERE id = $1",
      [positionId]
    );
    console.log("🏢 Existing position for delete:", existingPosition.rows);

    if (existingPosition.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Position not found" });
    }

    // Get all documents for this position to delete physical files
    const documentsQuery = `
      SELECT document_path FROM position_documents WHERE position_id = $1
    `;
    const documentsResult = await client.query(documentsQuery, [positionId]);
    console.log("🗑️ Documents to delete for position:", documentsResult.rows);

    // Delete physical files
    for (const doc of documentsResult.rows) {
      try {
        const filePath = path.join(process.cwd(), doc.document_path);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue even if file deletion fails
      }
    }

    // Delete the position → documents cascade
    await client.query("DELETE FROM company_positions WHERE id = $1", [
      positionId,
    ]);
    console.log("✅ Position deleted:", positionId);

    await client.query("COMMIT");
    res.json({ message: "Position (and documents) deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting position:", err);
    res.status(500).json({ error: "Failed to delete position" });
  } finally {
    client.release();
  }
});

// ***************************************************
// *************** Document Endpoints ****************

// File serving endpoint
routes.use("/documents", (req, res) => {
  // Decode the URL path to handle spaces and special characters
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(req.path.substring(1)); // Remove leading slash and decode
  } catch (error) {
    return res.status(400).json({ error: "Invalid URL encoding" });
  }

  if (!requestedPath) {
    return res.status(400).json({ error: "File path is required" });
  }

  // Convert forward slashes to system path separators
  const filePath = path.join(process.cwd(), requestedPath);

  // Security check
  const basePath = path.join(process.cwd(), "cgdc-docs");
  const resolvedFilePath = path.resolve(filePath);
  const resolvedBasePath = path.resolve(basePath);

  if (!resolvedFilePath.startsWith(resolvedBasePath)) {
    return res.status(403).json({ error: "Access denied" });
  }

  // Use Express's built-in sendFile method
  res.sendFile(resolvedFilePath, (err) => {
    if (err) {
      console.error("File serving error:", err);
      if (err.code === "ENOENT") {
        res.status(404).json({ error: "File not found" });
      } else if (!res.headersSent) {
        res.status(500).json({ error: "Server error" });
      }
    }
  });
});

// GET all documents for a specific position
routes.get("/position/:positionId/documents", async (req, res) => {
  const { positionId } = req.params;

  if (!positionId || isNaN(positionId)) {
    return res.status(400).json({ error: "Invalid position ID" });
  }

  try {
    const query = `
      SELECT 
        id,
        position_id,
        document_type,
        document_title,
        document_path,
        display_order,
        original_filename
      FROM position_documents
      WHERE position_id = $1
      ORDER BY display_order ASC
    `;

    const result = await db.query(query, [positionId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// File/Document upload endpoint
routes.post(
  "/batch/:batchYear/position/:positionId/documents",
  upload.array("documents"),
  async (req, res) => {
    try {
      const { positionId, batchYear } = req.params;
      const {
        document_types = [],
        document_titles = [],
        display_orders = [],
      } = req.body;
      const files = req.files || [];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No documents uploaded" });
      }

      const insertedDocs = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const docType = Array.isArray(document_types)
          ? document_types[i] || "other"
          : document_types || "other";

        const docTitle = Array.isArray(document_titles)
          ? document_titles[i] || file.originalname
          : document_titles || file.originalname;

        const displayOrder = Array.isArray(display_orders)
          ? parseInt(display_orders[i]) || i + 1
          : parseInt(display_orders) || i + 1;

        // If any critical field missing, log it
        if (!docType || !docTitle) {
          console.error("⚠️ Missing required document fields:", {
            docType,
            docTitle,
            displayOrder,
            file: file.originalname,
          });
        }

        // Insert into DB
        const result = await db.query(
          `
          INSERT INTO position_documents
            (position_id, document_type, document_title, document_path, file_type, display_order, original_filename)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `,
          [
            positionId,
            docType,
            docTitle,
            path.join("cgdc-docs", "documents", batchYear, file.filename),
            path.extname(file.originalname).slice(1), // e.g. pdf
            displayOrder,
            file.originalname,
          ]
        );

        insertedDocs.push(result.rows[0]);
      }

      res.status(201).json(insertedDocs);
    } catch (err) {
      console.error("❌ Error uploading documents:", err);
      res.status(500).json({ error: "Failed to upload documents" });
    }
  }
);

// PUT endpoint for updating document metadata only
routes.put("/documents/:documentId", async (req, res) => {
  const { documentId } = req.params;
  const { document_title, document_type, display_order } = req.body;

  if (!documentId || isNaN(documentId)) {
    return res.status(400).json({ error: "Invalid document ID" });
  }

  // Only allow metadata fields to be updated
  const fields = [];
  const values = [];
  let idx = 1;

  if (document_title !== undefined) {
    fields.push(`document_title = $${idx++}`);
    values.push(document_title);
  }
  if (document_type !== undefined) {
    fields.push(`document_type = $${idx++}`);
    values.push(document_type);
  }
  if (display_order !== undefined) {
    fields.push(`display_order = $${idx++}`);
    values.push(display_order);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No metadata fields provided" });
  }

  values.push(documentId);

  const updateQuery = `
    UPDATE position_documents
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING *
  `;

  try {
    const result = await db.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({
      message: "Document metadata updated",
      document: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating document metadata:", err);
    res.status(500).json({ error: "Failed to update document metadata" });
  }
});

// DELETE endpoint for deleting a document
routes.delete("/documents/:documentId", async (req, res) => {
  const { documentId } = req.params;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Get document info
    const getDocQuery = "SELECT * FROM position_documents WHERE id = $1";
    const docResult = await client.query(getDocQuery, [documentId]);

    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const document = docResult.rows[0];
    const filePath = path.join(process.cwd(), document.document_path);

    // Delete from database
    const deleteQuery = "DELETE FROM position_documents WHERE id = $1";
    await client.query(deleteQuery, [documentId]);

    // Delete physical file
    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error("Error deleting file:", fileError);
      // Continue even if file deletion fails
    }

    await client.query("COMMIT");

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  } finally {
    client.release();
  }
});

// ************ End of Document Endpoints ************
// ***************************************************
// GET companies with active positions for a specific batch year
routes.get("/with-active-positions/:batchYear", async (req, res) => {
  try {
    const { batchYear } = req.params;

    if (!batchYear || isNaN(batchYear)) {
      return res.status(400).json({ error: "Invalid batch year" });
    }

    const query = `
      SELECT 
          c.id AS company_id,
          c.company_name,
          p.id AS position_id,
          p.position_title,
          p.job_type,
          b.year AS batch_year
      FROM companies c
      JOIN company_positions p ON c.id = p.company_id
      JOIN company_batches cb ON c.id = cb.company_id
      JOIN batches b ON cb.batch_id = b.id
      WHERE b.year = $1
        -- Exclude positions that already have a "last" round event
        AND NOT EXISTS (
          SELECT 1 
          FROM events e
          WHERE e.company_id = c.id
            AND e.round_type = 'last'
            AND p.id = ANY(e.position_ids)
        )
      ORDER BY c.company_name, p.position_title;
    `;

    const { rows } = await db.query(query, [batchYear]);

    // Group positions under their companies
    const companies = {};
    rows.forEach((row) => {
      if (!companies[row.company_id]) {
        companies[row.company_id] = {
          company_id: row.company_id,
          company_name: row.company_name,
          batch_year: row.batch_year,
          positions: [],
        };
      }

      companies[row.company_id].positions.push({
        position_id: row.position_id,
        position_title: row.position_title,
        is_active: row.is_active,
        job_type: row.job_type,
      });
    });

    res.json({
      success: true,
      data: Object.values(companies),
    });
  } catch (error) {
    console.error("Error fetching companies with active positions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = routes;

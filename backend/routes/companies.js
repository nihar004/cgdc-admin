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
        package,
        internship_stipend_monthly,
        rounds_start_date,
        rounds_end_date,
        has_range,
        package_end,
      } = position;

      // Process optional fields to handle empty strings
      const processedPosition = {
        position_title: position_title?.trim() || null,
        job_type: job_type || "full_time",
        company_type: company_type || "tech", // Add default
        package:
          package && package !== "" && !isNaN(package)
            ? parseFloat(package)
            : -1,
        internship_stipend_monthly: internship_stipend_monthly?.trim() || null,
        rounds_start_date:
          rounds_start_date?.trim() && rounds_start_date.trim() !== ""
            ? rounds_start_date.trim()
            : null,
        rounds_end_date:
          rounds_end_date?.trim() && rounds_end_date.trim() !== ""
            ? rounds_end_date.trim()
            : null,
        has_range: has_range === "true" || has_range === true,
        package_end:
          package_end && package_end !== "" && !isNaN(package_end)
            ? parseFloat(package_end)
            : -1,
      };

      // Relaxed compensation validation - only validate if values are provided
      // This allows positions to be created without compensation details initially
      if (
        processedPosition.job_type === "internship" &&
        processedPosition.package !== null &&
        processedPosition.internship_stipend_monthly === null
      ) {
        throw new Error(
          "internship_stipend_monthly should be provided for internship positions when compensation is specified"
        );
      }

      if (
        processedPosition.job_type === "full_time" &&
        processedPosition.internship_stipend_monthly !== null &&
        processedPosition.package === null
      ) {
        throw new Error(
          "package should be provided for full_time positions when compensation is specified"
        );
      }

      // Insert position
      const positionInsertQuery = `
        INSERT INTO company_positions (
          company_id, position_title, job_type, company_type,
          package, internship_stipend_monthly, 
          rounds_start_date, rounds_end_date,
          has_range, package_end
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      try {
        const positionResult = await client.query(positionInsertQuery, [
          companyId,
          processedPosition.position_title,
          processedPosition.job_type,
          processedPosition.company_type,
          processedPosition.package,
          processedPosition.internship_stipend_monthly,
          processedPosition.rounds_start_date,
          processedPosition.rounds_end_date,
          processedPosition.has_range,
          processedPosition.package_end,
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
          package = $5,
          internship_stipend_monthly = $6,
          rounds_start_date = $7,
          rounds_end_date = $8,
          has_range = $10,
          package_end = $11,
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
          processedPosition.package,
          processedPosition.internship_stipend_monthly,
          processedPosition.rounds_start_date,
          processedPosition.rounds_end_date,
          companyId,
          processedPosition.has_range,
          processedPosition.package_end,
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
          package, internship_stipend_monthly, 
          rounds_start_date, rounds_end_date,
          has_range, package_end
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      try {
        const result = await client.query(insertQuery, [
          companyId,
          processedPosition.position_title,
          processedPosition.job_type,
          processedPosition.company_type,
          processedPosition.package,
          processedPosition.internship_stipend_monthly,
          processedPosition.rounds_start_date,
          processedPosition.rounds_end_date,
          processedPosition.has_range,
          processedPosition.package_end,
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
    package:
      position.package && position.package !== "" && !isNaN(position.package)
        ? parseFloat(position.package)
        : -1,
    internship_stipend_monthly:
      position.internship_stipend_monthly?.trim() || null,
    rounds_start_date:
      position.rounds_start_date?.trim() &&
      position.rounds_start_date.trim() !== ""
        ? position.rounds_start_date.trim()
        : null,
    rounds_end_date:
      position.rounds_end_date?.trim() && position.rounds_end_date.trim() !== ""
        ? position.rounds_end_date.trim()
        : null,
    has_range: position.has_range === "true" || position.has_range === true,
    package_end:
      position.package_end &&
      position.package_end !== "" &&
      !isNaN(position.package_end)
        ? parseFloat(position.package_end)
        : -1,
  };

  // Validation
  if (
    processedPosition.job_type === "internship" &&
    processedPosition.package !== null &&
    processedPosition.internship_stipend_monthly === null
  ) {
    throw new Error(
      "internship_stipend_monthly should be provided for internship positions when compensation is specified"
    );
  }

  if (
    processedPosition.job_type === "full_time" &&
    processedPosition.internship_stipend_monthly !== null &&
    processedPosition.package === null
  ) {
    throw new Error(
      "package should be provided for full_time positions when compensation is specified"
    );
  }

  return processedPosition;
}

// Helper function to calculate company status and round dates
async function calculateCompanyStatusAndDates(companyId) {
  const query = `
    SELECT 
      rounds_start_date,
      rounds_end_date
    FROM company_positions
    WHERE company_id = $1
  `;

  const result = await db.query(query, [companyId]);
  const positions = result.rows;

  if (positions.length === 0) {
    return {
      company_rounds_start_date: null,
      company_rounds_end_date: null,
    };
  }

  // Filter positions that have a start date
  const relevantPositions = positions.filter(
    (p) => p.rounds_start_date !== null
  );

  if (relevantPositions.length === 0) {
    return {
      company_rounds_start_date: null,
      company_rounds_end_date: null,
    };
  }

  // Get earliest start date from all positions
  const startDates = relevantPositions
    .map((p) => new Date(p.rounds_start_date))
    .filter((d) => !isNaN(d.getTime()));

  const company_rounds_start_date =
    startDates.length > 0 ? new Date(Math.min(...startDates)) : null;

  // Get latest end date, but only if ALL positions have end dates
  const endDates = relevantPositions
    .map((p) => p.rounds_end_date)
    .filter((d) => d !== null)
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d.getTime()));

  // Only set end date if ALL relevant positions have end dates
  const company_rounds_end_date =
    endDates.length === relevantPositions.length && endDates.length > 0
      ? new Date(Math.max(...endDates))
      : null;

  return {
    company_rounds_start_date,
    company_rounds_end_date,
  };
}

// Helper function to determine company status
function getCompanyStatus(
  jd_shared_date,
  company_rounds_start_date,
  company_rounds_end_date
) {
  if (company_rounds_end_date !== null) {
    return "completed";
  }

  if (company_rounds_start_date !== null) {
    return "ongoing";
  }

  if (jd_shared_date !== null) {
    return "jd_shared";
  }

  return null;
}

// ************** END Helper functions **************
// **************************************************

// GET all companies for a specific batch with positions, documents, and calculated status
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
        ) as total_registered,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', cp.id,
            'position_title', cp.position_title,
            'job_type', cp.job_type,
            'company_type', cp.company_type,
            'package', cp.package,
            'has_range', cp.has_range,
            'package_end', cp.package_end,
            'internship_stipend_monthly', cp.internship_stipend_monthly,
            'rounds_start_date', cp.rounds_start_date,
            'rounds_end_date', cp.rounds_end_date,
            'selected_students', (
              SELECT COUNT(DISTINCT s.id)
              FROM students s
              WHERE EXISTS (
                SELECT 1
                FROM jsonb_array_elements(s.offers_received) AS offer
                WHERE 
                  offer->>'source' = 'campus'
                  AND (offer->>'company_id')::INT = c.id
                  AND (offer->>'position_id')::INT = cp.id
              )
            ),
            -- Count registered students for this specific position
            'registered_students', (
              SELECT COUNT(DISTINCT fr.student_id)
              FROM form_responses fr
              INNER JOIN forms f ON fr.form_id = f.id
              WHERE (fr.response_data->>'position_id')::INTEGER = cp.id
                AND f.batch_year = $1
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
    )}/api/companies/documents/', pd.document_path)
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
      ORDER BY c.company_name
    `;

    const result = await db.query(query, [parseInt(batchYear), batchId]);

    // Calculate status and dates for each company using helper functions
    const companiesWithStats = await Promise.all(
      result.rows.map(async (company) => {
        const positions = company.positions || [];

        // Calculate company round dates
        const { company_rounds_start_date, company_rounds_end_date } =
          await calculateCompanyStatusAndDates(company.id);

        // Determine status using helper function
        const status = getCompanyStatus(
          company.jd_shared_date,
          company_rounds_start_date,
          company_rounds_end_date
        );

        // Calculate total selected students
        const totalSelected = positions.reduce(
          (sum, pos) => sum + (pos.selected_students || 0),
          0
        );

        return {
          ...company,
          total_selected: totalSelected,
          company_rounds_start_date,
          company_rounds_end_date,
          status,
        };
      })
    );

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
    glassdoor_rating,
    work_locations,
    min_cgpa,
    max_backlogs,
    bond_required = false,
    allowed_specializations = [],
    positions = [],
    office_address,
    jd_shared_date,
    eligibility_10th,
    eligibility_12th,
  } = req.body;

  // Basic validation - only truly required fields
  if (!company_name || !batchYear) {
    return res.status(400).json({
      error: "Missing required fields: company_name, batchYear",
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
    glassdoor_rating:
      glassdoor_rating && glassdoor_rating !== ""
        ? parseFloat(glassdoor_rating)
        : null,
    work_locations: work_locations?.trim() || null,
    min_cgpa: min_cgpa && min_cgpa !== "" ? parseFloat(min_cgpa) : 0.0,
    max_backlogs: max_backlogs === "true" || max_backlogs === true,
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

    const companyInsertQuery = `
      INSERT INTO companies (
        company_name, company_description, sector, is_marquee,
        website_url, linkedin_url, primary_hr_name, primary_hr_designation,
        primary_hr_email, primary_hr_phone, glassdoor_rating, work_locations, 
        min_cgpa, max_backlogs, bond_required, allowed_specializations, account_owner, 
        office_address, jd_shared_date, eligibility_10th, eligibility_12th
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
              $13, $14, $15, $16, $17, $18, $19, $20, $21)
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
      processedData.glassdoor_rating,
      processedData.work_locations,
      processedData.min_cgpa,
      processedData.max_backlogs,
      bond_required,
      allowed_specializations,
      req.body.account_owner || null,
      office_address?.trim() || null,
      jd_shared_date || null,
      eligibility_10th ? parseFloat(eligibility_10th) : null,
      eligibility_12th ? parseFloat(eligibility_12th) : null,
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
    is_marquee = false,
    website_url,
    linkedin_url,
    primary_hr_name,
    primary_hr_designation,
    primary_hr_email,
    primary_hr_phone,
    glassdoor_rating,
    work_locations,
    min_cgpa,
    max_backlogs,
    bond_required = false,
    allowed_specializations = [],
    positions = [],
    office_address,
    jd_shared_date,
    eligibility_10th,
    eligibility_12th,
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
    glassdoor_rating:
      glassdoor_rating && glassdoor_rating !== ""
        ? parseFloat(glassdoor_rating)
        : null,
    work_locations: work_locations?.trim() || null,
    min_cgpa: min_cgpa && min_cgpa !== "" ? parseFloat(min_cgpa) : null,
    max_backlogs: max_backlogs === "true" || max_backlogs === true,
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
        glassdoor_rating = $12,
        work_locations = $13,
        min_cgpa = $14,
        max_backlogs = $15,
        bond_required = $16,
        allowed_specializations = $17,
        account_owner = $18,
        office_address = $19, 
        jd_shared_date = $20,
        eligibility_10th = $21, 
        eligibility_12th = $22, 
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
      processedData.glassdoor_rating,
      processedData.work_locations,
      processedData.min_cgpa,
      processedData.max_backlogs,
      processedData.bond_required,
      allowed_specializations,
      req.body.account_owner || null,
      office_address?.trim() || null,
      jd_shared_date || null,
      eligibility_10th ? parseFloat(eligibility_10th) : null,
      eligibility_12th ? parseFloat(eligibility_12th) : null,
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

    const existingPosition = await client.query(
      "SELECT * FROM company_positions WHERE id = $1",
      [positionId]
    );

    if (existingPosition.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Position not found" });
    }

    const documentsQuery = `
      SELECT document_path FROM position_documents WHERE position_id = $1
    `;
    const documentsResult = await client.query(documentsQuery, [positionId]);

    for (const doc of documentsResult.rows) {
      try {
        const filePath = path.join(process.cwd(), doc.document_path);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError.message);
      }
    }

    await client.query("DELETE FROM company_positions WHERE id = $1", [
      positionId,
    ]);

    await client.query("COMMIT");
    res.json({ message: "Position (and documents) deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting position:", err.message);
    res.status(500).json({ error: "Failed to delete position" });
  } finally {
    client.release();
  }
});

// ***************************************************
// *************** Document Endpoints ****************

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
    console.error("Error fetching documents:", error.message);
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

        const documentPath = `cgdc-docs/documents/${batchYear}/${file.filename}`;
        const fileType = path.extname(file.originalname).slice(1);

        try {
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
              documentPath,
              fileType,
              displayOrder,
              file.originalname,
            ]
          );
          insertedDocs.push(result.rows[0]);
        } catch (dbError) {
          console.error("Database insert failed:", dbError);
          throw dbError;
        }
      }

      res.status(201).json(insertedDocs);
    } catch (err) {
      console.error("Upload failed:", err.message);
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
    console.error("Update failed:", err.message);
    res.status(500).json({ error: "Failed to update document metadata" });
  }
});

// DELETE endpoint for deleting a document
routes.delete("/documents/:documentId", async (req, res) => {
  const { documentId } = req.params;

  if (!documentId || isNaN(documentId)) {
    return res.status(400).json({ error: "Invalid document ID" });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const getDocQuery = "SELECT * FROM position_documents WHERE id = $1";
    const docResult = await client.query(getDocQuery, [documentId]);

    if (docResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Document not found" });
    }

    const document = docResult.rows[0];
    const filePath = path.join(process.cwd(), document.document_path);

    const deleteQuery = "DELETE FROM position_documents WHERE id = $1";
    await client.query(deleteQuery, [documentId]);

    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error("Error deleting physical file:", fileError.message);
    }

    await client.query("COMMIT");
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete operation failed:", error.message);
    res.status(500).json({ error: "Failed to delete document" });
  } finally {
    client.release();
  }
});

routes.get("/documents/*", (req, res) => {
  let requestedPath;
  try {
    const pathMatch = req.path.match(/^\/documents\/(?:file\/)?(.*)/);

    if (!pathMatch || !pathMatch[1]) {
      return res.status(400).json({ error: "File path is required" });
    }

    requestedPath = decodeURIComponent(pathMatch[1]);
    requestedPath = requestedPath.replace(/\\/g, "/");
  } catch (error) {
    console.error("URL decoding failed:", error.message);
    return res.status(400).json({ error: "Invalid URL encoding" });
  }

  if (!requestedPath) {
    return res.status(400).json({ error: "File path is required" });
  }

  const filePath = path.join(process.cwd(), requestedPath);
  const basePath = path.join(process.cwd(), "cgdc-docs");
  const resolvedFilePath = path.resolve(filePath);
  const resolvedBasePath = path.resolve(basePath);

  if (!resolvedFilePath.startsWith(resolvedBasePath)) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.sendFile(resolvedFilePath, (err) => {
    if (err) {
      console.error("File serving error:", err.message);

      if (err.code === "ENOENT") {
        res.status(404).json({ error: "File not found" });
      } else if (!res.headersSent) {
        res.status(500).json({ error: "Server error" });
      }
    }
  });
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

/**
 * GET /api/companies/:companyId/positions
 * Get all positions for a specific company
 * Returns minimal data needed for selection dropdown - in students/ManualOffersModal.js
 */
routes.get("/:companyId/positions", async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await db.query(
      `SELECT 
        id as position_id,
        position_title,
        package,
        has_range,
        package_end,
        job_type,
        company_type,
        internship_stipend_monthly as stipend
      FROM company_positions 
      WHERE company_id = $1
      ORDER BY position_title ASC`,
      [companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No positions found for this company",
      });
    }

    res.json({
      success: true,
      data: {
        company_id: parseInt(companyId),
        positions: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error("Error fetching company positions:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

/**
 * GET /api/companies/:companyId/positions/:positionId
 * Get full details of a specific position
 * Used for fetching complete offer details
 */
routes.get("/:companyId/positions/:positionId", async (req, res) => {
  try {
    const { companyId, positionId } = req.params;

    const result = await db.query(
      `SELECT 
        cp.*,
        c.company_name
      FROM company_positions cp
      JOIN companies c ON c.id = cp.company_id
      WHERE cp.id = $1 AND cp.company_id = $2`,
      [positionId, companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Position not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching position details:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = routes;

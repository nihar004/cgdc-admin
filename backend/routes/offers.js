const express = require("express");
const routes = express.Router();
const db = require("../db");

// ============================================
// 1. ADD/UPDATE MANUAL OFFER (Off-Campus)
// ============================================
/**
 * POST /api/students/:studentId/offers/manual
 * Add or update a manual offer for off-campus placements
 * If offer_id is provided and it's a manual offer, it will update
 * Otherwise, it creates a new offer
 */
routes.post("/students/:studentId/offers/manual", async (req, res) => {
  const client = await db.connect();

  try {
    const { studentId } = req.params;
    const {
      offer_id, // Optional: provide this to update existing manual offer
      company_name,
      position_title,
      package: offerPackage,
      has_range, // Add this
      package_end, // Add this
      offer_date,
      joining_date, // Add this
      company_type, // 'tech' or 'non-tech'
      job_type, // 'internship', 'full_time', 'internship_plus_ppo'
      stipend,
      work_location,
      bond_details,
      additional_details,
    } = req.body;

    // Validation
    if (!company_name || !position_title || !offerPackage || !company_type) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: company_name, position_title, package, company_type",
      });
    }

    // Add package range validation
    if (
      has_range &&
      (!package_end || parseFloat(package_end) <= parseFloat(offerPackage))
    ) {
      return res.status(400).json({
        success: false,
        error: "Package end range must be greater than start package",
      });
    }

    const parsedPackage = parseFloat(offerPackage);
    if (isNaN(parsedPackage) || (parsedPackage < 0 && parsedPackage !== -1)) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid package value. Use a positive number or -1 if undisclosed.",
      });
    }

    await client.query("BEGIN");

    // Get current student data
    const studentResult = await client.query(
      "SELECT offers_received, current_offer, placement_status FROM students WHERE id = $1",
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const student = studentResult.rows[0];
    let offersReceived = Array.isArray(student.offers_received)
      ? student.offers_received
      : [];
    let isUpdate = false;
    let offerIndex = -1;

    // Check if updating existing manual offer
    if (offer_id) {
      offerIndex = offersReceived.findIndex((o) => o.offer_id === offer_id);

      if (offerIndex !== -1) {
        // Check if it's a manual offer (can only update manual offers)
        if (offersReceived[offerIndex].source !== "manual") {
          await client.query("ROLLBACK");
          return res.status(403).json({
            success: false,
            error:
              "Cannot update campus offers. Only manual offers can be updated.",
          });
        }
        isUpdate = true;
      }
    }

    // Create/Update offer object with consistent structure
    const offerData = {
      offer_id: offer_id || `MANUAL_${Date.now()}`,
      company_id: null, // Always null for manual entries
      position_id: null, // Always null for manual entries
      company_name,
      position_title,
      package: parseFloat(offerPackage),
      has_range: has_range || false,
      package_end: has_range ? parseFloat(package_end) : null,
      offer_date: offer_date || new Date().toISOString().split("T")[0],
      joining_date: joining_date || null,
      acceptance_date: null, // Set only when accepting offer
      company_type,
      job_type: job_type || "full_time",
      stipend: stipend || null,
      work_location: work_location || null,
      bond_details: bond_details || null,
      source: "manual", // Differentiates from 'campus'
      is_accepted: false,
      additional_details,
      created_at: isUpdate
        ? offersReceived[offerIndex].created_at
        : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let message;
    if (isUpdate) {
      // Update existing offer
      offersReceived[offerIndex] = {
        ...offersReceived[offerIndex],
        ...offerData,
      };
      message = "Manual offer updated successfully";
    } else {
      // Add new offer
      offersReceived.push(offerData);
      message = "Manual offer added successfully";
    }

    // Update student record
    await client.query(
      `UPDATE students 
       SET offers_received = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [JSON.stringify(offersReceived), studentId]
    );

    await client.query("COMMIT");

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message,
      data: {
        offer: offerData,
        total_offers: offersReceived.length,
        is_update: isUpdate,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding/updating manual offer:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  } finally {
    client.release();
  }
});

// ============================================
// 2. UPDATE CURRENT OFFER (Accept Offer)
// ============================================
/**
 * PUT /api/students/:studentId/offers/current
 * Update the current accepted offer of a student
 * Works for both campus and manual offers
 */
routes.put("/students/:studentId/offers/current", async (req, res) => {
  const client = await db.connect();

  try {
    const { studentId } = req.params;
    const {
      offer_id, // Required: ID from offers_received array
      acceptance_date,
    } = req.body;

    if (!offer_id) {
      return res.status(400).json({
        success: false,
        error: "offer_id is required",
      });
    }

    await client.query("BEGIN");

    // Get current student data
    const studentResult = await client.query(
      `SELECT offers_received, current_offer, placement_status 
       FROM students WHERE id = $1`,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const student = studentResult.rows[0];
    let offersReceived = Array.isArray(student.offers_received)
      ? student.offers_received
      : [];

    // Find the selected offer
    const selectedOffer = offersReceived.find((o) => o.offer_id === offer_id);

    if (!selectedOffer) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Offer not found in student offers",
      });
    }

    // Mark all offers as not accepted, then mark selected one as accepted
    offersReceived = offersReceived.map((offer) => ({
      ...offer,
      is_accepted: offer.offer_id === offer_id,
      acceptance_date:
        offer.offer_id === offer_id
          ? acceptance_date || new Date().toISOString().split("T")[0]
          : offer.acceptance_date,
    }));

    const currentOffer = {
      offer_id: selectedOffer.offer_id,
      company_id: selectedOffer.company_id,
      position_id: selectedOffer.position_id,
      source: selectedOffer.source,
      acceptance_date:
        acceptance_date || new Date().toISOString().split("T")[0],
      work_location: selectedOffer.work_location,
      // Only include full details if it's a manual offer
      ...(selectedOffer.source === "manual" && {
        company_name: selectedOffer.company_name,
        position_title: selectedOffer.position_title,
        package: selectedOffer.package,
        has_range: selectedOffer.has_range,
        package_end: selectedOffer.package_end,
        job_type: selectedOffer.job_type,
        company_type: selectedOffer.company_type,
        stipend: selectedOffer.stipend,
      }),
    };

    // Update placement status to 'placed'
    await client.query(
      `UPDATE students 
       SET current_offer = $1,
           offers_received = $2,
           placement_status = 'placed',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [JSON.stringify(currentOffer), JSON.stringify(offersReceived), studentId]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Current offer updated successfully",
      data: {
        current_offer: currentOffer,
        placement_status: "placed",
        offer_source: selectedOffer.source,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating current offer:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  } finally {
    client.release();
  }
});

routes.get("/students/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const result = await db.query("SELECT * FROM students WHERE id = $1", [
    studentId,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.json(result.rows[0]);
});

// ============================================
// 3. DELETE MANUAL OFFER
// ============================================
/**
 * DELETE /api/students/:studentId/offers/manual/:offerId
 * Delete a manual offer from student's offers_received
 * Only manual offers can be deleted, campus offers are protected
 */
routes.delete(
  "/students/:studentId/offers/manual/:offerId",
  async (req, res) => {
    const client = await db.connect();

    try {
      const { studentId, offerId } = req.params;

      await client.query("BEGIN");

      const studentResult = await client.query(
        "SELECT offers_received, current_offer, placement_status FROM students WHERE id = $1",
        [studentId]
      );

      if (studentResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Student not found",
        });
      }

      const student = studentResult.rows[0];
      let offersReceived = student.offers_received || [];

      const offerIndex = offersReceived.findIndex(
        (o) => o.offer_id === offerId
      );

      if (offerIndex === -1) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Offer not found",
        });
      }

      // Check if it's a manual offer
      if (offersReceived[offerIndex].source !== "manual") {
        await client.query("ROLLBACK");
        return res.status(403).json({
          success: false,
          error:
            "Cannot delete campus offers. Only manual offers can be deleted.",
          offer_source: offersReceived[offerIndex].source,
        });
      }

      // Check if this is the current accepted offer
      const isCurrentOffer =
        student.current_offer && student.current_offer.offer_id === offerId;

      // Remove the offer
      const deletedOffer = offersReceived[offerIndex];
      offersReceived.splice(offerIndex, 1);

      // If current offer was deleted, clear it and update placement status
      let updateQuery, updateParams;

      if (isCurrentOffer) {
        updateQuery = `UPDATE students 
         SET offers_received = $1,
             current_offer = NULL,
             placement_status = CASE 
               WHEN $2 > 0 THEN 'unplaced'
               ELSE 'unplaced' 
             END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`;
        updateParams = [
          JSON.stringify(offersReceived),
          offersReceived.length,
          studentId,
        ];
      } else {
        updateQuery = `UPDATE students 
         SET offers_received = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`;
        updateParams = [JSON.stringify(offersReceived), studentId];
      }

      await client.query(updateQuery, updateParams);

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Manual offer deleted successfully",
        data: {
          deleted_offer: {
            offer_id: deletedOffer.offer_id,
            company_name: deletedOffer.company_name,
            position_title: deletedOffer.position_title,
          },
          remaining_offers: offersReceived.length,
          current_offer_cleared: isCurrentOffer,
          placement_status_updated: isCurrentOffer,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting manual offer:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        details: error.message,
      });
    } finally {
      client.release();
    }
  }
);

/**
 * This function should be called when a student gets placed through campus
 * It adds the offer to offers_received with source='campus'
 */
async function addCampusOffer(
  studentId,
  companyId,
  positionId,
  offerDetails = {}
) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const positionResult = await client.query(
      `
      SELECT 
        cp.position_title, 
        cp.package, 
        cp.has_range,
        cp.package_end,
        cp.job_type, 
        cp.internship_stipend_monthly, 
        cp.company_type,
        c.company_name
      FROM company_positions cp
      JOIN companies c ON c.id = cp.company_id
      WHERE cp.id = $1 AND cp.company_id = $2
      `,
      [positionId, companyId]
    );

    if (positionResult.rows.length === 0) {
      throw new Error("Position not found");
    }

    const position = positionResult.rows[0];

    const studentResult = await client.query(
      `SELECT offers_received, placement_status, current_offer FROM students WHERE id = $1`,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      throw new Error("Student not found");
    }

    let offersReceived = studentResult.rows[0]?.offers_received || [];
    if (!Array.isArray(offersReceived)) offersReceived = [];

    const currentStatus = studentResult.rows[0]?.placement_status || "unplaced";
    const currentOffer = studentResult.rows[0]?.current_offer || null;

    // ✅ Determine if this is the student's first offer
    const isFirstOffer = offersReceived.length === 0;

    // 🔵 CHANGE 1: Always set original_position_id to the position being offered
    const campusOffer = {
      offer_id: `CAMPUS_${companyId}_${positionId}_${Date.now()}`,
      company_id: companyId,
      position_id: positionId,
      original_position_id: offerDetails.original_position_id || positionId, // Store original position
      source: "campus",
      offer_date:
        offerDetails.offer_date || new Date().toISOString().split("T")[0],
      acceptance_date: new Date().toISOString().split("T")[0],
      is_accepted: isFirstOffer, // ✅ Mark first offer as accepted
      work_location: offerDetails.work_location || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 🔵 CHANGE 2: Check for existing offer using original_position_id
    // This prevents duplicate offers when position is changed
    const alreadyExists = offersReceived.some(
      (o) =>
        o.source === "campus" &&
        o.company_id === companyId &&
        (o.original_position_id === positionId || o.position_id === positionId)
    );

    if (!alreadyExists) {
      offersReceived.push(campusOffer);
    } else {
      // 🔵 CHANGE 3: If offer exists, update it instead of skipping
      const existingIndex = offersReceived.findIndex(
        (o) =>
          o.source === "campus" &&
          o.company_id === companyId &&
          (o.original_position_id === positionId ||
            o.position_id === positionId)
      );

      if (existingIndex !== -1) {
        offersReceived[existingIndex] = {
          ...offersReceived[existingIndex],
          ...campusOffer,
          offer_id: offersReceived[existingIndex].offer_id, // Keep original offer_id
        };
      }
    }

    let newCurrentOffer = currentOffer;
    if (!currentOffer || offersReceived.length === 1) {
      newCurrentOffer = campusOffer;
    }

    await client.query(
      `
      UPDATE students 
      SET 
        offers_received = $1,
        current_offer = $2,
        placement_status = 'placed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [
        JSON.stringify(offersReceived),
        JSON.stringify(newCurrentOffer),
        studentId,
      ]
    );

    await client.query("COMMIT");

    return {
      success: true,
      offer: campusOffer,
      current_offer: newCurrentOffer,
      message: isFirstOffer
        ? `First offer added and automatically accepted. Student marked as placed.`
        : alreadyExists
        ? `Offer updated successfully.`
        : `Offer added successfully. Student already placed.`,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in addCampusOffer:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * PUT /api/students/:studentId/offers/campus/:offerId/change-position
 * Change the position for a campus offer
 */
routes.put(
  "/students/:studentId/offers/campus/:offerId/change-position",
  async (req, res) => {
    const client = await db.connect();

    try {
      const { studentId, offerId } = req.params;
      const { new_position_id } = req.body;

      if (!new_position_id) {
        return res.status(400).json({
          success: false,
          error: "new_position_id is required",
        });
      }

      await client.query("BEGIN");

      // Get student data
      const studentResult = await client.query(
        "SELECT offers_received, current_offer FROM students WHERE id = $1",
        [studentId]
      );

      if (studentResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ success: false, error: "Student not found" });
      }

      let offersReceived = studentResult.rows[0].offers_received || [];
      const offerIndex = offersReceived.findIndex(
        (o) => o.offer_id === offerId
      );

      if (offerIndex === -1) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ success: false, error: "Offer not found" });
      }

      const offer = offersReceived[offerIndex];

      if (offer.source !== "campus") {
        await client.query("ROLLBACK");
        return res.status(403).json({
          success: false,
          error: "Can only change position for campus offers",
        });
      }

      // Verify new position belongs to same company
      const positionCheck = await client.query(
        "SELECT company_id FROM company_positions WHERE id = $1",
        [new_position_id]
      );

      if (positionCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ success: false, error: "Position not found" });
      }

      if (positionCheck.rows[0].company_id !== offer.company_id) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "New position must belong to the same company",
        });
      }

      // 🔵 CHANGE 4: Preserve original_position_id when changing position
      // Only set it if it doesn't exist yet
      offersReceived[offerIndex] = {
        ...offer,
        original_position_id: offer.original_position_id || offer.position_id,
        position_id: parseInt(new_position_id),
        updated_at: new Date().toISOString(),
      };

      // 🔵 CHANGE 5: Update current_offer with same logic
      let currentOffer = studentResult.rows[0].current_offer;
      if (currentOffer && currentOffer.offer_id === offerId) {
        currentOffer = {
          ...currentOffer,
          original_position_id:
            currentOffer.original_position_id || currentOffer.position_id,
          position_id: parseInt(new_position_id),
          updated_at: new Date().toISOString(),
        };
      }

      await client.query(
        `UPDATE students 
         SET offers_received = $1, 
             current_offer = $2,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
        [
          JSON.stringify(offersReceived),
          currentOffer ? JSON.stringify(currentOffer) : null,
          studentId,
        ]
      );

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Position changed successfully",
        data: { offer: offersReceived[offerIndex] },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error changing position:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    } finally {
      client.release();
    }
  }
);

module.exports = routes;

module.exports.addCampusOffer = addCampusOffer;

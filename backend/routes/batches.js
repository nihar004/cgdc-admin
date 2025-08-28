const express = require("express");
const db = require("../db");
const routes = express.Router();

// GET all batches
routes.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT year FROM batches ORDER BY year");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

// Add a new batch
routes.post("/", async (req, res) => {
  const { year } = req.body;

  if (!year || isNaN(year) || year < 2010 || year > 2100) {
    return res.status(400).json({ error: "Invalid batch year" });
  }

  try {
    const existingBatch = await db.query(
      "SELECT * FROM batches WHERE year = $1",
      [year]
    );

    if (existingBatch.rows.length > 0) {
      return res.status(400).json({ error: "Batch year already exists" });
    }

    const result = await db.query(
      "INSERT INTO batches (year) VALUES ($1) RETURNING *",
      [year]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding batch:", err);
    res.status(500).json({ error: "Failed to add batch" });
  }
});

module.exports = routes;

const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// GET /profile/:uid → to fetch profile info
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await pool.query(
      "SELECT uid, firstname, lastname, email, school, bio, imgs FROM users WHERE uid = $1",
      [uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /profile/:uid → to update profile info
router.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { firstname, lastname, school, bio, imgs } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET firstname = $1, lastname = $2, school = $3, bio = $4, imgs = $5
       WHERE uid = $6
       RETURNING uid, firstname, lastname, email, school, bio, imgs`,
      [firstname, lastname, school, bio, imgs, uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

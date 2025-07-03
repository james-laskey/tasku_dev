// routes/profile.js
const { pool } = require("../db");
const { validationResult } = require("express-validator");

/**
 * GET /profile/:uid
 */
async function getProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { uid } = req.params;
  if (req.user.uid !== uid) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT uid, firstname, lastname, school, bio
       FROM users
       WHERE uid = $1`,
      [uid]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * PUT /profile/:uid
 */
async function updateProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { uid } = req.params;
  if (req.user.uid !== uid) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { firstname, lastname, school, bio } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET firstname = $1,
           lastname  = $2,
           school    = $3,
           bio       = $4
       WHERE uid = $5
       RETURNING uid, firstname, lastname, school, bio`,
      [firstname, lastname, school, bio, uid]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Profile updated", profile: rows[0] });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getProfile, updateProfile };

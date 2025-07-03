// routes/Rankings.js
const { pool } = require("../db");
const { validationResult } = require("express-validator");

/**
 * GET /rankings?limit=…
 */
async function getRankings(req, res) {
  // validationResult already ran in server.js, but double-check:
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
  let sql = `
    SELECT
      s.school,
      SUM(t.amount) AS total_earned
    FROM transactions t
    JOIN schools s ON s.sid = t.school
    WHERE t.completed = TRUE
    GROUP BY s.school
    ORDER BY total_earned DESC
  `;
  const params = [];
  if (limit) {
    sql += " LIMIT $1";
    params.push(limit);
  }

  try {
    const { rows } = await pool.query(sql, params);
    res.json({ rankings: rows });
  } catch (err) {
    console.error("Error fetching rankings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getRankings };

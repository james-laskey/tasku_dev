const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// POST /messages → Send a message
router.post("/", async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;

    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sender_id, receiver_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /messages/:user1/:user2 → Get conversation between two users
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const result = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp ASC`,
      [user1, user2]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

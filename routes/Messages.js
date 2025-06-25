const express = require("express");
const { pool } = require("../db");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();

// ─── Validation rules ─────────────────────────────────────────────────────────

const validateMessageSend = [
  body("sender_id")
    .isUUID().withMessage("Invalid sender ID format"),
  body("receiver_id")
    .isUUID().withMessage("Invalid receiver ID format"),
  body("content")
    .trim()
    .notEmpty().withMessage("Message content cannot be empty")
    .isLength({ max: 1000 }).withMessage("Message too long")
];

const validateMessageConversation = [
  param("user1")
    .isUUID().withMessage("Invalid user1 ID format"),
  param("user2")
    .isUUID().withMessage("Invalid user2 ID format")
];

// ─── Validation error handler ─────────────────────────────────────────────────

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /messages → Send a message
router.post(
  "/",
  validateMessageSend,
  handleValidation,
  async (req, res) => {
    try {
      const { sender_id, receiver_id, content } = req.body;

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
  }
);

// GET /messages/:user1/:user2 → Get conversation between two users
router.get(
  "/:user1/:user2",
  validateMessageConversation,
  handleValidation,
  async (req, res) => {
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
  }
);

module.exports = router;

const express = require("express");
const { pool } = require("../db");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();

// ─── Validation rules ─────────────────────────────────────────────────────────

const validateProfileUID = [
  param("uid")
    .isUUID().withMessage("Invalid user ID format")
];

const validateProfileUpdate = [
  param("uid")
    .isUUID().withMessage("Invalid user ID format"),
  body("firstname")
    .trim()
    .notEmpty().withMessage("First name is required")
    .isLength({ max: 50 }).withMessage("First name too long"),
  body("lastname")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isLength({ max: 50 }).withMessage("Last name too long"),
  body("school")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 }).withMessage("School name too long"),
  body("bio")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 }).withMessage("Bio too long"),
  body("imgs")
    .optional({ nullable: true })
    .isArray().withMessage("Imgs must be an array of URLs")
    .custom(arr => arr.every(url => typeof url === "string"))
      .withMessage("Each image must be a URL string")
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

// GET /profile/:uid → fetch profile info
router.get(
  "/:uid",
  validateProfileUID,
  handleValidation,
  async (req, res) => {
    try {
      const { uid } = req.params;
      const result = await pool.query(
        `SELECT uid, firstname, lastname, email, school, bio, imgs
         FROM users
         WHERE uid = $1`,
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
  }
);

// PUT /profile/:uid → update profile info
router.put(
  "/:uid",
  validateProfileUpdate,
  handleValidation,
  async (req, res) => {
    try {
      const { uid } = req.params;
      const { firstname, lastname, school, bio, imgs } = req.body;

      const result = await pool.query(
        `UPDATE users
         SET firstname = $1,
             lastname  = $2,
             school    = $3,
             bio       = $4,
             imgs      = $5
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
  }
);

module.exports = router;

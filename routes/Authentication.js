const { validationResult } = require("express-validator");
const pool = require("../db");

// Login handler
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT username, password FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: `Welcome, ${user.username}!` });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Example additional handler for user registration
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password, passwordCopy, username } = req.body;
  
    // Ensure passwords match
    if (password !== passwordCopy) {
      return res.status(400).json({ error: "Passwords do not match!" });
    }
  
    try {
      // Check if email is an accepted college email
      const collegeCheck = await pool.query("SELECT email FROM college WHERE email = $1", [email]);
      if (collegeCheck.rows.length === 0) {
        return res.status(403).json({ error: "Email is not an accepted college email!" });
      }
  
      // Insert user into database
      await pool.query("INSERT INTO users (email, password, username) VALUES ($1, $2, $3)", [
        email,
        password,
        username,
      ]);
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
module.exports = { login, register };
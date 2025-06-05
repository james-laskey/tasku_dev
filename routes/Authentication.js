const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
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
    // Create JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
  
  

    res.status(200).json({ token, message: `Welcome, ${user.first_name} ${user.last_name}!` });
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
  
    const { email, password, firstname, lastname } = req.body;
  

    try {
      // Check if email is an accepted college email
      const domainCheck = await pool.query("SELECT email FROM domains WHERE email = $1", [email]);
      if (domainCheck.rows.length === 0) {
        return res.status(403).json({ error: "Email is not an accepted college email!" });
      }
      const uid = uuidv4();

      // Insert user into database
      await pool.query("INSERT INTO users (uid, email, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5)", [
        uid,
        email,
        password,
        firstname,
        lastname
      ]);
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
module.exports = { login, register };
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
const { v4: uuidv4 } = require("uuid");
const pool = require("../db");

// Login handler
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  if(email === undefined || password === undefined) {
    return res.status(400).json({ error: "Email and password are required or invalid" });
  } else {
      try {
        const result = await pool.query("SELECT username, firstname, lastname, uid, password FROM users WHERE email = $1 AND password = $2", [email, password]);
        if (result.rows.length === 0) {
          return res.status(401).json({ error: "User not found" });
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: "Email and password are required or invalid" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.uid, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
          );
      
      
        res.status(200).json({ token, message: `Welcome, ${user.firstname} ${user.lastname}!` });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
      const token = jwt.sign(
        { userId: uid, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
      // Insert user into database
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await pool.query("INSERT INTO users (uid, token, email, password, firstname, lastname) VALUES ($1, $2, $3, $4, $5, $6)", [
        uid,
        token,
        email,
        hashedPassword,
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
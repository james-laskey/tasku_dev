require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
var bodyParser = require("body-parser");
const { Pool } = require("pg");

const validateLogin = require("./validation");


let app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("src"));

const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
  console.log("Listening on port number %d", server.address().port);
});

// Validation middleware
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

  });
  
  // Login Route using PostgreSQL
  app.post("/login", validateLogin, async (req, res) => {
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
  });
  
  

app.get("/", (req, res) => res.sendStatus(200));
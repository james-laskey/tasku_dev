const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
const { v4: uuidv4 } = require("uuid");
const pool = require("../db");
const  fakeData = require("../fakeTaskData");
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
        
        const user = fakeData.users[email]; // Simulating a database lookup with fake data
        if (!user) {
          return res.status(401).json({ error: "No User Account Found" });
        }

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
  
    const user ={...req.body};
  

    try {
      const uid = uuidv4();
      const token = jwt.sign(
        { uid: uid, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
      // Insert user into database
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  
      res.status(201).json({ message: "User registered successfully!", token, user});
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
module.exports = { login, register };
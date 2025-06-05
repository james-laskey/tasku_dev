const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {
      user,
      school,
      datetimestamp,
      description,
      offer,
      address,
      coordinates,
      completed,
      accepteduser,
      rating,
      review
    } = req.body;
  
    try {
      const result = await pool.query(
        `INSERT INTO tasks (user, school, datetimestamp, description, offer, address, coordinates, completed, accepteduser, rating, review) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [user, school, datetimestamp, description, offer, address, coordinates, completed, accepteduser, rating, review]
      );
  
      res.status(201).json({ message: "Task created successfully!", task: result.rows[0] });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  
const getUncompletedTasks = async (req, res) => {
    const { school } = req.body;
  
    if (!school) {
      return res.status(400).json({ error: "School must be provided in the request body." });
    }
  
    try {
      const result = await pool.query(
        `SELECT * FROM tasks 
         WHERE completed = false AND school = $1`,
        [school]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No uncompleted tasks found for the provided school." });
      }
  
      res.status(200).json({ tasks: result.rows });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
  module.exports = { createTask, getUncompletedTasks };
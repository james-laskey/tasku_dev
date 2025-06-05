require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
var bodyParser = require("body-parser");
const { Pool } = require("pg");

const validateLogin = require("./validation");
const validateRegister = require("./validation");
const login = require("./routes/Authentication");
const register = require("./routes/Authentication");

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
  app.post("/login", validateLogin, login);
  app.post("/register", validateRegister, register);
  

app.get("/", (req, res) => res.sendStatus(200));
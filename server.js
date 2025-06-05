require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
var bodyParser = require("body-parser");


const { validateLogin, validateRegister }  = require("./validation");
const { login, register } = require("./routes/Authentication");
const pool = require("./db");

let app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("src"));

const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
  console.log("Listening on port number %d", server.address().port);
});

console.log(typeof login, typeof register, typeof validateLogin, typeof validateRegister);
  // Login Route using PostgreSQL
  app.post("/login", validateLogin(), (req, res) => login(req, res));
  app.post("/register", validateRegister(), (req, res) => register(req, res));
  

app.get("/", (req, res) => res.sendStatus(200));
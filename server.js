require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
var bodyParser = require("body-parser");

const { validateLogin, validateRegister } = require("./validation");
const { login, register } = require("./routes/Authentication");
const profileRoutes = require("./routes/Profile");
const pool = require("./db");

let app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("src"));

// Register routes
app.use("/profile", profileRoutes);
app.post("/login", validateLogin(), (req, res) => login(req, res));
app.post("/register", validateRegister(), (req, res) => register(req, res));

// Test route
app.get("/", (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT, function () {
  console.log("Listening on port number %d", server.address().port);
});

console.log(typeof login, typeof register, typeof validateLogin, typeof validateRegister);

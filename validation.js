const { body } = require("express-validator");

const validateLogin = () => [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character"),
  body("passwordCopy").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const validateRegister = () => [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[edu]{3}$/) // Only allows ".edu" emails
    .withMessage("Only college emails (.edu) are allowed"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character"),
  body("passwordCopy").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("firstName")
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 2, max: 30 }).withMessage("First name must be between 2 and 30 characters")
    .matches(/^[a-zA-Z]+$/).withMessage("First name must contain only letters"),
  body("lastName")
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 2, max: 30 }).withMessage("Last name must be between 2 and 30 characters")
    .matches(/^[a-zA-Z]+$/).withMessage("Last name must contain only letters"),
];

const validateTask = () => {
    return [
      body("user").notEmpty().withMessage("User is required"),
      body("datetimestamp").isISO8601().withMessage("Invalid date format"),
      body("description").notEmpty().withMessage("Description is required"),
      body("offer").isInt({ min: 0 }).withMessage("Offer must be a valid integer"),
      body("address").notEmpty().withMessage("Address is required"),
      body("coordinates").isArray({ min: 2, max: 2 }).withMessage("Coordinates must be an array of two floats"),
      body("completed").isBoolean().withMessage("Completed must be a boolean value"),
      body("accepteduser").optional().isInt().withMessage("Accepted user must be a valid user ID"),
      body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
      body("review").optional().isString().withMessage("Review must be a valid string"),
    ];
  };
  
module.exports = { validateLogin, validateRegister, validateTask };
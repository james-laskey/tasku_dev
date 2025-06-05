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

module.exports = { validateLogin, validateRegister};
const Joi = require("joi");

// Registration Schema
const registrationSchema = Joi.object({
  username: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).max(255).required(), // Ensuring password is plain text and required
});

// Middleware for Registration Validation
const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body; // password in plain text here

  const { error } = registrationSchema.validate(
    { username, email, password }, // Validate the plain text password
    { abortEarly: false }
  );

  if (error) {
    return res.status(422).json({ validationErrors: error.details });
  }

  next();
};

// Login Schema
const loginSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().max(255).required(), // Using plain text password for login validation
});

// Middleware for Login Validation
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body; // Expecting plain text password for validation

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const { error } = loginSchema.validate(
    { email, password },
    { abortEarly: false }
  );

  if (error) {
    return res.status(422).json({ validationErrors: error.details });
  }

  next();
};

// User Schema for Updates
const userSchema = Joi.object({
  username: Joi.string().max(255),
  email: Joi.string().email().max(255),
  password: Joi.string().min(6).max(255), // Make this optional, as updates may not include a password
});

// Middleware for General User Validation (e.g., update routes)
const validateUser = (req, res, next) => {
  const { username, email, password } = req.body; // Use the plain text password before it's hashed

  const { error } = userSchema.validate(
    { username, email, password },
    { abortEarly: false }
  );

  if (error) {
    return res.status(422).json({ validationErrors: error.details });
  }

  next();
};

module.exports = {
  validateUser,
  validateUserRegistration,
  validateUserLogin,
};

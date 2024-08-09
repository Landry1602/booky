const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  hashedPassword: Joi.string().max(255).required(),
});

const validateUser = (req, res, next) => {
  const { username, email, hashedPassword } = req.body;

  const { error } = userSchema.validate(
    { username, email, hashedPassword },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = {
  validateUser,
}
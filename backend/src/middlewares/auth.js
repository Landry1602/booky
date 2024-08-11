const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = (req, res, next) => {
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hashedPassword) => {
      console.log(hashedPassword);

      req.body.hashedPassword = hashedPassword;
      delete req.body.password;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
      console.log('No Authorization Header');
      return res.sendStatus(401); // Unauthorized
  }

  // Split and extract the token
  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  if (!token) {
      console.log('No Token Provided');
      return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          console.error('Token verification failed:', err);
          return res.sendStatus(401); // Unauthorized
      }
      req.user = user; // Attach user to request
      console.log('Decoded User:', user);
      next();
  });
};

module.exports = {
  hashPassword,
  validateToken,
};

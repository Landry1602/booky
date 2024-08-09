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
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization Header:', authHeader);
    console.log('Extracted Token:', token);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        console.log('Decoded User:', user);
        next();
    });
};

module.exports = {
  hashPassword,
  validateToken,
};

const express = require("express");
const bcrypt = require('bcrypt');
require("dotenv").config();

const { validateUser } = require("../src/middlewares/validateUser");
const { hashPassword, validateToken } = require("../src/middlewares/auth");

const userController = require("../src/controllers/userController");
const database = require("../database/database");

const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

app.post('/register', hashPassword, userController.postUser);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    console.log('Received login request for:', email);

    try {
        const [users] = await database.query("SELECT id, username, email, hashedPassword FROM user WHERE email = ?", [email]);
        console.log('Database query result:', users);
        if (users.length > 0) {
            const user = users[0];
            console.log('User found:', user);

            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            console.log('Password comparison result:', isMatch);
            if (isMatch) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '1h' } 
                );
                return res.json({ token });
            } else {
                return res.status(401).send('Invalid credentials');
            }
        } else {
            return res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Database query error:', err);
        return res.sendStatus(500);
    }
});

//Authentification wall
app.use(validateToken)
app.get('/api/users/:id', validateUser, userController.getUserById);
app.post('/api/users', hashPassword, validateUser, userController.postUser);
app.put('/api/users/:id', hashPassword, validateUser, userController.updateUser);
app.delete('/api/users/:id', validateUser, userController.deleteUser);

module.exports = app;

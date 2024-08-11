const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const database = require("../../database/database")

const loginController = async (req, res) => {
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

            if (!user) {
                console.log('No user found with that email.');
                return res.status(404).send('User not found');
            }

            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            console.log('Password comparison result:', isMatch);
            if (isMatch) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '1h' } 
                );
                console.log('Generated JWT Token:', token);
                return res.status(200).json({ token });
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
}

module.exports = {
    loginController,
}
const express = require("express");
const bcrypt = require('bcrypt');
require("dotenv").config();

const { validateUser, validateUserRegistration, validateUserLogin } = require("../src/middlewares/validateUser");
const { hashPassword, validateToken } = require("../src/middlewares/auth");
const { loginController } = require("./controllers/loginController");

const userController = require("../src/controllers/userController");
const favoriteController = require("../src/controllers/favoriteController");

const database = require("../database/database");

const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');


const app = express();

app.use(express.json());

app.post('/register', validateUserRegistration, hashPassword, userController.postUser);
app.post('/login', validateUserLogin, loginController);

//Authentification wall
app.use(validateToken)
app.get('/api/users/:id', userController.getUserById);
app.post('/api/users', validateUser, hashPassword, userController.postUser);
app.put('/api/users/:id', validateUser, hashPassword, userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

app.post('/api/favorites', favoriteController.addFavorite);
app.get('/api/favorite', favoriteController.getFavorites);

module.exports = app;

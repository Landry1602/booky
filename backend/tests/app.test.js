const request = require('supertest');
const app = require('../src/app'); // Adjust the path if necessary
const bcrypt = require('bcrypt');
const database = require('../database/database');
const jwt = require('jsonwebtoken');

// Mock the database module
jest.mock('../database/database', () => ({
    query: jest.fn()
}));

describe('User Routes', () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Clear any previous mock calls
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            // Mock the database query to simulate successful registration
            const mockInsertResult = { insertId: 1 }; // Simulated result from database insert
            database.query.mockResolvedValue([mockInsertResult]); // Simulate query response

            const response = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'password123'
                });

                expect(response.statusCode).toBe(201);
                expect(response.body).toHaveProperty('id', 1);
        });
    });

    describe('POST /login', () => {
        it('should login with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);

            // Mock the database query to simulate finding a user
            database.query.mockResolvedValue([[{
                id: 1,
                username: 'testuser',
                email: 'testuser@example.com',
                hashedPassword: hashedPassword
            }]]);

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123'
                });

            // Check the status code
            expect(response.statusCode).toBe(200);

            // Ensure the response contains a JWT token
            expect(response.body).toHaveProperty('token');
            const token = response.body.token;
            expect(typeof token).toBe('string');

            // Decode the token to verify its contents
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            expect(decodedToken).toHaveProperty('id', 1);
            expect(decodedToken).toHaveProperty('username', 'testuser');
            expect(decodedToken).toHaveProperty('email', 'testuser@example.com');
        });

        it('should return 401 for invalid credentials', async () => {
            // Mock the database query to simulate no user found
            database.query.mockResolvedValue([[]]);

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'wrongpassword'
                });

            expect(response.statusCode).toBe(401);
            expect(response.text).toBe('Invalid credentials');
        });

        it('should return 400 for missing email or password', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'testuser@example.com'
                });

            expect(response.statusCode).toBe(400);
            expect(response.text).toBe('Email and password are required');
        });
    });
});


describe('POST /api/favorites', () => {
    it('should add a book to favorites successfully', async () => {
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        // Mock the database query to simulate finding a user
        database.query.mockResolvedValue([[{
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            hashedPassword: hashedPassword
        }]]);

        // First, login to get a valid token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        // Ensure that we successfully get a token from the login response
        expect(loginResponse.statusCode).toBe(200);
        const token = loginResponse.body.token;
        expect(token).toBeDefined(); // Check that token is defined

        // Now use the token to access the authenticated route
        const response = await request(app)
        .post('/api/favorites')
        .set('Authorization', `Bearer ${token}`)
        .send({
            isbn: '978-3-16-148410-0'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Book added to favorites');
    });

    it('should return 500 on database error', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        database.query.mockResolvedValue([[{
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            hashedPassword: hashedPassword
        }]]);

        const loginResponse = await request(app)
        .post('/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123'
        });

    // Ensure that we successfully get a token from the login response
    expect(loginResponse.statusCode).toBe(200);
    const token = loginResponse.body.token;
    expect(token).toBeDefined(); // Check that token is defined
    
        // Mock the database query to simulate a database error
        database.query.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/api/favorites')
            .set('Authorization', `Bearer ${token}`)
            .send({
                isbn: '978-3-16-148410-0'
            });

        expect(response.statusCode).toBe(500);
    });
});
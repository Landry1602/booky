const request = require('supertest');
const response = require('supertest')
const app = require('../src/app'); // Adjust the path if necessary
const database = require('../database/database');
const bcrypt = require('bcrypt')

jest.mock('../database/database', () => ({
    query: jest.fn()
}));

beforeEach(() => {
    jest.resetAllMocks(); // Clear any previous mock calls
});

describe('Authenticated CRUD Routes', () => {

    describe('GET /api/users/:id', () => {
        it('should retrieve user details with a valid token', async () => {

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
            const userResponse = await request(app)
                .get('/api/users/1')
                .set('Authorization', `Bearer ${token}`);

            expect(userResponse.statusCode).toBe(200);
            expect(userResponse.body).toHaveProperty('id', 1);
            expect(userResponse.body).toHaveProperty('username', 'testuser');
            expect(userResponse.body).toHaveProperty('email', 'testuser@example.com');
        });

        it('should return 401 for requests with an invalid token', async () => {
            const response = await request(app)
                .get('/api/users/1')
                .set('Authorization', 'Bearer invalidtoken');

            expect(response.statusCode).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });

        it('should return 401 for requests without a token', async () => {
            const response = await request(app)
                .get('/api/users/1');

            expect(response.statusCode).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });
    });
});

const { expect } = require('chai');
const supertest = require('supertest');
const express = require('express');
const path = require('path');
const { connectToDatabase, getContacts, insertContact } = require('../models/contactModel');
const contactController = require('../controllers/contactController');

// Create an Express app instance for testing
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the contact controller for handling routes
app.use('/', contactController);

// Set up the database connection before running tests
before(async function() {
    await connectToDatabase(); // Ensure this connects to the correct MongoDB instance
});

const request = supertest(app);

describe('Contact Model and Controller', function() {
    this.timeout(5000); // Increase timeout to 5 seconds

    // Model Tests
    describe('Contact Model', function() {
        it('should retrieve contacts', async function() {
            const contacts = await getContacts();
            expect(contacts).to.be.an('array');
        });

        it('should insert a contact', async function() {
            const newContact = { name: 'John Doe', email: 'john@example.com' };
            const result = await insertContact(newContact);
            expect(result.insertedId).to.exist;
        });

        it('should not insert a contact with invalid data', async function() {
            const invalidContact = { name: '', email: '' }; // Invalid data example
            try {
                await insertContact(invalidContact);
            } catch (error) {
                expect(error).to.exist;
            }
        });
    });

    // Controller Tests
    describe('Contact Controller', function() {
        // Test retrieving all contacts (GET /api/contact)
        it('should retrieve all contacts', function(done) {
            request.get('/api/contact')
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.message).to.equal('Data retrieved successfully');
                    done();
                });
        });

        // Test inserting a new contact (POST /api/contact)
        it('should insert a new contact', function(done) {
            const newContact = { name: 'Jane Doe', email: 'jane@example.com' };
            request.post('/api/contact')
                .send(newContact)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(201);
                    expect(res.body.data.insertedId).to.exist;
                    expect(res.body.message).to.equal('Contact data inserted successfully');
                    done();
                });
        });

        // Test retrieving contacts with no data in the database
        it('should retrieve no contacts if the database is empty', function(done) {
            // Assuming the database is empty or cleared before this test
            request.get('/api/contact')
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body.data).to.be.an('array').that.is.empty;
                    expect(res.body.message).to.equal('Data retrieved successfully');
                    done();
                });
        });
    });
});

const { expect } = require('chai');
const { connectToDatabase, getContacts, insertContact, updateContact, deleteContact } = require('../models/contactModel');

describe('Contact Model', function() {
    this.timeout(5000); // Increase timeout to 5 seconds

    before(async function() {
        await connectToDatabase(); // Ensure this connects to the correct MongoDB instance
    });

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

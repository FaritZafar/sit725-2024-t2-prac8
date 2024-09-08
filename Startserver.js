// startServerWithMongo.js
const express = require('express');
const path = require('path');
const { connectToDatabase } = require('./models/contactModel');
const contactController = require('./controllers/contactController');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the contact controller for handling routes
app.use('/', contactController);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/indexMongo.html'));
});

app.listen(port, async () => {
    console.log(`Express server started on port ${port}`);
    await connectToDatabase();
});

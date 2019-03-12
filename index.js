const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
const trips = require('./routes/trip');
const accommodations = require('./routes/accommodation');
const tickets = require('./routes/ticket');
const experiences = require('./routes/experience');
const express = require('express');
const app = express();

var mongoose = require('mongoose');

const URL = 'mongodb+srv://eco:hello@travelplanner-sxsmf.mongodb.net/test?retryWrites=true'
const client = new MongoClient(URL, { useNewUrlParser: true });
mongoose.connect(URL); // connect to our database

app.use(express.json());
app.use(cors())
app.use('/api/trips', trips);
app.use('/api/trips/:trip_id/accommodations', accommodations);
app.use('/api/trips/:trip_id/tickets', tickets);
app.use('/api/trips/:trip_id/experiences', experiences);

const port = process.env.PORT || 3000;
// app.listen(port);
app.listen(port, () => {
    client.connect(err => {
        if (err) {
            console.error('Could not connect to MongoDB...')
        } else {
            console.log(`Connected to MongoDB on port ${port}...`)
        }
        const collection = client.db("test").collection("travelplans");
        client.close();
      });
} );

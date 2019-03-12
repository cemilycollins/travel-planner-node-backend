const mongoose = require('mongoose');
const cors = require('cors')
const trips = require('./routes/trip');
const accommodations = require('./routes/accommodation');
const tickets = require('./routes/ticket');
const experiences = require('./routes/experience');
const express = require('express');
const app = express();

const URL = 'mongodb://localhost/travelplanner'
mongoose.connect(URL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use(cors())
app.use('/api/trips', trips);
app.use('/api/trips/:trip_id/accommodations', accommodations);
app.use('/api/trips/:trip_id/tickets', tickets);
app.use('/api/trips/:trip_id/experiences', experiences);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
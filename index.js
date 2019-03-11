const mongoose = require('mongoose');
const trips = require('./routes/trip');
const express = require('express');
const app = express();

const URL = 'mongodb://localhost/travelplanner'
mongoose.connect(URL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/trips', trips);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Trip = mongoose.model('Trip', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  img_url: String
}));

router.get('/', async (req, res) => {
  const trips = await Trip.find().sort('start_date');
  res.send(trips);
});

router.post('/', async (req, res) => {
    console.log(req.body)
  const { error } = validateTrip(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let trip = new Trip({ 
    name: req.body.name,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    img_url: req.body.img_url
  });

  trip = await trip.save().catch(err=>console.log(err));
  
  res.send(trip);
});

router.put('/:id', async (req, res) => {
  const { error } = validateTrip(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const trip = await Trip.findByIdAndUpdate(req.params.id, { 
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      img_url: req.body.img_url
    }, {
    new: true
  });

  if (!trip) return res.status(404).send('The trip with the given ID was not found.');
  
  res.send(trip);
});

router.delete('/:id', async (req, res) => {
  const trip = await Trip.findByIdAndRemove(req.params.id);

  if (!trip) return res.status(404).send('The trip with the given ID was not found.');

  res.send(trip);
});

router.get('/:id', async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) return res.status(404).send('The trip with the given ID was not found.');

  res.send(trip);
});

function validateTrip(trip) {
  const schema = {
    name: Joi.string().min(3).required(),
    start_date: Joi.string(),
    end_date: Joi.string(),
    img_url: Joi.string()
  };

  return Joi.validate(trip, schema);
}

module.exports = router;
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Accommodation = mongoose.model('Accommodation', new mongoose.Schema({
  address: { type: String, required: true},
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  city: String,
  relevant_info: String,
  trip_id: String
}));

router.get('/', async (req, res) => {
  const accommodations = await Accommodation.find().sort('start_date');
  res.send(accommodations);
});

router.post('/', async (req, res) => {
  const { error } = validateAccommodation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let accommodation = new Accommodation({ 
    address: req.body.address,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    city: req.body.city,
    relevant_info: req.body.relevant_info,
    trip_id: req.body.trip_id
  });
  accommodation = await accommodation.save();
  
  res.send(accommodation);
});

router.put('/:id', async (req, res) => {
  const { error } = validateAccommodation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const accommodation = await Accommodation.findByIdAndUpdate(req.params.id, { 
    address: req.body.address,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    city: req.body.city,
    relevant_info: req.body.relevant_info,
    trip_id: req.body.trip_id
    }, {
    new: true
  });

  if (!accommodation) return res.status(404).send('The accommodation with the given ID was not found.');
  
  res.send(accommodation);
});

router.delete('/:id', async (req, res) => {
  const accommodation = await Accommodation.findByIdAndRemove(req.params.id);

  if (!accommodation) return res.status(404).send('The accommodation with the given ID was not found.');

  res.send(accommodation);
});

router.get('/:id', async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) return res.status(404).send('The accommodation with the given ID was not found.');

  res.send(accommodation);
});

function validateAccommodation(accommodation) {
  const schema = {
    address: Joi.string().min(3).required(),
    start_date: Joi.string(),
    end_date: Joi.string(),
    city: Joi.string(),
    relevant_info: Joi.string(),
    trip_id: Joi.string()
  };

  return Joi.validate(accommodation, schema);
}

module.exports = router;
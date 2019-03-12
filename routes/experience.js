const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Experience = mongoose.model('Experience', new mongoose.Schema({
    name: { type: String, required: true},
    address: { type: String, required: true},
    date: { type: String, required: true },
    city: String,
    relevant_info: String,
    trip_id: String
}));

router.get('/', async (req, res) => {
  const experiences = await Experience.find().sort('start_date');
  res.send(experiences);
});

router.post('/', async (req, res) => {
  const { error } = validateExperience(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let experience = new Experience({ 
    name: req.body.name,
    date: req.body.date,
    address: req.body.address,
    city: req.body.city,
    relevant_info: req.body.relevant_info,
    trip_id: req.body.trip_id
  });
  experience = await experience.save();
  
  res.send(experience);
});

router.put('/:id', async (req, res) => {
  const { error } = validateExperience(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const experience = await Experience.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        city: req.body.city,
        relevant_info: req.body.relevant_info,
        trip_id: req.body.trip_id
    }, {
    new: true
  });

  if (!experience) return res.status(404).send('The experience with the given ID was not found.');
  
  res.send(experience);
});

router.delete('/:id', async (req, res) => {
  const experience = await Experience.findByIdAndRemove(req.params.id);

  if (!experience) return res.status(404).send('The experience with the given ID was not found.');

  res.send(experience);
});

router.get('/:id', async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) return res.status(404).send('The experience with the given ID was not found.');

  res.send(experience);
});

function validateExperience(experience) {
  const schema = {
    name: Joi.string().min(3).required(),
    date: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    relevant_info: Joi.string(),
    trip_id: Joi.string()
  };

  return Joi.validate(experience, schema);
}

module.exports = router;
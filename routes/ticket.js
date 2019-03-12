const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Ticket = mongoose.model('Ticket', new mongoose.Schema({
    type_of: { type: String, required: true },
    departure_date_time: { type: String, required: true },
    departure_location: { type: String, required: true },
    arrival_date_time: String,
    arrival_location: String,
    price: Number,
    relevant_info: String,
    purchased: Boolean,
    trip_id: String
}));

router.get('/', async (req, res) => {
  const tickets = await Ticket.find({trip_id: req.params.trip_id}).sort('departure_date_time');
  res.send(tickets);
});

router.post('/', async (req, res) => {
  const { error } = validateTicket(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let ticket = new Ticket({ 
    type_of: req.body.type_of,
    departure_date_time: req.body.departure_date_time,
    departure_location: req.body.departure_location,
    arrival_date_time: req.body.arrival_date_time,
    arrival_location: req.body.arrival_location,
    price: req.body.price,
    relevant_info: req.body.relevant_info,
    purchased: req.body.purchased,
    trip_id: req.body.trip_id
  });
  ticket = await ticket.save();
  
  res.send(ticket);
});

router.put('/:id', async (req, res) => {
  const { error } = validateTicket(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { 
        type_of: req.body.type_of,
        departure_date_time: req.body.departure_date_time,
        departure_location: req.body.departure_location,
        arrival_date_time: req.body.arrival_date_time,
        arrival_location: req.body.arrival_location,
        price: req.body.price,
        relevant_info: req.body.relevant_info,
        purchased: req.body.purchased,
        trip_id: req.body.trip_id
    }, {
    new: true
  });

  if (!ticket) return res.status(404).send('The ticket with the given ID was not found.');
  
  res.send(ticket);
});

router.delete('/:id', async (req, res) => {
  const ticket = await Ticket.findByIdAndRemove(req.params.id);

  if (!ticket) return res.status(404).send('The ticket with the given ID was not found.');

  res.send(ticket);
});

router.get('/:id', async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) return res.status(404).send('The ticket with the given ID was not found.');

  res.send(ticket);
});

function validateTicket(ticket) {
  const schema = {
    type_of: Joi.string().min(3).required(),
    departure_date_time: Joi.string(),
    departure_location: Joi.string(),
    arrival_date_time: Joi.string(),
    arrival_location: Joi.string(),
    price: Joi.number(),
    relevant_info: Joi.string(),
    purchased: Joi.boolean(),
    trip_id: Joi.string()
  };

  return Joi.validate(ticket, schema);
}

module.exports = router;
const Joi = require('joi');
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fullName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    phoneNumber: {
      type: Number,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
  },
  { timestamps: true }
);

// Create user Model with schema
const Contact = mongoose.model('Contact', contactSchema);

// validate inputs
function validateContact(contact) {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(255).required(),
    email: Joi.string().email().min(5).max(255).required(),
    phoneNumber: Joi.string().min(5).max(255).required(),
    gender: Joi.string().valid('male', 'female').required(),
  });

  return schema.validate(contact);
}

module.exports = { Contact, validateContact };

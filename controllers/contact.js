const asyncHandler = require('express-async-handler');
const { Contact, validateContact } = require('../models/contact');

const createContact = asyncHandler(async (req, res) => {
  // TODO
  const userId = req.user._id;
  console.log('userId  ', userId);

  const { error } = validateContact(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { fullName, email, phoneNumber, gender } = req.body;

  const newContact = await Contact.create({
    userId,
    fullName,
    email,
    phoneNumber,
    gender,
  });

  if (!newContact)
    return res.status(400).json({
      success: false,
      message: 'Contact could not be created',
    });

  res.status(201).json({
    success: true,
    message: 'Contact created successfully',
    data: newContact,
  });
});

const getContacts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('userId  ', userId);

  const contacts = await Contact.find({ userId });

  if (!contacts)
    return res.status(400).json({
      success: false,
      message: 'Contacts could not be fetched',
    });

  res.status(200).json({
    success: true,
    message: 'Contacts fetched successfully',
    data: contacts,
  });
});

const updateContact = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('userId  ', userId);

  const contact = await Contact.findById(req.params.id);

  if (!contact)
    return res.status(400).json({
      success: false,
      message: 'Contact could not be found',
    });

  if (contact.userId.toString() !== userId)
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });

  const { fullName, email, phoneNumber, gender } = req.body;

  contact.fullName = fullName || contact.fullName.trim();
  contact.email = email || contact.email.trim();
  contact.phoneNumber = phoneNumber || contact.phoneNumber;
  contact.gender = gender || contact.gender.trim();

  const updatedContact = await contact.save();

  if (!updatedContact)
    return res.status(400).json({
      success: false,
      message: 'Contact could not be updated',
    });

  res.status(201).json({
    success: true,
    message: 'Contact updated successfully',
    data: updatedContact,
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const contact = await Contact.findById(req.params.id);

  if (!contact)
    return res.status(400).json({
      success: false,
      message: 'Contact could not be found',
    });

  if (contact.userId.toString() !== userId)
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Contact deleted successfully',
  });
});

module.exports = { createContact, getContacts, deleteContact, updateContact };

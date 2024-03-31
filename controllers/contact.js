const asyncHandler = require('express-async-handler');
const { Contact, validateContact } = require('../models/contact');

// create new contact
const createContact = asyncHandler(async (req, res) => {
  // get user id from token
  const userId = req.user._id;
  console.log('userId  ', userId);

  // validate user input
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

  // return contact data
  res.status(201).json({
    success: true,
    message: 'Contact created successfully',
    data: newContact,
  });
});

// get all contacts
const getContacts = asyncHandler(async (req, res) => {
  // get user id from token
  const userId = req.user._id;
  console.log('userId contacts ', userId);

  const contacts = await Contact.find({ userId });

  if (!contacts)
    return res.status(400).json({
      success: false,
      message: 'Contacts could not be fetched',
    });

  // return contacts data
  res.status(200).json({
    success: true,
    message: 'Contacts fetched successfully',
    data: contacts,
  });
});

// update contact
const updateContact = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('userId  ', userId);

  const contact = await Contact.findById(req.params.id);

  // check if contact exists
  if (!contact)
    return res.status(400).json({
      success: false,
      message: 'Contact could not be found',
    });

  // check if user is authorized to update contact
  if (contact.userId.toString() !== userId)
    return res.status(400).json({
      success: false,
      message: 'Unauthorized',
    });

  const { fullName, email, phoneNumber, gender } = req.body;

  // update contact
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

  // return updated contact data
  res.status(201).json({
    success: true,
    message: 'Contact updated successfully',
    data: updatedContact,
  });
});

// delete contact
const deleteContact = asyncHandler(async (req, res) => {
  // get user id from token
  const userId = req.user._id;

  const contact = await Contact.findById(req.params.id);

  if (!contact)
    return res.status(400).json({
      success: false,
      message: 'Contact could not be found',
    });

  if (contact.userId.toString() !== userId)
    return res.status(400).json({
      success: false,
      message: 'Unauthorized',
    });

  // delete contact
  await contact.deleteOne();

  // return success message
  res.status(201).json({
    success: true,
    message: 'Contact deleted successfully',
  });
});

module.exports = { createContact, getContacts, deleteContact, updateContact };

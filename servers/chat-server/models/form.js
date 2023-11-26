const mongoose = require('mongoose');

// Define the schema for the form document
const formSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  frontImageURL: String,
  imageURLs: [String],
});

// Create the Mongoose model
const Form = mongoose.model('Form', formSchema);
const OnlineForm = mongoose.model('OnlineForm', formSchema);

module.exports = {
  Form,
  OnlineForm
};
const mongoose = require('mongoose');

// Define the schema for the Question model
const questionSchema = new mongoose.Schema({
  formId: Number,
  questions: mongoose.Schema.Types.Mixed,
});

// Create the Question model
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
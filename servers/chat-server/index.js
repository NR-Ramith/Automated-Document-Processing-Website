const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const questions = require('./questions');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bank', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

// Create a cache to store models to prevent duplication
const modelCache = {};

app.post('/save', async (req, res) => {
  console.log('Received POST request');
  console.log('Voice Input:', req.body.userInput);
  const voiceInput = req.body.userInput;
  const selectedFormId = req.body.selectedFormId;

  try {
    // Check if the model already exists in the cache, and create it if not
    if (!modelCache[selectedFormId]) {
      // Define a schema-less model
      modelCache[selectedFormId] = mongoose.model(`Form_${selectedFormId}`, new mongoose.Schema({}, { strict: false }));
    }

    // Use the model from the cache to create a new document in the appropriate collection without validation
    const FormModel = modelCache[selectedFormId];
    const newVoiceInput = new FormModel(voiceInput);
    await newVoiceInput.save();
    res.sendStatus(200);
  } catch (err) {
    console.error('Error inserting into MongoDB:', err);
    res.sendStatus(500);
  }
});

app.get('/getQuestions/:selectedFormId', (req, res) => {
  const selectedFormId = req.params.selectedFormId;
  if (questions[selectedFormId]) {
    // If questions for the selected form ID exist, send it to the client.
    res.send(questions[selectedFormId]);
  } else {
    // Handle the case where the selected form ID is not found.
    res.status(404).send('Questions not found for the selected form ID');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
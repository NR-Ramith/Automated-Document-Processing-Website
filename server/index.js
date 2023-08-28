const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const VoiceInput = require('./schema/voiceInput'); // Import the schema from the separate file

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

app.post('/save', async (req, res) => {
  console.log('Received POST request');
  console.log('Voice Input:', req.body.userInput);
  const voiceInput = req.body.userInput;

  try {
    const existingInput = await VoiceInput.findOne({ name: voiceInput.name, personalNumber: voiceInput.personalNumber });
    if (existingInput) {
      res.status(409).json({ message: 'Name already exists' });
    } else {
      const newVoiceInput = new VoiceInput(voiceInput);
      await newVoiceInput.save();
      res.sendStatus(200);
    }
  } catch (err) {
    console.error('Error inserting into MongoDB:', err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
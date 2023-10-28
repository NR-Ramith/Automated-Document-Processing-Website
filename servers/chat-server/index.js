const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const questions = require('./questions');
const fs = require('fs');
const Form = require('./models/form');
const multer = require('multer');

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

// Define storage for image files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images'); // Save uploaded images to the 'images' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Rename the image files
  },
});

// Create a multer instance with the defined storage options
const upload = multer({ storage });

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

app.get('/getForms', async (req, res) => {
  try {
    const forms = await Form.find({}); // Fetch all entries using the Form model

    if (!forms) {
      return res.status(404).json({ message: 'No forms found' });
    }

    const formsWithImages = forms.map(async (form) => {
      // Extract image paths from the form data
      const { id, name, description, frontImageURL, imageURLs } = form;

      // Function to encode an image as a base64 data URI
      const encodeImage = async (path) => {
        const data = fs.readFileSync(path);
        const base64Image = Buffer.from(data).toString('base64');
        const mimeType = path.endsWith('.png') ? 'image/png' : 'image/jpeg';
        return `data:${mimeType};base64,${base64Image}`;
      };

      // Encode the images asynchronously
      const frontImage = frontImageURL ? await encodeImage(frontImageURL) : null;
      const images = await Promise.all(imageURLs.map((imageURL) => encodeImage(imageURL)));

      return {
        id,
        name,
        description,
        frontImage,
        images,
      };
    });

    const formsData = await Promise.all(formsWithImages);

    res.status(200).json(formsData);
  } catch (err) {
    console.error('Error fetching forms from MongoDB:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/makeFormEntry', upload.fields([{ name: 'frontImage' }, { name: 'images' }]), async (req, res) => {
  const { id, name, description } = req.body;
  const frontImageURL = './images/'+req.files['frontImage'][0].filename;
  const imageFiles = req.files['images'];

  // Store the relative paths of images
  const imageURLs = imageFiles.map((file) => './images/'+file.filename);

  // Create a new Form document and save it to MongoDB
  const newForm = new Form({
    id,
    name,
    description,
    frontImageURL,
    imageURLs,
  });

  try {
    await newForm.save();
    res.status(200).json({ message: 'Form entry and images saved successfully' });
  } catch (error) {
    console.error('Error saving form entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/submitTemplateQuestions', (req, res) => {
  // Get data from the request
  const data = req.body;

  // Extract the key and value from the request
  const k = data[0];
  const v = data[1];

  // Append the key-value pair to the questions object
  questions[k] = v;

  // Convert the new data to a JSON string
  // const newDataString = JSON.stringify({k:v}, null, 2);
  const newDataString = JSON.stringify(questions, null, 2);

  // Write the updated data back to questions.js
  fs.writeFileSync('questions.js', `const questions = ${newDataString};\nmodule.exports = questions;`);

  return res.status(200).json({ message: 'Template questions submitted successfully' });
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
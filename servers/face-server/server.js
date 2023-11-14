// backend/server.js
const express = require('express');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
// import fetch from "node-fetch";
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const tempImagePath = path.join(__dirname, 'temp_image.jpeg');
const processedImagePath = path.join(__dirname, 'passport_image.png');

mongoose.connect('mongodb://localhost/bank', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose model for the image
const Image = mongoose.model('Image', {
  data: Buffer,
  contentType: String,
});

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store the image data in memory
const upload = multer({ storage: storage });

app.post('/processImage', async (req, res) => {
  const { imageData, backgroundColor } = req.body;

  // Extract the base64 image data from the data URI
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');

  // Convert base64 data to a buffer
  const imageBuffer = Buffer.from(base64Data, 'base64');

  // Save the buffer as a temporary image
  fs.writeFile(tempImagePath, imageBuffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error saving image.' });
    }

    const options = {
      scriptPath: path.join(__dirname),
      args: [tempImagePath, processedImagePath, backgroundColor], // Pass the temporary image path as an argument
    };

    // Run the Python script to process the image
    PythonShell.run('process_image.py', options, (pythonErr) => {
      if (pythonErr) {
        console.error(pythonErr);
        return res.status(500).json({ error: 'Image processing failed.' });
      }
    }).then(() => {
      if (fs.existsSync(processedImagePath)) {
        res.setHeader('Content-Type', 'image/png');
        res.sendFile(__dirname + '/passport_image.png')
        console.log('File exists');
      } else {
        console.log('File does not exist');
        res.status(500).send('Internal Server Error');
        return;
      }
    });

  });
});

// Handle the image upload route
app.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    const image = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    await image.save();

    res.json({ message: 'Image uploaded and saved successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
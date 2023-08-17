// backend/server.js
const express = require('express');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
// import fetch from "node-fetch";
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const tempImagePath = path.join(__dirname, 'temp_image.jpeg');
const processedImagePath = path.join(__dirname, 'processed_image.jpeg');

app.post('/processImage', async (req, res) => {
  const { imageData } = req.body;

  // console.log(imageData);

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
      args: [tempImagePath, processedImagePath], // Pass the temporary image path as an argument
    };

    // Run the Python script to process the image
    PythonShell.run('process_image.py', options, (pythonErr) => {
      console.log("hi");
      if (pythonErr) {
        console.error(pythonErr);
        return res.status(500).json({ error: 'Image processing failed.' });
      }

      // // Read the processed image
      // fs.readFile(processedImagePath, (readErr, processedImageBuffer) => {
      //   if (readErr) {
      //     console.error(readErr);
      //     return res.status(500).json({ error: 'Error reading processed image.' });
      //   }


      //   // Delete the temporary image
      //   fs.unlink(tempImagePath, (unlinkErr) => {
      //     if (unlinkErr) {
      //       console.error(unlinkErr);
      //     } else {
      //       console.log('Temporary image deleted.');
      //     }
      //     console.log(processedImageBuffer.toString('base64'));

      //     // Send the processed image to the client
      //     res.json({ imageData: processedImageBuffer.toString('base64') });
      //   });
      // });
    });
    fs.readFile(processedImagePath, (error, data) => {
      if (error) {
        console.error('Error reading file:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Convert the buffer to a Base64-encoded string
      const base64DataRes = data.toString('base64');
      // console.log(base64DataRes);
      // Create a data URL-like string
      // const dataURL = `data:image/jpeg;base64,${base64DataRes}`;
      // const resBase64Data = dataURL.replace(/^data:image\/jpeg;base64,/, '');
      // Convert base64 data to a buffer
      // const resImageBuffer = Buffer.from(base64DataRes, 'base64');
      // res.send(resImageBuffer);
      const stream = fs.createReadStream(processedImagePath);
      const buffer = stream.read();
      console.log(buffer);
      res.send(buffer);
      // const fetchresponse = fetch(processedImagePath);
      // console.log(fetchresponse);
      // res.sendFile(processedImagePath);
      // console.log(resBase64Data);
      // const imageBuffer = fs.readFileSync(processedImagePath);
      // res.send(imageBuffer);
    });

    // console.log("done");
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';
import UploadForm from './UploadForm';
// import { URL } from 'node-url';

function Photo() {
  const [processedImage, setProcessedImage] = useState(null);
  // const path = require('path');
  // const fs = require('fs');
  // const passportImagePath = path.join(__dirname, 'res_image.jpeg');
  const handleImageUpload = async (imageData) => {
    try {
      const response = await axios.post('http://localhost:5000/processImage', {
        imageData,
      });
      // console.log(response);
      // setProcessedImage(response.data);
      // const processedImageUrl = URL.createObjectURL(response.data);
      // const fetchresponse = await fetch(response.data); // Replace with the actual path
      console.log(response);
      // const imageBlob = await response.data.blob();
      // setProcessedImage(URL.createObjectURL(imageBlob));
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      // saveAs(blob, "my-image.jpeg");

      const blobURL = URL.createObjectURL(blob);
      console.log(blobURL); // Check the console to see if it's a valid Blob
      setProcessedImage(blobURL);
      // Save the buffer as a temporary image
      // console.log(response);
      // fs.writeFile(passportImagePath, response, (err) => {
      //   if (err) {
      //     console.error(err);
      //   }});
      // const buffer = Buffer.from(response.data, 'binary'); // Convert image data to Buffer
      // const blob = new Blob([response.data], { type: 'image/jpeg' }); // Create Blob from Buffer
      // setProcessedImage(URL.createObjectURL(blob)); // Convert Blob to URL
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('Processed image changed:', processedImage);
  }, [processedImage]);

  return (
    <div>
      <h1>Image Processing</h1>
      <UploadForm onImageUpload={handleImageUpload} />
        <div>
          <h2>Processed Image</h2>
          <img src={processedImage} alt="Processed" />
        </div>
    </div>
  );
}

export default Photo;

import React, { useState, useEffect } from 'react';
import './Menu.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UploadForm from './UploadForm';
import axios from 'axios';

const Menu = () => {

    const [processedImage, setProcessedImage] = useState(null);
    const navigate = useNavigate();

    const location = useLocation();
    let selectedFormId =null;
    if(location !== null){
    selectedFormId = location.state.selectedFormId;
    console.log(selectedFormId);
    }
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

    const handleButtonClick = () => {
        navigate('/chatbot', { state: { selectedFormId: selectedFormId } });
    };
    

    useEffect(() => {
        console.log('Processed image changed:', processedImage);
    }, [processedImage]);

    return (
        <div className="menu-container">
            <div className="menu-content">
                <h1 className="menu-title">Image Processing</h1>
                <UploadForm onImageUpload={handleImageUpload} />
                {processedImage && (
                    <div className="processed-image-container">
                        <h2>Processed Image</h2>
                        <img className="processed-image" src={processedImage} alt="Processed" />
                    </div>
                )}
            </div>
            <p className="no-application">Don't have the filled application form?</p>
            {/* <Link to={{ pathname: '/chatBot', state: { selectedForm } }} className="chatbot-link"> */}
                <button onClick={handleButtonClick} className="chatbot-button">Try ChatBot</button>
            {/* </Link> */}
        </div>
    );
};

export default Menu;

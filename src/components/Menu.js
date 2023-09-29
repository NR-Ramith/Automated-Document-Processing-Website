import React, { useState, useEffect } from 'react';
import './Menu.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UploadForm from './UploadForm';

const Menu = () => {
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const location = useLocation();
    let selectedFormId = null;
    
    if (location !== null) {
        selectedFormId = location.state.selectedFormId;
    }

    const handleImageUpload = async (imageData) => {
        setIsLoading(true); // Set loading state to true when processing starts

        try {
            const response = await fetch('http://localhost:5000/processImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageData }), // Assuming imageData is a base64-encoded image
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const blob = await response.blob();

            // Check if the Blob has a valid type (e.g., image/jpeg, image/png)
            if (blob.type.startsWith('image/')) {
                // Create a Blob URL for the image
                const imageUrl = URL.createObjectURL(blob);
                setProcessedImage(imageUrl);
            } else {
                console.error('Invalid Blob type:', blob.type);
                // Handle the case where the Blob is not a valid image
            }
        } catch (error) {
            console.error('Error fetching image:', error);
            // Handle the fetch error here
        } finally {
            setIsLoading(false); // Set loading state to false when processing is complete
        }
    };

    const handleButtonClick = () => {
        handleImageUpload(); // Call the image upload function when the button is clicked
    };

    return (
        <div className="menu-container">
            <div className="menu-content">
                <h1 className="menu-title">Image Processing</h1>
                <UploadForm onImageUpload={handleImageUpload} />
                {isLoading ? (
                    <div className="loading-spinner-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : processedImage ? (
                    <div className="processed-image-container">
                        <h2>Processed Image</h2>
                        <img className="processed-image" src={processedImage} alt="Processed" />
                    </div>
                ) : null}
            </div>
            <p className="no-application">Don't have the filled application form?</p>
            <button onClick={handleButtonClick} className="chatbot-button">
                Try ChatBot
            </button>
        </div>
    );
};

export default Menu;
import React, { useState, useRef } from 'react';
import './Menu.css';
import { useNavigate } from 'react-router-dom';
import UploadForm from './UploadForm';
import { getTemplateId } from './values';

const Menu = () => {
    const [processedImageBlob, setProcessedImageBlob] = useState(null);
    const [processedImageURL, setProcessedImageURL] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    let selectedFormId = getTemplateId();

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
                setProcessedImageBlob(blob);
                const imageUrl = URL.createObjectURL(blob);
                setProcessedImageURL(imageUrl);
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
        navigate('/chatbot', { state: { selectedFormId: selectedFormId } });
    };

    const handleScanFormClick = () => {
        navigate('/getdata');
    };

    const handleImageSubmit = async () => {
        if (processedImageBlob) {
            setIsLoading(true);

            try {
                const formData = new FormData();
                formData.append('image', processedImageBlob);

                const response = await fetch('http://localhost:5000/uploadImage', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                console.log('Image uploaded successfully');

                // Reset the file input value to clear the selected file
                fileInputRef.current.value = '';

                // Reset the processedImageBlob and URL after upload
                setProcessedImageBlob(null);
                setProcessedImageURL(null);
            } catch (error) {
                console.error('Error uploading image:', error);
                // Handle the fetch error here
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="menu-container">
            <div className="menu-content">
                <h1 className="menu-title">Image Processing</h1>
                <UploadForm onImageUpload={handleImageUpload} fileInputRef={fileInputRef} />
                {isLoading ? (
                    <div className="loading-spinner-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : processedImageURL ? (
                    <div className="processed-image-container">
                        <h2>Processed Image</h2>
                        <img className="processed-image" src={processedImageURL} alt="Processed" />
                        <button onClick={handleImageSubmit} className="submit-button">Submit</button>
                    </div>
                ) : null}
            </div>
            <button onClick={handleScanFormClick} className="scan-form-button">Scan Form</button>
            <p className="no-application">Don't have the filled application form?</p>
            <button onClick={handleButtonClick} className="chatbot-button">Try ChatBot</button>
        </div>
    );
};

export default Menu;
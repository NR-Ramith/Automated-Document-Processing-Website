import React, { useState, useRef, useEffect } from 'react';
import './Menu.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import UploadForm from './UploadForm';
import { getStateValue, getTemplateId, setFieldValue, setFilledMandatoryFieldIndicator, setStateValue, getAllFieldValues } from './values';

const Menu = () => {
    const [processedImageBlob, setProcessedImageBlob] = useState(null);
    const [processedImageURL, setProcessedImageURL] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    let selectedFormId = getTemplateId();
    const location = useLocation();

    useEffect(() => {
        if (!getStateValue('fetchedQuestions')) {
            // Fetch questions when the component mounts or when selectedFormId changes
            if (location.state && location.state.selectedFormId) {
                const formId = location.state.selectedFormId;
                selectedFormId = formId;

                axios.get(`http://localhost:3001/getQuestions/${formId}`)
                    .then((response) => {
                        setStateValue('questions', response.data);

                        for (let i = 0; i < response.data.length; i++) {
                            const qesDictionary = response.data[i];
                            setFieldValue(qesDictionary.field, null);
                            if (qesDictionary.mandatory)
                                setFilledMandatoryFieldIndicator(qesDictionary.field, 0);
                        }
                        setStateValue('fetchedQuestions', 1);
                    })
                    .catch((error) => {
                        // Handle errors, e.g., questions not found for the selected form ID
                        console.error('Error fetching questions:', error);
                    });
            }
        }
    }, [location.state]);

    const handleImageUpload = async (imageData) => {
        setIsLoading(true); // Set loading state to true when processing starts

        try {
            const response = await fetch('http://localhost:5000/processImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageData, backgroundColor }), // Assuming imageData is a base64-encoded image
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

    const handleBackgroundChange = (e) => {
        setBackgroundColor(e.target.value);
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
                // const formData = new FormData();
                // formData.append('image', processedImageBlob);

                // const response = await fetch('http://localhost:5000/uploadImage', {
                //     method: 'POST',
                //     body: formData,
                // });

                // if (!response.ok) {
                //     throw new Error(`HTTP error! Status: ${response.status}`);
                // }

                // console.log('Image uploaded successfully');

                setFieldValue('passportImage', processedImageBlob);

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

    const handleSubmit = () => {
        const qes = getStateValue('questions');
        const allFieldValues = getAllFieldValues();
        for (let i = 0; i < qes.length; i++) {
            if (qes[i].mandatory === 'true') {
                console.log(qes[i])
                if (!allFieldValues[qes[i].field]) {
                    alert('Fill all the mandatory fields.');
                    return;
                }
            }
        }
        navigate('/viewfinaldata');
    };

    const goBack = () => {
        navigate('/formsList');
    };

    return (
        <div className="menu-container">
            <button onClick={goBack} className="back-button">&lt; Back</button>
            <div className="menu-content">
                <h1 className="menu-title">Image Processing</h1>
                <h5>Upload Image</h5>
                <div className="background-dropdown-container">
                    <label className="background-dropdown-label">Background color&nbsp;</label>
                    <select
                        className="background-dropdown"
                        value={backgroundColor}
                        onChange={handleBackgroundChange}
                    >
                        <option value="white">Choose...</option>
                        <option value="white">White</option>
                        <option value="blue">Blue</option>
                    </select>
                </div>
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
            <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
    );
};

export default Menu;
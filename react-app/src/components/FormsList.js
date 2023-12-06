import React, { useEffect, useState } from 'react';
import './FormsList.css';
import { useNavigate } from 'react-router-dom';
import { resetFieldValues, resetFilledMandatoryFieldIndicator, resetStateValues, setStateValue, setTemplateId, setDId } from './values';
import axios from 'axios';

const FormsList = () => {
    const [selectedForm, setSelectedForm] = useState(null);
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        resetStateValues();
        setTemplateId(0);
        setDId(0);
        resetFieldValues();
        resetFilledMandatoryFieldIndicator();
        setStateValue('fetchedQuestions',0);
        setStateValue('questions', []);
        axios.get('http://localhost:3001/getForms')
            .then(response => setForms(response.data))
            .catch(error => console.error('Error fetching forms:', error));
    }, []);

    const handleFormClick = (form) => {
        setSelectedForm(form);
        setTemplateId(form.id);
    };

    const handleBackButtonClick = () => {
        setSelectedForm(null);
        setTemplateId(0);
    };

    const handleFillButtonClick = (form) => {
        setSelectedForm(form);
        setTemplateId(form.id);
        navigate('/menu', { state: { selectedFormId: form.id } }); // Use navigate() for navigation
    };

    const handleCreateTemplateClick = () => {
        navigate('/createNewTemplate');
    };

    const handleFillOnlineFormClick = () => {
        navigate('/onlineFormsList');
    };

    return (
        <div className="forms-list-container">
            <h1 className="forms-list-heading">Available Forms</h1>
            <button className="online-form-button" onClick={handleFillOnlineFormClick}>
                Fill Online Form
            </button>
            <button className="create-template-button" onClick={handleCreateTemplateClick}>
                Create New Template
            </button>
            <div className="forms-list">
                {selectedForm ? (
                    <div className="selected-form">
                        <h2>{selectedForm.name}</h2>
                        <p>{selectedForm.description}</p>
                        <button onClick={handleBackButtonClick}>&lt; Back to Forms List</button>
                        <div className="form-images">
                            {selectedForm.images.map((image, index) => (
                                <>
                                <img
                                    key={index}
                                    src={image} // Set the image source URL
                                    alt={`Page ${index + 1}`}
                                    className="form-image"
                                    style={{ maxHeight: '150vh', maxWidth: '100%' }}
                                />
                                <br/>
                                </>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ul className="forms">
                        {forms.map((form, index) => (
                            <li key={index} className="form-card">
                                <div className="form-preview">
                                    <img src={form.frontImage} alt={`${form.name} Preview`} /> {/* Display the front image */}
                                </div>
                                <div className="form-details">
                                    <h3>{form.name}</h3>
                                    <p style={{fontFamily:"Georgia"}}>{form.description}</p>
                                    <div className="buttons">
                                        <div onClick={() => handleFormClick(form)} className="button preview-button">
                                            Preview
                                        </div>
                                        <div
                                            onClick={() => handleFillButtonClick(form)}
                                            className="button fill-form-button"
                                        >
                                            Fill
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FormsList;
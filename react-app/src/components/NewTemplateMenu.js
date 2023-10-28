import React, { useEffect } from 'react';
import './NewTemplateMenu.css';
import { useNavigate } from 'react-router-dom';
import { setNewTemplateId } from './values';
import axios from './axios-object';

const NewTemplateMenu = () => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/getCurrentNewTemplateId')
            .then(response => setNewTemplateId(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleGetNewTemplateId = () => {
        axios.get('/getNewTemplateId')
            .then(response => setNewTemplateId(response.data))
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleCreateFormEntry = () => {
        navigate('/createFormEntry');
    };

    const handleInsertChatbotFields = () => {
        navigate('/addChatbotFields');
    };

    const handleMarkFormTemplate = () => {
        navigate('/markTemp');
    };

    const goBack = () => {
        navigate('/formsList');
    };

    return (
        <>
            <button onClick={goBack} className="back-button">&lt; Back</button>
            <div className="new-template-menu">
                <h2>Create New Template</h2>
                <div className="menu-container">
                    <div className="menu-content">
                        <div className="menu-buttons">
                            <button className="menu-button" onClick={handleGetNewTemplateId}>
                                Get New Template Id
                            </button>
                            <button className="menu-button" onClick={handleCreateFormEntry}>
                                Create Forms List Entry
                            </button>
                            <button className="menu-button" onClick={handleInsertChatbotFields}>
                                Insert Chatbot Fields
                            </button>
                            <button className="menu-button" onClick={handleMarkFormTemplate}>
                                Mark Form Template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewTemplateMenu;

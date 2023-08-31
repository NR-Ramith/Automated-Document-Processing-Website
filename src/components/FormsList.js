import React, { useState } from 'react';
import './FormsList.css'; 

const FormsList = () => {
    const [selectedForm, setSelectedForm] = useState(null);

    const forms = [
        {
            name: 'Account Opening Form for Resident Individuals',
            description: 'Fill this out to open a new financial account with the bank.',
            frontImage: require('../images/form1-1.jpeg'),
            images: [require('../images/form1-1.jpeg'), require('../images/form1-2.jpeg')],
        },
        {
            name: 'Information of Applicant/Signatory',
            description: 'Fill this out to provide essential personal and identification details required to establish an account or perform financial transactions.',
            frontImage: require('../images/form2-1.jpeg'),
            images: [require('../images/form2-1.jpeg'), require('../images/form2-2.jpeg')],
        },
        {
            name: 'Interview and Customer Due Diligence Form',
            description: 'Fill this out to complete as part of the process to gather detailed information from customers, aiding the bank in assessing risks, complying with regulations, and ensuring the legitimacy of financial transactions.',
            frontImage: require('../images/form3-1.jpeg'),
            images: [require('../images/form3-1.jpeg')],
        },
        // {
        //     name: 'Form 4',
        //     description: 'Description for Form 1',
        //     frontImage: require('../images/pew.jpeg'),
        //     images: ['url_to_image_1', 'url_to_image_2', 'url_to_image_3'],
        // },
        // {
        //     name: 'Form 5',
        //     description: 'Description for Form 1',
        //     frontImage: require('../images/pew.jpeg'),
        //     images: ['url_to_image_1', 'url_to_image_2', 'url_to_image_3'],
        // },
        // Add more forms as needed
    ];

    const handleFormClick = (form) => {
        setSelectedForm(form);
    };

    const handleBackButtonClick = () => {
        setSelectedForm(null);
    };

    return (
        <div className="forms-list-container">
            <h1 className="forms-list-heading">Available Forms</h1>
            <div className="forms-list">
                {selectedForm ? (
                    <div className="selected-form">
                        <h2>{selectedForm.name}</h2>
                        <p>{selectedForm.description}</p>
                        <button onClick={handleBackButtonClick}>Back to Forms List</button>
                        <div className="form-images">
                            {selectedForm.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Page ${index + 1}`}
                                    className="form-image"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <ul className="forms">
                        {forms.map((form, index) => (
                            <li
                                key={index}
                                className="form-card"
                                onClick={() => handleFormClick(form)}
                            >
                                <div className="form-preview">
                                    <img src={form.frontImage} alt={`${form.name} Preview`} />
                                </div>
                                <div className="form-details">
                                    <h3>{form.name}</h3>
                                    <p>{form.description}</p>
                                    <div className="buttons">
                                        <button
                                            className="button preview-button"
                                            onClick={() => handleFormClick(form)}
                                        >
                                            Preview
                                        </button>
                                        <a href="/menu">
                                            <button className="button fill-form-button">Fill</button>
                                        </a>
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

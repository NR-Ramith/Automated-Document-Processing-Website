import React, { useState, useRef } from 'react';
import './AddChatbotFields.css';
import { getNewTemplateId } from './values';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddChatbotFields = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({ id: 1 });
    const [optionsText, setOptionsText] = useState('');
    const [qid, setQid] = useState(2);

    const callValidationInputRef = useRef(null);
    const optionValueInputRef = useRef(null);
    const optionLabelInputRef = useRef(null);
    const navigate = useNavigate();

    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuestion({
            ...currentQuestion,
            [name]: value,
        });

    };

    const handleValidationSubmit = () => {
        if (callValidationInputRef.current.value) {
            if (!currentQuestion.callValidations) {
                currentQuestion.callValidations = [];
            }
            currentQuestion.callValidations = [
                ...currentQuestion.callValidations,
                callValidationInputRef.current.value
            ];
            callValidationInputRef.current.value = '';
        }
    };
    const handleOptionSubmit = () => {
        if (optionValueInputRef.current.value && optionLabelInputRef.current.value) {
            if (!currentQuestion.options) {
                currentQuestion.options = [];
            }
            currentQuestion.options = [
                ...currentQuestion.options,
                { value: optionValueInputRef.current.value, label: optionLabelInputRef.current.value }
            ];
            optionValueInputRef.current.value = '';
            optionLabelInputRef.current.value = '';
        }
    };

    const addQuestion = () => {
        if (currentQuestion.text && currentQuestion.field && currentQuestion.mandatory && currentQuestion.callValidations) {
            setQuestions([...questions, currentQuestion]);
            setCurrentQuestion({ id: qid });
            setQid(qid + 1);
        }
    };

    const addOption = () => {
        if (optionsText) {
            const updatedQuestions = [...questions];
            updatedQuestions[questions.length - 1].options.push(optionsText);
            setQuestions(updatedQuestions);
            setOptionsText('');
        }
    };

    const goBack = () => {
        navigate('/createNewTemplate');
      };

    const submitTemplateQuestions = () => {
        axios.post(`http://localhost:3001/submitTemplateQuestions`, [getNewTemplateId(), questions])
            .then(() => {
                alert("Template questions submitted successfully.");
                navigate('/createNewTemplate');
            })
            .catch(error => console.error('Error submitting questions:', error));
    };

    return (
        <div>
            <button onClick={goBack} className="back-button">&lt; Back</button>
            <div>
                <h2>Add Chatbot Fields</h2>
                <div className="add-question-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="text"
                            placeholder="Question Text"
                            value={currentQuestion.text || ''}
                            onChange={handleQuestionChange}
                        />
                        <input
                            type="text"
                            name="field"
                            placeholder="Field"
                            value={currentQuestion.field || ''}
                            onChange={handleQuestionChange}
                        />
                        <input
                            type="text"
                            name="fieldLength"
                            placeholder="Field Length"
                            value={currentQuestion.fieldLength || ''}
                            onChange={handleQuestionChange}
                        />
                        <input
                            type="text"
                            name="mandatory"
                            placeholder="Mandatory Question?"
                            value={currentQuestion.mandatory || ''}
                            onChange={handleQuestionChange}
                        />
                    </div>
                    <div className="input-group">
                        {/* <input
                        type="text"
                        name="options"
                        placeholder="Has Options to Select?"
                        value={currentQuestion.options || ''}
                        onChange={handleQuestionChange}
                    /> */}
                        <input
                            type="text"
                            name="callValidation"
                            placeholder="Validation to call"
                            ref={callValidationInputRef}
                        />
                        <button className="add-button" onClick={handleValidationSubmit}>Add Validation</button>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name='optionValue'
                            placeholder="Option Value"
                            ref={optionValueInputRef}
                        />
                        <input
                            type="text"
                            name='optionLabel'
                            placeholder="Option Label"
                            ref={optionLabelInputRef}
                        />
                        <button className="add-button" onClick={handleOptionSubmit}>Add Option</button>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="last"
                            placeholder="Last Question?"
                            value={currentQuestion.last || ''}
                            onChange={handleQuestionChange}
                        />
                        <button onClick={addQuestion}>Add Question</button>
                    </div>
                </div>
                <button className='submit-button' onClick={submitTemplateQuestions}>Submit Template Questions</button>
                {/* {currentQuestion.text && (
                <tr>
                    <td>{currentQuestion.id}</td>
                    <td>{currentQuestion.text}</td>
                    <td>{currentQuestion.field}</td>
                    <td>{currentQuestion.fieldLength}</td>
                    <td>{currentQuestion.mandatory}</td>
                    <td>
                        <ul>
                            {currentQuestion.options && currentQuestion.options.map((option, optionIndex) => (
                                <li key={optionIndex}>{option.value} - {option.label}</li>
                            ))}
                        </ul>
                    </td>
                    <td>
                        <ul>
                            {currentQuestion.callValidations && currentQuestion.callValidations.map((validation, validationIndex) => (
                                <li key={validationIndex}>{validation}</li>
                            ))}
                        </ul>
                    </td>
                </tr>
            )} */}

                <table className="questions-table">
                    <thead>
                        <tr>
                            <th className="small-column">ID</th>
                            <th className="large-column">Text</th>
                            <th className="small-column">Field</th>
                            <th className="small-column">Field Length</th>
                            <th className="small-column">Mandatory</th>
                            <th className="large-column">Options</th>
                            <th className="medium-column">Call Validations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr key={index}>
                                <td>{question.id}</td>
                                <td>{question.text}</td>
                                <td>{question.field}</td>
                                <td>{question.fieldLength}</td>
                                <td>{question.mandatory}</td>
                                <td>
                                    <ul>
                                        {question.options && question.options.map((option, optionIndex) => (
                                            <li key={optionIndex}>{option.value} - {option.label}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {question.callValidations && question.callValidations.map((validation, validationIndex) => (
                                            <li key={validationIndex}>{validation}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AddChatbotFields;

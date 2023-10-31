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
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);

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

    const handleEdit = (index) => {
        setEditingQuestion({ ...questions[index] });
    };

    const handleEditQuestionChange = (e) => {
        const { name, value } = e.target;
        const updatedQuestion = { ...editingQuestion };

        if (name === "options") {
            updatedQuestion.options = updatedQuestion.options.map((option, index) => {
                if (index === parseInt(e.target.dataset.index, 10)) {
                    return { ...option, [e.target.dataset.field]: value };
                }
                return option;
            });
        } else if (name === "callValidations") {
            updatedQuestion.callValidations = updatedQuestion.callValidations.map((validation, index) => {
                if (index === parseInt(e.target.dataset.index, 10)) {
                    return value;
                }
                return validation;
            });
        } else {
            updatedQuestion[name] = value;
        }

        setEditingQuestion(updatedQuestion);
    };


    const saveEditedQuestion = () => {
        const updatedQuestions = [...questions];
        const index = updatedQuestions.findIndex((q) => q.id === editingQuestion.id);
        if (index !== -1) {
            updatedQuestions[index] = editingQuestion; // Update the selected row
            setQuestions(updatedQuestions); // Update the state
        }
        setEditingQuestion(null); // Close the editing form
    };

    const handleDelete = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1); // Remove the selected row from the array
        setQuestions(updatedQuestions); // Update the state
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index) => {
        if (draggedIndex === null || index === draggedIndex) return;

        const updatedQuestions = [...questions];
        const [draggedItem] = updatedQuestions.splice(draggedIndex, 1);
        updatedQuestions.splice(index, 0, draggedItem);

        setQuestions(updatedQuestions);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);

        // Reassign IDs based on the new order
        const updatedQuestions = questions.map((question, index) => ({
            ...question,
            id: index + 1,
        }));

        setQuestions(updatedQuestions);
    };

    const goBack = () => {
        navigate('/createNewTemplate')
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
                    </div>
                    <div className="input-group">
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
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="mandatory"
                            placeholder="Mandatory Question?"
                            value={currentQuestion.mandatory || ''}
                            onChange={handleQuestionChange}
                        />
                    </div>
                    <div className="input-group">
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
                            <th className="small-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr key={index}
                                draggable={true}
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={() => handleDragOver(index)}
                                onDragEnd={handleDragEnd}>
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
                                <td>
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                    <button onClick={() => handleDelete(index)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {editingQuestion && (
                            <div className="edit-form">
                                <h3>Edit Question</h3>
                                <input
                                    type="text"
                                    name="text"
                                    value={editingQuestion.text}
                                    onChange={handleEditQuestionChange}
                                />
                                <input
                                    type="text"
                                    name="field"
                                    value={editingQuestion.field}
                                    onChange={handleEditQuestionChange}
                                />
                                <input
                                    type="text"
                                    name="fieldLength"
                                    value={editingQuestion.fieldLength}
                                    onChange={handleEditQuestionChange}
                                />
                                <input
                                    type="text"
                                    name="mandatory"
                                    value={editingQuestion.mandatory}
                                    onChange={handleEditQuestionChange}
                                />
                                {editingQuestion.options && (
                                    <div>
                                        <h4>Options</h4>
                                        {editingQuestion.options.map((option, optionIndex) => (
                                            <div key={optionIndex}>
                                                <input
                                                    type="text"
                                                    name="options"
                                                    data-index={optionIndex}
                                                    data-field="value"
                                                    value={option.value}
                                                    onChange={handleEditQuestionChange}
                                                />
                                                <input
                                                    type="text"
                                                    name="options"
                                                    data-index={optionIndex}
                                                    data-field="label"
                                                    value={option.label}
                                                    onChange={handleEditQuestionChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {editingQuestion.callValidations && (
                                    <div>
                                        <h4>Call Validations</h4>
                                        {editingQuestion.callValidations.map((validation, validationIndex) => (
                                            <div key={validationIndex}>
                                                <input
                                                    type="text"
                                                    name="callValidations"
                                                    data-index={validationIndex}
                                                    value={validation}
                                                    onChange={handleEditQuestionChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button onClick={saveEditedQuestion}>Save</button>
                            </div>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default AddChatbotFields;
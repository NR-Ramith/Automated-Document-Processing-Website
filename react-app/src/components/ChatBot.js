import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { isValidDateFormat, isValidDate, hasOnlyAlphabets, hasOnlyDigits, hasFieldLength, isValidEmailFormat, toTitle } from './validate';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [voiceInput, setVoiceInput] = useState('');
  const inputRef = useRef(null);
  const [userInputs, setUserInputs] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [lastQuestionValue, setLastQuestionValue] = useState('');
  const [questions, setQuestions] = useState([]);
  let currentQuestion = {};

  const location = useLocation();
  let selectedFormId = null;

  useEffect(() => {
    // Fetch questions when the component mounts or when selectedFormId changes
    if (location.state && location.state.selectedFormId) {
      const formId = location.state.selectedFormId;
      selectedFormId = formId;

      axios.get(`http://localhost:3001/getQuestions/${formId}`)
        .then((response) => {
          setQuestions(response.data);
          currentQuestion = response.data[currentQuestionIndex];
          setMessages([...messages, { text: currentQuestion.text, isUser: false }]);
          readOutText(currentQuestion.text);
        })
        .catch((error) => {
          // Handle errors, e.g., questions not found for the selected form ID
          console.error('Error fetching questions:', error);
        });
    }
  }, [location.state]);

  const handleVoiceInput = (event) => {
    const transcript = event.results[0][0].transcript;
    setVoiceInput(transcript);
  };

  const handleVoiceError = (event) => {
    console.log('Voice recognition error:', event.error);
  };

  const readOutText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.addEventListener('result', handleVoiceInput);
    recognition.addEventListener('error', handleVoiceError);
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.stop();
  };


  const askNextQuestion = () => {
    // Check if there are more questions in the selected form
    if (currentQuestionIndex + 1 < questions.length) {
      // Get the next question
      const nextQuestion = questions[currentQuestionIndex + 1];

      // Create a message for the next question
      const nextQuestionMessage = { text: nextQuestion.text, isUser: false };

      // Update the state with the new question and messages
      setMessages((messages) => [...messages, nextQuestionMessage]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      // Read out the next question
      readOutText(nextQuestion.text);
    } else {
      // Conversation ended, you can handle this however you want
      const endMessage = {
        text: 'Thank you for the conversation!\n Enter your Name',
        isUser: false,
      };
      // setMessages([...messages, endMessage]);
      setMessages((messages) => [...messages, endMessage]);
      setCurrentQuestionIndex(0); // Reset to the initial question for future conversations
      readOutText(endMessage.text);
    }
  };


  const handleUserInput = async (event) => {
    event.preventDefault();

    let userInput = voiceInput || inputRef.current.value; // Use voiceInput if available, otherwise use text input
    // Remove trailing full stop if it exists
    userInput = userInput.replace(/\.$/, '');
    const currentQuestion = questions[currentQuestionIndex];
    let updatedMessages = [];

    userInput = userInput.trim(); // Remove leading and trailing whitespace

    if (userInput === "") {
      // If field is mandatory
      if (currentQuestion.mandatory) {
        const mandatoryMessage = {
          text: 'This field is required.',
        };
        setMessages(prevMessages => [...prevMessages, mandatoryMessage]);
        readOutText(mandatoryMessage.text);
        return;
      }

      // If user input is empty, just move to the next question
      if (currentQuestion.last === true)
        setLastQuestionValue('Empty');
      askNextQuestion();
      return; // Skip further processing
    } else {
      if (currentQuestion.options)
        return;
    }

    let validationFailed = false;
    let invalidMessage;

    if (currentQuestion.callValidations) {
      for (let i = 0; i < currentQuestion.callValidations.length; i++) {
        const validationCheck = currentQuestion.callValidations[i];
        if (validationCheck === 'onlyAlphabets') {
          if (!hasOnlyAlphabets(userInput)) {
            invalidMessage = "Field must contain only alphabets.";
            validationFailed = true;
            break;
          }
        } else if (validationCheck === 'onlyDigits') {
          if (!hasOnlyDigits(userInput)) {
            invalidMessage = "Field must contain only digits.";
            validationFailed = true;
            break;
          }
        } else if (validationCheck === 'maxLength') {
          if (!hasFieldLength(userInput, currentQuestion.fieldLength, false)) {
            invalidMessage = "Field exceeds the max length.";
            validationFailed = true;
            break;
          }
        } else if (validationCheck === 'fixedLength') {
          if (!hasFieldLength(userInput, currentQuestion.fieldLength, true)) {
            invalidMessage = "Field is not of the required length.";
            validationFailed = true;
            break;
          }
        } else if (validationCheck === 'validEmail') {
          if (!isValidEmailFormat(userInput)) {
            invalidMessage = "Field is not of proper Email id format.";
            validationFailed = true;
            break;
          }
        } else if (validationCheck === 'makeTitle') {
          userInput = toTitle(userInput);
        } else if (validationCheck === 'dateFormat') {
          if (!isValidDateFormat(userInput)) {
            invalidMessage = "Field is not of proper date format.";
            validationFailed = true;
            break;
          }
        } else if (validationCheck === 'validDate') {
          if (!isValidDate(userInput)) {
            invalidMessage = "Field is not a proper calendar date or date lies in the future.";
            validationFailed = true;
            break;
          }
        }
      }
    }

    if (validationFailed) {
      const invalidMessageObj = { text: invalidMessage, isUser: false };
      setMessages([...messages, invalidMessageObj]);
      readOutText(invalidMessage);
      return; // Exit the handleUserInput function if validation failed
    }
    if (userInput) {
      setInputs([...inputs, { fieldName: currentQuestion.field, val: userInput }]);
      if (currentQuestion.last === true)
        setLastQuestionValue(userInput);

      // Add the user's input to the messages
      updatedMessages = [
        ...messages,
        { text: userInput, isUser: true },
      ];
      setMessages(updatedMessages);
      setVoiceInput('');
    }

    // Move to the next field or end the conversation
    askNextQuestion();
  };


  // Use useEffect to capture the updated dob value before sending it to the server
  useEffect(() => {
    if (lastQuestionValue || lastQuestionValue === 'Empty') {
      // Send the user input to the server
      const sendUserInput = async () => {
        const userInputData = {};
        for (let i = 0; i < inputs.length; i++) {
          console.log(inputs[i]);
          userInputData[inputs[i].fieldName] = inputs[i].val;
        }

        try {
          await axios.post('http://localhost:3001/save', {
            userInput: userInputData, selectedFormId
          });
          console.log('User input saved successfully');

          // Add the user inputs to the userInputs array
          const newInput = userInputData;
          console.log(newInput);
          setUserInputs((prevUserInputs) => [...prevUserInputs, newInput]);

          // Clear the input fields
          setLastQuestionValue('');
          setInputs([]);

        } catch (error) {
          console.error('Failed to save user input:', error);
        }
      };

      sendUserInput();
    }
  }, [lastQuestionValue]);


  useEffect(() => {
    // Scroll to the bottom of the chat window whenever messages change
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>ChatBot</h2>
      </div>
      <div id="chat-window" className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user' : 'bot'}`}
          >
            {message.text}
          </div>
        ))}
        {userInputs.length > 0 && (
          <div className="message bot">
            <h4>Collected Inputs:</h4>
            {userInputs.map((input, index) => (
              <div key={index}>
                {Object.entries(input).map(([fieldName, fieldValue]) => (
                  <div>
                    <span key={fieldName}>
                      <strong>{fieldName}:</strong> {fieldValue}
                    </span>
                    <br />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {questions[currentQuestionIndex] && questions[currentQuestionIndex].options ? (
          <div className="checkbox-options">
            {questions[currentQuestionIndex].options.map((option) => (
              <div key={option.value} className="checkbox-option">
                <input
                  type="checkbox"
                  id={option.value}
                  name={option.value}
                  // checked={checkboxValue === option.value}
                  checked={false}
                  onChange={() => {
                    // setCheckboxValue(option.value);
                    setInputs([...inputs, { fieldName: questions[currentQuestionIndex].field, val: option.value }]);
                    const checkboxMessage = {
                      text: option.value,
                      isUser: true,
                    };
                    setMessages([...messages, checkboxMessage]);
                    if (questions[currentQuestionIndex].last === true)
                      setLastQuestionValue('Empty');
                    askNextQuestion();
                  }}
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <form onSubmit={handleUserInput} className="input-form">
        <input
          type="text"
          ref={inputRef}
          value={voiceInput}
          onChange={(e) => setVoiceInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div className="voice-recognition">
        <button onClick={startVoiceRecognition}>Start Voice Recognition</button>
        <button onClick={stopVoiceRecognition}>Stop Voice Recognition</button>
      </div>
    </div>
  );
};

export default ChatBot;
import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidDateFormat, isValidDate, hasOnlyAlphabets, hasOnlyDigits, hasFieldLength, isValidEmailFormat, toTitle } from './validate';
import { getFieldValue, getStateValue, setFieldValue, setFilledMandatoryFieldIndicator, setStateValue } from './values';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // let currentQuestionIndex=0;
  const [voiceInput, setVoiceInput] = useState('');
  const inputRef = useRef(null);
  const [userInputs, setUserInputs] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [lastQuestionValue, setLastQuestionValue] = useState('');
  const [questions, setQuestions] = useState([]);
  let currentQuestion = {};

  const navigate = useNavigate();
  const location = useLocation();
  let selectedFormId = null;
  let doneFlag = 0;

  useEffect(() => {
    // Fetch questions when the component mounts or when selectedFormId changes
    if (location.state && location.state.selectedFormId) {
      const formId = location.state.selectedFormId;
      selectedFormId = formId;
      setStateValue('currentQuestionIndex', 0);
      setQuestions(getStateValue('questions'));
      let tempQuestions = getStateValue('questions');
      let i = 0;
      for (i = 0; i < tempQuestions.length; i++) {
        if (!getFieldValue(tempQuestions[i]['field'])) {
          currentQuestion = tempQuestions[i];
          // setCurrentQuestionIndex(i);
          // currentQuestionIndex=i;
          setStateValue('currentQuestionIndex', i);
          setMessages([...messages, { text: currentQuestion.text, isUser: false }]);
          readOutText(currentQuestion.text);
          return;
        }
      }
      // If all the questions are filled
      if (i === tempQuestions.length) {
        const endMessage = {
          text: 'Everything is filled. Thank you for the conversation!',
          isUser: false,
        };
        // setMessages([...messages, endMessage]);
        setMessages((messages) => [...messages, endMessage]);
        doneFlag = 1;
        // setCurrentQuestionIndex(0); // Reset to the initial question for future conversations
        readOutText(endMessage.text);
      }

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

  const goBack = () => {
    navigate('/menu');
  };

  const askNextQuestion = () => {
    while (getStateValue('currentQuestionIndex') + 1 < questions.length) {
      const nextQuestion = questions[getStateValue('currentQuestionIndex') + 1];
      // Check if the question is already filled
      if (getFieldValue(nextQuestion.field) == null) {
        // If the question is filled, assign it as the next question and read it out
        const nextQuestionMessage = { text: nextQuestion.text, isUser: false };
        setMessages((messages) => [...messages, nextQuestionMessage]);
        readOutText(nextQuestion.text);
        // setCurrentQuestionIndex(currentQuestionIndex + 1);
        // currentQuestionIndex+=1;
        setStateValue('currentQuestionIndex', getStateValue('currentQuestionIndex') + 1);
        return;
      } else {
        // setCurrentQuestionIndex(currentQuestionIndex + 1);
        setStateValue('currentQuestionIndex', getStateValue('currentQuestionIndex') + 1);
      }
    }
    const endMessage = {
      text: 'Thank you for the conversation!',
      isUser: false,
    };
    // setMessages([...messages, endMessage]);
    setMessages((messages) => [...messages, endMessage]);
    doneFlag = 1;
    // setCurrentQuestionIndex(0); // Reset to the initial question for future conversations
    readOutText(endMessage.text);
  };


  const handleUserInput = async (event) => {
    event.preventDefault();

    let userInput = voiceInput || inputRef.current.value; // Use voiceInput if available, otherwise use text input
    // Remove trailing full stop if it exists
    userInput = userInput.replace(/\.$/, '');
    const currentQuestion = questions[getStateValue('currentQuestionIndex')];
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
      if (getStateValue('currentQuestionIndex') === questions.length - 1)
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
      setFieldValue(currentQuestion.field, userInput);
      if (currentQuestion.mandatory)
        setFilledMandatoryFieldIndicator(currentQuestion.field, 1);
      setInputs([...inputs, { fieldName: currentQuestion.field, val: userInput }]);
      if (getStateValue('currentQuestionIndex') === questions.length - 1)
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


  // Use useEffect to capture the updated last value before sending it to the server
  useEffect(() => {
    if (lastQuestionValue || lastQuestionValue === 'Empty') {
      // Send the user input to the server
      // const sendUserInput = async () => {
      //   const userInputData = {};
      //   for (let i = 0; i < inputs.length; i++) {
      //     userInputData[inputs[i].fieldName] = inputs[i].val;
      //   }

      //   try {
      //     await axios.post('http://localhost:3001/save', {
      //       userInput: userInputData, selectedFormId
      //     });
      //     console.log('User input saved successfully');

      //     // Add the user inputs to the userInputs array
      //     const newInput = userInputData;
      //     setUserInputs((prevUserInputs) => [...prevUserInputs, newInput]);

      //     // Clear the input fields
      //     setLastQuestionValue('');
      //     setInputs([]);

      //   } catch (error) {
      //     console.error('Failed to save user input:', error);
      //   }
      // };

      const sendUserInput = async () => {
        const userInputData = {};
        for (let i = 0; i < inputs.length; i++) {
          userInputData[inputs[i].fieldName] = inputs[i].val;
        }

        try {
          doneFlag = 1;
          // await axios.post('http://localhost:3001/save', {
          //   userInput: userInputData, selectedFormId
          // });
          // console.log('User input saved successfully');

          // Add the user inputs to the userInputs array
          const newInput = userInputData;
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
    <div className='chatbot-window'>
      <button onClick={goBack} className="back-button">&lt; Back</button>
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
          {questions[getStateValue('currentQuestionIndex')] && questions[getStateValue('currentQuestionIndex')].options ? (
            <div className="checkbox-options">
              {questions[getStateValue('currentQuestionIndex')].options.map((option) => (
                <div key={option.value} className="checkbox-option">
                  <input
                    type="checkbox"
                    id={option.value}
                    name={option.value}
                    // checked={checkboxValue === option.value}
                    checked={false}
                    onChange={() => {
                      // setCheckboxValue(option.value);
                      setFieldValue(questions[getStateValue('currentQuestionIndex')].field, option.value);
                      if (questions[getStateValue('currentQuestionIndex')].mandatory)
                        setFilledMandatoryFieldIndicator(questions[getStateValue('currentQuestionIndex')].field, 1);
                      setInputs([...inputs, { fieldName: questions[getStateValue('currentQuestionIndex')].field, val: option.value }]);
                      const checkboxMessage = {
                        text: option.value,
                        isUser: true,
                      };
                      setMessages([...messages, checkboxMessage]);
                      if (getStateValue('currentQuestionIndex') === questions.length - 1)
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
      <button onClick={goBack} className="submit-button">Back to Menu</button>
    </div>
  );
};

export default ChatBot;
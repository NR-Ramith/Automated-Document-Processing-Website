import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [voiceInput, setVoiceInput] = useState('');
  const inputRef = useRef(null);
  const [userInputs, setUserInputs] = useState([]);

  const questions = [
    { id: 1, text: 'What is your name?', field: 'name' },
    { id: 2, text: 'What is your address?', field: 'address' },
    { id: 3, text: 'What is your date of birth?', field: 'dob' },
    // Add more questions as needed
  ];

  const handleVoiceInput = (event) => {
    const transcript = event.results[0][0].transcript;
    setVoiceInput(transcript);
  };

  const handleVoiceError = (event) => {
    console.log('Voice recognition error:', event.error);
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

  const handleUserInput = async (event) => {
    event.preventDefault();
    console.log('Handle User Input');
    console.log('Data:', { name, address, dob });
    const userInput = voiceInput || inputRef.current.value; // Use voiceInput if available, otherwise use text input
    const currentQuestion = questions[currentQuestionIndex];
  
    // Capture the user's input for the current field
    switch (currentQuestion.field) {
      case 'name':
        setName(userInput);
        break;
      case 'address':
        setAddress(userInput);
        break;
      case 'dob':
        setDob(userInput);
        break;
      default:
        break;
    }
  
    // Add the user's input to the messages
    const updatedMessages = [
      ...messages,
      { text: userInput, isUser: true },
    ];
    setMessages(updatedMessages);
    setVoiceInput('');
  
    // Move to the next field or end the conversation
    if (currentQuestionIndex + 1 < questions.length) {
      // Ask the next question
      const nextQuestion = questions[currentQuestionIndex + 1];
      const nextQuestionMessage = { text: nextQuestion.text, isUser: false };
      setMessages([...updatedMessages, nextQuestionMessage]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Conversation ended, you can handle this however you want
      const endMessage = {
        text: 'Thank you for the conversation!\n Enter your Name',
        isUser: false,
      };
      setMessages([...updatedMessages, endMessage]);
      setCurrentQuestionIndex(0); // Reset to the initial question for future conversations
    }
  };
  
  // Use useEffect to capture the updated dob value before sending it to the server
  useEffect(() => {
    if (dob) {
      // Capture the updated dob value
      const updatedDob = dob;
  
      // Send the user input to the server
      const sendUserInput = async () => {
        try {
          await axios.post('http://localhost:3001/save', {
            userInput: {
              name,
              address,
              dob: updatedDob,
            },
          });
          console.log('User input saved successfully');
  
          // Add the user inputs to the userInputs array
          const newInput = { name, address, dob: updatedDob };
          setUserInputs((prevUserInputs) => [...prevUserInputs, newInput]);
  
          // Clear the input fields
          setName('');
          setAddress('');
          setDob('');
        } catch (error) {
          console.error('Failed to save user input:', error);
        }
      };
  
      sendUserInput();
    }
  }, [dob]);
  
  

  useEffect(() => {
    // Scroll to the bottom of the chat window whenever messages change
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  useEffect(() => {
    // Ask the initial question when the component mounts
    const currentQuestion = questions[currentQuestionIndex];
    setMessages([...messages, { text: currentQuestion.text, isUser: false }]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <strong>Name:</strong> {input.name}
        <br />
        <strong>Address:</strong> {input.address}
        <br />
        <strong>Date of Birth:</strong> {input.dob}
        <br />
        <br />
      </div>
    ))}
  </div>
)}

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
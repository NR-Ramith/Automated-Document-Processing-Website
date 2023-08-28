import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [name, setName] = useState(null);
  const [personalNumber, setPersonalNumber] = useState('');
  const [email, setEmail] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherNumber, setFatherNumber] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherNumber, setMotherNumber] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianNumber, setGuardianNumber] = useState('');
  const [dob, setDob] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [nationality, setNationality] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [voiceInput, setVoiceInput] = useState('');
  const inputRef = useRef(null);
  const [userInputs, setUserInputs] = useState([]);

  const questions = [
    { id: 1, text: 'What is your name?', field: 'name' },
    // { id: 2, text: 'What is your personal number?', field: 'personalNumber' },
    // { id: 16, text: 'What is your email address?', field: 'email' },
    // { id: 3, text: "What is your father's name?", field: 'fatherName' },
    // { id: 4, text: "What is your father's number?", field: 'fatherNumber' },
    // { id: 5, text: "What is your mother's name?", field: 'motherName' },
    // { id: 6, text: "What is your mother's number?", field: 'motherNumber' },
    // { id: 7, text: "What is your guardian's name?", field: 'guardianName' },
    // { id: 8, text: "What is your guardian's number?", field: 'guardianNumber' },
    { id: 11, text: 'What is your address?', field: 'address' },
    { id: 9, text: 'What is your date of birth? Speak the date in this format - YYYY dash MM dash DD', field: 'dob' },
    // { id: 10, text: 'What is the current date? Speak the date in this format - YYYY dash MM dash DD', field: 'date' },

    // { id: 12, text: 'What is your city?', field: 'city' },
    // { id: 13, text: 'What is your state?', field: 'state' },
    // { id: 14, text: 'What is your nationality?', field: 'nationality' },
    // { id: 15, text: 'What is your pin code?', field: 'pinCode' },
  ];

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

  function validateAndFormatName(input) {
    // Check if the name contains numbers or special characters
    if (/\d/.test(input) || /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/]/.test(input)) {
      return { isValid: false, formattedName: null };
    }

    // Capitalize the first letter of every word
    const words = input.split(' ');
    const capitalizedWords = words.map((word) => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    });

    const formattedName = capitalizedWords.join(' ');

    return { isValid: true, formattedName };
  }

  function isValidDateFormat(input) {
    // Regular expression to match "YYYY-MM-DD" format
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    return regex.test(input);
  }

  function isValidDate(year, month, day) {
    const dateObject = new Date(year, month - 1, day); // Month is 0-indexed
    if (
      dateObject.getFullYear() !== year ||
      dateObject.getMonth() !== month - 1 ||
      dateObject.getDate() !== day
    ) {
      return false; // Invalid date
    }

    // Check if the input date is not beyond the present day
    const currentDate = new Date();
    if (dateObject > currentDate) {
      return false; // Input date is in the future
    }

    // Check if the day is within the valid range for the given month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) {
      return false; // Invalid day for the given month
    }

    return true; // Date is valid
  }

  const handleUserInput = async (event) => {
    event.preventDefault();
    // console.log('Handle User Input');
    // console.log('Data:', { name, address, dob });
    let userInput = voiceInput || inputRef.current.value; // Use voiceInput if available, otherwise use text input
    // Remove trailing full stop if it exists
    userInput = userInput.replace(/\.$/, '');
    const currentQuestion = questions[currentQuestionIndex];
    let updatedMessages = [];

    userInput = userInput.trim(); // Remove leading and trailing whitespace

    if (userInput === "") {
      // If field is mandatory
      if (currentQuestion.field === 'name' || currentQuestion.field === 'personalNumber') {
        const mandatoryMessage = {
          text: 'This field is required.',
        };
        setMessages(prevMessages => [...prevMessages, mandatoryMessage]);
        readOutText(mandatoryMessage.text);
        return;
      }
      // If user input is empty, just move to the next question
      if (currentQuestionIndex + 1 < questions.length) {
        const nextQuestion = questions[currentQuestionIndex + 1];
        const nextQuestionMessage = { text: nextQuestion.text, isUser: false };
        setMessages([...messages, nextQuestionMessage]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        readOutText(nextQuestion.text);
      } else {
        // Conversation ended, you can handle this however you want
        const endMessage = {
          text: 'Thank you for the conversation!\n Enter your Name',
          isUser: false,
        };
        setMessages([...updatedMessages, endMessage]);
        setCurrentQuestionIndex(0); // Reset to the initial question for future conversations
        readOutText(endMessage.text);
      }
      return; // Skip further processing
    }

    // Validation and formatting for name fields
    if (currentQuestion.field === 'name' ||
      currentQuestion.field === 'fatherName' ||
      currentQuestion.field === 'motherName' ||
      currentQuestion.field === 'guardianName' ||
      currentQuestion.field === 'nationality') {
      const { isValid, formattedName } = validateAndFormatName(userInput);
      if (!isValid) {
        const invalidMessage = "Invalid Name. Please enter a valid name with no numbers and special characters.";
        const invalidMessageObj = { text: invalidMessage, isUser: false };

        setMessages([...messages, invalidMessageObj]);
        readOutText(invalidMessage);
        return; // Stop further processing
      }
      userInput = formattedName; // Use the formatted name
    }

    // Validation for number
    if (currentQuestion.field === 'personalNumber') {
      if (userInput.length !== 10 || !/^\d+$/.test(userInput)) {
        const invalidMessage = "Invalid Number. Please enter a 10-digit numeric number.";
        const invalidMessageObj = { text: invalidMessage, isUser: false };

        setMessages([...messages, invalidMessageObj]);
        readOutText(invalidMessage);
        return; // Stop further processing
      }
    }

    // Validation for email
    if (currentQuestion.field === 'email') {
      if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(userInput)) {
        const invalidMessage = "Invalid Email. Please enter a valid email address.";
        const invalidMessageObj = { text: invalidMessage, isUser: false };

        setMessages([...messages, invalidMessageObj]);
        readOutText(invalidMessage);
        return; // Stop further processing
      }
    }

    // Validation for pinCode
    if (currentQuestion.field === 'pinCode') {
      if (userInput.length !== 6 || !/^\d+$/.test(userInput)) {
        const invalidMessage = "Invalid Pin Code. Please enter a 6-digit numeric number.";
        const invalidMessageObj = { text: invalidMessage, isUser: false };

        setMessages([...messages, invalidMessageObj]);
        readOutText(invalidMessage);
        return; // Stop further processing
      }
    }

    // Validation for dates
    if (currentQuestion.field === 'date' || currentQuestion.field === 'dob') {
      if (!isValidDateFormat(userInput)) {
        const invalidMessage = "Invalid Date Format. Please use YYYY-MM-DD format.";
        const invalidMessageObj = { text: invalidMessage, isUser: false };

        setMessages([...messages, invalidMessageObj]);
        readOutText(invalidMessage);
        return; // Stop further processing
      }
      // Check if the date is a valid date
      const parts = userInput.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      if (!isValidDate(year, month, day)) {
        const invalidMessage = "Invalid Date. Please enter a valid calendar date.";
        const invalidMessageObj = { text: invalidMessage, isUser: false };

        setMessages([...messages, invalidMessageObj]);
        readOutText(invalidMessage);
        return; // Stop further processing
      }
    }

    // Capture the user's input for the current field
    switch (currentQuestion.field) {
      case 'name':
        setName(userInput);
        break;
      case 'personalNumber':
        setPersonalNumber(userInput);
        break;
      case 'email':
        setEmail(userInput);
        break;
      case 'fatherName':
        setFatherName(userInput);
        break;
      case 'fatherNumber':
        setFatherNumber(userInput);
        break;
      case 'motherName':
        setMotherName(userInput);
        break;
      case 'motherNumber':
        setMotherNumber(userInput);
        break;
      case 'guardianName':
        setGuardianName(userInput);
        break;
      case 'guardianNumber':
        setGuardianNumber(userInput);
        break;
      case 'dob':
        setDob(userInput);
        break;
      case 'date':
        setDate(userInput);
        break;
      case 'address':
        setAddress(userInput);
        break;
      case 'city':
        setCity(userInput);
        break;
      case 'state':
        setState(userInput);
        break;
      case 'nationality':
        setNationality(userInput);
        break;
      case 'pinCode':
        setPinCode(userInput);
        break;
      default:
        break;
    }

    // Add the user's input to the messages
    updatedMessages = [
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

      // Read out the next question
      readOutText(nextQuestion.text);
    } else {
      // Conversation ended, you can handle this however you want
      const endMessage = {
        text: 'Thank you for the conversation!\n Enter your Name',
        isUser: false,
      };
      setMessages([...updatedMessages, endMessage]);
      setCurrentQuestionIndex(0); // Reset to the initial question for future conversations
      readOutText(endMessage.text);
    }
  };

  // Use useEffect to capture the updated dob value before sending it to the server
  useEffect(() => {
    if (dob) {
      // Capture the updated dob value
      const updatedDob = dob;

      // Send the user input to the server
      const sendUserInput = async () => {
        // Define the fields and their corresponding values
        const fields = {
          name,
          personalNumber: 0,
          email,
          fatherName,
          fatherNumber,
          motherName,
          motherNumber,
          guardianName,
          guardianNumber,
          date,
          address,
          city,
          state,
          nationality,
          pinCode,
          dob: updatedDob,
        };

        // Prepare the user input data by filtering out empty fields
        const userInputData = {};
        for (const [key, value] of Object.entries(fields)) {
          if (value !== null && value !== undefined && value !== '') {
            userInputData[key] = value;
          }
        }
        try {
          await axios.post('http://localhost:3001/save', {
            userInput: userInputData,
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
    readOutText(currentQuestion.text); // Read out the initial question
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
                {input.name && <span><strong>Name:</strong> {input.name}</span>}
                <br />
                {input.personalNumber && <span><strong>Personal Number:</strong> {input.personalNumber}</span>}
                <br />
                {input.email && <span><strong>Email:</strong> {input.email}</span>}
                <br />
                {input.fatherName && <span><strong>Father's Name:</strong> {input.fatherName}</span>}
                <br />
                {input.fatherNumber && <span><strong>Father's Number:</strong> {input.fatherNumber}</span>}
                <br />
                {input.motherName && <span><strong>Mother's Name:</strong> {input.motherName}</span>}
                <br />
                {input.motherNumber && <span><strong>Mother's Number:</strong> {input.motherNumber}</span>}
                <br />
                {input.guardianName && <span><strong>Guardian's Name:</strong> {input.guardianName}</span>}
                <br />
                {input.guardianNumber && <span><strong>Guardian's Number:</strong> {input.guardianNumber}</span>}
                <br />
                {input.dob && <span><strong>Date of Birth:</strong> {input.dob}</span>}
                <br />
                {input.date && <span><strong>Date:</strong> {input.date}</span>}
                <br />
                {input.address && <span><strong>Address:</strong> {input.address}</span>}
                <br />
                {input.city && <span><strong>City:</strong> {input.city}</span>}
                <br />
                {input.state && <span><strong>State:</strong> {input.state}</span>}
                <br />
                {input.nationality && <span><strong>Nationality:</strong> {input.nationality}</span>}
                <br />
                {input.pinCode && <span><strong>PIN Code:</strong> {input.pinCode}</span>}
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
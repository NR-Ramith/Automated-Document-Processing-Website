import React, { useEffect, useState } from 'react';

const GoogleSheetForm = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Replace 'YOUR_SPREADSHEET_ID' with your actual spreadsheet ID
    const spreadsheetId = '618026251';

    // The Google Sheets API endpoint to get sheet data
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;

    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // Extracting questions from the Google Sheets API response
        const sheetData = data.sheets[0].data[0].rowData;
        const questionsArray = sheetData.map(row => row.values[0].formattedValue);
        setQuestions(questionsArray);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Google Form Questions</h1>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleSheetForm;
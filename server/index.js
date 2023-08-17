const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat_form',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse request body as JSON
app.use(express.json());

// API endpoint to save user inputs to the MySQL database
app.post('/save', (req, res) => {
  console.log('Received POST request');
  console.log('User Input:', req.body.userInput);
  const userInput = req.body.userInput;

  // Extract the data from the userInput object
  const { name, address, dob } = userInput;

  // Check if the name already exists in the database
  connection.query(
    'SELECT * FROM answers WHERE name = ?',
    [name],
    (err, results) => {
      if (err) {
        console.error('Error querying MySQL:', err);
        res.sendStatus(500);
        return;
      }

      if (results.length > 0) {
        res.status(409).json({ message: 'Name already exists' });
      } else {
        // Insert the new record into the database
        const sql = 'INSERT INTO answers (name, address, dob) VALUES (?, ?, ?)';
        const values = [name, address, dob];

        connection.query(sql, values, (err) => {
          if (err) {
            console.error('Error inserting into MySQL:', err);
            res.sendStatus(500);
            return;
          }
          res.sendStatus(200);
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// API endpoint to fetch the inserted data from the MySQL database
app.get('/', (req, res) => {
  // Query the database to retrieve the data
  connection.query('SELECT * FROM answers', (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.sendStatus(500);
      return;
    }

    // Send the retrieved data as the response
    res.json(results);
  });
});
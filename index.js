const express = require('express');
const app = express();
const port = 3000;
const db = require('./db'); // Import the database connection

// Route to get users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

// Route to add a new user
app.post('/users', express.json(), (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  
  db.query(sql, [name, email], (error, results) => {
    if (error) {
      console.error('Error inserting user:', error);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).json({ id: results.insertId, name, email });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

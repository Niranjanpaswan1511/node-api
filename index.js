const express = require('express');
const app = express();
const port = 3000;
const db = require('./db'); // Import the database connection

// Route to get users
app.get('/users', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM users');
    res.json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to add a new user
app.post('/users', express.json(), async (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  
  try {
    const [results] = await db.query(sql, [name, email]);
    res.status(201).json({ id: results.insertId, name, email });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

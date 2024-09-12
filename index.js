const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./db'); // Import the database connection
const cors = require('cors');  // Import CORS middleware

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies and limit body size
app.use(bodyParser.json({ limit: '10kb' }));

// Set up Nodemailer transport asynchronously
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Paswanniranjan6387@gmail.com',
    pass: 'Niranjan1511@'
  }
});

// Route to handle contact form submissions with async email sending
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'Paswanniranjan6387@gmail.com',
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    // Send email asynchronously, so it doesn't block the API
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get users with error handling and optimized query execution
app.get('/users', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM users');
    res.json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to get Contacts LIST
app.get("/Contactlst", async (req, res) => {
  try {
    const [rs] = await db.query('SELECT * FROM Contacts');
    res.json(rs);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert data into Contacts table
app.post('/contacts', async (req, res) => {
  const { name, email, mobile, message } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  const query = 'INSERT INTO Contacts (name, email, mobile, message) VALUES (?, ?, ?, ?)';
  const values = [name, email, mobile, message];

  try {
    await db.query(query, values);
    res.status(201).send('Contact added');
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error inserting data');
  }
});

// POST route for inserting Contacts Form data into the database
app.post('/ContactF', async (req, res) => {
  const { name, email, mobile, message } = req.body;
  
  // SQL query to insert data
  const query = 'INSERT INTO Tbl_Contact(name, email, mobile, Message) VALUES (?, ?, ?, ?)';
  const values = [name, email, mobile, message];

  try {
    // Insert data into the database
    await db.query(query, values);
    
    // Send a JSON response
    res.status(201).json({ message: 'Contact Added' });
  } catch (err) {
    // Log the error and send a JSON error response
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data' });
  }
});


// Route to add a new user with proper async handling
app.post('/users', async (req, res) => {
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

// Get All Contact

app.get('/Contactlist',async(req,res)=>{
  try {
    const[rs]=await db.query('Select * from Tbl_Contact');
    res.json(rs);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Start the server with logging
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

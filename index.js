const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./db'); // Import the database connection


// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service
  auth: {
    user: 'Paswanniranjan6387@gmail.com',
    pass: 'Niranjan1511@'
  }
});



// Route to handle contact form submissions
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'Paswanniranjan6387@gmail.com', // your email address
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Message sent successfully');
  });
});


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



// Rout to get Contacts LIST

app.get("/Contactlst",async(req,res)=>{
  try {
    const[rs]=await db.query('select * from Contacts');
    res.json(rs);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
})


//post


// POST route to insert data into Contacts table
app.post('/contacts', (req, res) => {
  const { name, email, mobile, message } = req.body;

  if (!name || !email) {
      return res.status(400).send('Name and email are required');
  }

  const query = 'INSERT INTO Contacts (name, email, mobile, message) VALUES (?, ?, ?, ?)';
  const values = [name, email, mobile, message];

  db.query(query, values, (err, results) => {
      if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send('Error inserting data');
      }
      res.status(201).send('Contact added');
  });
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

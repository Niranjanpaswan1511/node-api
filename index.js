const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;
const db = require('./db'); // Import the database connection
const cors = require('cors'); // Import CORS middleware
const firebaseAdmin = require('firebase-admin');

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies and limit body size
app.use(bodyParser.json({ limit: '10kb' }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Configure Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/'); // Directory to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage });

// Set up Nodemailer transport for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Paswanniranjan6387@gmail.com',
    pass: 'Niranjan1511@'
  }
});

// Route for uploading images and saving paths in the database
app.post('/upload-image', upload.single('image'), async (req, res) => {
  const {category_id, name, description } = req.body;
  
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'Image upload failed' });
  }

  const imagePath = `uploads/${req.file.filename}`;

  const query = 'INSERT INTO decorations (category_id, name, description, image_path) VALUES (?, ?, ?, ?)';
  const values = [category_id, name, description, imagePath];

  try {
    await db.query(query, values);
    res.status(201).json({ message: 'Image uploaded and path saved in database', path: imagePath });
  } catch (error) {
    console.error('Error saving image data:', error);
    res.status(500).json({ error: 'Failed to save image data' });
  }
});


// Route for handling contact form submissions and sending emails
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'Paswanniranjan6387@gmail.com',
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
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

// Route to get contacts list
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

// POST route for inserting Contacts Form data into Tbl_Contact table
app.post('/ContactF', async (req, res) => {
  const { name, email, mobile, message } = req.body;

  const query = 'INSERT INTO Tbl_Contact (name, email, mobile, Message) VALUES (?, ?, ?, ?)';
  const values = [name, email, mobile, message];

  try {
    await db.query(query, values);
    res.status(201).json({ message: 'Contact Added' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

// Route to add a new user
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

// Route to get all contacts
app.get('/Contactlist', async (req, res) => {
  try {
    const [rs] = await db.query('SELECT * FROM Tbl_Contact ORDER BY id DESC');
    res.json(rs);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route to get all categories
app.get('/Categ', async (req, res) => {
  try {
    const [rs] = await db.query('SELECT * FROM categories');
    res.json(rs);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


// Route to get all items grouped by category
app.get('/items-by-category', async (req, res) => {
  const query = `
    SELECT c.category_id AS category_id, c.name AS category_name, i.decoration_id AS item_id, i.name, i.description, i.image_path 
    FROM categories c 
    LEFT JOIN decorations i ON c.category_id = i.category_id 
    ORDER BY c.name
  `;

  try {
    const [results] = await db.query(query);

    // Organize results by category
    const data = results.reduce((acc, row) => {
      const { category_id, category_name, item_id, name, description, image_path } = row;

      // Initialize the category if it doesn't exist in the accumulator
      if (!acc[category_name]) {
        acc[category_name] = [];
      }

      // Add the item to the category
      if (item_id) {
        acc[category_name].push({
          item_id,
          name,
          description,
          image_path
        });
      }

      return acc;
    }, {});

    res.json(data);
  } catch (error) {
    console.error('Error fetching items by category:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

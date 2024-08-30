const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: '193.203.184.158', // Replace with your host, e.g., '127.0.0.1'
  user: 'u560667907_Niranjanuser',      // Replace with your MySQL username
  password: 'Niranjan151199@',      // Replace with your MySQL password
  database: 'u560667907_dbniranjan' // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;

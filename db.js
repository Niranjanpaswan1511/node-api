const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host:'193.203.184.158', 
  user:'u560667907_Niranjanuser',      
  password: 'Niranjan151199@',
  database:'u560667907_dbniranjan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully!');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise();

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const otps = {};

// Set up database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dumbu@21',
  database: 'otp_verification'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sushmitha2721.k@gmail.com',
    pass: 'vldx quay cfho sung',
  },
});

// Endpoint to check if backend is running
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const sql = 'INSERT INTO users (email, otp) VALUES (?, ?) ON DUPLICATE KEY UPDATE otp = ?';
  db.query(sql, [email, otp, otp], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const mailOptions = {
      from: 'sushmitha2721.k@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send email' });
      }
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const sql = 'SELECT otp FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'Email not found' });
    }

    const storedOtp = results[0].otp;
    if (storedOtp === otp) {
      const updateSql = 'UPDATE users SET is_verified = TRUE WHERE email = ?';
      db.query(updateSql, [email], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'OTP verified successfully' });
      });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

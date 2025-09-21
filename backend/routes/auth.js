const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/signup - Register a new user
router.post('/signup', (req, res) => {
  const { name, phone, email } = req.body;
  
  // Validate required fields
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'All fields are required: name, phone, and email.' });
  }

  // Validate phone number format (+91 followed by 10 digits)
  const phoneRegex = /^\+91[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be in format +91XXXXXXXXXX (10 digits starting with 6-9).' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Check if phone or email already exists
  const checkQuery = 'SELECT id FROM users WHERE phone = ? OR email = ?';
  db.query(checkQuery, [phone, email], (err, results) => {
    if (err) {
      console.error('Database check error:', err);
      return res.status(500).json({ error: 'Database error during validation.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Phone number or email already registered.' });
    }

    // Insert new user
    const insertQuery = 'INSERT INTO users (name, phone, email) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, phone, email], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ error: 'Failed to register user.' });
      }
      
      res.status(201).json({ 
        success: true,
        message: 'Registration successful!',
        userId: result.insertId,
        user: { name, phone, email }
      });
    });
  });
});

// POST /api/signin - Authenticate user with phone number
router.post('/signin', (req, res) => {
  const { phone, email } = req.body;
  console.log('SignIn request:', req.body); // Debug log
  
  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone number or email is required.' });
  }

  // Use phone as primary login method, email as backup
  const loginField = phone || email;
  const loginColumn = phone ? 'phone' : 'email';
  
  // Validate phone format if phone is provided
  if (phone) {
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
    }
  }

  const sql = `SELECT id, name, phone, email FROM users WHERE ${loginColumn} = ?`;
  db.query(sql, [loginField], (err, results) => {
    console.log('SQL results:', results); // Debug log
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error during signin.' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }
    
    const user = results[0];
    res.json({ 
      success: true,
      message: 'Sign in successful!',
      userId: user.id,
      user: {
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });
  });
});

module.exports = router;

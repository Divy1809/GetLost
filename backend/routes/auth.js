const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/signup - Register a new user
router.post('/signup', (req, res) => {
  const { name, age, origin_city, destination_city, email, phone, password, username } = req.body;
  if (!name || !age || !origin_city || !destination_city || !email || !phone || !password || !username) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const sql = 'INSERT INTO profiles (name, age, origin_city, destination_city, email, phone, password, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, age, origin_city, destination_city, email, phone, password, username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ userId: result.insertId });
  });
});

// POST /api/signin - Authenticate user
router.post('/signin', (req, res) => {
  const { username, password } = req.body;
  console.log('SignIn request:', req.body); // Debug log
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const sql = 'SELECT id FROM profiles WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    console.log('SQL results:', results); // Debug log
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    res.json({ userId: results[0].id });
  });
});

module.exports = router;

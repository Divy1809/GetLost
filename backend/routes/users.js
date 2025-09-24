const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Valid User ID is required' });
  }

  const query = 'SELECT id, name, phone, email, email_verified, phone_verified, is_verified FROM users WHERE id = ?';
  
  db.query(query, [parseInt(userId)], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = results[0];
    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      isVerified: user.is_verified
    });
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const otpService = require('../services/otpService');

// POST /api/auth/signup/initiate - Start signup process and send OTPs
router.post('/signup/initiate', async (req, res) => {
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
  db.query(checkQuery, [phone, email], async (err, results) => {
    if (err) {
      console.error('Database check error:', err);
      return res.status(500).json({ error: 'Database error during validation.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Phone number or email already registered.' });
    }

    // Generate OTP for email
    const emailOTP = otpService.generateOTP();
    const otpExpiry = otpService.getOTPExpiry();

    // Insert user with email OTP (not verified yet)
    const insertQuery = `
      INSERT INTO users (name, phone, email, email_otp, email_otp_expires_at, email_verified, is_verified) 
      VALUES (?, ?, ?, ?, ?, false, false)
    `;
    
    db.query(insertQuery, [name, phone, email, emailOTP, otpExpiry], async (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ error: 'Failed to initiate signup.' });
      }
      
      // Send email OTP
      const emailResult = await otpService.sendEmailOTP(email, emailOTP, 'signup');
      
      res.status(201).json({ 
        success: true,
        message: 'OTP sent to your email!',
        userId: result.insertId,
        emailSent: emailResult.success
      });
    });
  });
});

// POST /api/auth/signup/verify - Verify OTPs and complete signup
router.post('/signup/verify', (req, res) => {
  const { userId, emailOTP } = req.body;
  
  if (!userId || !emailOTP) {
    return res.status(400).json({ error: 'User ID and email OTP are required.' });
  }

    // Get user and verify email OTP
  const getUserQuery = `
    SELECT id, name, phone, email, email_otp, email_otp_expires_at, email_verified 
    FROM users WHERE id = ?
  `;  db.query(getUserQuery, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error during verification.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const user = results[0];
    
    // Verify email OTP
    const emailValid = otpService.isOTPValid(user.email_otp, emailOTP, user.email_otp_expires_at);
    
    if (!emailValid) {
      return res.status(400).json({ 
        error: 'Invalid or expired email OTP.'
      });
    }
    
    // Update user as verified
    const updateQuery = `
      UPDATE users 
      SET email_verified = true, is_verified = true,
          email_otp = NULL, email_otp_expires_at = NULL
      WHERE id = ?
    `;
    
    db.query(updateQuery, [userId], (err) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: 'Failed to complete verification.' });
      }
      
      res.json({
        success: true,
        message: 'Signup completed successfully!',
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email
        }
      });
    });
  });
});

// POST /api/signup - Register a new user (legacy endpoint - kept for compatibility)
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

// POST /api/auth/signin/initiate - Send OTP for signin
router.post('/signin/initiate', async (req, res) => {
  const { phone, email } = req.body;
  console.log('SignIn initiate request:', req.body);
  
  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone number or email is required.' });
  }

  // Use phone as primary login method, email as backup
  const loginField = phone || email;
  const loginColumn = phone ? 'phone' : 'email';
  const otpType = phone ? 'phone' : 'email';
  
  // Validate phone format if phone is provided
  if (phone) {
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
    }
  }

  const sql = `SELECT id, name, phone, email FROM users WHERE ${loginColumn} = ?`;
  db.query(sql, [loginField], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error during signin.' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }
    
    const user = results[0];
    
    // Generate OTP
    const otp = otpService.generateOTP();
    const otpExpiry = otpService.getOTPExpiry();
    
    // Update user with OTP
    const otpColumn = otpType === 'phone' ? 'phone_otp' : 'email_otp';
    const expiryColumn = otpType === 'phone' ? 'phone_otp_expires_at' : 'email_otp_expires_at';
    
    const updateQuery = `UPDATE users SET ${otpColumn} = ?, ${expiryColumn} = ? WHERE id = ?`;
    db.query(updateQuery, [otp, otpExpiry, user.id], async (err) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: 'Failed to generate OTP.' });
      }
      
      // Send OTP
      let otpResult;
      if (otpType === 'phone') {
        otpResult = await otpService.sendPhoneOTP(user.phone, otp, 'signin');
      } else {
        otpResult = await otpService.sendEmailOTP(user.email, otp, 'signin');
      }
      
      res.json({
        success: true,
        message: `OTP sent to your ${otpType}!`,
        userId: user.id,
        otpType,
        otpSent: otpResult.success,
        note: otpResult.note || undefined
      });
    });
  });
});

// POST /api/auth/signin/verify - Verify OTP and complete signin
router.post('/signin/verify', (req, res) => {
  const { userId, otp, otpType } = req.body;
  
  if (!userId || !otp || !otpType) {
    return res.status(400).json({ error: 'User ID, OTP, and OTP type are required.' });
  }

  if (!['phone', 'email'].includes(otpType)) {
    return res.status(400).json({ error: 'OTP type must be either "phone" or "email".' });
  }

  // Get user and verify OTP
  const otpColumn = otpType === 'phone' ? 'phone_otp' : 'email_otp';
  const expiryColumn = otpType === 'phone' ? 'phone_otp_expires_at' : 'email_otp_expires_at';
  
  const getUserQuery = `
    SELECT id, name, phone, email, ${otpColumn} as stored_otp, ${expiryColumn} as otp_expires_at 
    FROM users WHERE id = ?
  `;
  
  db.query(getUserQuery, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error during verification.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const user = results[0];
    
    // Verify OTP
    const otpValid = otpService.isOTPValid(user.stored_otp, otp, user.otp_expires_at);
    
    if (!otpValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }
    
    // Clear OTP after successful verification
    const clearQuery = `UPDATE users SET ${otpColumn} = NULL, ${expiryColumn} = NULL WHERE id = ?`;
    db.query(clearQuery, [userId], (err) => {
      if (err) {
        console.error('Database clear error:', err);
        // Don't fail the signin, just log the error
        console.log('Warning: Failed to clear OTP after successful verification');
      }
      
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
});

// POST /api/signin - Authenticate user with phone number (legacy endpoint - kept for compatibility)
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

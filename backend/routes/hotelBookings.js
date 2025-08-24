const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/hotelBookings - Add a new hotel booking
router.post('/', (req, res) => {
	console.log('Hotel booking request body:', req.body);
	const { userId, destination, hotel_name, booking_date } = req.body;
	if (!userId || !destination || !hotel_name || !booking_date) {
		console.error('Missing required fields:', req.body);
		return res.status(400).json({ error: 'Missing required fields.' });
	}
	const sql = 'INSERT INTO hotel_bookings (user_id, destination, hotel_name, booking_date) VALUES (?, ?, ?, ?)';
	db.query(sql, [userId, destination, hotel_name, booking_date], (err, result) => {
		if (err) {
			console.error('DB error:', err.message);
			return res.status(500).json({ error: err.message });
		}
		res.status(201).json({ booking_id: result.insertId });
	});
});

// GET /api/hotelBookings?userId=xx - Get hotel bookings for a user
router.get('/', (req, res) => {
	const { userId } = req.query;
	let sql = 'SELECT * FROM hotel_bookings';
	let params = [];
	if (userId) {
		sql += ' WHERE user_id = ?';
		params.push(userId);
	}
	db.query(sql, params, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(results);
	});
});

// DELETE /api/hotelBookings/:id - Cancel a hotel booking
router.delete('/:id', (req, res) => {
	const bookingId = req.params.id;
	console.log('Hotel booking cancel request for booking_id:', bookingId);
	const sql = 'DELETE FROM hotel_bookings WHERE booking_id = ?';
	db.query(sql, [bookingId], (err, result) => {
		if (err) {
			console.error('DB error:', err.message);
			return res.status(500).json({ error: err.message });
		}
		if (result.affectedRows === 0) {
			console.log('Hotel booking not found for cancellation:', bookingId);
			return res.status(404).json({ error: 'Booking not found.' });
		}
		console.log('Hotel booking cancelled successfully:', bookingId);
		res.json({ success: true });
	});
});

module.exports = router;

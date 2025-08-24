const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/bookings - Add a new flight booking
router.post('/', (req, res) => {
	console.log('Flight booking request body:', req.body);
	const { userId, destination, flight_details, booking_date } = req.body;
	if (!userId || !destination || !flight_details || !booking_date) {
		console.error('Missing required fields:', req.body);
		return res.status(400).json({ error: 'Missing required fields.' });
	}
	const sql = 'INSERT INTO bookings (user_id, destination, flight_details, booking_date) VALUES (?, ?, ?, ?)';
	db.query(sql, [userId, destination, flight_details, booking_date], (err, result) => {
		if (err) {
			console.error('DB error:', err.message);
			return res.status(500).json({ error: err.message });
		}
		res.status(201).json({ booking_id: result.insertId });
	});
});

// GET /api/bookings?userId=xx - Get bookings for a user
router.get('/', (req, res) => {
	const { userId } = req.query;
	let sql = 'SELECT * FROM bookings';
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

// DELETE /api/bookings/:id - Cancel a flight booking
router.delete('/:id', (req, res) => {
	const bookingId = req.params.id;
	console.log('Flight booking cancel request for booking_id:', bookingId);
	const sql = 'DELETE FROM bookings WHERE booking_id = ?';
	db.query(sql, [bookingId], (err, result) => {
		if (err) {
			console.error('DB error:', err.message);
			return res.status(500).json({ error: err.message });
		}
		if (result.affectedRows === 0) {
			console.log('Booking not found for cancellation:', bookingId);
			return res.status(404).json({ error: 'Booking not found.' });
		}
		console.log('Booking cancelled successfully:', bookingId);
		res.json({ success: true });
	});
});

module.exports = router;

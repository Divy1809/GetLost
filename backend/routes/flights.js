const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Book a flight
router.post('/book', (req, res) => {
  const { userId, flightName, origin, destination, departureDate, returnDate, price, passengers } = req.body;
  
  if (!userId || !flightName || !origin || !destination || !departureDate || !price || !passengers) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const bookingDate = new Date().toISOString().split('T')[0];
  const bookingId = `FL${Date.now()}`;

  const query = `
    INSERT INTO flight_bookings (booking_id, user_id, flight_name, origin, destination, departure_date, return_date, price, passengers, booking_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
  `;

  db.run(query, [bookingId, userId, flightName, origin, destination, departureDate, returnDate, price, passengers, bookingDate], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to book flight' });
    }
    
    res.json({ 
      success: true, 
      message: 'Flight booked successfully',
      bookingId: bookingId,
      bookingDetails: {
        bookingId,
        userId,
        flightName,
        origin,
        destination,
        departureDate,
        returnDate,
        price,
        passengers,
        bookingDate,
        status: 'confirmed'
      }
    });
  });
});

// Get all bookings for a user
router.get('/bookings/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM flight_bookings WHERE user_id = ? ORDER BY booking_date DESC';

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
    
    res.json({ bookings: rows });
  });
});

// Cancel a flight booking
router.delete('/cancel/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // First check if booking exists and belongs to user
  const checkQuery = 'SELECT * FROM flight_bookings WHERE booking_id = ? AND user_id = ?';
  
  db.get(checkQuery, [bookingId, userId], (err, booking) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to check booking' });
    }

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or does not belong to user' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    // Update booking status to cancelled
    const cancelQuery = 'UPDATE flight_bookings SET status = ? WHERE booking_id = ? AND user_id = ?';
    
    db.run(cancelQuery, ['cancelled', bookingId, userId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to cancel booking' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json({ 
        success: true, 
        message: 'Flight booking cancelled successfully',
        bookingId: bookingId
      });
    });
  });
});

// Get flight search results (mock data for demo)
router.get('/search', (req, res) => {
  const { origin, destination, departureDate, returnDate, passengers } = req.query;

  // Mock flight data - in real app, this would come from airline APIs
  const mockFlights = [
    {
      id: 'AI101',
      airline: 'Air India',
      flightName: 'AI-101',
      origin: origin || 'Delhi',
      destination: destination || 'Mumbai',
      departureTime: '06:00',
      arrivalTime: '08:30',
      duration: '2h 30m',
      price: 5500,
      stops: 'Non-stop'
    },
    {
      id: 'SG202',
      airline: 'SpiceJet',
      flightName: 'SG-202',
      origin: origin || 'Delhi',
      destination: destination || 'Mumbai',
      departureTime: '09:15',
      arrivalTime: '11:45',
      duration: '2h 30m',
      price: 4800,
      stops: 'Non-stop'
    },
    {
      id: 'UK303',
      airline: 'Vistara',
      flightName: 'UK-303',
      origin: origin || 'Delhi',
      destination: destination || 'Mumbai',
      departureTime: '14:20',
      arrivalTime: '16:50',
      duration: '2h 30m',
      price: 6200,
      stops: 'Non-stop'
    },
    {
      id: '6E404',
      airline: 'IndiGo',
      flightName: '6E-404',
      origin: origin || 'Delhi',
      destination: destination || 'Mumbai',
      departureTime: '18:30',
      arrivalTime: '21:00',
      duration: '2h 30m',
      price: 4500,
      stops: 'Non-stop'
    }
  ];

  res.json({ 
    flights: mockFlights,
    searchParams: {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers
    }
  });
});

module.exports = router;

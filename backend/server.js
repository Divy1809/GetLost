// const express = require("express");
// const app = express();
// const PORT = 5000;
// const db = require('./config/db');


// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// app.get('/test-db', (req, res) => {
//   db.query('SELECT * FROM profiles LIMIT 5;', (err, results) => {
//     if (err) {
//       return res.status(500).send('Error fetching data: ' + err.message);
//     }
//     res.json(results);
//   });
// });


const express = require("express");
const app = express();
const PORT = 5000;
const db = require('./config/db');

app.use(express.json()); // For parsing JSON bodies, needed for POST requests

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get('/test-db', (req, res) => {
  db.query('SELECT * FROM profiles LIMIT 5;', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching data: ' + err.message);
    }
    res.json(results);
  });
});

const profileRoutes = require('./routes/profiles');
app.use('/api/profiles', profileRoutes);


const bookingsRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingsRoutes);


const hotelBookingsRoutes = require('./routes/hotelBookings');
app.use('/api/hotelBookings', hotelBookingsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



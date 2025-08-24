import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";

const BookFlightsPage = () => {
  const locationObj = useLocation();
  const { destination } = locationObj.state || {};
  const { userId: currentUserId } = useUser();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState("");

  const airlines = [
    "IndiGo",
    "Air India",
    "SpiceJet",
    "Emirates",
    "Singapore Airlines",
    "Qatar Airways",
  ];
  // Generate random flights
  const generateFlights = () => {
    const newFlights = [];
    for (let i = 0; i < 5; i++) {
      newFlights.push({
        flight_no: "FL" + Math.floor(1000 + Math.random() * 9000),
        airline: selectedAirline,
        destination: destination,
        time: `${Math.floor(Math.random() * 12) + 1}:$${
          Math.random() < 0.5 ? "00" : "30"
        } ${Math.random() < 0.5 ? "AM" : "PM"}`,
        fare: 5000 + Math.floor(Math.random() * 4000),
      });
    }
    setFlights(newFlights);
  };

  useEffect(() => {
    if (selectedAirline) {
      generateFlights();
    } else {
      setFlights([]);
    }
  }, [destination, selectedAirline]);


  const handleBookFlight = async (flight) => {
    if (!flight) return;

    const newBooking = {
      userId: currentUserId,
      destination: destination,
      flight_details: `Flight: ${flight.flight_no} | Time: ${flight.time} | Fare: ₹${flight.fare}`,
      booking_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      if (res.ok) {
        alert('✅ Flight booked successfully!');
      } else {
        alert('❌ Booking failed.');
      }
    } catch (err) {
      alert('❌ Booking failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Book a Flight to {destination}
        </h1>

        <label className="block text-lg font-medium mb-2 text-center">Select Airline:</label>
        <select
          value={selectedAirline}
          onChange={e => setSelectedAirline(e.target.value)}
          className="w-full p-2 border rounded-lg mb-6"
        >
          <option value="">-- Select Airline --</option>
          {airlines.map(airline => (
            <option key={airline} value={airline}>{airline}</option>
          ))}
        </select>

        {selectedAirline === "" ? (
          <p className="text-center text-gray-500">Please select an airline to view available flights.</p>
        ) : (
          <div className="space-y-4">
            {flights.length === 0 ? (
              <p className="text-center text-gray-500">No flights available.</p>
            ) : (
              flights.map((flight, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <p><strong>Airline:</strong> {flight.airline}</p>
                  <p><strong>Flight:</strong> {flight.flight_no}</p>
                  <p><strong>Time:</strong> {flight.time}</p>
                  <p><strong>Fare:</strong> ₹{flight.fare}</p>
                  <button
                    onClick={() => handleBookFlight(flight)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Book This Flight
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFlightsPage;

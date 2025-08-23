import React, { useState, useEffect } from "react";

const BookFlightsPage = ({ currentUserId, destination, onBack }) => {
  const [flights, setFlights] = useState([]);

  // Generate random flights
  const generateFlights = () => {
    const newFlights = [];
    for (let i = 0; i < 5; i++) {
      newFlights.push({
        flight_no: "FL" + Math.floor(1000 + Math.random() * 9000),
        destination: destination,
        time: `${Math.floor(Math.random() * 12) + 1}:${
          Math.random() < 0.5 ? "00" : "30"
        } ${Math.random() < 0.5 ? "AM" : "PM"}`,
        fare: 5000 + Math.floor(Math.random() * 4000),
      });
    }
    setFlights(newFlights);
  };

  useEffect(() => {
    generateFlights();
  }, [destination]);

  const handleBookFlight = (flight) => {
    if (!flight) return; // safety check

    const newBooking = {
      booking_id: Date.now(), // unique ID
      destination: flight.destination,
      flight_details: `Flight: ${flight.flight_no} | Time: ${flight.time} | Fare: ₹${flight.fare}`,
      booking_date: new Date().toISOString().split("T")[0],
      userId: currentUserId,
    };

    // Save to localStorage
    const existingBookings =
      JSON.parse(localStorage.getItem("flightBookings")) || [];
    existingBookings.push(newBooking);
    localStorage.setItem("flightBookings", JSON.stringify(existingBookings));

    alert("✅ Flight booked successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Available Flights to {destination}
        </h1>

        <div className="space-y-4">
          {flights.map((flight, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <p><strong>Flight:</strong> {flight.flight_no}</p>
              <p><strong>Time:</strong> {flight.time}</p>
              <p><strong>Fare:</strong> ₹{flight.fare}</p>
              <button
                onClick={() => handleBookFlight(flight)} // ✅ Pass correct flight
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Book This Flight
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
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

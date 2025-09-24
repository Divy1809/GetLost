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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        setSuccessMessage(`Flight ${flight.flight_no} booked successfully! ✈️`);
        setShowSuccessModal(true);
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        setSuccessMessage('❌ Booking failed. Please try again.');
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      }
    } catch (err) {
      setSuccessMessage('❌ Booking failed. Please check your connection.');
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-lg border-2 border-slate-600/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Booking Confirmed!</h3>
              <p className="text-slate-300 text-lg mb-6">{successMessage}</p>
              <div className="w-full bg-slate-600/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <p className="text-slate-400 text-sm mt-3">This message will close automatically</p>
            </div>
          </div>
        </div>
      )}

      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            Book a Flight to {destination}
          </h1>

          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4 text-center text-slate-300">Select Airline:</label>
            <select
              value={selectedAirline}
              onChange={e => setSelectedAirline(e.target.value)}
              className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 backdrop-blur-sm"
            >
              <option value="" className="bg-slate-800 text-white">-- Select Airline --</option>
              {airlines.map(airline => (
                <option key={airline} value={airline} className="bg-slate-800 text-white">{airline}</option>
              ))}
            </select>
          </div>

          {selectedAirline === "" ? (
            <p className="text-center text-slate-400 text-lg">Please select an airline to view available flights.</p>
          ) : (
            <div className="space-y-4">
              {flights.length === 0 ? (
                <p className="text-center text-slate-400 text-lg">No flights available.</p>
              ) : (
                flights.map((flight, index) => (
                  <div
                    key={index}
                    className="p-6 bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl shadow-lg"
                  >
                    <div className="text-slate-300 space-y-2 mb-4">
                      <p><span className="text-white font-semibold">Airline:</span> {flight.airline}</p>
                      <p><span className="text-white font-semibold">Flight:</span> {flight.flight_no}</p>
                      <p><span className="text-white font-semibold">Time:</span> {flight.time}</p>
                      <p><span className="text-white font-semibold">Fare:</span> ₹{flight.fare}</p>
                    </div>
                    <button
                      onClick={() => handleBookFlight(flight)}
                      className="w-full bg-slate-600/60 hover:bg-slate-500/60 text-white py-3 px-4 rounded-xl font-bold shadow-lg border border-slate-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
                    >
                      Book This Flight
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-slate-700/60 hover:bg-slate-600/60 text-white py-3 px-8 rounded-xl font-bold shadow-2xl border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFlightsPage;

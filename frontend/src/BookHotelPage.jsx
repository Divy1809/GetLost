import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { useUser } from "./UserContext";

export default function BookHotelPage() {
  const locationObj = useLocation();
  const { selectedDestination } = locationObj.state || {};
  const { userId: currentUserId } = useUser();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");

  useEffect(() => {
    const generatedHotels = [
      `${selectedDestination} Grand Hotel`,
      `${selectedDestination} City Inn`,
      `${selectedDestination} Luxury Suites`,
      `${selectedDestination} Budget Stay`,
      `${selectedDestination} Premium Inn`,
    ];
    setHotels(generatedHotels);
    setSelectedHotel(generatedHotels[0]);
  }, [selectedDestination]);


  const handleBooking = async () => {
    if (!selectedHotel) return;

    const newBooking = {
      userId: currentUserId,
      destination: selectedDestination,
      hotel_name: selectedHotel,
  booking_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    try {
      const res = await fetch('/api/hotelBookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      if (res.ok) {
        alert('✅ Hotel booked successfully!');
      } else {
        alert('❌ Booking failed.');
      }
    } catch (err) {
      alert('❌ Booking failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-lg bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Book a Hotel</h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-3 font-bold text-white text-lg">Select Hotel:</label>
              <select
                className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 backdrop-blur-sm"
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
              >
                {hotels.map((hotel, index) => (
                  <option key={index} value={hotel} className="bg-slate-800">
                    {hotel}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-blue-600/60 hover:bg-blue-500/60 text-white py-4 rounded-xl font-bold shadow-lg border border-blue-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm mb-4"
            >
              Book Hotel
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-white py-4 rounded-xl font-bold shadow-lg border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";

export default function BookHotelPage({ currentUserId, selectedDestination, onBack }) {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-[400px] bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Book a Hotel</h2>

        <label className="block mb-2 font-medium">Select Hotel:</label>
        <select
          className="w-full p-2 border rounded-lg mb-4"
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
        >
          {hotels.map((hotel, index) => (
            <option key={index} value={hotel}>
              {hotel}
            </option>
          ))}
        </select>

        <button
          onClick={handleBooking}
          className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 mb-2"
        >
          Book Hotel
        </button>

        <button
          onClick={onBack}
          className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400"
        >
          Back
        </button>
      </div>
    </div>
  );
}

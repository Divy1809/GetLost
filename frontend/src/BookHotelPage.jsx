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

  const handleBooking = () => {
    if (!selectedHotel) return;

    const newBooking = {
      booking_id: Date.now(),
      userId: currentUserId,
      destination: selectedDestination,
      hotel_name: selectedHotel,
      booking_date: new Date().toISOString().split("T")[0],
    };

    const existingBookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];
    existingBookings.push(newBooking);

    localStorage.setItem("hotelBookings", JSON.stringify(existingBookings));

    alert("✅ Hotel booked successfully!");
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

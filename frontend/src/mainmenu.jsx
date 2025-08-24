import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function MainMenu() {
  const [selectedLocation, setSelectedLocation] = useState("Delhi");
  const navigate = useNavigate();
  const { userId, setUserId } = useUser();

  // Redirect to sign in if userId is not set
  useEffect(() => {
    if (!userId) {
      navigate("/signin");
    }
  }, [userId, navigate]);

  const locations = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
    "Kolkata", "Pune", "Jaipur", "Ahmedabad"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Main Menu</h1>
        <label className="block text-lg font-medium mb-2 text-center">
          Select Destination:
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full p-2 border rounded-lg mb-6"
        >
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate("/tinder", { state: { location: selectedLocation, loggedInUserId: userId } })} className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Solo Travellers</button>
          <button onClick={() => navigate("/travel-groups") } className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Travel Groups</button>
          <button onClick={() => navigate("/matches", { state: { loggedInUserId: userId } })} className="bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600">Matches</button>
          <button onClick={() => navigate("/book-flights", { state: { currentUserId: userId, destination: selectedLocation } })} className="bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600">Book Flights</button>
          <button onClick={() => navigate("/show-bookings") } className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">Show Flight Bookings</button>
          <button onClick={() => navigate("/book-hotels", { state: { currentUserId: userId, selectedDestination: selectedLocation } })} className="bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600">Book Hotels</button>
          <button onClick={() => navigate("/show-hotel-bookings") } className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">Show Hotel Bookings</button>
          <button onClick={() => { setUserId(null); navigate('/signin'); }} className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Logout</button>
        </div>
      </div>
    </div>
  );
}
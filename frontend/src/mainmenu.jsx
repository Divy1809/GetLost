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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/5 to-transparent animate-pulse"></div>
      
      <div className="relative z-10 flex items-center justify-between min-h-screen w-full px-12 py-8">
        {/* Left Column - Professional */}
        <div className="flex flex-col space-y-8 w-80">
          <button 
            onClick={() => navigate("/tinder", { state: { location: selectedLocation, loggedInUserId: userId } })} 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-blue-400">👥</span>
              </div>
              <span>Solo Travellers</span>
            </div>
          </button>
          <button 
            onClick={() => navigate("/matches", { state: { loggedInUserId: userId } })} 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-pink-400">💕</span>
              </div>
              <span>Your Matches</span>
            </div>
          </button>
          <button 
            onClick={() => navigate("/book-flights", { state: { currentUserId: userId, destination: selectedLocation } })} 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-emerald-400">✈️</span>
              </div>
              <span>Book Flights</span>
            </div>
          </button>
          <button 
            onClick={() => navigate("/show-bookings") } 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-amber-400">📋</span>
              </div>
              <span>Flight Bookings</span>
            </div>
          </button>
        </div>

        {/* Center Content - Enhanced */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-center mb-8">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-300 mb-4 animate-pulse drop-shadow-2xl">
              GetLost
            </h1>
            <div className="h-2 w-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto mb-6 animate-pulse"></div>
            <p className="text-3xl text-slate-300 font-light tracking-wide">Your smart travel planner</p>
            <p className="text-lg text-slate-400 mt-2 italic">Discover • Connect • Explore</p>
          </div>
          
          <div className="bg-gradient-to-r from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-lg rounded-3xl p-10 border border-slate-600/40 shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[400px]">
            <label className="block text-2xl font-bold mb-6 text-center text-slate-200">
              🌍 Select Your Destination
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full mx-auto p-6 border-2 border-slate-600/50 rounded-2xl bg-slate-800/70 text-white text-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 backdrop-blur-sm transition-all duration-300 shadow-inner"
            >
              {locations.map((location) => (
                <option key={location} value={location} className="bg-slate-800 text-white py-2">{location}</option>
              ))}
            </select>
            <div className="mt-4 text-center">
              <span className="text-slate-400 text-sm">Current destination: </span>
              <span className="text-blue-400 font-semibold">{selectedLocation}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Professional */}
        <div className="flex flex-col space-y-8 w-80">
          <button 
            onClick={() => navigate("/travel-groups", { state: { selectedLocation } })} 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-purple-400">👥</span>
              </div>
              <span>Travel Groups</span>
            </div>
          </button>
          <button 
            onClick={() => navigate("/book-hotels", { state: { currentUserId: userId, selectedDestination: selectedLocation } })} 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-cyan-400">🏨</span>
              </div>
              <span>Book Hotels</span>
            </div>
          </button>
          <button 
            onClick={() => navigate("/show-hotel-bookings") } 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-teal-400">🏩</span>
              </div>
              <span>Hotel Bookings</span>
            </div>
          </button>
          <button 
            onClick={() => { setUserId(null); navigate('/signin'); }} 
            className="group bg-slate-800/60 hover:bg-slate-700/70 text-white py-8 px-8 rounded-xl font-semibold text-lg shadow-xl border border-slate-600/40 transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl text-red-400">🚪</span>
              </div>
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

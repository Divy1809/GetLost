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
      {/* Enhanced background decorative elements with more dynamic animations */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-violet-400/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 rounded-full blur-xl animate-ping"></div>
      
      {/* Animated gradient overlay with floating particles effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/5 to-transparent"></div>
      
      {/* Floating particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-ping delay-100"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-300"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-ping delay-700"></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping delay-500"></div>
      
      <div className="relative z-10 flex items-center justify-between min-h-screen w-full px-12 py-8">
        {/* Left Column - Enhanced with gradient borders and improved animations */}
        <div className="flex flex-col space-y-6 w-80">
          <button 
            onClick={() => navigate("/tinder", { state: { location: selectedLocation, loggedInUserId: userId } })} 
            className="group relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-700/80 hover:to-slate-600/80 text-white py-8 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-600/40 hover:border-blue-500/50 transform hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🌟</span>
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold">Solo Travellers</span>
                <span className="block text-sm text-slate-300 group-hover:text-blue-300">Find travel companions</span>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate("/matches", { state: { loggedInUserId: userId } })} 
            className="group relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-700/80 hover:to-slate-600/80 text-white py-8 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-600/40 hover:border-pink-500/50 transform hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💕</span>
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold">Your Matches</span>
                <span className="block text-sm text-slate-300 group-hover:text-pink-300">Connected travelers</span>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate("/travel-groups", { state: { selectedLocation } })} 
            className="group relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-700/80 hover:to-slate-600/80 text-white py-8 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-600/40 hover:border-purple-500/50 transform hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">�</span>
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold">Travel Groups</span>
                <span className="block text-sm text-slate-300 group-hover:text-purple-300">Join group adventures</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Content - Enhanced with modern glassmorphism and animations */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-center mb-12">
            {/* Main logo with enhanced animations */}
            <div className="relative mb-8">
              <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-200 mb-4 drop-shadow-2xl">
                GetLost
              </h1>
            </div>
            
            {/* Enhanced progress bar with multiple colors */}
            <div className="relative h-3 w-80 bg-slate-800/50 rounded-full mx-auto mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            
            <p className="text-3xl md:text-4xl text-slate-200 font-light tracking-wide mb-2 animate-fade-in">Your smart travel planner</p>
            <p className="text-lg text-slate-400 italic animate-fade-in delay-200">Discover • Connect • Explore • Adventure</p>
            
            {/* New feature highlights */}
            <div className="flex justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2 bg-slate-800/30 px-4 py-2 rounded-full border border-slate-600/30">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300 text-sm">Smart Matching</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/30 px-4 py-2 rounded-full border border-slate-600/30">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300 text-sm">Easy Booking</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/30 px-4 py-2 rounded-full border border-slate-600/30">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300 text-sm">Travel Groups</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced destination selector with modern glassmorphism */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-30"></div>
            <div className="relative bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/40 shadow-2xl transform hover:scale-105 transition-all duration-500 min-w-[450px]">
              {/* Header with icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-200">Select Destination</h3>
                  <p className="text-slate-400 text-sm">Where do you want to explore?</p>
                </div>
              </div>
              
              {/* Enhanced dropdown */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-6 border-2 border-slate-600/50 rounded-2xl bg-slate-800/80 text-white text-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 backdrop-blur-sm transition-all duration-300 shadow-inner hover:bg-slate-700/80 cursor-pointer appearance-none"
                >
                  {locations.map((location) => (
                    <option key={location} value={location} className="bg-slate-800 text-white py-3 text-lg">{location}</option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-slate-300">▼</span>
                  </div>
                </div>
              </div>
              
              {/* Current selection display */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-600/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-sm">Currently selected:</span>
                    <span className="text-blue-400 font-semibold text-lg">{selectedLocation}</span>
                  </div>
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Enhanced with modern design */}
        <div className="flex flex-col space-y-6 w-80">
          <button 
            onClick={() => navigate("/plan-bookings", { state: { currentUserId: userId, destination: selectedLocation } })} 
            className="group relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-700/80 hover:to-slate-600/80 text-white py-8 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-600/40 hover:border-emerald-500/50 transform hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✈️</span>
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold">Plan Bookings</span>
                <span className="block text-sm text-slate-300 group-hover:text-emerald-300">Flights & Hotels</span>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate("/my-bookings") } 
            className="group relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-700/80 hover:to-slate-600/80 text-white py-8 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-600/40 hover:border-amber-500/50 transform hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">�</span>
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold">My Bookings</span>
                <span className="block text-sm text-slate-300 group-hover:text-amber-300">Manage reservations</span>
              </div>
            </div>
          </button>
          
          {/* Profile/Settings Button */}
          
          
          {/* Enhanced Logout Button */}
          <button 
            onClick={() => { setUserId(null); navigate('/signin'); }} 
            className="group relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-red-900/60 hover:to-red-800/60 text-white py-8 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-600/40 hover:border-red-500/50 transform hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚪</span>
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold">Logout</span>
                <span className="block text-sm text-slate-300 group-hover:text-red-300">Sign out safely</span>
              </div>
            </div>
          </button>
          

          

          </div>
        </div>
      </div>
  );
}

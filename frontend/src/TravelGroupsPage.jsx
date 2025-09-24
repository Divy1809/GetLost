import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TravelGroupsPage({ selectedLocation: initialLocation, onBack }) {
  const navigate = useNavigate();
  const [showPrivate, setShowPrivate] = useState(false);
  const [privateCode, setPrivateCode] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || "Delhi");

  const locations = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
    "Kolkata", "Pune", "Jaipur", "Ahmedabad"
  ];

  // Handler for Create Group
  const handleCreateGroup = () => {
    window.open("https://web.whatsapp.com/", "_blank");
  };

  // Handler for Join Private Group
  const handleJoinPrivate = () => {
    // For now, just log the code
    alert(`Joining private group with code: ${privateCode}`);
  };

  // Handler for Join Group (show QR)
  const handleJoinGroup = () => {
    setShowQR(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Travel Groups</h1>
        
        {/* Enhanced destination selector at top */}
        <div className="relative mb-12">
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
        
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <button
              onClick={handleCreateGroup}
              className="flex flex-col items-center justify-center bg-slate-700/60 hover:bg-slate-600/60 text-white py-8 rounded-xl shadow-2xl border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              <span className="text-4xl mb-4">💬</span>
              <span className="font-bold text-lg">Create Group</span>
            </button>
            <button
              onClick={() => setShowPrivate(true)}
              className="flex flex-col items-center justify-center bg-slate-700/60 hover:bg-slate-600/60 text-white py-8 rounded-xl shadow-2xl border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              <span className="text-4xl mb-4">🔒</span>
              <span className="font-bold text-lg">Join Private Group</span>
            </button>
            <button
              onClick={handleJoinGroup}
              className="flex flex-col items-center justify-center bg-slate-700/60 hover:bg-slate-600/60 text-white py-8 rounded-xl shadow-2xl border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              <span className="text-4xl mb-4">🌐</span>
              <span className="font-bold text-lg">Join Group</span>
            </button>
          </div>

          {showPrivate && (
            <div className="mt-8 bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8 shadow-2xl w-full max-w-lg">
              <label className="block mb-4 font-bold text-white text-lg">Enter Private Group Code:</label>
              <input
                type="text"
                value={privateCode}
                onChange={e => setPrivateCode(e.target.value)}
                className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl mb-6 text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 backdrop-blur-sm"
                placeholder="Enter code..."
              />
              <button
                onClick={handleJoinPrivate}
                className="w-full bg-slate-700/60 hover:bg-slate-600/60 text-white py-3 px-6 rounded-xl font-bold shadow-lg border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
              >
                Join Private Group
              </button>
            </div>
          )}

          {showQR && (
            <div className="mt-8 text-center bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8 shadow-2xl w-full max-w-lg">
              <p className="mb-6 text-lg font-semibold text-white">Scan this QR code to join the <span className="font-bold text-slate-300">{selectedLocation}</span> group:</p>
              <div className="w-48 h-48 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-500 mx-auto bg-slate-700/30">
                {selectedLocation && (
                  <img
                    src={`/qr/${selectedLocation.toLowerCase()}.jpg`}
                    alt={`QR code for ${selectedLocation}`}
                    className="w-full h-full object-contain rounded-xl"
                    onError={e => { e.target.onerror = null; e.target.src = '/qr/delhi.jpg'; }}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-10">
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
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TravelGroupsPage({ selectedLocation, onBack }) {
  const navigate = useNavigate();
  const [showPrivate, setShowPrivate] = useState(false);
  const [privateCode, setPrivateCode] = useState("");
  const [showQR, setShowQR] = useState(false);

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

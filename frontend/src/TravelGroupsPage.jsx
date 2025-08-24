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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-purple-700 tracking-wide drop-shadow">Travel Groups</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={handleCreateGroup}
            className="flex flex-col items-center justify-center bg-green-500 text-white py-6 rounded-2xl shadow-lg hover:bg-green-600 transition-all"
          >
            <span className="text-4xl mb-2">💬</span>
            <span className="font-semibold text-lg">Create Group</span>
          </button>
          <button
            onClick={() => setShowPrivate(true)}
            className="flex flex-col items-center justify-center bg-blue-500 text-white py-6 rounded-2xl shadow-lg hover:bg-blue-600 transition-all"
          >
            <span className="text-4xl mb-2">🔒</span>
            <span className="font-semibold text-lg">Join Private Group</span>
          </button>
          <button
            onClick={handleJoinGroup}
            className="flex flex-col items-center justify-center bg-purple-500 text-white py-6 rounded-2xl shadow-lg hover:bg-purple-600 transition-all"
          >
            <span className="text-4xl mb-2">🌐</span>
            <span className="font-semibold text-lg">Join Group</span>
          </button>
        </div>

        {showPrivate && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 shadow">
            <label className="block mb-3 font-bold text-blue-700 text-lg">Enter Private Group Code:</label>
            <input
              type="text"
              value={privateCode}
              onChange={e => setPrivateCode(e.target.value)}
              className="w-full p-3 border-2 border-blue-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              placeholder="Enter code..."
            />
            <button
              onClick={handleJoinPrivate}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              Join
            </button>
          </div>
        )}

        {showQR && (
          <div className="mt-8 text-center bg-purple-50 border border-purple-200 rounded-xl p-6 shadow">
            <p className="mb-4 text-lg font-semibold text-purple-700">Scan this QR code to join the <span className="font-bold">{selectedLocation}</span> group:</p>
            {/* QR code image will be added here when provided */}
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-xl border-2 border-dashed border-purple-400 mx-auto">
              <span className="text-gray-500 text-lg">QR code for {selectedLocation}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all shadow"
          >
             Back
          </button>
        </div>
      </div>
    </div>
  );
}

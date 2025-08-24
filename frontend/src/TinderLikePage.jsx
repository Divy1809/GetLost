import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TinderLikePage() {
  const locationObj = useLocation();
  const navigate = useNavigate();
  const { location, loggedInUserId } = locationObj.state || {};
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!location || !loggedInUserId) return;
    async function fetchProfiles() {
      try {
        const res = await fetch(`/api/profiles?destination=${encodeURIComponent(location)}&exclude=${loggedInUserId}`);
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        setProfiles([]);
      }
    }
    fetchProfiles();
  }, [location, loggedInUserId]);

  const currentProfile = profiles[currentIndex];

  const handleLikeDislike = async (liked) => {
    if (!currentProfile) return;

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUserId,
          targetUserId: currentProfile.id,
          liked,
        }),
      });

      // Check if mutual like (replace with API call)
      if (liked) {
        const res = await fetch(
          `/api/mutualLike?userId=${loggedInUserId}&targetUserId=${currentProfile.id}`
        );
        const result = await res.json();
        if (result.match) {
          alert("🎉 It's a match!");
        }
      }
    } catch (err) {
      console.error("Error saving like/dislike", err);
    }

    // Move to next profile
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Solo Travellers</h1>
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Profile info */}
          {currentProfile ? (
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30 mb-8 w-full">
              <h2 className="text-3xl font-bold text-white mb-4">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <p className="text-slate-300 mb-6 text-lg">
                {currentProfile.originCity} ➔ {currentProfile.destinationCity}
              </p>
              
              {/* Buttons */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <button
                  onClick={() => handleLikeDislike(true)}
                  className="bg-green-700/60 hover:bg-green-600/60 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-2xl border border-green-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
                >
                  ❤️ Like
                </button>
                <button
                  onClick={() => handleLikeDislike(false)}
                  className="bg-red-700/60 hover:bg-red-600/60 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-2xl border border-red-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
                >
                  👎 Dislike
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30 mb-8 w-full">
              <h2 className="text-xl text-slate-300 mb-6">No more profiles available.</h2>
            </div>
          )}
          
          <button
            className="bg-slate-700/60 hover:bg-slate-600/60 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-2xl border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

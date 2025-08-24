import React, { useState, useEffect } from "react";

export default function TinderLikePage({ location, loggedInUserId, onBack }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  // Fetch profiles from backend
  useEffect(() => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        {/* Profile info */}
        {currentProfile ? (
          <>
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              {currentProfile.name}, {currentProfile.age}
            </h2>
            <p className="text-gray-600 mb-6">
              {currentProfile.originCity} ➔ {currentProfile.destinationCity}
            </p>
          </>
        ) : (
          <h2 className="text-lg text-gray-500">No more profiles available.</h2>
        )}

        {/* Buttons */}
        {currentProfile && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => handleLikeDislike(true)}
                className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                ❤️ Like
              </button>
              <button
                onClick={() => handleLikeDislike(false)}
                className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                👎 Dislike
              </button>
            </div>
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onBack}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

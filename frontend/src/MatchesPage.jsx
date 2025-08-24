import React, { useEffect, useState } from "react";

export default function MatchesPage({ loggedInUserId, onBack }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch matches from backend API

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`/api/matches?userId=${loggedInUserId}`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [loggedInUserId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Your Matches
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : matches.length === 0 ? (
          <p className="text-center text-gray-500">
            No matches yet. Like profiles to find matches!
          </p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {matches.map((match, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <h2 className="font-bold text-lg">
                  {match.name}, {match.age}
                </h2>
                <p className="text-gray-600">
                  {match.originCity} ➔ {match.destinationCity}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  📞 {match.phone} <br />
                  📧 {match.email}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          ⬅ Back to Menu
        </button>
      </div>
    </div>
  );
}

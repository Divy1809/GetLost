import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MatchesPage({ loggedInUserId }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
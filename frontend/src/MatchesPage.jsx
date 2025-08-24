import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MatchesPage() {
  const locationObj = useLocation();
  const loggedInUserId = locationObj.state?.loggedInUserId;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Your Matches</h1>
        <div className="w-full max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center">
              <p className="text-slate-300 text-lg">Loading your matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8 shadow-2xl">
              <p className="text-slate-300 text-lg mb-4">No matches yet!</p>
              <p className="text-slate-400">Like profiles to find matches</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 shadow-2xl"
                >
                  <h2 className="font-bold text-xl text-white mb-2">
                    {match.name}, {match.age}
                  </h2>
                  <p className="text-slate-300 mb-3 text-lg">
                    {match.originCity} ➔ {match.destinationCity}
                  </p>
                  <div className="text-slate-400">
                    <p>📞 {match.phone}</p>
                    <p>📧 {match.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back Button */}
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

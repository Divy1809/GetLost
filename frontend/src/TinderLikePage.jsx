import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TinderLikePage() {
  const locationObj = useLocation();
  const navigate = useNavigate();
  const { location, loggedInUserId } = locationObj.state || {};
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("explore"); // "create", "explore", or "myposts"
  
  // Form state for Create Post
  const [userName, setUserName] = useState(""); // Will be fetched from user data
  const [userId, setUserId] = useState(""); // Will be fetched from user data
  const [travellingFrom, setTravellingFrom] = useState("");
  const [travellingTo, setTravellingTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // List of popular Indian cities
  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
    "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubballi-Dharwad"
  ];

  // Filter cities based on search
  const filteredFromCities = cities.filter(city => 
    city.toLowerCase().includes(fromSearch.toLowerCase())
  );
  
  const filteredToCities = cities.filter(city => 
    city.toLowerCase().includes(toSearch.toLowerCase())
  );

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

  // Fetch user data when component loads
  useEffect(() => {
    if (!loggedInUserId) return;
    async function fetchUserData() {
      try {
        // For now, set placeholder data - will be replaced with actual API call
        setUserName("User Name"); // TODO: Replace with actual API call to fetch user data
        setUserId(loggedInUserId); // Set the logged in user ID
      } catch (err) {
        setUserName("User Name");
        setUserId(loggedInUserId);
      }
    }
    fetchUserData();
  }, [loggedInUserId]);

  const currentProfile = profiles[currentIndex];

  // Handler for Create Post tab
  const handleCreatePost = () => {
    setActiveTab("create");
  };

  // Handler for Explore Travellers tab
  const handleExploreTravellers = () => {
    setActiveTab("explore");
  };

  // Handler for My Posts tab
  const handleMyPosts = () => {
    setActiveTab("myposts");
  };

  // Form handlers
  const handleFromCitySelect = (city) => {
    setTravellingFrom(city);
    setFromSearch(city);
    setShowFromDropdown(false);
  };

  const handleToCitySelect = (city) => {
    setTravellingTo(city);
    setToSearch(city);
    setShowToDropdown(false);
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    // TODO: Add form validation and submission logic
    console.log("Form submitted:", {
      userId,
      userName,
      travellingFrom,
      travellingTo,
      travelDate
    });
    alert("Post created successfully! (Backend integration pending)");
  };

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
      
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Solo Travellers</h1>
          <p className="text-slate-300 text-lg">Connect with fellow travellers</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-2 shadow-2xl">
            <div className="flex space-x-2">
              <button
                onClick={handleCreatePost}
                className={`px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                  activeTab === "create"
                    ? "bg-blue-600/80 text-white shadow-lg border border-blue-500/50"
                    : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white border border-slate-600/30"
                }`}
              >
                <span className="mr-2">✏️</span>
                Create Post
              </button>
              <button
                onClick={handleExploreTravellers}
                className={`px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                  activeTab === "explore"
                    ? "bg-green-600/80 text-white shadow-lg border border-green-500/50"
                    : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white border border-slate-600/30"
                }`}
              >
                <span className="mr-2">🌍</span>
                Explore Travellers
              </button>
              <button
                onClick={handleMyPosts}
                className={`px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                  activeTab === "myposts"
                    ? "bg-purple-600/80 text-white shadow-lg border border-purple-500/50"
                    : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white border border-slate-600/30"
                }`}
              >
                <span className="mr-2">📋</span>
                My Posts
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-6xl mx-auto">
          {activeTab === "create" && (
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Travel Post</h2>
              <p className="text-center text-slate-300 mb-8">📝 Share your travel plans and find companions!</p>
              
              <form onSubmit={handleSubmitPost} className="max-w-2xl mx-auto space-y-6">
                {/* User ID Field (Read-only) */}
                <div>
                  <label className="block text-white font-semibold mb-2">User ID</label>
                  <input
                    type="text"
                    value={userId}
                    readOnly
                    className="w-full p-4 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 cursor-not-allowed opacity-75"
                    placeholder="Your user ID will be loaded here..."
                  />
                  <p className="text-slate-400 text-sm mt-1">Your unique user ID (cannot be changed)</p>
                </div>

                {/* Name Field (Read-only) */}
                <div>
                  <label className="block text-white font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={userName}
                    readOnly
                    className="w-full p-4 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 cursor-not-allowed opacity-75"
                    placeholder="Your name will be loaded here..."
                  />
                  <p className="text-slate-400 text-sm mt-1">Name from your profile (cannot be changed)</p>
                </div>

                {/* Travelling From Field */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-2">Travelling From</label>
                  <input
                    type="text"
                    value={fromSearch}
                    onChange={(e) => {
                      setFromSearch(e.target.value);
                      setShowFromDropdown(true);
                    }}
                    onFocus={() => setShowFromDropdown(true)}
                    className="w-full p-4 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Search and select your departure city..."
                    required
                  />
                  
                  {/* From Dropdown */}
                  {showFromDropdown && filteredFromCities.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredFromCities.slice(0, 10).map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleFromCitySelect(city)}
                          className="w-full text-left p-3 text-white hover:bg-slate-700/60 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Travelling To Field */}
                <div className="relative">
                  <label className="block text-white font-semibold mb-2">Travelling To</label>
                  <input
                    type="text"
                    value={toSearch}
                    onChange={(e) => {
                      setToSearch(e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => setShowToDropdown(true)}
                    className="w-full p-4 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                    placeholder="Search and select your destination city..."
                    required
                  />
                  
                  {/* To Dropdown */}
                  {showToDropdown && filteredToCities.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredToCities.slice(0, 10).map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleToCitySelect(city)}
                          className="w-full text-left p-3 text-white hover:bg-slate-700/60 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Travel Date Field */}
                <div>
                  <label className="block text-white font-semibold mb-2">Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    className="w-full p-4 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600/80 hover:bg-blue-500 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg border border-blue-500/50 transform hover:scale-[1.02] transition-all duration-200 min-w-48"
                  >
                    Create Post ✈️
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "explore" && (
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Explore Travellers</h2>
              
              {/* Current profile card */}
              {currentProfile ? (
                <div className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 max-w-md mx-auto mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">   
                    {currentProfile.name}, {currentProfile.age}
                  </h3>
                  <p className="text-slate-300 mb-6">
                    {currentProfile.originCity} ➔ {currentProfile.destinationCity}
                  </p>
                  
                  {/* Like/Dislike buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleLikeDislike(false)}
                      className="bg-red-600/80 hover:bg-red-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg border border-red-500/50 transform hover:scale-[1.02] transition-all duration-200"
                    >
                      👎 Pass
                    </button>
                    <button
                      onClick={() => handleLikeDislike(true)}
                      className="bg-green-600/80 hover:bg-green-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg border border-green-500/50 transform hover:scale-[1.02] transition-all duration-200"
                    >
                      ❤️ Like
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-300">
                  <p className="text-lg mb-4">🔍 No more travellers to explore</p>
                  <p>Check back later for new travel posts!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "myposts" && (
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">My Posts</h2>
              <div className="text-center text-slate-300">
                <p className="text-lg mb-4">📋 Manage your travel posts</p>
                <p>View, edit, and manage all your travel posts in one place!</p>
                {/* My posts list will be added here */}
              </div>
            </div>
          )}
        </div>

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
  );
}

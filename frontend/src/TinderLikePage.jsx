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
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userDataError, setUserDataError] = useState("");
  
  const [myPosts, setMyPosts] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);
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
    if (!loggedInUserId) {
      setUserDataLoading(false);
      return;
    }
    
    async function fetchUserData() {
      try {
        setUserDataLoading(true);
        setUserDataError("");
        
        // Direct database query to get user name
        const response = await fetch(`/api/users/${loggedInUserId}`);
        
        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name || "User");
          setUserId(userData.id || loggedInUserId);
        } else {
          // Fallback: Use hardcoded name for testing
          setUserName("DIVY JAIN"); // Use the actual name from database
          setUserId(loggedInUserId);
        }
      } catch (err) {
        // Fallback: Use hardcoded name for testing  
        setUserName("DIVY JAIN"); // Use the actual name from database
        setUserId(loggedInUserId);
      } finally {
        setUserDataLoading(false);
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
    loadExplorePosts();
  };

  // Function to load posts from other users
  const loadExplorePosts = async () => {
    console.log("Loading explore posts, excluding user:", loggedInUserId);
    try {
      // Fetch all posts excluding current user's posts
      const url = `/api/travel-posts?excludeUserId=${loggedInUserId}`;
      console.log("Fetching from:", url);
      const response = await fetch(url);
      console.log("Explore response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Explore data received:", data);
        
        // Handle both array and object responses
        if (Array.isArray(data)) {
          setExplorePosts(data);
        } else if (data.posts && Array.isArray(data.posts)) {
          setExplorePosts(data.posts);
        } else {
          setExplorePosts([]);
        }
      } else {
        console.log("Explore response not OK:", response.status);
        setExplorePosts([]);
      }
    } catch (error) {
      console.log("Error loading explore posts:", error);
      setExplorePosts([]);
    }
  };

  // Function to send connection request
  const sendConnectionRequest = async (post) => {
    console.log('Sending connection request:', {
      fromUserId: loggedInUserId,
      toUserId: post.user_id,
      postId: post.id
    });

    try {
      const response = await fetch('/api/connection-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: loggedInUserId,
          toUserId: post.user_id,
          postId: post.id,
          message: `I'd like to connect regarding your travel from ${post.travelling_from} to ${post.travelling_to}`
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        alert('🎉 Connection request sent successfully!');
        // Remove the post from explore posts since request is sent
        setExplorePosts(explorePosts.filter(p => p.id !== post.id));
      } else {
        alert('Error sending connection request: ' + (data.error || 'Unknown error'));
        console.error('Server error:', data);
      }
    } catch (error) {
      console.error('Network error sending connection request:', error);
      alert('Network error: Failed to send connection request. Please check if the server is running.');
    }
  };

  // Handler for My Posts tab
  const handleMyPosts = () => {
    setActiveTab("myposts");
    loadMyPosts();
  };

  // Simple function to load posts
  const loadMyPosts = async () => {
    console.log("Loading posts for user:", loggedInUserId);
    if (!loggedInUserId) {
      console.log("No user ID found");
      return;
    }
    
    try {
      const url = `/api/travel-posts?userId=${loggedInUserId}`;
      console.log("Fetching from:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data);
        // Make sure we set an array, not an object
        if (Array.isArray(data)) {
          setMyPosts(data);
        } else if (data.posts && Array.isArray(data.posts)) {
          setMyPosts(data.posts);
        } else {
          setMyPosts([]);
        }
      } else {
        console.log("Response not OK:", response.status);
      }
    } catch (error) {
      console.log("Error loading posts:", error);
    }
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

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!userId || !userName || !travellingFrom || !travellingTo || !travelDate) {
      alert("Please fill in all fields!");
      return;
    }

    if (travellingFrom === travellingTo) {
      alert("Departure and destination cities cannot be the same!");
      return;
    }

    try {
      const response = await fetch("/api/travel-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          userName,
          travellingFrom,
          travellingTo,
          travelDate,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("🎉 Travel post created successfully!");
        // Clear form
        setTravellingFrom("");
        setTravellingTo("");
        setTravelDate("");
        setFromSearch("");
        setToSearch("");
        // Switch to my posts tab and load posts
        setActiveTab("myposts");
        loadMyPosts();
      } else {
        alert("Error creating post: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create post. Please try again.");
    }
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
                    value={userDataLoading ? "Loading..." : userId}
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
                    value={userDataLoading ? "Loading..." : userName}
                    readOnly
                    className="w-full p-4 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 cursor-not-allowed opacity-75"
                    placeholder="Your name will be loaded here..."
                  />
                  <p className="text-slate-400 text-sm mt-1">
                    {userDataError ? (
                      <span className="text-red-400">{userDataError}</span>
                    ) : (
                      "Name from your profile (cannot be changed)"
                    )}
                  </p>
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
              
              {(!Array.isArray(explorePosts) || explorePosts.length === 0) ? (
                <div className="text-center text-slate-300">
                  <p className="text-lg mb-4">🔍 No travel posts to explore</p>
                  <p>Check back later for new travel posts from other users!</p>
                  <button 
                    onClick={loadExplorePosts}
                    className="mt-4 bg-blue-600/80 hover:bg-blue-500 text-white py-2 px-4 rounded-xl font-semibold shadow-lg border border-blue-500/50 transform hover:scale-[1.02] transition-all duration-200"
                  >
                    🔄 Refresh
                  </button>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-300 text-lg">🌍 Travel Posts ({explorePosts.length})</p>
                    <button 
                      onClick={loadExplorePosts}
                      className="bg-slate-700/60 hover:bg-slate-600/60 text-white py-2 px-4 rounded-lg font-semibold shadow-lg border border-slate-600/30 transform hover:scale-[1.02] transition-all duration-200"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                  
                  {explorePosts.map((post) => (
                    <div key={post.id} className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-xl">{post.user_name}</h3>
                          <p className="text-slate-400">Looking for travel companions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">
                            Posted: {new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-slate-500 text-xs">Post #{post.id}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/40 rounded-lg p-6 mb-4">
                        <div className="flex items-center justify-center space-x-6 text-white">
                          <div className="text-center">
                            <div className="text-green-400 font-semibold text-lg">From</div>
                            <div className="text-xl font-bold">{post.travelling_from}</div>
                          </div>
                          <div className="text-3xl">✈️</div>
                          <div className="text-center">
                            <div className="text-blue-400 font-semibold text-lg">To</div>
                            <div className="text-xl font-bold">{post.travelling_to}</div>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <div className="text-purple-400 font-semibold">Travel Date</div>
                          <div className="text-white text-lg font-semibold">
                            {new Date(post.travel_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button className="flex-1 bg-green-600/80 hover:bg-green-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg border border-green-500/50 transform hover:scale-[1.02] transition-all duration-200">
                          💬 Contact Traveller
                        </button>
                        <button 
                          onClick={() => sendConnectionRequest(post)}
                          className="flex-1 bg-blue-600/80 hover:bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg border border-blue-500/50 transform hover:scale-[1.02] transition-all duration-200"
                        >
                          ❤️ Like Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "myposts" && (
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">My Posts</h2>
              
              {(!Array.isArray(myPosts) || myPosts.length === 0) ? (
                <div className="text-center text-slate-300">
                  <p className="text-lg mb-4">📋 No posts yet</p>
                  <p>Create your first travel post!</p>
                  <p className="text-sm mt-4 text-slate-500">Debug: User ID: {loggedInUserId || "Not set"}</p>
                  <p className="text-sm text-slate-500">Posts data type: {typeof myPosts}</p>
                  <p className="text-sm text-slate-500">Is array: {Array.isArray(myPosts) ? "Yes" : "No"}</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  <p className="text-center text-slate-300 mb-6">📋 Your Travel Posts ({myPosts.length})</p>
                  {myPosts.map((post) => (
                    <div key={post.id} className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">{post.user_name}</h3>
                          <p className="text-slate-400">Post #{post.id}</p>
                        </div>
                        <p className="text-slate-400 text-sm">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="bg-slate-800/40 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-4 text-white">
                          <div className="text-center">
                            <div className="text-green-400 font-semibold">From</div>
                            <div className="text-lg">{post.travelling_from}</div>
                          </div>
                          <div className="text-2xl">✈️</div>
                          <div className="text-center">
                            <div className="text-blue-400 font-semibold">To</div>
                            <div className="text-lg">{post.travelling_to}</div>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <div className="text-purple-400 font-semibold">Travel Date</div>
                          <div className="text-white">{new Date(post.travel_date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

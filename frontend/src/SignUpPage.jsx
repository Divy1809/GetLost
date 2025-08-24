import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Send signup data to backend
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        age,
        origin_city: originCity,
        destination_city: destinationCity,
        email,
        phone: contact,
        password,
        username
      })
    });
    if (res.ok) {
      alert("Signup successful! Please sign in.");
      navigate("/signin");
    } else {
      alert("Signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-16 right-16 w-36 h-36 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-16 left-16 w-44 h-44 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gray-700/10 rounded-full blur-lg"></div>
      
      {/* Top Welcome Header spanning full width */}
      <div className="w-full bg-black/30 backdrop-blur-sm border-b border-slate-700/30 py-8">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-5xl font-bold text-center text-white mb-3">
            Welcome to <span className="text-slate-300">GetLost</span>
          </h1>
          <p className="text-xl text-center text-slate-400">
            Your smart travel planner
          </p>
        </div>
      </div>
      
      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Left Side - Welcome Section */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-lg">
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-10 border border-slate-700/30">
              <h1 className="text-5xl font-bold text-white mb-6">
                Join <span className="text-slate-300">GetLost</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Start your journey with the smartest travel planner. Connect with 
                travelers worldwide and discover your next adventure.
              </p>
              <div className="space-y-5 text-lg text-slate-300">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Personalized Itineraries</h3>
                    <p className="text-sm text-slate-400">Create custom travel plans tailored to your preferences</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Travel Buddy Matching</h3>
                    <p className="text-sm text-slate-400">Find compatible travel companions for your adventures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Exclusive Deals</h3>
                    <p className="text-sm text-slate-400">Access special travel offers and group discounts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Travel Communities</h3>
                    <p className="text-sm text-slate-400">Join groups and share experiences with fellow travelers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-lg">
            <form onSubmit={handleSignUp}>
              <h2 className="text-4xl font-bold text-white mb-3 text-center">Create Your Account</h2>
              <p className="text-slate-400 mb-8 text-center text-lg">Start your travel journey today</p>
              
              <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Origin City</label>
                    <input
                      type="text"
                      placeholder="From city"
                      value={originCity}
                      onChange={e => setOriginCity(e.target.value)}
                      className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Destination</label>
                    <input
                      type="text"
                      placeholder="To city"
                      value={destinationCity}
                      onChange={e => setDestinationCity(e.target.value)}
                      className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    placeholder="Choose username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-8 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-slate-900/50 transform hover:scale-[1.02] transition-all duration-200 border border-slate-600/30"
              >
                Create Account
              </button>

              <div className="mt-6 text-center">
                <p className="text-slate-400 mb-4 text-sm">Already have an account?</p>
                <button 
                  type="button" 
                  className="w-full bg-slate-800/60 text-slate-300 py-3 rounded-lg font-semibold border-2 border-slate-700 hover:bg-slate-700/60 hover:border-slate-600 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm" 
                  onClick={() => navigate("/signin")}
                >
                  Sign In Instead
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

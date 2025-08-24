import React, { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUser();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Replace with real backend call
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUserId(data.userId); // Set real userId from backend
      navigate("/");
    } else {
      alert("Sign in failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      {/* Top Welcome Header spanning full width */}
      <div className="w-full bg-black/30 backdrop-blur-sm border-b border-slate-700/30 py-8">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-5xl font-bold text-center text-white mb-3">
            Welcome Back to <span className="text-slate-300">GetLost</span>
          </h1>
          <p className="text-xl text-center text-slate-400">
            Your smart travel planner - Plan your journey
          </p>
        </div>
      </div>

      <div className="flex h-full min-h-[calc(100vh-140px)]">
        {/* Left Side - Features Section */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-lg">
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
              <h2 className="text-3xl font-bold text-white mb-8">Why Choose GetLost?</h2>
              <div className="space-y-6 text-lg text-slate-300">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Smart Trip Planning</h3>
                    <p className="text-sm text-slate-400">AI-powered recommendations for your perfect getaway</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Travel Companions</h3>
                    <p className="text-sm text-slate-400">Connect with like-minded travelers worldwide</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Seamless Booking</h3>
                    <p className="text-sm text-slate-400">Book flights, hotels, and activities in one place</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Travel Groups</h3>
                    <p className="text-sm text-slate-400">Join or create groups for shared adventures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <form onSubmit={handleSignIn}>
              <h2 className="text-4xl font-bold text-white mb-3 text-center">Sign In</h2>
              <p className="text-slate-400 mb-10 text-center text-lg">Enter your credentials to continue</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">Username</label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-lg text-white placeholder-slate-400 backdrop-blur-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-lg text-white placeholder-slate-400 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-slate-900/50 transform hover:scale-[1.02] transition-all duration-200 border border-slate-600/30"
              >
                Sign In
              </button>

              <div className="mt-8 text-center">
                <p className="text-slate-400 mb-4">Don't have an account?</p>
                <button
                  type="button"
                  className="w-full bg-slate-800/60 text-slate-300 py-3 rounded-xl font-semibold text-lg border-2 border-slate-700 hover:bg-slate-700/60 hover:border-slate-600 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
                  onClick={() => navigate("/signup")}
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

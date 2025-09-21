import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Client-side validation
    if (!name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    if (!phone.startsWith("+91") || phone.length !== 13) {
      setErrorMessage("Phone number must be +91 followed by 10 digits");
      return;
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, email: email.trim() })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setErrorMessage(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Auto-add +91 if not present
    if (!value.startsWith("+91") && value.length > 0) {
      value = "+91" + value.replace(/^\+?91?/, "");
    }
    
    // Limit to +91 + 10 digits
    if (value.length <= 13) {
      setPhone(value);
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
            {/* Success Modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-lg border-2 border-slate-600/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Registration Successful!</h3>
                    <p className="text-slate-300 text-lg mb-6">Welcome to GetLost! Redirecting to sign in...</p>
                    <div className="w-full bg-slate-600/30 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUp}>
              <h2 className="text-4xl font-bold text-white mb-3 text-center">Create Your Account</h2>
              <p className="text-slate-400 mb-8 text-center text-lg">Just 3 simple steps to get started</p>
              
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-center">
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm text-lg"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm text-lg"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">Format: +91 followed by 10 digits</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-white placeholder-slate-400 backdrop-blur-sm text-lg"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full mt-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold text-lg rounded-lg shadow-xl transform hover:scale-[1.02] transition-all duration-200 border border-slate-500/30"
              >
                Create Account
              </button>
              
              <div className="text-center mt-6">
                <p className="text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signin")}
                    className="text-slate-300 hover:text-white font-semibold underline decoration-slate-500 hover:decoration-white transition-all"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
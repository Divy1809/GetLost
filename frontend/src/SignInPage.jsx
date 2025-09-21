import React, { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { setUserId } = useUser();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate input
    if (!phone && !email) {
      setErrorMessage("Please enter either your phone number or email address");
      return;
    }

    if (phone && (!phone.startsWith("+91") || phone.length !== 13)) {
      setErrorMessage("Phone number must be in format +91XXXXXXXXXX");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone || undefined, email: email || undefined }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUserId(data.userId);
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setErrorMessage(data.error || "Sign in failed. Please check your credentials.");
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
            {/* Success Modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-lg border-2 border-slate-600/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Welcome Back!</h3>
                    <p className="text-slate-300 text-lg mb-6">Redirecting to your dashboard...</p>
                    <div className="w-full bg-slate-600/30 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSignIn}>
              <h2 className="text-4xl font-bold text-white mb-3 text-center">Sign In</h2>
              <p className="text-slate-400 mb-10 text-center text-lg">Welcome back to your travel journey</p>
              
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-center">
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-lg text-white placeholder-slate-400 backdrop-blur-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1">Format: +91 followed by 10 digits</p>
                </div>
                
                <div className="text-center">
                  <span className="text-slate-400 text-sm">OR</span>
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30 transition-all outline-none text-lg text-white placeholder-slate-400 backdrop-blur-sm"
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

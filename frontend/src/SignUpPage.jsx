import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [step, setStep] = useState(1); // 1: Enter details, 2: Verify OTPs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [userId, setUserId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInitiateSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Client-side validation
    if (!name.trim()) {
      setErrorMessage("Name is required");
      setLoading(false);
      return;
    }

    if (!phone.startsWith("+91") || phone.length !== 13) {
      setErrorMessage("Phone number must be +91 followed by 10 digits");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, email: email.trim() })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUserId(data.userId);
        setStep(2);
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Signup initiation failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTPs = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!emailOTP || !phoneOTP) {
      setErrorMessage("Please enter both email and phone OTPs");
      setLoading(false);
      return;
    }

    if (emailOTP.length !== 6 || phoneOTP.length !== 6) {
      setErrorMessage("OTPs must be 6 digits long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, emailOTP, phoneOTP })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setErrorMessage(data.error || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTPs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, email: email.trim() })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUserId(data.userId);
        setErrorMessage("OTPs resent successfully!");
        setTimeout(() => setErrorMessage(""), 3000);
      } else {
        setErrorMessage(data.error || "Failed to resend OTPs.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
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

            {/* Sign Up Form */}
            <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/40 rounded-2xl p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {step === 1 ? "Create Account" : "Verify Your Details"}
                </h2>
                <p className="text-slate-400">
                  {step === 1 
                    ? "Fill in your details to get started" 
                    : "Enter the OTPs sent to your email and phone"
                  }
                </p>
                {step === 2 && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      📧 OTP sent to: {email}<br/>
                      📱 OTP sent to: {phone}
                    </p>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleInitiateSignUp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="+91XXXXXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending OTPs..." : "Send OTPs & Continue"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTPs} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email OTP *
                    </label>
                    <input
                      type="text"
                      value={emailOTP}
                      onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone OTP *
                    </label>
                    <input
                      type="text"
                      value={phoneOTP}
                      onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleResendOTPs}
                      disabled={loading}
                      className="flex-1 bg-slate-600/50 hover:bg-slate-600/70 text-slate-300 py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Resending..." : "Resend OTPs"}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying..." : "Verify & Sign Up"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-slate-400 hover:text-slate-300 text-sm transition-colors"
                  >
                    ← Back to edit details
                  </button>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-slate-700/40 text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/signin")}
                    className="text-slate-300 hover:text-white font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
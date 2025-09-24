import React, { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [step, setStep] = useState(1); // 1: Enter phone/email, 2: Verify OTP
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [userId, setUserId] = useState(null);
  const [otpType, setOtpType] = useState(null); // 'phone' or 'email'
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserId: setUserContext } = useUser();
  const navigate = useNavigate();

  const handleInitiateSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Validate input
    if (!phone && !email) {
      setErrorMessage("Please enter either your phone number or email address");
      setLoading(false);
      return;
    }

    if (phone && (!phone.startsWith("+91") || phone.length !== 13)) {
      setErrorMessage("Phone number must be in format +91XXXXXXXXXX");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone || undefined, email: email || undefined }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUserId(data.userId);
        setOtpType(data.otpType);
        setStep(2);
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to send OTP. Please check your credentials.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!otp) {
      setErrorMessage("Please enter the OTP");
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("OTP must be 6 digits long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp, otpType }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUserContext(data.userId);
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setErrorMessage(data.error || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signin/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone || undefined, email: email || undefined }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUserId(data.userId);
        setErrorMessage("OTP resent successfully!");
        setTimeout(() => setErrorMessage(""), 3000);
      } else {
        setErrorMessage(data.error || "Failed to resend OTP.");
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
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sign In Form */}
            <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/40 rounded-2xl p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {step === 1 ? "Sign In" : "Verify OTP"}
                </h2>
                <p className="text-slate-400">
                  {step === 1 
                    ? "Enter your phone number or email to continue" 
                    : `Enter the OTP sent to your ${otpType}`
                  }
                </p>
                {step === 2 && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      🔐 OTP sent to: {otpType === 'phone' ? phone : email}
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
                <form onSubmit={handleInitiateSignIn} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="+91XXXXXXXXXX"
                    />
                  </div>

                  <div className="text-center">
                    <span className="text-slate-400 text-sm">OR</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Enter OTP *
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="flex-1 bg-slate-600/50 hover:bg-slate-600/70 text-slate-300 py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Resending..." : "Resend OTP"}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying..." : "Sign In"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-slate-400 hover:text-slate-300 text-sm transition-colors"
                  >
                    ← Back to login details
                  </button>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-slate-700/40 text-center">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-slate-300 hover:text-white font-semibold transition-colors"
                  >
                    Sign Up
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

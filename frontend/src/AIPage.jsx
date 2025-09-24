import React from "react";
import { useNavigate } from "react-router-dom";

export default function AIPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-cyan-700/10 rounded-full blur-lg"></div>
      <div className="absolute top-1/3 left-1/3 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl"></div>
      
      {/* Floating AI particles */}
      <div className="absolute top-32 left-32 w-2 h-2 bg-cyan-400/40 rounded-full animate-ping delay-100"></div>
      <div className="absolute top-48 right-40 w-1 h-1 bg-purple-400/50 rounded-full animate-ping delay-300"></div>
      <div className="absolute bottom-40 left-48 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping delay-700"></div>
      <div className="absolute bottom-32 right-32 w-2 h-2 bg-indigo-400/40 rounded-full animate-ping delay-500"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* AI Icon with glow effect */}
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-full flex items-center justify-center mx-auto border border-purple-500/30 backdrop-blur-sm">
              <span className="text-6xl animate-pulse">🤖</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-6 drop-shadow-2xl">
            AI Travel Agent
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-slate-200 font-light tracking-wide mb-4">
            Your Personal Travel Assistant
          </p>
          <p className="text-lg text-slate-400 italic mb-12">
            Powered by Advanced AI • Personalized Recommendations • 24/7 Support
          </p>

          {/* Coming Soon Card */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-30"></div>
            <div className="relative bg-gradient-to-r from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-600/40 shadow-2xl">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-8">
                <span className="text-2xl animate-bounce">🚧</span>
                <span className="text-purple-300 font-bold text-xl">Coming Soon</span>
              </div>

              {/* Features Preview */}
              <div className="space-y-6 text-left">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Smart Trip Planning</h3>
                    <p className="text-slate-300">AI-powered itinerary generation based on your preferences</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">24/7 Chat Support</h3>
                    <p className="text-slate-300">Get instant answers to all your travel questions</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Personalized Recommendations</h3>
                    <p className="text-slate-300">Tailored suggestions based on your travel history</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => navigate(-1)}
              className="group relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-700/80 hover:to-slate-600/80 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-600/40 hover:border-purple-500/50 transform hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <span className="text-xl">⬅️</span>
                <span>Back to Menu</span>
              </div>
            </button>

            <button
              disabled
              className="relative bg-gradient-to-r from-purple-600/40 to-cyan-600/40 text-slate-400 py-4 px-8 rounded-2xl font-semibold text-lg shadow-2xl border border-purple-500/30 cursor-not-allowed backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🔔</span>
                <span>Notify Me When Ready</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
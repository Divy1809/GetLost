import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MatchesPage() {
  const locationObj = useLocation();
  const loggedInUserId = locationObj.state?.loggedInUserId;
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("connections"); // "connections", "sent", "received"
  
  // Data states
  const [myConnections, setMyConnections] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab handlers
  const handleConnectionsTab = () => {
    setActiveTab("connections");
    loadMyConnections();
  };

  const handleSentTab = () => {
    setActiveTab("sent");
    loadSentRequests();
  };

  const handleReceivedTab = () => {
    setActiveTab("received");
    loadReceivedRequests();
  };

  // Load functions
  const loadMyConnections = async () => {
    try {
      const response = await fetch(`/api/connection-requests/connections/${loggedInUserId}`);
      if (response.ok) {
        const data = await response.json();
        setMyConnections(data);
      } else {
        setMyConnections([]);
      }
    } catch (error) {
      console.log("Error loading connections:", error);
      setMyConnections([]);
    }
  };

  const loadSentRequests = async () => {
    try {
      const response = await fetch(`/api/connection-requests/sent/${loggedInUserId}`);
      if (response.ok) {
        const data = await response.json();
        setSentRequests(data);
      } else {
        setSentRequests([]);
      }
    } catch (error) {
      console.log("Error loading sent requests:", error);
      setSentRequests([]);
    }
  };

  const loadReceivedRequests = async () => {
    try {
      const response = await fetch(`/api/connection-requests/received/${loggedInUserId}`);
      if (response.ok) {
        const data = await response.json();
        setReceivedRequests(data);
      } else {
        setReceivedRequests([]);
      }
    } catch (error) {
      console.log("Error loading received requests:", error);
      setReceivedRequests([]);
    }
  };

  // Action functions
  const acceptRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/connection-requests/${requestId}/accept`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        alert('✅ Connection request accepted!');
        loadReceivedRequests(); // Refresh received requests
        loadMyConnections(); // Refresh connections
      } else {
        alert('Error accepting request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request');
    }
  };

  const declineRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/connection-requests/${requestId}/decline`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        alert('❌ Connection request declined');
        loadReceivedRequests(); // Refresh received requests
      } else {
        alert('Error declining request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline request');
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/connection-requests/${requestId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('🗑️ Connection request canceled');
        loadSentRequests(); // Refresh sent requests
      } else {
        alert('Error canceling request');
      }
    } catch (error) {
      console.error('Error canceling request:', error);
      alert('Failed to cancel request');
    }
  };

  useEffect(() => {
    if (loggedInUserId) {
      loadMyConnections();
      setLoading(false);
    }
  }, [loggedInUserId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Travel Connections</h1>
          <p className="text-slate-300 text-lg">Manage your travel network</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-2 shadow-2xl">
            <div className="flex space-x-2">
              <button
                onClick={handleConnectionsTab}
                className={`px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                  activeTab === "connections"
                    ? "bg-green-600/80 text-white shadow-lg border border-green-500/50"
                    : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white border border-slate-600/30"
                }`}
              >
                <span className="mr-2">🤝</span>
                My Connections
              </button>
              <button
                onClick={handleSentTab}
                className={`px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                  activeTab === "sent"
                    ? "bg-blue-600/80 text-white shadow-lg border border-blue-500/50"
                    : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white border border-slate-600/30"
                }`}
              >
                <span className="mr-2">📤</span>
                Requests Sent
              </button>
              <button
                onClick={handleReceivedTab}
                className={`px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${
                  activeTab === "received"
                    ? "bg-purple-600/80 text-white shadow-lg border border-purple-500/50"
                    : "bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-white border border-slate-600/30"
                }`}
              >
                <span className="mr-2">📥</span>
                Requests Received
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-6xl mx-auto">
          {activeTab === "connections" && (
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">My Connections</h2>
              {myConnections.length === 0 ? (
                <div className="text-center text-slate-300">
                  <p className="text-lg mb-4">🤝 No connections yet</p>
                  <p>Connect with fellow travelers to build your network!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myConnections.map((connection, index) => (
                    <div key={index} className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{connection.connection_name}</h3>
                          <p className="text-slate-400 mb-2">{connection.connection_email}</p>
                          <div className="text-slate-300">
                            <p className="mb-1">✈️ {connection.travelling_from} → {connection.travelling_to}</p>
                            <p className="text-sm">🗓️ {new Date(connection.travel_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button className="bg-green-600/80 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-semibold">
                          💬 Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "sent" && (
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Requests Sent</h2>
              {sentRequests.length === 0 ? (
                <div className="text-center text-slate-300">
                  <p className="text-lg mb-4">📤 No requests sent</p>
                  <p>Send connection requests to travelers you'd like to connect with!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentRequests.map((request, index) => (
                    <div key={index} className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{request.to_user_name}</h3>
                          <p className="text-slate-400 mb-2">{request.to_user_email}</p>
                          <div className="text-slate-300">
                            <p className="mb-1">✈️ {request.travelling_from} → {request.travelling_to}</p>
                            <p className="text-sm mb-2">🗓️ {new Date(request.travel_date).toLocaleDateString()}</p>
                            <p className="text-sm text-slate-400">Sent: {new Date(request.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <span className="bg-yellow-600/80 text-white py-2 px-4 rounded-lg font-semibold text-center">
                            ⏳ {request.status}
                          </span>
                          <button 
                            onClick={() => cancelRequest(request.id)}
                            className="bg-red-600/80 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "received" && (
            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Requests Received</h2>
              {receivedRequests.length === 0 ? (
                <div className="text-center text-slate-300">
                  <p className="text-lg mb-4">📥 No requests received</p>
                  <p>When travelers want to connect with you, they'll appear here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedRequests.map((request, index) => (
                    <div key={index} className="bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">{request.from_user_name}</h3>
                          <p className="text-slate-400 mb-2">{request.from_user_email}</p>
                          <div className="text-slate-300">
                            <p className="mb-1">✈️ {request.travelling_from} → {request.travelling_to}</p>
                            <p className="text-sm mb-2">🗓️ {new Date(request.travel_date).toLocaleDateString()}</p>
                            <p className="text-sm text-slate-400">Received: {new Date(request.created_at).toLocaleDateString()}</p>
                            {request.message && (
                              <p className="text-sm text-slate-300 mt-2 p-2 bg-slate-800/40 rounded">
                                💬 "{request.message}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => acceptRequest(request.id)}
                            className="bg-green-600/80 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-semibold"
                          >
                            ✅ Accept
                          </button>
                          <button 
                            onClick={() => declineRequest(request.id)}
                            className="bg-red-600/80 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
                          >
                            ❌ Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

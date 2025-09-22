import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { userId: currentUserId } = useUser();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("all");
  
  // Booking states
  const [flightBookings, setFlightBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAllBookings();
  }, [currentUserId]);

  const loadAllBookings = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Loading bookings for user:", currentUserId);
      
      // Load flight bookings
      const flightRes = await fetch(`http://localhost:5000/api/bookings?userId=${currentUserId}`);
      const flightData = await flightRes.json();
      console.log("Flight bookings response:", flightData);
      
      // Load hotel bookings
      const hotelRes = await fetch(`http://localhost:5000/api/hotelBookings?userId=${currentUserId}`);
      const hotelData = await hotelRes.json();
      console.log("Hotel bookings response:", hotelData);
      
      // Handle different response formats
      setFlightBookings(flightData.bookings || flightData || []);
      setHotelBookings(hotelData.bookings || hotelData || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings. Please try again.");
      setFlightBookings([]);
      setHotelBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFlightBooking = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadAllBookings(); // refresh all bookings
        alert("Flight booking cancelled successfully!");
      } else {
        alert("Failed to cancel flight booking.");
      }
    } catch (err) {
      alert("Error cancelling flight booking.");
    }
  };

  const handleCancelHotelBooking = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/hotelBookings/${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadAllBookings(); // refresh all bookings
        alert("Hotel booking cancelled successfully!");
      } else {
        alert("Failed to cancel hotel booking.");
      }
    } catch (err) {
      alert("Error cancelling hotel booking.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Get all bookings combined with type indicator
  const getAllBookings = () => {
    const allBookings = [
      ...flightBookings.map(booking => ({ ...booking, type: 'flight' })),
      ...hotelBookings.map(booking => ({ ...booking, type: 'hotel' }))
    ];
    
    // Sort by created_at or booking_date
    return allBookings.sort((a, b) => {
      const dateA = new Date(a.created_at || a.booking_date);
      const dateB = new Date(b.created_at || b.booking_date);
      return dateB - dateA; // Most recent first
    });
  };

  const renderBookingCard = (booking) => {
    const isFlightBooking = booking.type === 'flight';
    const cardColor = isFlightBooking ? 'border-blue-500/30' : 'border-orange-500/30';
    const iconBg = isFlightBooking ? 'bg-blue-500/20' : 'bg-orange-500/20';
    const icon = isFlightBooking ? '✈️' : '🏨';
    const cancelHandler = isFlightBooking ? handleCancelFlightBooking : handleCancelHotelBooking;

    return (
      <div
        key={`${booking.type}-${booking.booking_id}`}
        className={`bg-slate-800/20 backdrop-blur-sm border ${cardColor} rounded-xl p-6 shadow-2xl transform hover:scale-[1.01] transition-all duration-200`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {isFlightBooking ? 'Flight Booking' : 'Hotel Booking'}
              </h3>
              <p className="text-slate-400 text-sm">ID: {booking.booking_id}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            booking.status === 'active' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {booking.status || 'Active'}
          </span>
        </div>

        <div className="text-slate-300 space-y-2 mb-4">
          <p><span className="text-white font-semibold">Destination:</span> {booking.destination}</p>
          {isFlightBooking ? (
            <p><span className="text-white font-semibold">Flight Details:</span> {booking.flight_details}</p>
          ) : (
            <p><span className="text-white font-semibold">Hotel:</span> {booking.hotel_name}</p>
          )}
          <p><span className="text-white font-semibold">Booking Date:</span> {formatDate(booking.booking_date)}</p>
          {booking.created_at && (
            <p><span className="text-white font-semibold">Booked On:</span> {formatDate(booking.created_at)}</p>
          )}
        </div>

        {(booking.status === 'active' || !booking.status) && (
          <button
            onClick={() => cancelHandler(booking.booking_id)}
            className="bg-red-600/60 hover:bg-red-500/60 text-white px-6 py-2 rounded-lg font-bold shadow-lg border border-red-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
          >
            Cancel Booking
          </button>
        )}
      </div>
    );
  };

  const renderBookingsList = (bookingsList, emptyMessage) => (
    <div className="space-y-6">
      {bookingsList.length === 0 ? (
        <div className="text-center bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8 shadow-2xl">
          <p className="text-slate-300 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-6 max-h-96 overflow-y-auto pr-2">
          {bookingsList.map(renderBookingCard)}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 shadow-2xl rounded-2xl p-10 w-full max-w-6xl">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            My Bookings
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-700/30 rounded-xl p-2 border border-slate-600/30">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 mx-1 ${
                  activeTab === "all"
                    ? "bg-purple-600/70 text-white shadow-lg border border-purple-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                }`}
              >
                📋 All Bookings ({getAllBookings().length})
              </button>
              <button
                onClick={() => setActiveTab("flights")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 mx-1 ${
                  activeTab === "flights"
                    ? "bg-blue-600/70 text-white shadow-lg border border-blue-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                }`}
              >
                ✈️ Flights ({flightBookings.length})
              </button>
              <button
                onClick={() => setActiveTab("hotels")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 mx-1 ${
                  activeTab === "hotels"
                    ? "bg-orange-600/70 text-white shadow-lg border border-orange-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                }`}
              >
                🏨 Hotels ({hotelBookings.length})
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {/* All Bookings Tab */}
            {activeTab === "all" && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">All Your Bookings</h2>
                  <p className="text-slate-400">Complete history of your flight and hotel bookings</p>
                </div>
                {renderBookingsList(getAllBookings(), "No bookings found. Start planning your next trip!")}
              </div>
            )}

            {/* Flights Tab */}
            {activeTab === "flights" && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Flight Bookings</h2>
                  <p className="text-slate-400">Your flight booking history and management</p>
                </div>
                {renderBookingsList(
                  flightBookings.map(booking => ({ ...booking, type: 'flight' })), 
                  "No flight bookings found. Book your next flight now!"
                )}
              </div>
            )}

            {/* Hotels Tab */}
            {activeTab === "hotels" && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Hotel Bookings</h2>
                  <p className="text-slate-400">Your hotel booking history and management</p>
                </div>
                {renderBookingsList(
                  hotelBookings.map(booking => ({ ...booking, type: 'hotel' })), 
                  "No hotel bookings found. Find your perfect stay now!"
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => navigate("/plan-bookings")}
              className="bg-gradient-to-r from-blue-600/60 to-orange-600/60 hover:from-blue-500/60 hover:to-orange-500/60 text-white py-3 px-8 rounded-xl font-bold shadow-2xl border border-blue-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              📅 Plan New Booking
            </button>
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
};

export default MyBookingsPage;
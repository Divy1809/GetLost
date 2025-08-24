import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function ShowHotelBookingsPage() {
  const navigate = useNavigate();
  const { userId: currentUserId } = useUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, [currentUserId]);


  const loadBookings = async () => {
    try {
      const res = await fetch(`/api/hotelBookings?userId=${currentUserId}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setBookings([]);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await fetch(`/api/hotelBookings/${bookingId}`, {
        method: 'DELETE',
      });
      loadBookings(); // refresh UI
      alert('Hotel booking cancelled successfully!');
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Your Hotel Bookings</h1>
        <div className="w-full max-w-4xl mx-auto">
          {bookings.length === 0 ? (
            <div className="text-center bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8 shadow-2xl">
              <p className="text-slate-300 text-lg">No hotel bookings found</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {bookings.map((booking) => (
                <div
                  key={booking.booking_id}
                  className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 shadow-2xl"
                >
                  <div className="text-white space-y-2 mb-4">
                    <p><strong>Booking ID:</strong> <span className="text-slate-300">{booking.booking_id}</span></p>
                    <p><strong>Destination:</strong> <span className="text-slate-300">{booking.destination}</span></p>
                    <p><strong>Hotel:</strong> <span className="text-slate-300">{booking.hotel_name}</span></p>
                    <p><strong>Booked On:</strong> <span className="text-slate-300">{booking.booking_date}</span></p>
                  </div>
                  <button
                    onClick={() => handleCancelBooking(booking.booking_id)}
                    className="bg-red-600/60 hover:bg-red-500/60 text-white px-6 py-2 rounded-lg font-bold shadow-lg border border-red-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
                  >
                    Cancel This Booking
                  </button>
                </div>
              ))}
            </div>
          )}

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

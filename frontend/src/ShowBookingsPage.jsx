import React, { useEffect, useState } from "react";

export default function ShowFlightsBookingsPage({ currentUserId, onBack }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, [currentUserId]);


  const loadBookings = async () => {
    try {
      const res = await fetch(`/api/bookings?userId=${currentUserId}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setBookings([]);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadBookings(); // refresh UI
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (err) {
      alert("Error cancelling booking.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Your Flight Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">No flight bookings found.</p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                <p><strong>Destination:</strong> {booking.destination}</p>
                <p><strong>Flight:</strong> {booking.flight_details}</p>
                <p><strong>Booked On:</strong> {booking.booking_date}</p>
                <button
                  onClick={() => handleCancelBooking(booking.booking_id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Cancel This Booking
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

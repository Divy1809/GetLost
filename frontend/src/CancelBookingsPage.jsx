import React, { useEffect, useState } from "react";

export default function CancelBookingsPage({ currentUserId, onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings?userId=${currentUserId}`
        );
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [currentUserId]);

  async function cancelBooking(bookingId) {
    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  }

  if (loading) {
    return <p className="text-center mt-6">Loading your bookings...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Cancel Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">No bookings available.</p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>{booking.destination}</strong>
                  </p>
                  <p>{booking.flight_details}</p>
                </div>
                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
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

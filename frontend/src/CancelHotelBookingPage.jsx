import React, { useState } from "react";
import TinderLikePage from "./TinderLikePage";
import MatchesPage from "./MatchesPage";
import BookFlightsPage from "./BookFlightsPage";
import ShowBookingsPage from "./ShowBookingsPage";
import CancelBookingsPage from "./CancelBookingsPage";
import BookHotelPage from "./BookHotelPage";
import CancelHotelBookingPage from "./CancelHotelBookingPage";

export default function App() {
  const [page, setPage] = useState("menu");
  const [selectedLocation, setSelectedLocation] = useState("Delhi");
  const loggedInUserId = 1; // Example user

  const locations = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Ahmedabad",
  ];

  // ---- Page Switches ----
  if (page === "tinder") {
    return (
      <TinderLikePage
        location={selectedLocation}
        loggedInUserId={loggedInUserId}
        onBack={() => setPage("menu")}
      />
    );
  }

  if (page === "matches") {
    return (
      <MatchesPage
        loggedInUserId={loggedInUserId}
        onBack={() => setPage("menu")}
      />
    );
  }

  if (page === "bookFlights") {
    return (
      <BookFlightsPage
        currentUserId={loggedInUserId}
        onBack={() => setPage("menu")}
      />
    );
  }

  if (page === "showBookings") {
    return (
      <ShowBookingsPage
        currentUserId={loggedInUserId}
        onBack={() => setPage("menu")}
        onCancelBookings={() => setPage("cancelBookings")}
      />
    );
  }

  if (page === "cancelBookings") {
    return (
      <CancelBookingsPage
        currentUserId={loggedInUserId}
        onBack={() => setPage("showBookings")}
      />
    );
  }

  if (page === "bookHotels") {
    return (
      <BookHotelPage
        currentUserId={loggedInUserId}
        selectedDestination={selectedLocation}
        onBack={() => setPage("menu")}
      />
    );
  }

  if (page === "cancelHotelBookings") {
    return (
      <CancelHotelBookingPage
        currentUserId={loggedInUserId}
        onBack={() => setPage("menu")}
      />
    );
  }

  // ---- Main Menu ----
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">Main Menu</h1>

        {/* Destination Dropdown */}
        <label className="block text-lg font-medium mb-2 text-center">
          Select Destination:
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full p-2 border rounded-lg mb-6"
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Button Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPage("tinder")}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Solo Travellers
          </button>

          <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            Travel Groups
          </button>

          <button
            onClick={() => setPage("matches")}
            className="bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Matches
          </button>

          <button
            onClick={() => setPage("bookFlights")}
            className="bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
          >
            Book Flights
          </button>

          <button
            onClick={() => setPage("showBookings")}
            className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
          >
            Show Flight Bookings
          </button>

          <button
            onClick={() => setPage("bookHotels")}
            className="bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
          >
            Book Hotels
          </button>

          <button
            onClick={() => setPage("cancelHotelBookings")}
            className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
          >
            Show/Cancel Hotel Bookings
          </button>

          <button className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

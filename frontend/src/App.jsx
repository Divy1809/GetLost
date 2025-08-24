import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./mainmenu";
import TinderLikePage from "./TinderLikePage";
import TravelGroupsPage from "./TravelGroupsPage";
import MatchesPage from "./MatchesPage";
import BookFlightsPage from "./BookFlightsPage";
import ShowBookingsPage from "./ShowBookingsPage";
import CancelBookingsPage from "./CancelBookingsPage";
import BookHotelPage from "./BookHotelPage";
import ShowHotelBookingsPage from "./ShowHotelBookingsPage";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/tinder" element={<TinderLikePage />} />
          <Route path="/travel-groups" element={<TravelGroupsPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/book-flights" element={<BookFlightsPage />} />
          <Route path="/show-bookings" element={<ShowBookingsPage />} />
          <Route path="/cancel-bookings" element={<CancelBookingsPage />} />
          <Route path="/book-hotels" element={<BookHotelPage />} />
          <Route path="/show-hotel-bookings" element={<ShowHotelBookingsPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

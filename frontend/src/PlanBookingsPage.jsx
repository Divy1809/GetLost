import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";

const PlanBookingsPage = () => {
  const locationObj = useLocation();
  const { destination, selectedDestination } = locationObj.state || {};
  const finalDestination = destination || selectedDestination || "Delhi";
  const { userId: currentUserId } = useUser();
  const navigate = useNavigate();
  
  console.log("PlanBookingsPage state:", { destination, selectedDestination, finalDestination });
  
  // Tab state
  const [activeTab, setActiveTab] = useState("flights");
  
  // Flight states
  const [flights, setFlights] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState("");
  
  // Hotel states
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  
  // Common states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const airlines = [
    "IndiGo",
    "Air India",
    "SpiceJet",
    "Emirates",
    "Singapore Airlines",
    "Qatar Airways",
  ];

  // Generate random flights
  const generateFlights = () => {
    const newFlights = [];
    for (let i = 0; i < 5; i++) {
      newFlights.push({
        flight_no: "FL" + Math.floor(1000 + Math.random() * 9000),
        airline: selectedAirline,
        destination: finalDestination,
        time: `${Math.floor(Math.random() * 12) + 1}:${
          Math.random() < 0.5 ? "00" : "30"
        } ${Math.random() < 0.5 ? "AM" : "PM"}`,
        fare: 5000 + Math.floor(Math.random() * 4000),
      });
    }
    setFlights(newFlights);
  };

  // Generate hotels
  useEffect(() => {
    if (finalDestination) {
      const generatedHotels = [
        `${finalDestination} Grand Hotel`,
        `${finalDestination} City Inn`,
        `${finalDestination} Luxury Suites`,
        `${finalDestination} Budget Stay`,
        `${finalDestination} Premium Inn`,
      ];
      setHotels(generatedHotels);
      setSelectedHotel(generatedHotels[0]);
    }
  }, [finalDestination]);

  // Generate flights when airline is selected
  useEffect(() => {
    if (selectedAirline) {
      generateFlights();
    } else {
      setFlights([]);
    }
  }, [finalDestination, selectedAirline]);

  const handleBookFlight = async (flight) => {
    if (!flight) return;

    const newBooking = {
      userId: currentUserId,
      destination: finalDestination,
      flight_details: `Flight: ${flight.flight_no} | Time: ${flight.time} | Fare: ₹${flight.fare}`,
      booking_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    console.log("Booking flight with data:", newBooking);

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      
      const responseData = await res.json();
      console.log("Flight booking response:", responseData);
      
      if (res.ok) {
        setSuccessMessage(`Flight ${flight.flight_no} booked successfully! ✈️`);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        setSuccessMessage(`❌ Flight booking failed: ${responseData.error || 'Please try again.'}`);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Flight booking error:", err);
      setSuccessMessage('❌ Flight booking failed. Please check your connection.');
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }
  };

  const handleBookHotel = async () => {
    if (!selectedHotel) return;

    const newBooking = {
      userId: currentUserId,
      destination: finalDestination,
      hotel_name: selectedHotel,
      booking_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    console.log("Booking hotel with data:", newBooking);

    try {
      const res = await fetch('http://localhost:5000/api/hotelBookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      
      const responseData = await res.json();
      console.log("Hotel booking response:", responseData);
      
      if (res.ok) {
        setSuccessMessage(`Hotel "${selectedHotel}" booked successfully! 🏨`);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } else {
        setSuccessMessage(`❌ Hotel booking failed: ${responseData.error || 'Please try again.'}`);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      }
    } catch (err) {
      setSuccessMessage('❌ Hotel booking failed. Please check your connection.');
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-lg border-2 border-slate-600/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Booking Confirmed!</h3>
              <p className="text-slate-300 text-lg mb-6">{successMessage}</p>
              <div className="w-full bg-slate-600/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <p className="text-slate-400 text-sm mt-3">This message will close automatically</p>
            </div>
          </div>
        </div>
      )}

      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gray-700/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 shadow-2xl rounded-2xl p-10 w-full max-w-4xl">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Plan Your Trip to {finalDestination}
          </h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-700/30 rounded-xl p-2 border border-slate-600/30">
              <button
                onClick={() => setActiveTab("flights")}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 mx-1 ${
                  activeTab === "flights"
                    ? "bg-blue-600/70 text-white shadow-lg border border-blue-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                }`}
              >
                ✈️ Flights
              </button>
              <button
                onClick={() => setActiveTab("hotels")}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 mx-1 ${
                  activeTab === "hotels"
                    ? "bg-orange-600/70 text-white shadow-lg border border-orange-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                }`}
              >
                🏨 Hotels
              </button>
              <button
                onClick={() => setActiveTab("taxi")}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 mx-1 ${
                  activeTab === "taxi"
                    ? "bg-yellow-600/70 text-white shadow-lg border border-yellow-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                }`}
              >
                🚕 Taxi
              </button>
              <button
                onClick={() => setActiveTab("rent")}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 mx-1 ${
                  activeTab === "rent"
                    ? "bg-green-600/70 text-white shadow-lg border border-green-500/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-600/30"
                }`}
              >
                🚗 Rent Vehicle
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {/* Flights Tab */}
            {activeTab === "flights" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Book Your Flight</h2>
                </div>
                
                <div className="mb-8">
                  <label className="block text-lg font-semibold mb-4 text-center text-slate-300">
                    Select Airline:
                  </label>
                  <select
                    value={selectedAirline}
                    onChange={e => setSelectedAirline(e.target.value)}
                    className="w-full max-w-md mx-auto block p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 backdrop-blur-sm"
                  >
                    <option value="" className="bg-slate-800 text-white">-- Select Airline --</option>
                    {airlines.map(airline => (
                      <option key={airline} value={airline} className="bg-slate-800 text-white">
                        {airline}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedAirline === "" ? (
                  <p className="text-center text-slate-400 text-lg">
                    Please select an airline to view available flights.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {flights.length === 0 ? (
                      <p className="text-center text-slate-400 text-lg">No flights available.</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {flights.map((flight, index) => (
                          <div
                            key={index}
                            className="p-6 bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl shadow-lg"
                          >
                            <div className="text-slate-300 space-y-2 mb-4">
                              <p><span className="text-white font-semibold">Airline:</span> {flight.airline}</p>
                              <p><span className="text-white font-semibold">Flight:</span> {flight.flight_no}</p>
                              <p><span className="text-white font-semibold">Time:</span> {flight.time}</p>
                              <p><span className="text-white font-semibold">Fare:</span> ₹{flight.fare}</p>
                            </div>
                            <button
                              onClick={() => handleBookFlight(flight)}
                              className="w-full bg-blue-600/60 hover:bg-blue-500/60 text-white py-3 px-4 rounded-xl font-bold shadow-lg border border-blue-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
                            >
                              Book This Flight
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hotels Tab */}
            {activeTab === "hotels" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Book Your Hotel</h2>
                </div>
                
                <div className="max-w-lg mx-auto space-y-6">
                  <div>
                    <label className="block mb-3 font-bold text-white text-lg text-center">
                      Select Hotel:
                    </label>
                    <select
                      className="w-full p-4 bg-slate-800/60 border-2 border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 backdrop-blur-sm"
                      value={selectedHotel}
                      onChange={(e) => setSelectedHotel(e.target.value)}
                    >
                      {hotels.map((hotel, index) => (
                        <option key={index} value={hotel} className="bg-slate-800">
                          {hotel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-2">Selected Hotel:</h3>
                    <p className="text-slate-300 mb-4">{selectedHotel}</p>
                    <p className="text-slate-400 text-sm mb-4">
                      Premium accommodation with modern amenities and excellent service.
                    </p>
                    <button
                      onClick={handleBookHotel}
                      className="w-full bg-orange-600/60 hover:bg-orange-500/60 text-white py-4 rounded-xl font-bold shadow-lg border border-orange-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
                    >
                      Book This Hotel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Taxi Tab */}
            {activeTab === "taxi" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Book a Taxi</h2>
                </div>
                
                <div className="max-w-lg mx-auto">
                  <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-8 text-center">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">🚕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Taxi Booking</h3>
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
                      <p className="text-yellow-300 font-semibold text-lg mb-2">🚧 Coming Soon!</p>
                      <p className="text-slate-300">
                        We're working hard to bring you convenient taxi booking services. 
                        Stay tuned for quick and reliable rides around {finalDestination}!
                      </p>
                    </div>
                    <button
                      disabled
                      className="w-full bg-slate-600/40 text-slate-400 py-4 rounded-xl font-bold border border-slate-500/30 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rent Vehicle Tab */}
            {activeTab === "rent" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">Rent a Vehicle</h2>
                </div>
                
                <div className="max-w-lg mx-auto">
                  <div className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">🚗</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Vehicle Rental</h3>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
                      <p className="text-green-300 font-semibold text-lg mb-2">🚧 Coming Soon!</p>
                      <p className="text-slate-300">
                        Self-drive car rentals are on the way! Explore {finalDestination} at your own pace 
                        with our upcoming vehicle rental service.
                      </p>
                    </div>
                    <button
                      disabled
                      className="w-full bg-slate-600/40 text-slate-400 py-4 rounded-xl font-bold border border-slate-500/30 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate("/my-bookings")}
              className="bg-gradient-to-r from-purple-600/60 to-indigo-600/60 hover:from-purple-500/60 hover:to-indigo-500/60 text-white py-3 px-8 rounded-xl font-bold shadow-2xl border border-purple-500/30 transform hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
            >
              📋 My Bookings
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

export default PlanBookingsPage;
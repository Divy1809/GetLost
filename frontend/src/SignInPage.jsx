import React, { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUser();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Replace with real backend call
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUserId(data.userId); // Set real userId from backend
      navigate("/");
    } else {
      alert("Sign in failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-lg w-80"
        onSubmit={handleSignIn}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

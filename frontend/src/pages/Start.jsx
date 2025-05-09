import React from "react";
import { Link } from "react-router-dom";

function Start() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold">GoTogether</h1>
        <nav>
          <Link to="/login" className="px-4 py-2 border border-gray-900 rounded-md hover:bg-gray-900 hover:text-white transition">Sign In</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center text-center py-20 px-6">
        <h2 className="text-5xl font-extrabold">Share Rides, Save Costs 🚗</h2>
        <p className="mt-4 text-lg max-w-lg">A simple way to connect with verified drivers and passengers. Travel smarter.</p>
        <Link to="/signup" className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition">Get Started</Link>
      </section>

      {/* Key Features */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
        {[ 
          { title: "Find Rides", text: "Search and book a ride instantly." },
          { title: "Offer Rides", text: "Drive and share costs effortlessly." },
          { title: "Verified Users", text: "Safety and trust built-in." }
        ].map((item, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-lg text-center">
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-700 text-sm">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-4 bg-gray-900 text-gray-200 text-sm mt-auto">
        &copy; 2025 GoTogether. All rights reserved.
      </footer>
    </div>
  );
}

export default Start;

import React from "react";
import { Link } from "react-router-dom";
import { Car, Users, ShieldCheck } from "lucide-react";

function Start() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0f0f10] text-gray-200 font-sans">
      
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 md:px-10 py-4 bg-[#1c1c1e]/80 backdrop-blur-md border-b border-[#2a2a2e] shadow-sm">
        <h1 className="text-xl md:text-3xl font-semibold tracking-wide text-gray-100">
          GoTogether
        </h1>
        <nav>
          <Link
            to="/login"
            className="px-5 py-2 rounded-md text-sm font-medium border border-gray-600 text-gray-300 hover:bg-[#2a2a2e] hover:text-white transition"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 sm:px-6 py-12 sm:py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-gray-100">
          Connect. Ride. Share. 🚘
        </h2>
        <p className="text-gray-400 text-base sm:text-lg mb-10 px-2 sm:px-8">
          Discover a smarter, safer way to move together. Modern carpooling with verified users and sleek experience.
        </p>
        <Link
          to="/signup"
          className="px-8 py-3 bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] text-white rounded-md font-semibold shadow-lg hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Feature Section */}
      <section className="w-full px-4 sm:px-6 py-16 bg-[#111112]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Car className="w-8 h-8 text-[#4fd1c5]" />,
              title: "Find Rides",
              text: "Easily browse routes and connect with drivers.",
            },
            {
              icon: <Users className="w-8 h-8 text-[#818cf8]" />,
              title: "Offer Rides",
              text: "Post your trips and fill your empty seats.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-[#6ee7b7]" />,
              title: "Trusted Network",
              text: "All members are verified for your safety.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-[#1c1c1e]/80 border border-[#2a2a2e] rounded-xl text-center backdrop-blur-md shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-6 bg-[#1c1c1e] border-t border-[#2a2a2e] text-gray-500 text-sm mt-auto">
        &copy; {new Date().getFullYear()} GoTogether. Built for better rides.
      </footer>
    </div>
  );
}

export default Start;

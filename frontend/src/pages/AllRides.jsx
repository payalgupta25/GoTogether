import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Send, Filter } from "lucide-react";
import RideDetailsLoading from "../components/RideDetailsLoading";
import Navbar from "../components/Navbar";
import { Button } from "@headlessui/react";
import Buttons from "../components/Buttons";

const AllRides = () => {
  const location = useLocation();
  const [rides, setRides] = useState(location.state?.rides || []);
  const [filteredRides, setFilteredRides] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSeats, setMinSeats] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [womenOnly, setWomenOnly] = useState(false);


  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/all`);
        setRides(response.data);
        setFilteredRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    if (rides.length === 0) {
      fetchRides();
    } else {
      setFilteredRides(rides);
    }
  }, [rides]);

  useEffect(() => {
    let updated = [...rides];

    if (from) {
      updated = updated.filter((ride) =>
        ride.from.toLowerCase().includes(from.toLowerCase())
      );
    }

    if (womenOnly) {
      updated = updated.filter((ride) => ride.womenOnly === true);
    }

    if (to) {
      updated = updated.filter((ride) =>
        ride.to.toLowerCase().includes(to.toLowerCase())
      );
    }

    if (maxPrice) {
      updated = updated.filter((ride) => ride.price <= parseFloat(maxPrice));
    }

    if (minSeats) {
      updated = updated.filter((ride) => ride.numberOfMembers >= parseInt(minSeats));
    }

    if (selectedDate) {
      updated = updated.filter(
        (ride) => new Date(ride.date).toISOString().split("T")[0] === selectedDate
      );
    }

    if (selectedTimeSlot) {
      updated = updated.filter((ride) => {
        if (!ride.time) return false;

        const timeString = ride.time.trim();

        let match = timeString.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
        let hour, minute;

        if (match) {
          hour = parseInt(match[1], 10);
          minute = parseInt(match[2], 10);
          const period = match[3].toUpperCase();

          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;
        } else {
          const parts = timeString.split(":");
          if (parts.length < 2) return false;
          hour = parseInt(parts[0], 10);
          minute = parseInt(parts[1], 10);
        }

        if (isNaN(hour) || isNaN(minute)) return false;

        const totalMinutes = hour * 60 + minute;

        if (selectedTimeSlot === "morning")
          return totalMinutes >= 300 && totalMinutes < 720;
        if (selectedTimeSlot === "afternoon")
          return totalMinutes >= 720 && totalMinutes < 1020;
        if (selectedTimeSlot === "evening")
          return totalMinutes >= 1020 && totalMinutes < 1260;
        if (selectedTimeSlot === "night")
          return totalMinutes >= 1260 || totalMinutes < 300;

        return true;
      });
    }

    setFilteredRides(updated);
  }, [from, to, maxPrice, minSeats, selectedDate, rides, selectedTimeSlot, womenOnly]);

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex flex-col md:flex-row">
      <div className="hidden md:block w-full md:w-1/4 bg-[#131316] p-6 shadow-lg sticky top-0 h-screen overflow-auto border-r border-[#2c2c2e]">
        <h2 className="text-xl font-semibold mb-4 text-white">Filters</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="womenOnly"
              checked={womenOnly}
              onChange={(e) => setWomenOnly(e.target.checked)}
              className="accent-pink-500 w-4 h-4 sm:w-5 sm:h-5"
            />
            <div className="flex flex-col visible">
              <label htmlFor="womenOnly" className="text-sm text-gray-300">
                Women Only Rides
              </label>
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Pickup location"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Send className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Destination"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-4 py-3 bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Minimum Seats"
            value={minSeats}
            onChange={(e) => setMinSeats(e.target.value)}
            className="w-full px-4 py-3 bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="w-full px-4 py-3 bg-[#1c1c1e] text-white border border-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Time Slots</option>
            <option value="morning">Morning (5 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 9 PM)</option>
            <option value="night">Night (9 PM - 5 AM)</option>
          </select>
        </div>
      </div>

      <div className="md:hidden p-4 flex justify-end">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-[#1c1c1e] border border-[#2c2c2e] p-2 rounded-lg shadow flex items-center gap-2"
        >
          <Filter className="text-white" />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 bg-[#131316] text-white z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="text-gray-300 hover:text-red-500"
            >
              Close
            </button>
          </div>
          <div className="mb-4">
            <label>
            <input
              type="checkbox"
              checked={womenOnly}
              onChange={(e) => setWomenOnly(e.target.checked)}
              className="mr-2"
            />
            Women Only
          </label>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Pickup"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 bg-[#1c1c1e] border border-[#2c2c2e] rounded"
            />
            <input
              type="text"
              placeholder="Destination"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 bg-[#1c1c1e] border border-[#2c2c2e] rounded"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-3 bg-[#1c1c1e] border border-[#2c2c2e] rounded"
            />
            <input
              type="number"
              placeholder="Min Seats"
              value={minSeats}
              onChange={(e) => setMinSeats(e.target.value)}
              className="w-full p-3 bg-[#1c1c1e] border border-[#2c2c2e] rounded"
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 bg-[#1c1c1e] border border-[#2c2c2e] rounded"
            />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] text-white py-3 mt-2 rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="w-full md:w-3/4 p-6">
        {filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredRides.map((ride) => (
              
              <div key={ride._id} className="bg-[#1c1c1e] p-6 rounded-lg shadow-md border border-[#2c2c2e]">
                
                <h1 className="text-lg font-bold text-white">{ride.driver?.name}</h1>
                <h2 className="text-md text-gray-300">
                  {ride.from} ➝ {ride.to}  
                </h2>
                <p className="text-sm text-gray-400">
                  Date: {new Date(ride.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  Seats Available: {ride.numberOfMembers}
                </p>
                <p className="font-bold text-[#4fd1c5]">₹{ride.price}</p>
                <ul className="text-sm text-gray-400">
                  {ride.passengers?.map((p) => (
                    <li key={p._id}>{p.name}</li>
                  ))}
                </ul>
                <Link to={`/ride/${ride._id}`}>
                  {/* <button className="mt-3 bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] text-white py-2 px-4 rounded-lg hover:opacity-90 transition">
                    View Details
                  </button> */}

                  <Buttons text="View Details" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg mt-6">
            Oops! No rides match your filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllRides;
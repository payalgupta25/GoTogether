import { useState, useEffect, useRef } from "react";
import React from "react";
import { CarFront } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import RateDriverModal from "./RateDriverModal.jsx";
import socket from "../socket.js";
import LiveRouteStatusBar from "./LiveRouteStatusBar.jsx";
import { UseScrollReveal } from "../hooks/UseScrollReveal.jsx";
import TextReveal from "../hooks/TextReveal.jsx";
import Buttons from "./Buttons.jsx";

const OngoingRidesSection = ({ user, rides = [], onRideCompleted }) => {

  const ridesRef = useRef(null);
  UseScrollReveal(ridesRef, { delay: 0.3 });

  const [showModal, setShowModal] = useState(false);
  const [rideToRate, setRideToRate] = useState(null);
  const [liveLocations, setLiveLocations] = useState({});
  const watchIdRef = useRef(null);

  // Define early so useEffects below can use it
  const isUserDriver = (ride) => ride.driver?._id === user?._id;

  // --- Driver: emit GPS location ---
  useEffect(() => {
    const driverRides = rides.filter((r) => isUserDriver(r));
    if (driverRides.length === 0) return;

    const rideId = driverRides[0]._id;
    socket.emit("joinRide", { rideId });

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          socket.emit("sendLocation", {
            rideId,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => console.warn("GPS error:", err.message),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      socket.emit("leaveRide", { rideId });
    };
  }, [rides]);

  // --- Passenger: listen for location updates ---
  useEffect(() => {
    const passengerRides = rides.filter((r) => !isUserDriver(r));
    if (passengerRides.length === 0) return;

    passengerRides.forEach((r) => socket.emit("joinRide", { rideId: r._id }));

    socket.on("locationUpdate", ({ rideId, lat, lon }) => {
      setLiveLocations((prev) => ({ ...prev, [rideId]: { lat, lon } }));
    });

    return () => {
      socket.off("locationUpdate");
      passengerRides.forEach((r) => socket.emit("leaveRide", { rideId: r._id }));
    };
  }, [rides]);

  // --- Check for pending ratings on mount ---
  useEffect(() => {
    const checkPendingRatings = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/rides/pending-ratings`,
          { withCredentials: true }
        );
        if (data.rides.length > 0) {
          setRideToRate(data.rides[0]);
          setShowModal(true);
        }
      } catch (err) {
        console.error("Error checking pending ratings", err);
      }
    };
    checkPendingRatings();
  }, []);

  const handleMarkAsComplete = async (ride) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/complete/${ride._id}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message || "Ride marked as completed");
        if (!isUserDriver(ride)) {
          setRideToRate(ride);
          setShowModal(true);
        } else {
          // Notify parent to refetch rides instead of hard reload
          onRideCompleted?.();
        }
      } else {
        toast.error(res.data.message || "Failed to complete ride.");
      }
    } catch (error) {
      toast.error("Error completing ride.");
      console.error("Ride completion error:", error);
    }
  };

  if (!rides || rides.length === 0) {
    return (
      <section className="py-12 bg-[#1c1c1e] px-6">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-white">
          Your Ongoing Rides
        </h2>
        <p className="text-center text-white">No active rides currently.</p>
      </section>
    );
  }

  return (
    <section ref={ridesRef} className="py-16 px-6 bg-[#1c1c1e]">
      <TextReveal
        text="Your Ongoing Rides"
        className="text-3xl font-extrabold text-center w-full text-white mb-10"
        delay={0.3}
      />
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {rides.map((ride, index) => {
          const isDriver = isUserDriver(ride);
          const liveLocation = liveLocations[ride._id];

          return (
            <motion.div
              key={ride._id}
              className="bg-[#232323] border border-gray-800 p-6 rounded-2xl shadow-xl relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute -top-6 -right-6">
                <motion.div
                  animate={{ x: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="text-[#2a7a73] opacity-30 rotate-12"
                >
                  <CarFront size={100} />
                </motion.div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-400 mb-2">
                  {isDriver ? "You're Hosting This Ride" : "You're a Passenger"}
                </h3>
                <p className="text-gray-200">
                  From: <span className="font-medium">{ride.from}</span>
                </p>
                <p className="text-gray-200">
                  To: <span className="font-medium">{ride.to}</span>
                </p>
                <p className="text-gray-200 text-sm mt-1">
                  {new Date(ride.date).toLocaleDateString()} @ {ride.time}
                </p>

                {isDriver && (
                  <Buttons
                    text="Mark as Complete"
                    onClick={() => handleMarkAsComplete(ride)}
                  />
                )}

                {/* Show live tracking for passengers when driver is broadcasting */}
                {!isDriver && liveLocation?.lat && (
                  <LiveRouteStatusBar
                    from={ride.from}
                    to={ride.to}
                    liveLat={liveLocation.lat}
                    liveLng={liveLocation.lon}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <RateDriverModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          onRideCompleted?.(); // Refetch from parent instead of hard reload
        }}
        ride={rideToRate}
      />
    </section>
  );
};

export default OngoingRidesSection;
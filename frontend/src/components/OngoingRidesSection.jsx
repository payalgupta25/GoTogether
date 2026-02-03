import { useState, useEffect } from "react";
import { CarFront } from "lucide-react";
import { useNavigate , useLocation} from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import RateDriverModal from "./RateDriverModal.jsx";
// import MapComponent from "./MapComponent.jsx"; // ✅ import your map
import socket from "../socket.js";
import LiveRouteStatusBar from "./LiveRouteStatusBar.jsx";
const OngoingRidesSection = ({ user, rides = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [rideToRate, setRideToRate] = useState(null);
  const [liveLocations, setLiveLocations] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

// useEffect(() => {
//   socket.on("locationUpdate", (data) => {
//     setLiveLocations(prev => ({
//       ...prev,
//       [data.rideId]: { lat: data.lat, lon: data.lon },
//     }));
//   });

//   return () => {
//     socket.off("locationUpdate");
//   };
// }, []);


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

useEffect(() => {
  checkPendingRatings(); // Call on mount
}, []);
  const handleMarkAsComplete = async (ride) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/complete/${ride._id}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message || "✅ Ride marked as completed");
        // fetchOngoingRides();
        // If user is a passenger, show rating modal
        if (!isUserDriver(ride)) {
          setRideToRate(ride);
          setShowModal(true);
        } else {
          // toast.success("✅ Ride completed!");
        //   fetchOngoingRides(); // Refresh list for driver too
        }

      } else {
        toast.error(res.data.message || "Failed to complete ride.");
      }
    } catch (error) {
      toast.error("❌ Error completing ride.");
      console.error("Ride completion error:", error);
    }
  };

  const isUserDriver = (ride) => ride.driver?._id === user?._id;

  if (!rides || rides.length === 0) {
    return (
      <section className="py-12 bg-[#1c1c1e] px-6">
        <h2 className="text-4xl font-extrabold text-center mb-6">Your Ongoing Rides</h2>
        <p className="text-center text-white">No active rides currently.</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-[#1c1c1e] ">
      <h2 className="text-3xl font-extrabold text-center text-white mb-10">Your Ongoing Rides</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {rides.map((ride, index) => {
          const isDriver = isUserDriver(ride);

          return (
            <motion.div
              key={index}
              className="bg-[#232323] border border-hray-950 p-6 rounded-2xl shadow-xl  relative overflow-hidden"
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
                  {isDriver ? "🚘 You’re Hosting This Ride" : "🧍 You’re a Passenger"}
                </h3>
                <p className="text-gray-200">
                  From: <span className="font-medium">{ride.from}</span>
                </p>
                <p className="text-gray-200">
                  To: <span className="font-medium">{ride.to}</span>
                </p>
                <p className="text-gray-200 text-sm mt-1">
                  Time: {new Date(ride.date).toLocaleDateString()} @ {ride.time}
                </p>

                {/* Mark as Complete (only for drivers) */}
                <button
                  onClick={() => handleMarkAsComplete(ride)}
                  className="mt-4 bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] text-white px-5 py-2 rounded-lg shadow-md transition"
                >
                  ✅ Mark as Complete
                </button>
                {/* {liveLocation.rideId === ride._id && liveLocation.lat && ( */}
                {liveLocations[ride._id]?.lat && (
                  <LiveRouteStatusBar
                    from={ride.from}
                    to={ride.to}
                    liveLat={liveLocations[ride._id].lat}
                    liveLng={liveLocations[ride._id].lon}
                  />
                )}

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rating Modal for Passenger */}
      <RateDriverModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          window.location.reload(); // refresh after rating
        }}
        ride={rideToRate}
      />
    </section>
  );
};

export default OngoingRidesSection;

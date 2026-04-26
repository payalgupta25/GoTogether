import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import OngoingRidesSection from "../components/OngoingRidesSection.jsx";
import useGeoLocation from "../hooks/useGeoLocation.js";
import TextReveal from "../hooks/TextReveal.jsx";
import { UseScrollReveal } from "../hooks/UseScrollReveal.jsx";
import Buttons from "../components/Buttons.jsx";

const API = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const featureRef = React.useRef(null);
  UseScrollReveal(featureRef);

  const [modal, setModal] = useState(false);
  const [ongoingRides, setOngoingRides] = useState([]);
  const [user, setUser] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { location, error } = useGeoLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("jwt");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(`${API}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/sos/contacts`, {
        withCredentials: true,
      });
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  // Lifted out of useEffect so it can be passed as onRideCompleted prop
  const fetchOngoingRides = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/rides/ongoing`, {
        withCredentials: true,
      });
      setOngoingRides(res.data.rides);
    } catch (error) {
      console.error("Error fetching ongoing rides:", error);
    }
  }, []);

  const sendSOS = async () => {
    if (!location?.latitude || !location?.longitude) {
      return toast.error(error || "Unable to fetch location.");
    }
    try {
      await axios.post(
        `${API}/api/sos/send-sos`,
        { latitude: location.latitude, longitude: location.longitude },
        { withCredentials: true }
      );
      toast.success("SOS Sent!");
    } catch (err) {
      console.error("Error sending SOS", err);
      toast.error("Failed to send SOS.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user?._id) fetchContacts();
  }, [user]);

  useEffect(() => {
    fetchOngoingRides();
  }, [fetchOngoingRides]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-sans">

      {/* Navbar */}
      <header className="w-full bg-black/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-6 py-4">
          <h1 className="text-3xl font-bold text-[#4fd1c5] tracking-wide">GoTogether</h1>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <img
              onClick={() => navigate("/profile")}
              src={user?.pfp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-cyan-500 hover:scale-105 transition-transform cursor-pointer"
            />
            <button
              onClick={() => setModal(true)}
              className="bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 px-4 py-2 rounded-md font-medium shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[85vh] flex items-center justify-center px-6 py-20"
        style={{ backgroundImage: `url('https://cdn.blablacar.com/k/a/images/hero_carpool-fe5c67bc8445ec79.png')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-6 bg-black/30 p-6 md:p-10 rounded-3xl shadow-lg border border-gray-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Share Rides. <br /> Save Time. <br /> Reduce Emissions.
            </h2>
            <p className="text-lg md:text-xl font-light text-gray-300">
              Your everyday travel companion — find rides or create your own with complete control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Buttons text="View Rides" onClick={() => navigate("/all-rides")} />
              <Buttons text="Create Ride" className="bg-transparent" onClick={() => navigate("/create-ride")} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featureRef} className="py-20 px-6 sm:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Affordable & Transparent",
              desc: "Split costs easily with passengers. Transparent ride pricing. No hidden charges.",
              img: "https://cdn-icons-png.flaticon.com/512/3343/3343387.png",
            },
            {
              title: "Safe & Verified Riders",
              desc: "Profile verification, ride history, and reviews help you trust who you travel with.",
              img: "https://png.pngtree.com/png-vector/20230523/ourmid/pngtree-verified-stamp-vector-png-image_7105265.png",
            },
            {
              title: "Quick & Easy Matching",
              desc: "Search, book or publish your ride within minutes. Real-time notifications included!",
              img: "https://cdn2.iconfinder.com/data/icons/ride/256/taxi_cab_transport_ride-512.png",
            },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-[#232323] rounded-xl shadow-md">
              <img src={feature.img} className="w-20 h-20 md:w-24 md:h-24 mb-4" alt={feature.title} />
              <h3 className="text-lg md:text-xl font-semibold text-[#4fd1c5] mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOS Section */}
      <section className="relative bg-[#232323] py-16 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              <TextReveal text="Emergency SOS" delay={0.2} />
            </h2>
            <p className="text-white/80 text-lg">
              <TextReveal
                text="If you feel unsafe during a ride, press the SOS button to notify your emergency contacts immediately."
                delay={0.4}
              />
            </p>
          </div>
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <button
              onClick={sendSOS}
              className="bg-red-600 hover:bg-red-700 text-white h-32 w-32 sm:h-36 sm:w-36 rounded-full text-3xl font-bold shadow-lg animate-pulse"
            >
              SOS
            </button>
          </div>
        </div>
      </section>

      {/* Ongoing Rides */}
      <OngoingRidesSection
        user={user}
        rides={ongoingRides}
        onRideCompleted={fetchOngoingRides}
      />

      {/* Logout Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4">
          <div className="bg-gray-900 text-white p-6 sm:p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
            <h2 className="text-2xl font-bold text-rose-400 mb-4">Logout</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4 sm:gap-6">
              <button
                onClick={() => setModal(false)}
                className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
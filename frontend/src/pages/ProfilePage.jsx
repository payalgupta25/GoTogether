import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Star,
  StarHalf,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Calendar,
  Clock4,
  Users,
  Car,
  Loader2,
} from "lucide-react";
import { TbMoodEdit } from "react-icons/tb";
import React from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [showEmergency, setShowEmergency] = useState(false);
  const [showRideHistory, setShowRideHistory] = useState(false);
  const [completedRides, setCompletedRides] = useState([]);
  const [expandedRideId, setExpandedRideId] = useState(null);
  const [carbonStats, setCarbonStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchCarbonStats();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchContacts();
      fetchCompletedRides();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });
      console.log("Data in ProfilePage:", data);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const fetchCarbonStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/carbon-stats`, {
        withCredentials: true,
      });
      setCarbonStats(data);
    } catch (error) {
      console.error("Error fetching carbon stats", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/sos/contacts`, {
        withCredentials: true,
      });
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  const fetchCompletedRides = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/completed`, {
        withCredentials: true,
      });
      setCompletedRides(data.rides || []);
    } catch (error) {
      console.error("Error fetching completed rides", error);
    }
  };

  const addEmergencyContact = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      return toast.error("Please enter a valid phone number");
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/sos/add-contact`,
        { phoneNumber },
        { withCredentials: true }
      );
      fetchContacts();
      toast.success("Contact added successfully");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error adding contact", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/sos/delete-contact/${id}`, {
        withCredentials: true,
      });
      fetchContacts();
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact", error);
    }
  };

  const sendSOS = async () => {
    const updateAndSend = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/sos/send-sos`,
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          { withCredentials: true }
        );
        toast.success("🚨 SOS Sent!");
      } catch (error) {
        console.error("Error sending SOS", error);
        toast.error("Failed to send SOS.");
      }
    };

    if (!location.latitude || !location.longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            console.log("pfp 508",pos);
            const newLoc = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            };
            
            setLocation(newLoc);
            await updateAndSend();
          },
          (err) => {
            console.error("Location error", err);
            toast.error("Location access denied.");
          }
        );
      } else {
        toast.error("Geolocation not supported.");
      }
    } else {
      await updateAndSend();
    }
  };

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        console.log("Current Location:", latitude, longitude);
        
        setLocation({ latitude, longitude });
        const link = `https://www.tomtom.com/mapshare/tools/?lat=${latitude}&lon=${longitude}&zoom=14`;
        
        navigator.clipboard.writeText(link)
          .then(() => toast.success("📍 Location link copied!"))
          .catch(() => toast.error("Failed to copy location link."));
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Location access denied or error.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds max wait
        maximumAge: 0,  // don't use cached location
      }
    );
  } else {
    toast.error("Geolocation is not supported by this browser.");
  }
};


  const toggleExpand = (rideId) => {
    setExpandedRideId(expandedRideId === rideId ? null : rideId);
  };

  const calculateCO2Saved = (ride) => {
    const distance = ride.distance || 0; // in km
    const passengers = ride.passengers?.length || 0;
    const saved = distance * (1 - 1 / (1 + passengers)) * 0.21;
    return saved.toFixed(2);
  };

  const fileInputRef = React.useRef(null);

const handlePfpChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("pfp", file); // Ye backend ke upload.single('pfp') se match kar raha hai
  setLoading(true);
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/pfp`, 
      formData,
      { 
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" } 
      }
    );
    
    // Yahan state update ho rahi hai
    setUser(prev => ({ ...prev, pfp: data.pfp })); 
    setLoading(false);
    toast.success("Uploaded!");
  } catch (error) {
    console.error("Error details:", error.response?.data);
    toast.error(error.response?.data?.message || "Upload failed");
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] flex items-center justify-center px-4 py-6">
    <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl shadow-2xl p-6 text-white transition-all duration-300">
      
      <button
        className="text-sm text-[#4fd1c5] hover:underline mb-4"
        onClick={() => navigate("/home")}
      >
        ← Back to Home
      </button>

      {user ? (
        <>
          <div className="flex items-center relative gap-4">
            <div className="relative">
              <img
                src={user.pfp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-gray-400"
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <Loader2 className="animate-spin text-white w-6 h-6" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-12 text-teal-400">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePfpChange}
                className="hidden"
              />
              <button type='button' onClick={() => fileInputRef.current.click()}> <TbMoodEdit /> </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                {user.isVerified && <CheckCircle size={18} className="text-green-400" />}
              </div>
              <p className="text-sm text-gray-300">{user.email}</p>
              <div className="flex items-center gap-1 text-yellow-400 mt-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const fullStars = Math.floor(user.averageRating);
                  const hasHalf = user.averageRating - fullStars >= 0.5;
                  if (i < fullStars) {
                    return <Star key={i} fill="currentColor" size={16} />;
                  } else if (i === fullStars && hasHalf) {
                    return <StarHalf key={i} fill="currentColor" size={16} />;
                  } else {
                    return <Star key={i} size={16} className="text-gray-400" />;
                  }
                })}
                <span className="text-sm text-gray-200 ml-2">
                  {user.averageRating || "0.0"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-[#4fd1c5] font-semibold">VEHICLE DETAILS</h3>
            <p className="text-gray-300">
              {user.vehicle.type}
              <span className="inline-block text-xs bg-white/30 text-gray-100 px-2 py-0.5 rounded ml-1">
                {user.vehicle.fuel}
              </span>
            </p>
            <p className="font-bold text-lg tracking-wide">{user.vehicle.numberPlate}</p>
          </div>

          <div className="mt-6 border-t border-white/20 pt-4">
            <h3 className="text-[#4fd1c5] font-bold text-lg mb-1">🌱 Carbon Footprint</h3>
            <p className="text-green-200 bg-green-900/30 px-3 py-2 rounded-md inline-block shadow-sm text-sm">
              {carbonStats ? `${carbonStats.carbonSaved} kg CO₂ saved by sharing rides 🚗` : "Loading..."}
            </p>
          </div>

          <div className="mt-6 border-t border-white/20 pt-4">
            <div
              onClick={() => setShowEmergency(!showEmergency)}
              className="flex justify-between items-center cursor-pointer mb-2"
            >
              <h3 className="text-[#4fd1c5] font-bold text-lg">Emergency Info</h3>
              {showEmergency ? <ChevronUp /> : <ChevronDown />}
            </div>

            {showEmergency && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Contacts:</p>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <div
                        key={contact._id}
                        className="flex justify-between items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded"
                      >
                        <span className="text-white">{contact.phoneNumber}</span>
                        <button
                          onClick={() => deleteContact(contact._id)}
                          className="text-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No contacts added.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Add Contact Number"
                    className="flex-1 p-2 bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 rounded"
                  />
                  <button
                    onClick={addEmergencyContact}
                    className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>

                <button onClick={getLocation} className="cursor-pointer w-full bg-yellow-400 hover:bg-yellow-600 text-white py-2 rounded">
                  Get Location
                </button>
                <button className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded" onClick={sendSOS}>
                  Send SOS
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-white/20 pt-4">
            <div
              onClick={() => setShowRideHistory(!showRideHistory)}
              className="flex justify-between items-center cursor-pointer mb-2"
            >
              <h3 className="text-[#4fd1c5] font-bold text-lg">Your Rides</h3>
              {showRideHistory ? <ChevronUp /> : <ChevronDown />}
            </div>

            {showRideHistory && (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {completedRides.length === 0 ? (
                  <p className="text-gray-400 text-sm">No rides completed yet.</p>
                ) : (
                  completedRides.map((ride) => (
                    <div
                      key={ride._id}
                      className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4 hover:shadow-lg transition-all"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleExpand(ride._id)}
                      >
                        <div>
                          <p className="font-semibold text-white">{ride.from} → {ride.to}</p>
                          <p className="text-sm text-gray-300 flex items-center gap-1">
                            <Calendar size={14} /> {new Date(ride.date).toLocaleDateString()}
                          </p>
                        </div>
                        {expandedRideId === ride._id ? <ChevronUp /> : <ChevronDown />}
                      </div>
                      {expandedRideId === ride._id && (
                        <div className="mt-3 space-y-2 text-sm text-gray-300 border-t border-white/10 pt-3">
                          <p className="flex items-center gap-2">
                            <Clock4 size={14} /> Time: <span className="font-medium text-white">{ride.time}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Users size={14} /> Passengers: {ride.passengers?.length || 0}
                          </p>
                          <p className="flex items-center gap-2">
                            <Car size={14} /> Driver: {ride.driver?.name}
                          </p>
                          <p className="flex items-center gap-2">
                            🌍 CO₂ Saved: 
                            <span className="font-medium text-green-300">
                              {calculateCO2Saved(ride)} kg
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  </div>
);


};

export default ProfilePage;

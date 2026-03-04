import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, MapPin, CalendarDays, Clock, Users, IndianRupee,
  Trash2, Pencil, ChevronDown, ChevronUp , ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import RideDetailsLoading from '../components/RideDetailsLoading';
import { motion } from 'framer-motion';
import Buttons from '../components/Buttons';

const Card = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editForm, setEditForm] = useState({
    from: "",
    to: "",
    numberOfMembers: "",
    date: "",
    time: "",
    price: ""
  });
  const openEditModal = () => {
  setEditForm({
    from: ride.from,
    to: ride.to,
    numberOfMembers: ride.numberOfMembers,
    date: ride.date?.substring(0, 10),
    time: ride.time || "",
    price: ride.price
  });
  setShowEditModal(true);
};

  const [showPassengers, setShowPassengers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/ride/${id}`, {
          withCredentials: true
        });
        setRide(response.data);
      } catch (error) {
        console.error("Error fetching ride:", error);
      }
    };
    fetchRide();
  }, [id]);

    useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );
        setCurrentUser(res.data);
      } catch (err) {
        console.error("User fetch error", err);
      }
    };

    fetchUser();
  }, []);

  const deleteRide = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/rides/delete/${id}`, {
        withCredentials: true
      });
      toast.success("Ride deleted successfully");
      navigate("/all-rides");
    } catch (error) {
      console.error("Error deleting ride:", error);
      return toast.error(error.response.data.message);
    } finally {
    setShowDeleteModal(false);
  }
  };

  if (!ride) return <RideDetailsLoading />;

  
  const dateObj = new Date(ride.date);
  const date = dateObj.toLocaleDateString();
  let time = ride.time;
  if (time) {
    // Convert "HH:mm" to 12-hour format with AM/PM
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    time = `${hour}:${minute} ${ampm}`;
  }

  const handleConfirmRide = async () => {
  try {
    setIsLoading(true);
    if (ride.womenOnly && currentUser?.gender !== "female") {
      toast.error("This ride is for women only 🚺");
      setIsLoading(false);
      return;
    }
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/rides/confirm/${id}`,
      {},
      { withCredentials: true }
    );
    setShowModal(false);
    setIsLoading(false);
    // Optional: refresh ride data to reflect updated passenger list
    const updated = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/ride/${id}`, {
      withCredentials: true
    });
    setRide(updated.data);
    return toast.success(res.data.message);
  } catch (error) {
    setIsLoading(false);
    return toast.error(error.response.data.message);
  }
};

const handleEditChange = (e) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const handleUpdateRide = async () => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/rides/update/${id}`,
      editForm,
      { withCredentials: true }
    );
    toast.success("Ride updated successfully");
    setRide(res.data);
    setShowEditModal(false);
  } catch (error) {
    console.error("Error updating ride:", error);
    toast.error(error.response?.data?.message || "Update failed");
  }
};

console.log("Time:",time);

console.log("driver",ride.driver.id);
console.log("user",currentUser.user._id);

return (
  <div className="text-white min-h-screen flex items-center justify-center bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] p-4 sm:p-8">
    
    
    <div className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-3xl relative">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <img
          src={ride.driver?.pfp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-black hover:border-gray-500 transition"
        />
        {/* <User className="text-[#4fd1c5] w-7 h-7" /> */}
        <h1 className="text-3xl font-bold text-gray-100 break-words">{ride.driver?.name}<span className='text-sm text-zinc-300 ml-2'>(Hostname)</span></h1>
      </div>

      {/* From → To and Stats */}
      {/* <div className="flex flex-col mt-12 sm:flex-row sm:justify-between sm:items-center gap-6 mb-6 bg-white/10 p-2 rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-gray-100 space-y-2 sm:space-y-0">
          
          <div className="flex items-center w-1/2 gap-2">
            <MapPin className="text-green-300 w-11 h-11" />
            <span className="font-semibold">From:</span> {ride.from}
          </div>
          
          <span className="hidden sm:inline text-gray-100 mx-4">→</span>
          
          <div className="flex items-center w-1/2  gap-2">
            <MapPin className="text-red-600 w-6 h-6" />
            <span className="font-semibold">To:</span> {ride.to}
          </div>
        
        </div>

        
      </div> */}
      {/* Route Section */}
          <div className="bg-white/5 relative hover:bg-white/10 rounded-3xl p-6 border border-white/5 mb-8">
            <div className="flex mb-6 flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1"></p>
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="text-emerald-400 font-extrabol animate-pulse w-9 h-9" />
                  <span className="text-lg font-medium text-gray-100 text-center">{ride.from}</span>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center  translate-y-1/2 justify-center w-12">
                <ArrowRight className="text-gray-200 w-6 h-6" />
              </div>

              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1"></p>
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="text-rose-700 animate-pulse h-9 w-9" />
                  <span className="text-lg font-medium text-gray-100 text-center">{ride.to}</span>
                </div>
              </div>
            </div>
            <motion.p 
              initial={{ x: "-10%" }}
              animate={{ x: "1500%" }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="text-2xl absolute bottom-2 opacity-40 select-none pointer-events-none"
            >
              <img className='w-10' src='https://res.cloudinary.com/dc8ryewn6/image/upload/v1770995069/vecteezy_vintage-car_1193929_toholp.png'/>
            </motion.p>
          </div>

      {ride.womenOnly && (
        <span className="inline-block mt-1 px-2 py-1 text-xs bg-pink-600 text-white rounded-full">
          🚺 Women Only
        </span>
      )}
      {/* Date and Time */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: CalendarDays, label: "Date", value: date, color: "text-blue-400", bg: "bg-blue-400/10" },
          { icon: Clock, label: "Time", value: time, color: "text-purple-400", bg: "bg-purple-400/10" },
          { icon: Users, label: "Seats", value: ride.numberOfMembers, color: "text-orange-400", bg: "bg-orange-400/10" },
          { icon: IndianRupee, label: "Price", value: `₹${ride.price}`, color: "text-[#4fd1c5]", bg: "bg-[#4fd1c5]/10" },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-2xl border border-white/5 ${item.bg} backdrop-blur-md`}>
            <item.icon className={`${item.color} w-5 h-5 mb-2`} />
            <p className="text-[10px] uppercase tracking-widest text-gray-700 font-bold">{item.label}</p>
            <p className="text-sm font-semibold text-white truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Passengers Section */}
      <div className="mt-6">
        <button
          onClick={() => setShowPassengers(!showPassengers)}
          className="flex items-center gap-2 text-[#4fd1c5] font-semibold hover:underline"
        >
          {showPassengers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          {showPassengers ? "Hide Passengers" : "Show Passengers"}
        </button>

        {showPassengers && (
          <div className="mt-4 space-y-3 max-h-64 overflow-auto bg-green-100/10 backdrop-blur-sm rounded-xl p-4 shadow-inner border border-green-200">
            {ride.passengers?.length ? (
              ride.passengers.map((p, index) => (
                <div
                  key={p._id || index}
                  className="flex items-center gap-3 bg-green-100 px-4 py-2 rounded-2xl max-w-xs w-fit"
                >
                  <User className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-600">{p.name}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-100">No passengers yet.</div>
            )}
          </div>
        )}
      </div>

      {/* Buttons Bottom Right */}
      <div className="mt-10 flex justify-end items-center gap-4 flex-wrap sm:absolute sm:bottom-6 sm:right-6">
        {ride.driver.id != currentUser.user._id && (
        <button
          // className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow text-sm sm:text-base"
          onClick={() => setShowModal(true)}
        >
          <Buttons text="Book Ride" className={"bg-blue-700"}/>
        </button>
          
        )}
        {(ride.driver.id === currentUser.user._id) && (
          <>
          <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full" title="Edit Ride" onClick={openEditModal}>
          <Pencil className="text-blue-600 w-5 h-5" />
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="p-2 bg-red-100 hover:bg-red-200 rounded-full" title="Delete Ride">
          <Trash2 className="text-red-600 w-5 h-5" />
        </button>
          </>
        )}
      </div>
    </div>

    {/* Book Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
          <h2 className="text-xl font-bold mb-4 text-center">Confirm Ride</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Driver:</strong> {ride.driver?.name}</p>
            <p><strong>Email:</strong> {ride.driver?.email || 'Not Provided'}</p>
            <p><strong>Seats Left:</strong> {ride.numberOfMembers}</p>
          </div>
          <div className="mt-6 flex justify-end gap-4 flex-wrap">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRide}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              {isLoading ? "Confirming..." : "Confirm Ride"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
          <h2 className="text-xl font-bold mb-4 text-center text-red-600">Confirm Delete</h2>
          <p className="text-center text-gray-700">Are you sure you want to delete this ride?</p>
          <div className="mt-6 flex justify-end gap-4 flex-wrap">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={deleteRide}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Modal */}
    {showEditModal && (
      <div className="fixed text-black inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
          <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Edit Ride</h2>
          <form className="grid gap-4">
            {[
              { name: "from", type: "text", placeholder: "From" },
              { name: "to", type: "text", placeholder: "To" },
              { name: "numberOfMembers", type: "number", placeholder: "Seats" },
              { name: "date", type: "date", placeholder: "Date" },
              { name: "time", type: "time", placeholder: "Time" },
              { name: "price", type: "number", placeholder: "Price (₹)" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={editForm[field.name]}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </form>
          <div className="mt-6 flex justify-end gap-4 flex-wrap">
            <button
              onClick={() => setShowEditModal(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateRide}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);


};



export default Card;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, MapPin, CalendarDays, Clock, Users, IndianRupee,
  Trash2, Pencil, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import RideDetailsLoading from '../components/RideDetailsLoading';

const Card = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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



return (
  <div className="text-white min-h-screen flex items-center justify-center bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] p-4 sm:p-8">
    <div className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-3xl relative">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <User className="text-[#4fd1c5] w-7 h-7" />
        <h1 className="text-3xl font-bold text-gray-100 break-words">{ride.driver?.name}</h1>
      </div>

      {/* From → To and Stats */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-gray-100 space-y-2 sm:space-y-0">
          <div className="flex items-center gap-2">
            <MapPin className="text-green-600 w-5 h-5" />
            <span className="font-semibold">From:</span> {ride.from}
          </div>
          <span className="hidden sm:inline text-gray-100">→</span>
          <div className="flex items-center gap-2">
            <MapPin className="text-red-600 w-5 h-5" />
            <span className="font-semibold">To:</span> {ride.to}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-gray-100">
          <div className="flex items-center gap-2">
            <Users className="text-[#4fd1c5] w-5 h-5" />
            <span><strong>Seats:</strong> {ride.numberOfMembers}</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="text-[#4fd1c5] w-5 h-5" />
            <span><strong>Price:</strong> ₹{ride.price}</span>
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-100">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-[#4fd1c5] w-5 h-5" />
          <span><strong>Date:</strong> {date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-[#4fd1c5] w-5 h-5" />
          <span><strong>Time:</strong> {time}</span>
        </div>
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
                  <span className="font-medium">{p.name}</span>
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
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow text-sm sm:text-base"
          onClick={() => setShowModal(true)}
        >
          Book Ride
        </button>
        <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full" title="Edit Ride" onClick={openEditModal}>
          <Pencil className="text-blue-600 w-5 h-5" />
        </button>
        <button onClick={() => setShowDeleteModal(true)} className="p-2 bg-red-100 hover:bg-red-200 rounded-full" title="Delete Ride">
          <Trash2 className="text-red-600 w-5 h-5" />
        </button>
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
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  MapPin,
  CalendarDays,
  Users,
  IndianRupee,
  Trash2,
  Pencil,
} from 'lucide-react';

const Card = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/ride/${id}`,{
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
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/rides/delete/${id}`);
      navigate("/all-rides"); // Redirect after deletion
      // console.log(res)
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  // const editRide = () => {
  //   navigate(`/edit/${id}`); // assuming edit route exists
  // };

  if (!ride) return <p className="text-center mt-10 text-gray-600 text-lg animate-pulse">Loading ride details...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="relative bg-white p-10 rounded-3xl shadow-2xl max-w-4xl w-full transition-all duration-300 hover:shadow-blue-200">
        <div className="flex items-center mb-8 space-x-4">
          <User className="text-blue-600 w-8 h-8" />
          <h1 className="text-3xl font-extrabold text-gray-800">{ride.driver?.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Ride Info */}
          <div className="space-y-5 text-gray-700">
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="text-blue-600 w-5 h-5" />
              <span><strong>From:</strong> {ride.from}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="text-blue-600 w-5 h-5" />
              <span><strong>To:</strong> {ride.to}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <CalendarDays className="text-blue-600 w-5 h-5" />
              <span><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Users className="text-blue-600 w-5 h-5" />
              <span><strong>Seats:</strong> {ride.numberOfMembers}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <IndianRupee className="text-blue-600 w-5 h-5" />
              <span><strong>Price:</strong> ₹{ride.price}</span>
            </div>
          </div>

          {/* Right: Passengers */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Passengers</h3>
            <ul className="list-disc ml-6 text-gray-600 text-base space-y-2">
              {ride.passengers?.length ? (
                ride.passengers.map((p) => (
                  <li key={p._id}>{p.name}</li>
                ))
              ) : (
                <li>No passengers yet.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom-right icons */}
        <div className="absolute bottom-6 right-6 flex gap-4">
          <button
            className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full"
            title="Edit Ride"
          >
            <Pencil className="text-blue-600 w-5 h-5" />
          </button>
          <button
            onClick={deleteRide}
            className="bg-red-100 hover:bg-red-200 p-2 rounded-full"
            title="Delete Ride"
          >
            <Trash2 className="text-red-600 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

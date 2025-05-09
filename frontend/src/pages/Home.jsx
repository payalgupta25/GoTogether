import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt'); // Check if the JWT token is available

  const handleLogout = async () => {
    try {
      // Make a request to the backend to clear the JWT cookie
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      
      // Clear the token from localStorage (if you're storing it there)
      localStorage.removeItem('jwt');
      
      // Redirect the user to the login page after logging out
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-900 p-6 relative">
      <div className="absolute flex flex-row top-4 right-4 cursor-pointer items-center">
        <img
          onClick={() => navigate("/profile")}
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-black hover:border-gray-500 transition"
        />
        {(
          // Render logout button if a token exists
          <button onClick={handleLogout} className="p-2 px-5 m-3 text-xl bg-red-500 text-white rounded-4xl">
            Logout
          </button>
        )}
      </div>
      <h1 className="text-4xl font-bold mb-4">CarPool</h1>
      <p className="text-lg text-center mb-6">Find and share rides easily and affordably.</p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/all-rides")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          View All Rides
        </button>
        <button
          onClick={() => navigate("/create-ride")}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition"
        >
          Create a Ride
        </button>
      </div>
    </div>
  );
};

export default Home;

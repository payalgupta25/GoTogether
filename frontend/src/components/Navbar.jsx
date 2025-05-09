import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Navbar() {

    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');

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
        <>
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
        </>
    )
}

export default Navbar

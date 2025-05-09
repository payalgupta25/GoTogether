import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = { name, email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        newUser
      );
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        navigate("/verifyEmail");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      return toast.error(error.response.data.error);
    }

    setEmail("");
    setName("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Join CarPool Today!</h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-900">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
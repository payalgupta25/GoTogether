import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import {toast} from 'react-hot-toast';

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        userData,{
          withCredentials: true
        }
      );
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        // localStorage.setItem("token", data.token);
        navigate("/home");
        return toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if(password.length < 8){
        return toast.error("Password must be at least 8 characters long");
      }else{

        return toast.error(error.message);
      }
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Welcome Back!</h2>
        <form onSubmit={submitHandler} className="space-y-4">
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
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-900">
          New here? <Link to="/signup" className="text-blue-600 font-bold">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
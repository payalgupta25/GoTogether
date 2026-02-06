import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility , setVisibility] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        userData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        navigate("/home");
        return toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (password.length < 8) {
        return toast.error("Password must be at least 8 characters long");
      } else {
        return toast.error("Login failed. Check your credentials.");
      }
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] px-4">
      <div className="w-full max-w-md bg-[#1c1c1e]/90 border border-[#2a2a2e] backdrop-blur-md rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-6">Welcome Back</h2>
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2e] border border-[#333] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a3f94]"
              placeholder="you@example.com"
            />

            
          </div>

          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <div className="flex justify-between w-full px-4 py-3 rounded-lg bg-[#2a2a2e] border border-[#333] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2a7a73]">
            <input
              type= {visibility ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="outline-none bg-transparent"
              placeholder="••••••••"
            />
            <FaRegEyeSlash size={22} onClick={()=>setVisibility(!visibility)}/>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          New here?{" "}
          <Link to="/signup" className="text-[#4fd1c5] font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;

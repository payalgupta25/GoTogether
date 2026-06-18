import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaRegEyeSlash } from "react-icons/fa";
import Buttons from "../components/Buttons";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [visibility , setVisibility] = useState(false);
  const [gender, setGender] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = { name, email, password, gender };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        newUser
      );
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        navigate("/verifyEmail");
        toast.success("Signup successful. Check your inbox.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      return toast.error(error?.response?.data?.error || "Signup failed");
    }

    setEmail("");
    setName("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] px-4">
      <div className="w-full max-w-md bg-[#1c1c1e]/90 border border-[#2a2a2e] backdrop-blur-md rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-6">Join GoTogether</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2e] border border-[#333] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a3f94]"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a2e] border border-[#333] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a3f94]"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
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

          {/* <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#3a3f94] to-[#2a7a73] text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Sign Up
          </button> */}
          <Buttons text="Sign Up" type="submit" className={'w-full'}/>
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4fd1c5] font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;

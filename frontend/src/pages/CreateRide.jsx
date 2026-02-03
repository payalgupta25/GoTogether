import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAutoCompleteSuggestions } from "../../../backend/controllers/maps.controller.js";

const CreateRide = () => {
  const navigate = useNavigate();
  const [rideDetails, setRideDetails] = useState({
    from: "",
    to: "",
    numberOfMembers: "",
    date: "",
    time: "",
    price: "",
  });

  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });

  const handleChange = (e) => {
    setRideDetails({ ...rideDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/create`,
        rideDetails,
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Ride created!");
        navigate("/all-rides");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleSuggestion = async (e) => {
    const { name, value } = e.target;
    setRideDetails({ ...rideDetails, [name]: value });

    if (value.length >= 3) {
      try {
        const result = await getAutoCompleteSuggestions(value);
        setSuggestions((prev) => ({ ...prev, [name]: result }));
      } catch (err) {
        console.error("Suggestion error:", err.message);
      }
    } else {
      setSuggestions((prev) => ({ ...prev, [name]: [] }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-3xl bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-lg border border-[#2a2a2a]">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Create a Ride</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "from", placeholder: "From", type: "text" },
            { name: "to", placeholder: "To", type: "text" },
            { name: "numberOfMembers", placeholder: "No. of Members", type: "number" },
            { name: "date", placeholder: "Date", type: "date" },
            { name: "time", placeholder: "Time", type: "time" },
            { name: "price", placeholder: "Price (₹)", type: "number" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={rideDetails[field.name]}
                onChange={
                  field.name === "from" || field.name === "to"
                    ? handleSuggestion
                    : handleChange
                }
                required
                className="w-full p-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {["from", "to"].includes(field.name) &&
                suggestions[field.name]?.length > 0 && (
                  <ul className="absolute z-10 w-full bg-[#2a2a2a] text-white border border-[#333] rounded shadow max-h-40 overflow-y-auto mt-1">
                    {suggestions[field.name].map((s, i) => (
                      <li
                        key={i}
                        className="px-3 py-2 hover:bg-blue-600 cursor-pointer"
                        onClick={() => {
                          setRideDetails((prev) => ({
                            ...prev,
                            [field.name]: s,
                          }));
                          setSuggestions((prev) => ({
                            ...prev,
                            [field.name]: [],
                          }));
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))}

          <button
            type="submit"
            className="sm:col-span-2 w-full bg-gradient-to-r from-indigo-500 to-teal-400 hover:opacity-90 text-white py-3 rounded-md font-semibold transition duration-200"
          >
            Create Ride
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;

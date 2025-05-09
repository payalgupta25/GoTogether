import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CreateRide = () => {
  const navigate = useNavigate();
  const [rideDetails, setRideDetails] = useState({
    from: "",
    to: "",
    vehicle: "",
    numberPlate: "",
    numberOfMembers: "",
    date: "",
    time: "",
    price: "",
    fuelType: "Petrol",
  });

  const [error, setError] = useState("");

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
        {
          withCredentials: true,
        }
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

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full h-full rounded-none shadow-none p-6 sm:rounded-xl sm:shadow-md sm:max-w-4xl">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          Create a Ride
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "from", placeholder: "From", type: "text" },
            { name: "to", placeholder: "To", type: "text" },
            { name: "vehicle", placeholder: "Vehicle", type: "text" },
            { name: "numberPlate", placeholder: "Number Plate", type: "text" },
            {
              name: "numberOfMembers",
              placeholder: "No. of Members",
              type: "number",
            },
            { name: "date", placeholder: "Date", type: "date" },
            { name: "time", placeholder: "Time", type: "time" },
            { name: "price", placeholder: "Price (₹)", type: "number" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={rideDetails[field.name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <select
            name="fuelType"
            value={rideDetails.fuelType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>

          <button
            type="submit"
            className="sm:col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            Create Ride
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;

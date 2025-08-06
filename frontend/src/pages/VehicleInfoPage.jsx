import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const VehicleInfoPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    numberPlate: "",
    vehicleType: "Car",
    fuelType: "Petrol",
  });

  const [loading, setLoading] = useState(false);

  const vehicleTypes = ["Car", "Bike", "Two-Wheeler", "EV-Car", "EV-Bike"];
  const fuelTypes = ["Petrol", "Diesel", "Electric"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/vehicleInfo", form);
      if (res.data.success) {
        toast.success("Vehicle info saved!");
        navigate("/home");
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-bold text-center mb-6">Enter Vehicle Info</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="numberPlate"
            placeholder="Number Plate"
            value={form.numberPlate}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-teal-400 text-white py-2.5 rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleInfoPage;

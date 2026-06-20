import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MailCheck, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(import.meta.env.VITE_BASE_URL);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/verifyEmail`, { code });
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => navigate("/vehicle-info"), 2000);
      } else {
        toast.error("Invalid verification code.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-lg border border-[#2a2a2a]">
        <div className="flex justify-center mb-5">
          <MailCheck className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Verify Your Email</h2>
        <p className="text-sm text-center text-gray-400 mb-6">Enter the code sent to your email</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="6-digit Code"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-teal-400 text-white py-2.5 rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin w-5 h-5" />}
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;

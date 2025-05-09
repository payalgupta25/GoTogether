import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verifyEmail", { code });
      if (res.data.success) {
        setMessage(res.data.message);
        setTimeout(() => navigate("/home"), 2000); // Redirect to home after 2 sec
        return toast.success(res.data.message);
      } else {
        // setMessage(res.data.message);
        return toast.error("Invalid verification code.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    //    toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Verify Your Email</h2>
        <form onSubmit={handleVerify} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
        {/* {message && <p className="text-center text-red-500 mt-2">{message}</p>} */}
      </div>
    </div>
  );
};

export default VerifyEmail;

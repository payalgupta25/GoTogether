import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const RateDriverModal = ({ isOpen, onClose, ride }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/rate/${ride._id}`,
        { score: rating },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rate driver.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <Dialog.Panel className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        <Dialog.Title className="text-lg font-semibold mb-4">Rate Your Ride with {ride?.driver?.name}</Dialog.Title>
        
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={30}
              className={`cursor-pointer transition ${
                (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star)}
              fill={(hover || rating) >= star ? "currentColor" : "none"}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 text-sm border rounded hover:bg-gray-100">Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={rating === 0}
          >
            Submit
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default RateDriverModal;

// components/RideDetailsLoading.jsx
import { CarFront } from "lucide-react";
import { motion } from "framer-motion";

const RideDetailsLoading = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-lg p-6 shadow-md animate-pulse">
      <motion.div
        animate={{ x: [0, 20, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-blue-600 mb-6"
      >
        <CarFront size={60} strokeWidth={2.5} />
      </motion.div>

      <div className="space-y-4 w-full max-w-xl">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-5 w-full bg-gray-200 rounded-md" />
        ))}
        <div className="h-12 w-40 bg-blue-300 rounded-lg mt-4" />
      </div>
    </div>
  );
};

export default RideDetailsLoading;

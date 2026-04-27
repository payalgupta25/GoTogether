// src/components/LiveRouteStatusBar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getDistance } from "geolib";
import LiveMap from "./LiveMap.jsx";

const LiveRouteStatusBar = ({ from, to, liveLat, liveLng }) => {
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [progress, setProgress] = useState(0);
  const [distanceLeft, setDistanceLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!from || !to) return;

    const fetchCoords = async () => {
      try {
        const [fromRes, toRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/coordinates`, {
            params: { place: from },
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/coordinates`, {
            params: { place: to },
            withCredentials: true,
          }),
        ]);
        setFromCoords(fromRes.data);  // expects { lat, lon }
        setToCoords(toRes.data);
      } catch (err) {
        console.error("Failed to get coords", err);
      }
    };

    fetchCoords();
  }, [from, to]);

  useEffect(() => {
    if (!fromCoords || !toCoords || !liveLat || !liveLng) return;

    // geolib expects { latitude, longitude } — not lat/lon or lat/lng
    const totalDistance = getDistance(
      { latitude: fromCoords.lat, longitude: fromCoords.lon },
      { latitude: toCoords.lat, longitude: toCoords.lon }
    );
    const remaining = getDistance(
      { latitude: liveLat, longitude: liveLng },
      { latitude: toCoords.lat, longitude: toCoords.lon }
    );

    const percent = Math.min(100, 100 - (remaining / totalDistance) * 100);
    setDistanceLeft((remaining / 1000).toFixed(2));
    setTimeLeft(Math.round((remaining / 1000) / 40 * 60));
    setProgress(percent);
  }, [fromCoords, toCoords, liveLat, liveLng]);

  // Progress bar section in LiveRouteStatusBar.jsx — replace the existing return
return (
  <div className="w-full bg-[#1a1a1a] border border-gray-700 p-4 rounded-xl mt-4">
    
    {/* Stats row */}
    <div className="flex justify-between text-sm text-gray-300 mb-3">
      <span>
        <span className="text-white font-medium">{distanceLeft} km</span> remaining
      </span>
      <span>
        ETA <span className="text-white font-medium">{timeLeft} min</span>
      </span>
    </div>

    {/* Progress bar */}
    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-visible mb-1">
      {/* Filled portion */}
      <div
        className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
      {/* Car icon on top */}
      <div
        className="absolute top-1/2 text-base leading-none"
        style={{
          left: `${progress}%`,
          transform: "translate(-50%, -50%)",
          transition: "left 1s ease",
          fontSize: "16px",
        }}
      >
        🚗
      </div>
    </div>

    {/* From / To labels */}
    <div className="flex justify-between text-xs text-gray-500 mt-2 mb-2">
      <span>Pickup</span>
      <span>Drop-off</span>
    </div>

    {/* Map */}
    {fromCoords && toCoords && (
      <LiveMap
        fromCoords={{ lat: fromCoords.lat, lng: fromCoords.lon }}
        toCoords={{ lat: toCoords.lat, lng: toCoords.lon }}
        liveLat={liveLat}
        liveLng={liveLng}
      />
    )}
  </div>
);
};

export default LiveRouteStatusBar;
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

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg shadow">
      <div className="text-sm text-gray-700 mb-2">
        <strong>Distance left:</strong> {distanceLeft} km |{" "}
        <strong>ETA:</strong> {timeLeft} min
      </div>

      <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 text-base leading-none"
          style={{
            left: `${progress}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 1s ease",
          }}
        >
          🚗
        </div>
      </div>

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
import React, { useEffect, useState } from "react";
import { getCoordinates } from "../../../backend/utils/getCoordinates.js";
import { getDistance } from "geolib";
import LiveMap from "./LiveMap.jsx"; // ✅

const LiveRouteStatusBar = ({ from, to, liveLat, liveLng }) => {
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [progress, setProgress] = useState(0);
  const [distanceLeft, setDistanceLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await getCoordinates(from, to);
        setFromCoords(res.from);
        setToCoords(res.to);
      } catch (err) {
        console.error("Failed to get coords", err);
      }
    };
    fetchCoords();
  }, [from, to]);

  useEffect(() => {
    if (!fromCoords || !toCoords || !liveLat || !liveLng) return;

    const totalDistance = getDistance(fromCoords, toCoords);
    const remaining = getDistance({ lat: liveLat, lng: liveLng }, toCoords);
    const percent = Math.min(100, 100 - (remaining / totalDistance) * 100);

    setDistanceLeft((remaining / 1000).toFixed(2));
    setTimeLeft(Math.round((remaining / 1000) / 40 * 60));
    setProgress(percent);
  }, [fromCoords, toCoords, liveLat, liveLng]);

  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg shadow">
      <div className="text-sm text-gray-700 mb-2">
        <strong>Distance left:</strong> {distanceLeft} km | <strong>ETA:</strong> {timeLeft} min
      </div>

      <div className="relative w-full h-4 bg-gray-300 rounded-full">
        <div
          className="absolute top-0 transform -translate-y-1/2"
          style={{
            left: `${progress}%`,
            transition: "left 1s ease",
          }}
        >
          🚗
        </div>
      </div>

      {fromCoords && toCoords && (
        <LiveMap
          fromCoords={fromCoords}
          toCoords={toCoords}
          liveLat={liveLat}
          liveLng={liveLng}
        />
      )}
    </div>
  );
};

export default LiveRouteStatusBar;

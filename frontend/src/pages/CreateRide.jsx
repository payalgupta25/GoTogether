import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import tt from "@tomtom-international/web-sdk-maps";
import debounce from "lodash.debounce";
import Buttons from "../components/Buttons.jsx";

const API = import.meta.env.VITE_BASE_URL;
const TOMTOM_KEY = "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF";

const CreateRide = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [rideDetails, setRideDetails] = useState({
    from: "", to: "", numberOfMembers: "",
    date: "", time: "", price: "",
    womenOnly: false, duration: "", distance: "",
  });

  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState("");

  // Get user's location once on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.error("Location permission denied:", err)
    );
  }, []);

  // Fetch autocomplete suggestions from backend (not directly from TomTom)
  const debouncedSuggestions = useMemo(
    () =>
      debounce(async (value, fieldName) => {
        try {
          const res = await axios.get(`${API}/api/maps/get-suggestions`, {
            params: { input: value, lat: userLocation.lat, lon: userLocation.lon },
            withCredentials: true,
          });
          setSuggestions((prev) => ({ ...prev, [fieldName]: res.data }));
        } catch (err) {
          console.error("Suggestion error:", err);
        }
      }, 500),
    [userLocation]
  );

  useEffect(() => {
    return () => debouncedSuggestions.cancel();
  }, [debouncedSuggestions]);

  // Fetch coords via backend, then draw route with TomTom directly
  const showRouteOnMap = useCallback(async (fromPlace, toPlace) => {
    try {
      const [fromRes, toRes] = await Promise.all([
        axios.get(`${API}/api/maps/coordinates`, {
          params: { place: fromPlace }, withCredentials: true,
        }),
        axios.get(`${API}/api/maps/coordinates`, {
          params: { place: toPlace }, withCredentials: true,
        }),
      ]);

      const fromCoords = fromRes.data; // { lat, lon }
      const toCoords = toRes.data;

      const routeRes = await axios.get(
        `https://api.tomtom.com/routing/1/calculateRoute/` +
        `${fromCoords.lat},${fromCoords.lon}:${toCoords.lat},${toCoords.lon}` +
        `/json?key=${TOMTOM_KEY}`
      );

      const route = routeRes.data.routes[0];
      const distanceKm = (route.summary.lengthInMeters / 1000).toFixed(2);
      const timeMin = Math.ceil(route.summary.travelTimeInSeconds / 60);

      setRideDetails((prev) => ({ ...prev, distance: distanceKm, duration: timeMin }));

      // Destroy old map instance before creating new one
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = tt.map({
        key: TOMTOM_KEY,
        container: "map",
        center: [fromCoords.lon, fromCoords.lat],
        zoom: 10,
      });
      mapRef.current = map;

      new tt.Marker().setLngLat([fromCoords.lon, fromCoords.lat]).addTo(map);
      new tt.Marker({ color: "red" }).setLngLat([toCoords.lon, toCoords.lat]).addTo(map);

      const routeGeoJson = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route.legs[0].points.map((p) => [p.longitude, p.latitude]),
        },
      };

      map.on("load", () => {
        map.addSource("route", { type: "geojson", data: routeGeoJson });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: { "line-color": "#4F46E5", "line-width": 5 },
        });
      });
    } catch (err) {
      console.error("Route error:", err);
      toast.error("Could not calculate route. Try again.");
    }
  }, []);

  // Debounced route drawing
  const debouncedRoute = useMemo(
    () => debounce((from, to) => showRouteOnMap(from, to), 800),
    [showRouteOnMap]
  );

  useEffect(() => {
    if (rideDetails.from && rideDetails.to) {
      debouncedRoute(rideDetails.from, rideDetails.to);
    }
    return () => debouncedRoute.cancel();
  }, [rideDetails.from, rideDetails.to, debouncedRoute]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setRideDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSuggestion = (e) => {
    const { name, value } = e.target;
    if (name === "from") setFromInput(value);
    if (name === "to") setToInput(value);

    if (!userLocation.lat || !userLocation.lon) return;

    if (value.length >= 3) {
      debouncedSuggestions(value, name);
    } else {
      setSuggestions((prev) => ({ ...prev, [name]: [] }));
    }
  };

  const handleSelectSuggestion = (fieldName, value) => {
    setRideDetails((prev) => ({ ...prev, [fieldName]: value }));
    if (fieldName === "from") setFromInput(value);
    if (fieldName === "to") setToInput(value);
    setSuggestions((prev) => ({ ...prev, [fieldName]: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${API}/api/rides/create`,
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

  const fields = [
    { name: "from", placeholder: "From", type: "text" },
    { name: "to", placeholder: "To", type: "text" },
    { name: "numberOfMembers", placeholder: "No. of Members", type: "number" },
    { name: "date", placeholder: "Date", type: "date" },
    { name: "time", placeholder: "Time", type: "time" },
    { name: "price", placeholder: "Price (₹)", type: "number" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-3xl bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-lg border border-[#2a2a2a]">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Create a Ride</h2>

        {rideDetails.from && rideDetails.to && (
          <div className="mt-6 mb-6">
            <div id="map" className="w-full h-[400px] rounded-xl" />
            <div className="mt-3 bg-[#111] p-3 rounded-lg text-sm text-gray-300">
              <p>Distance: <span className="text-white font-medium">{rideDetails.distance} km</span></p>
              <p>Estimated Time: <span className="text-white font-medium">{rideDetails.duration} mins</span></p>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              name="womenOnly"
              checked={rideDetails.womenOnly}
              onChange={(e) => setRideDetails((prev) => ({ ...prev, womenOnly: e.target.checked }))}
            />
            <label>Women Only Ride</label>
          </div>

          {fields.map((field) => (
            <div key={field.name} className="relative">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={
                  field.name === "from" ? fromInput :
                  field.name === "to" ? toInput :
                  rideDetails[field.name]
                }
                onChange={
                  field.name === "from" || field.name === "to"
                    ? handleSuggestion
                    : handleChange
                }
                required
                className="w-full p-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {["from", "to"].includes(field.name) && suggestions[field.name]?.length > 0 && (
                <ul className="absolute z-10 w-full bg-[#2a2a2a] text-white border border-[#333] rounded shadow max-h-40 overflow-y-auto mt-1">
                  {suggestions[field.name].map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleSelectSuggestion(field.name, s)}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="sm:col-span-2">
            <Buttons text="Create Ride" type="submit" className="w-full" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;
import { useState, useEffect , useCallback} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAutoCompleteSuggestions , getCoordinates} from "../../../backend/controllers/maps.controller.js";
import tt from "@tomtom-international/web-sdk-maps";
import { useRef } from "react";
import debounce from "lodash.debounce";
import { useMemo } from "react";
import Buttons from "../components/Buttons.jsx";

const CreateRide = () => {
  const navigate = useNavigate();
  const [rideDetails, setRideDetails] = useState({
    from: "",
    to: "",
    numberOfMembers: "",
    date: "",
    time: "",
    price: "",
    womenOnly: false,
    duration: "",
    distance: "",
  });

  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [userLocation, setUserLocation] = useState({lat: null, lon: null});
  const mapRef = useRef(null);

  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  const debouncedRoute = useMemo(
    () =>
      debounce((from, to) => {
        showRouteOnMap(from, to);
      }, 800),   // wait 800ms
    []
  );

  
  
  const debouncedSuggestions = useMemo(
    () =>
      debounce(async (value, fieldName) => {
        try {
          const res = await getAutoCompleteSuggestions(
            value,
            userLocation?.lat,
            userLocation?.lon
          );
          
          setSuggestions((prev) => ({
            ...prev,
            [fieldName]: res,
          }));
        } catch (err) {
          console.error("Suggestion error:", err);
        }
      }, 500),
      [userLocation]
    );
    
    
    useEffect(() => {
      return () => {
        debouncedSuggestions.cancel();
      };
    }, [debouncedSuggestions]);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Location permission denied:", err);
      }
    );
  }, []);

  useEffect(() => {
    if (rideDetails.from && rideDetails.to) {
      debouncedRoute(rideDetails.from, rideDetails.to);
    }
  
    return () => {
      debouncedRoute.cancel();
    };
  }, [rideDetails.from, rideDetails.to, debouncedRoute]);

  const handleChange = (e) => {
    setRideDetails({ ...rideDetails, [e.target.name]: e.target.value });
  };

  const showRouteOnMap = async (fromPlace, toPlace) => {
  try {
    // 1. Get coordinates
    const fromCoords = await getCoordinates(fromPlace);
    const toCoords = await getCoordinates(toPlace);

    const apiKey = "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF";

    // 2. Routing API
    const routeRes = await axios.get(
      `https://api.tomtom.com/routing/1/calculateRoute/` +
      `${fromCoords.lat},${fromCoords.lon}:` +
      `${toCoords.lat},${toCoords.lon}/json?key=${apiKey}`
    );

    const route = routeRes.data.routes[0];

    const distanceKm = (route.summary.lengthInMeters / 1000).toFixed(2);
    const timeMin = Math.ceil(route.summary.travelTimeInSeconds / 60);

    setRideDetails((prev) => ({
      ...prev,
      distance: distanceKm,
      duration: timeMin,
    }));

    // 3. Create Map
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = tt.map({
      key: apiKey,
      container: "map",
      center: [fromCoords.lon, fromCoords.lat],
      zoom: 10,
    });

    mapRef.current = map;

    // 4. Markers
    new tt.Marker().setLngLat([fromCoords.lon, fromCoords.lat]).addTo(map);
    new tt.Marker({ color: "red" })
      .setLngLat([toCoords.lon, toCoords.lat])
      .addTo(map);

    // 5. Draw Route
    const geoJson = routeRes.data.routes[0].legs[0].points;

    const routeGeoJson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: geoJson.map((p) => [p.longitude, p.latitude]),
      },
    };

    map.on("load", () => {
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: routeGeoJson,
        },
        paint: {
          "line-color": "#4F46E5",
          "line-width": 5,
        },
      });
    });
  } catch (err) {
    console.error("Route error:", err);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/create`,
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

  const handleSuggestion = async (e) => {
    const { name, value } = e.target;
    // setRideDetails({ ...rideDetails, [name]: value });

    if (name === "from") setFromInput(value);
    if (name === "to") setToInput(value);

    if (!userLocation.lat || !userLocation.lon) return;

    if (value.length >= 3) {
      debouncedSuggestions(value, name);
    } else {
      setSuggestions((prev) => ({ ...prev, [name]: [] }));
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-3xl bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-lg border border-[#2a2a2a]">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Create a Ride</h2>
{rideDetails.from && rideDetails.to && (
  <div className="mt-6">

    {/* Map */}
    <div
      id="map"
      className="w-full h-[400px] rounded-xl"
    ></div>

    {/* Distance + Time */}
    <div className="mt-3 bg-[#111] p-3 rounded-lg text-sm">
      <p>Distance: {rideDetails.distance} km</p>
      <p>Estimated Time: {rideDetails.duration} mins</p>
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
              onChange={(e) =>
                setRideDetails({
                  ...rideDetails,
                  womenOnly: e.target.checked,
                })
              }
            />
            <label>Women Only Ride</label>
          </div>

          {[
            { name: "from", placeholder: "From", type: "text" },
            { name: "to", placeholder: "To", type: "text" },
            { name: "numberOfMembers", placeholder: "No. of Members", type: "number" },
            { name: "date", placeholder: "Date", type: "date" },
            { name: "time", placeholder: "Time", type: "time" },
            { name: "price", placeholder: "Price (₹)", type: "number" },
          ].map((field) => (
            
            <div key={field.name} className="relative">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                  value={
                    field.name === "from"
                      ? fromInput
                      : field.name === "to"
                      ? toInput
                      : rideDetails[field.name]
                  }

                  onChange={
                    field.name === "from" || field.name === "to"
                      ? handleSuggestion
                      : handleChange
                  }
                required
                className="w-full p-3 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {["from", "to"].includes(field.name) &&
                suggestions[field.name]?.length > 0 && (
                  <ul className="absolute z-10 w-full bg-[#2a2a2a] text-white border border-[#333] rounded shadow max-h-40 overflow-y-auto mt-1">
                    {suggestions[field.name].map((s, i) => (
                      <li
                        key={i}
                        className="px-3 py-2 hover:bg-blue-600 cursor-pointer"
                        onClick={() => {
                          setRideDetails((prev) => ({
                            ...prev,
                            [field.name]: s,   // FINAL selected place
                          }));
                        
                          if (field.name === "from") setFromInput(s);
                          if (field.name === "to") setToInput(s);
                        
                          setSuggestions((prev) => ({
                            ...prev,
                            [field.name]: [],
                          }));
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                
            </div>
            
          ))}

          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ffffff] rounded-full mix-blend-overlay filter blur-[128px] opacity-10 animate-ping"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0f0502] to-transparent"></div>
          </div>

          {/* <button
            type="submit"
            className="sm:col-span-2 w-full bg-gradient-to-r from-indigo-500 to-teal-400 hover:opacity-90 text-white py-3 rounded-md font-semibold transition duration-200"
          >
            Create Ride
          </button> */}
          <div className="sm:col-span-2">
            <Buttons text="Create Ride" type="submit" className={"w-full "} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;

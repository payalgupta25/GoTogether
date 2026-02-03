import { useState, useEffect } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation({
        loaded: true,
        coordinates: { lat: "", lng: "" },
        error: {
          code: 0,
          message: "Geolocation not supported",
        },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          loaded: true,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        setLocation({
          loaded: true,
          coordinates: { lat: "", lng: "" },
          error,
        });
      }
    );
  }, []);

  return location;
};

export default useGeoLocation;

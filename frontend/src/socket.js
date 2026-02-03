import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

// Geolocation tracking (optional - only when needed)
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", {
        rideId: "6892f6d5101ee528c51af9e0", // dynamically insert this
        lat: latitude,
        lon: longitude,
      });
    },
    (error) => console.warn("Location error (non-critical):", error.message),
    { enableHighAccuracy: true, maximumAge: 5000 }
  );
}

export default socket;
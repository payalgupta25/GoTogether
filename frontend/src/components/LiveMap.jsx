import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const LiveMap = ({ fromCoords, toCoords, liveLat, liveLng }) => {
  const mapRef = useRef(null);
  const routingRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!fromCoords || !toCoords) return;

    if (mapRef.current) return;

    const map = L.map("map").setView([fromCoords.lat, fromCoords.lng], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(fromCoords.lat, fromCoords.lng),
        L.latLng(toCoords.lat, toCoords.lng),
      ],
      routeWhileDragging: false,
      createMarker: () => null,
    }).addTo(map);

    markerRef.current = L.marker([liveLat, liveLng]).addTo(map);
  }, [fromCoords, toCoords]);

  useEffect(() => {
    if (markerRef.current && liveLat && liveLng) {
      markerRef.current.setLatLng([liveLat, liveLng]);
      mapRef.current.setView([liveLat, liveLng]);
    }
  }, [liveLat, liveLng]);

  return <div id="map" className="w-full h-64 rounded-lg mt-4 z-0" />;
};

export default LiveMap;

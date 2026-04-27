// src/components/LiveMap.jsx
import React, { useEffect, useRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import axios from "axios";

const TOMTOM_KEY = "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF";

const LiveMap = ({ fromCoords, toCoords, liveLat, liveLng }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const routeDrawn = useRef(false);

  // Initialize map and draw route once
  useEffect(() => {
    if (!fromCoords || !toCoords) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = tt.map({
      key: TOMTOM_KEY,
      container: mapRef.current,
      center: [fromCoords.lng, fromCoords.lat],
      zoom: 12,
      // style: "tomtom://vector/1/basic-night",
    });

    mapInstanceRef.current = map;

    // From marker — green
    new tt.Marker({ color: "#22c55e" })
      .setLngLat([fromCoords.lng, fromCoords.lat])
      .setPopup(new tt.Popup({ offset: 30 }).setHTML("<p style='color:#000;font-size:12px;margin:0'>Pickup</p>"))
      .addTo(map);

    // To marker — red
    new tt.Marker({ color: "#ef4444" })
      .setLngLat([toCoords.lng, toCoords.lat])
      .setPopup(new tt.Popup({ offset: 30 }).setHTML("<p style='color:#000;font-size:12px;margin:0'>Drop-off</p>"))
      .addTo(map);

    // Live driver marker — blue pulsing dot
    const el = document.createElement("div");
    el.style.cssText = `
      width: 18px; height: 18px;
      background: #3b82f6;
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
      animation: pulse 1.5s ease-in-out infinite;
    `;
    const style = document.createElement("style");
    style.textContent = `@keyframes pulse { 0%,100%{box-shadow:0 0 0 4px rgba(59,130,246,0.3)} 50%{box-shadow:0 0 0 8px rgba(59,130,246,0.1)} }`;
    document.head.appendChild(style);

    markerRef.current = new tt.Marker({ element: el })
      .setLngLat([liveLng ?? fromCoords.lng, liveLat ?? fromCoords.lat])
      .addTo(map);


      map.once("load", async () => {
  try {
    const res = await axios.get(
      `https://api.tomtom.com/routing/1/calculateRoute/` +
      `${fromCoords.lat},${fromCoords.lng}:${toCoords.lat},${toCoords.lng}/json` +
      `?key=${TOMTOM_KEY}&traffic=true&travelMode=car`
    );

    const points = res.data.routes[0].legs[0].points;
    const coordinates = points.map((p) => [p.longitude, p.latitude]);

    map.addSource("route-source", {
      type: "geojson",
      data: { type: "Feature", geometry: { type: "LineString", coordinates } },
    });

    map.addLayer({
      id: "route-glow",
      type: "line",
      source: "route-source",
      paint: {
        "line-color": "#3b82f6",
        "line-width": 10,
        "line-opacity": 0.3,
      },
    });

    map.addLayer({
      id: "route-main",
      type: "line",
      source: "route-source",
      paint: {
        "line-color": "#3b82f6",
        "line-width": 4,
        "line-cap": "round",
        "line-join": "round",
      },
    });

    const bounds = coordinates.reduce(
      (b, coord) => b.extend(coord),
      new tt.LngLatBounds(coordinates[0], coordinates[0])
    );
    map.fitBounds(bounds, { padding: 60, maxZoom: 14 });

  } catch (err) {
    console.error("Route drawing failed:", err);
  }
});

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      routeDrawn.current = false;
    };
  }, [fromCoords, toCoords]);

  // Update live driver marker position smoothly
  useEffect(() => {
    if (!markerRef.current || !liveLat || !liveLng) return;
    markerRef.current.setLngLat([liveLng, liveLat]);

    // Pan map to keep driver in view
    if (mapInstanceRef.current) {
      mapInstanceRef.current.easeTo({
        center: [liveLng, liveLat],
        duration: 1000,
        easing: (t) => t,
      });
    }
  }, [liveLat, liveLng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "12px",
        marginTop: "12px",
        overflow: "hidden",
      }}
    />
  );
};

export default LiveMap;
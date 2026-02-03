import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getCoordinates } from "../../../backend/controllers/maps.controller"; // Assumes this returns coords for both from and to

const MapComponent = ({ from, to }) => {
  const mapRef = useRef(null);
  const mapElementRef = useRef(null);

  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);

  useEffect(() => {
    if (!from || !to) return;

    // Get coordinates for both from and to
    const fetchCoords = async () => {
      try {
        const { fromCoords, toCoords } = await getCoordinates(from, to);
        setFromCoords(fromCoords);
        setToCoords(toCoords);
      } catch (error) {
        toast.error("Failed to fetch coordinates.");
        console.error(error);
      }
    };

    fetchCoords();
  }, [from, to]);

  useEffect(() => {
    if (!fromCoords || !toCoords) return;

    const map = tt.map({
      key: "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF",
      container: mapElementRef.current,
      center: fromCoords,
      zoom: 12,
    });

    mapRef.current = map;

    const fromMarker = new tt.Marker().setLngLat(fromCoords).addTo(map);
    const toMarker = new tt.Marker().setLngLat(toCoords).addTo(map);

    const calculateRoute = async () => {
      try {
        const res = await axios.get(
          `https://api.tomtom.com/routing/1/calculateRoute/${fromCoords[1]},${fromCoords[0]}:${toCoords[1]},${toCoords[0]}/json?key=mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF&computeBestOrder=true&routeType=fastest&traffic=false`
        );

        const route = res.data.routes[0];
        const geo = route.legs[0].points.map((p) => [p.longitude, p.latitude]);

        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: geo,
              },
            },
          },
          paint: {
            "line-color": "#4a90e2",
            "line-width": 5,
          },
        });

        const summary = route.summary;
        const timeMin = Math.round(summary.travelTimeInSeconds / 60);
        const distanceKm = (summary.lengthInMeters / 1000).toFixed(2);

        new tt.Popup({ closeButton: false })
          .setLngLat(toCoords)
          .setHTML(`<strong>ETA:</strong> ${timeMin} min<br/><strong>Distance:</strong> ${distanceKm} km`)
          .addTo(map);
      } catch (err) {
        toast.error("Failed to calculate route.");
        console.error(err);
      }
    };

    calculateRoute();

    return () => map.remove();
  }, [fromCoords, toCoords]);

  return <div ref={mapElementRef} style={{ height: "400px", width: "100%", borderRadius: "10px" }} />;
};

export default MapComponent;

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { useLocation } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Mapbox = () => {
  const location = useLocation();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const directionsRef = useRef(null);
  const markerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(location.state?.destination || null);
  const [distance, setDistance] = useState("N/A");
  const [customLocationEnabled, setCustomLocationEnabled] = useState(false);
  const [error, setError] = useState("");

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);

        if (mapRef.current) {
          mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 18 });
        }

        if (directionsRef.current) {
          directionsRef.current.setOrigin([coords.lng, coords.lat]);
        }
      },
      (err) => setError("Location error: " + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [72.458111, 23.530215],
      zoom: 16,
    });

    mapRef.current = map;

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/walking",
      interactive: false,
      controls: {
        inputs: false,
        instructions: true,
      },
    });

    directionsRef.current = directions;
    map.addControl(directions, "top-left");

    map.on("click", (e) => {
      if (!customLocationEnabled) return;
      const lngLat = e.lngLat;
      setDestination({ lat: lngLat.lat, lng: lngLat.lng });
    });

    return () => {
      map.remove();
    };
  }, [customLocationEnabled]);

  // Set destination
  useEffect(() => {
    if (destination && directionsRef.current) {
      directionsRef.current.setDestination([destination.lng, destination.lat]);
    }
  }, [destination]);

  // Handle distance update from route
  useEffect(() => {
    const handleRoute = (e) => {
      if (e.route && e.route.length > 0) {
        const distMeters = e.route[0].distance;
        const km = (distMeters / 1000).toFixed(2);
        setDistance(km + " km");
      }
    };

    if (directionsRef.current) {
      directionsRef.current.on("route", handleRoute);
    }

    // ⚠️ No .off method on MapboxDirections — skip cleanup
  }, []);

  // Custom destination marker
  useEffect(() => {
    if (!mapRef.current || !destination) return;

    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat([destination.lng, destination.lat])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([destination.lng, destination.lat]);
    }
  }, [destination]);

  return (
    <div className="h-screen w-full relative">
      {error && (
        <p className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 p-2 rounded shadow z-10">
          {error}
        </p>
      )}

      <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded shadow flex gap-2 items-center">
        <select
          className="border rounded p-1"
          onChange={(e) => {
            const val = e.target.value;
            if (val === "custom") {
              setCustomLocationEnabled(true);
              setDestination(null);
            } else {
              const [lat, lng] = val.split(",").map(parseFloat);
              setCustomLocationEnabled(false);
              setDestination({ lat, lng });
            }
          }}
          value={destination ? `${destination.lat},${destination.lng}` : ""}
        >
          <option value="">Select Destination</option>
          <option value="custom">Custom Location</option>
          <option value="23.5301,72.4579">Main Gate</option>
          <option value="23.5315,72.4568">Admin Block</option>
        </select>
        <p className="text-sm font-medium">📏 {distance}</p>
      </div>

      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default Mapbox;

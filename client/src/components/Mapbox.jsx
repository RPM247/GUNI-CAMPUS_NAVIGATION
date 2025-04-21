import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const ZOOM_LEVEL = 18;
const UPDATE_INTERVAL = 8000; // 8 seconds
const MIN_DISTANCE_CHANGE = 10; // meters (tuned for campus-scale navigation)

const Mapbox = () => {
  const location = useLocation();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const userMarker = useRef(null);
  const destinationMarker = useRef(null);
  const sourceMarker = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(location.state?.destination || null);
  const [distance, setDistance] = useState("N/A");
  const [customSelectionMode, setCustomSelectionMode] = useState("none");
  const [error, setError] = useState("");
  const lastUpdatedRef = useRef(0);
  const lastLocationRef = useRef(null);

  // Location Permission Check
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        alert("Location access is required for navigation to work. Please enable it.");
      }
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [72.458111, 23.530215],
      zoom: ZOOM_LEVEL,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.getCanvas().addEventListener("contextmenu", (e) => {
      e.stopPropagation();
    });

    // Map onClick event
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      console.log("Map clicked at:", { lng, lat });
      console.log("Current selection mode:", customSelectionMode);

      if (customSelectionMode === "source") {
        const src = { lat, lng };
        setSource(src);
        console.log("Source set to:", src);

        if (!sourceMarker.current) {
          sourceMarker.current = new mapboxgl.Marker({ element: createMarker("🧍") })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText("📍 Source"))
            .addTo(mapRef.current);
          console.log("Source marker created.");
        } else {
          sourceMarker.current.setLngLat([lng, lat]);
          console.log("Source marker updated.");
        }

        // Reset the selection mode after setting the source
        setCustomSelectionMode("none");
      } else if (customSelectionMode === "destination") {
        const dest = { lat, lng };
        setDestination(dest);
        console.log("Destination set to:", dest);

        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ element: createMarker("🏁") })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText("📍 Destination"))
            .addTo(mapRef.current);
          console.log("Destination marker created.");
        } else {
          destinationMarker.current.setLngLat([lng, lat]);
          console.log("Destination marker updated.");
        }

        // Reset the selection mode after setting the destination
        setCustomSelectionMode("none");
      }
    });

    return () => map.remove();
  }, []);

  // Track User Location and Update Route
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(pos);
        setSource((prev) => prev || pos);

        if (mapRef.current) {
          mapRef.current.flyTo({ center: [pos.lng, pos.lat], zoom: ZOOM_LEVEL });
        }

        if (!userMarker.current) {
          userMarker.current = new mapboxgl.Marker({ element: createMarker("🧍") })
            .setLngLat([pos.lng, pos.lat])
            .setPopup(new mapboxgl.Popup().setText("📍 You are here"))
            .addTo(mapRef.current);
        } else {
          userMarker.current.setLngLat([pos.lng, pos.lat]);
        }

        // Throttle API requests
        const now = Date.now();
        const last = lastUpdatedRef.current;
        const distMoved = lastLocationRef.current
          ? haversineDistance(pos, lastLocationRef.current)
          : Infinity;

        if (now - last >= UPDATE_INTERVAL && distMoved >= MIN_DISTANCE_CHANGE) {
          lastUpdatedRef.current = now;
          lastLocationRef.current = pos;

          const actualSource = source || pos;
          if (destination) {
            drawRoute(actualSource, destination);
          }
        }
      },
      (err) => setError("Failed to get location."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [source, destination]);

  // Trigger drawRoute when source or destination changes
  useEffect(() => {
    if (!source || !destination) {
      console.log("Source or destination is missing. Cannot draw route.");
      return;
    }

    console.log("Drawing route between:", source, destination);
    drawRoute(source, destination);
  }, [source, destination]);

  const drawRoute = async (from, to) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
    console.log("Fetching route from Mapbox API:", url);

    try {
      const res = await axios.get(url);
      const data = res.data.routes[0];

      if (!data) {
        console.error("No route data returned from API.");
        setError("No route found.");
        return;
      }

      const routeCoords = data.geometry.coordinates;
      console.log("Route coordinates:", routeCoords);

      // Remove existing route layer if it exists
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeLayer("route");
        mapRef.current.removeSource("route");
      }

      // Add new route source and layer
      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: routeCoords },
        },
      });

      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#1e40af", "line-width": 4 },
      });

      // Update distance
      setDistance(`${(data.distance / 1000).toFixed(2)} km`);
      console.log("Route drawn successfully. Distance:", data.distance);
    } catch (err) {
      console.error("Failed to fetch route:", err);
      setError("Failed to fetch route.");
    }
  };

  const createMarker = (emoji) => {
    const el = document.createElement("div");
    el.style.fontSize = "30px";
    el.textContent = emoji;
    return el;
  };

  const haversineDistance = (loc1, loc2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Top Control Panel */}
      <div className="absolute top-5 left-5 z-10 bg-white rounded-xl shadow-lg p-4 w-72">
        <p className="font-semibold text-gray-800 text-sm mb-2">📏 Distance: {distance}</p>
        <div className="text-sm text-gray-600 mb-2">🖱️ Click on map to select:</div>
        <div className="space-y-2">
          <button
            onClick={() => {
              setCustomSelectionMode("source");
              console.log("Custom selection mode set to: source");
            }}
            className={`w-full text-left text-sm border rounded px-2 py-1 ${
              customSelectionMode === "source" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            Select Source
          </button>
          <button
            onClick={() => {
              setCustomSelectionMode("destination");
              console.log("Custom selection mode set to: destination");
            }}
            className={`w-full text-left text-sm border rounded px-2 py-1 ${
              customSelectionMode === "destination" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            Select Destination
          </button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 left-6 z-10 bg-white rounded-lg shadow flex flex-col">
        <button onClick={() => mapRef.current?.zoomIn()} className="text-lg p-2 border-b hover:bg-gray-100">+</button>
        <button onClick={() => mapRef.current?.zoomOut()} className="text-lg p-2 hover:bg-gray-100">−</button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-6 right-6 z-20 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow text-sm">
          {error}
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full cursor-default select-none" />
    </div>
  );
};

export default Mapbox;

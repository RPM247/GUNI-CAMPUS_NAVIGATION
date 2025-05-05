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

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [72.458111, 23.530215],
      zoom: ZOOM_LEVEL,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.getCanvas().addEventListener("contextmenu", (e) => e.stopPropagation());

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      if (customSelectionMode === "source") {
        const src = { lat, lng };
        setSource(src);
        if (!sourceMarker.current) {
          sourceMarker.current = new mapboxgl.Marker({ element: createMarker("🧍") })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText("📍 Source"))
            .addTo(mapRef.current);
        } else {
          sourceMarker.current.setLngLat([lng, lat]);
        }
        setCustomSelectionMode("none");
      } else if (customSelectionMode === "destination") {
        const dest = { lat, lng };
        setDestination(dest);
        if (!destinationMarker.current) {
          destinationMarker.current = new mapboxgl.Marker({ element: createMarker("🏁") })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText("📍 Destination"))
            .addTo(mapRef.current);
        } else {
          destinationMarker.current.setLngLat([lng, lat]);
        }
        setCustomSelectionMode("none");
      }
    });

    return () => map.remove();
  }, []);

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

  useEffect(() => {
    if (!source || !destination) return;
    drawRoute(source, destination);
  }, [source, destination]);

  const drawRoute = async (from, to) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&overview=full&continue_straight=false&access_token=${mapboxgl.accessToken}`;
    try {
      const res = await axios.get(url);
      const data = res.data.routes[0];

      if (!data) {
        setError("No route found.");
        return;
      }

      const routeCoords = data.geometry.coordinates;

      if (mapRef.current.getSource("route")) {
        mapRef.current.removeLayer("route");
        mapRef.current.removeSource("route");
      }

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

      setDistance(`${(data.distance / 1000).toFixed(2)} km`);
    } catch (err) {
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
    const R = 6371000;
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

  const clearRoute = () => {
    setSource(null);
    setDestination(null);
    setDistance("N/A");

    if (mapRef.current.getSource("route")) {
      mapRef.current.removeLayer("route");
      mapRef.current.removeSource("route");
    }

    if (sourceMarker.current) {
      sourceMarker.current.remove();
      sourceMarker.current = null;
    }

    if (destinationMarker.current) {
      destinationMarker.current.remove();
      destinationMarker.current = null;
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute top-5 left-5 z-10 bg-white rounded-xl shadow-lg p-4 w-80 space-y-3">
        <p className="font-semibold text-gray-800 text-sm">📏 Distance: {distance}</p>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setCustomSelectionMode("source")}
            className={`px-2 py-1 rounded-md font-medium border ${
              customSelectionMode === "source" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            Set Source
          </button>
          <button
            onClick={() => setCustomSelectionMode("destination")}
            className={`px-2 py-1 rounded-md font-medium border ${
              customSelectionMode === "destination" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            Set Destination
          </button>
          <button
            onClick={clearRoute}
            className="px-2 py-1 rounded-md bg-red-100 text-red-700 font-medium border"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10 bg-white rounded-lg shadow flex flex-col">
        <button onClick={() => mapRef.current?.zoomIn()} className="text-lg p-2 border-b hover:bg-gray-100">+</button>
        <button onClick={() => mapRef.current?.zoomOut()} className="text-lg p-2 hover:bg-gray-100">−</button>
      </div>

      {error && (
        <div className="absolute top-6 right-6 z-20 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow text-sm">
          {error}
        </div>
      )}

      <div ref={mapContainer} className="h-full w-full cursor-default select-none" />
    </div>
  );
};

export default Mapbox;

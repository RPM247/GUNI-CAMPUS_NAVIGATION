import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const ZOOM_LEVEL = 18;
const UPDATE_INTERVAL = 5000;
const MIN_DISTANCE_CHANGE = 5;
const PLACE_RADIUS_FROM_ROUTE = 50;
const USER_RADIUS_FOR_POPUP = 30;

const maneuverIcons = {
  "turn": "↩️",
  "new name": "🆕",
  "depart": "🚶",
  "arrive": "🏁",
  "merge": "🔀",
  "on ramp": "🛣️",
  "off ramp": "⬇️",
  "fork": "🍴",
  "end of road": "🔚",
  "continue": "➡️",
  "roundabout": "⭕",
  "rotary": "🔄",
  "roundabout turn": "↪️",
  "exit roundabout": "⤴️",
  "exit rotary": "⤴️"
};

const Mapbox = () => {
  const location = useLocation();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const userMarker = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(location.state?.destination || null);
  const [distance, setDistance] = useState("N/A");
  const [error, setError] = useState("");
  const [places, setPlaces] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [spokenSteps, setSpokenSteps] = useState(new Set());
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
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
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/places/all`);
        setPlaces(res.data);
      } catch (err) {
        console.error("Failed to fetch places", err);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [72.458111, 23.530215],
      zoom: ZOOM_LEVEL,
      interactive: true,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.getCanvas().addEventListener("contextmenu", (e) => e.stopPropagation());

    return () => map.remove();
  }, []);

  useEffect(() => {
    const speakInstruction = (text) => {
      if (!voiceEnabled) return;
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    };

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(pos);

        if (mapRef.current && isFirstLoad) {
          mapRef.current.flyTo({ center: [pos.lng, pos.lat], zoom: ZOOM_LEVEL });
          setIsFirstLoad(false);
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

          if (destination) {
            drawRoute(pos, destination);
          }
        }

        if (navigationSteps.length > 0) {
          navigationSteps.forEach((step, index) => {
            const stepLoc = { lat: step.maneuver.location[1], lng: step.maneuver.location[0] };
            const dist = haversineDistance(pos, stepLoc);
            if (dist < 20 && !spokenSteps.has(index)) {
              speakInstruction(step.maneuver.instruction);
              setSpokenSteps((prev) => new Set(prev).add(index));
            }
          });
        }

        if (places.length > 0 && routeCoords.length > 0) {
          const newNearbyPlaces = [];
          places.forEach((place) => {
            const placeCoord = { lat: place.coordinates.lat, lng: place.coordinates.lng };
            const nearRoute = routeCoords.some((coord) => {
              const routePoint = { lat: coord[1], lng: coord[0] };
              return haversineDistance(placeCoord, routePoint) <= PLACE_RADIUS_FROM_ROUTE;
            });
            if (nearRoute) newNearbyPlaces.push(place);
          });
          setNearbyPlaces(newNearbyPlaces);
        }

        let nearestPlace = null;
        let nearestDistance = Infinity;
        nearbyPlaces.forEach((place) => {
          const distToPlace = haversineDistance(pos, place.coordinates);
          if (distToPlace <= USER_RADIUS_FOR_POPUP && distToPlace < nearestDistance) {
            nearestPlace = place;
            nearestDistance = distToPlace;
          }
        });

        if (nearestPlace && !visitedPlaces.includes(nearestPlace._id)) {
          setActivePlace(nearestPlace);
          setVisitedPlaces([nearestPlace._id]);
        } else if (!nearestPlace && visitedPlaces.length > 0) {
          setActivePlace(null);
          setVisitedPlaces([]);
        }
      },
      (err) => setError("Failed to get location."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [destination, places, routeCoords, navigationSteps, nearbyPlaces, visitedPlaces, voiceEnabled, isFirstLoad]);

  const drawRoute = async (from, to) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;
    try {
      const res = await axios.get(url);
      const data = res.data.routes[0];
      if (!data) return setError("No route found.");

      const coords = data.geometry.coordinates;
      setRouteCoords(coords);
      setNavigationSteps(data.legs[0].steps);
      setSpokenSteps(new Set());

      if (mapRef.current.getSource("route")) {
        mapRef.current.removeLayer("route");
        mapRef.current.removeSource("route");
      }

      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: coords },
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
      Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get next unspoken step
  const nextStepIndex = navigationSteps.findIndex((_, idx) => !spokenSteps.has(idx));
  const nextStep = nextStepIndex !== -1 ? navigationSteps[nextStepIndex] : null;

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {(nextStep || distance !== "N/A") && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow-lg rounded-xl px-5 py-4 w-[90%] max-w-2xl text-center space-y-2">
          {nextStep && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{maneuverIcons[nextStep.maneuver.type] || "🧭"}</span>
              <span className="text-sm text-gray-700">{nextStep.maneuver.instruction}</span>
            </div>
        )}
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm font-semibold text-gray-800">📏 {distance}</p>
            <button
              onClick={() => setVoiceEnabled((v) => !v)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {voiceEnabled ? "🔊 Voice Enabled" : "🔇 Voice Disabled"}
            </button>
        </div>
      </div>
  )}

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

      {activePlace && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white shadow-xl rounded-t-2xl p-4 flex items-center space-x-4 max-h-[160px]">
          <img
            src={activePlace.imageUrl || "/placeholder.png"}
            alt={activePlace.name}
            className="w-24 h-24 object-cover rounded-xl border"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{activePlace.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {activePlace.description || "No description available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mapbox;

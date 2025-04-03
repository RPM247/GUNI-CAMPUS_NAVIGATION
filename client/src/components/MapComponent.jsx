import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const ZOOM_LEVEL = 18;

// Custom Icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
});

// Predefined campus locations
const locations = [
  { name: "Library", lat: 23.527717, lng: 72.459251 },
  { name: "UVPCE Main Building", lat: 23.528454, lng: 72.458596 },
  { name: "UVPCE New Building", lat: 23.527146, lng: 72.458896 },
  { name: "Sports Complex", lat: 23.525531, lng: 72.456266 },
  { name: "University Building", lat: 23.529113, lng: 72.455437 },
];

const FocusMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, ZOOM_LEVEL);
    }
  }, [position, map]);
  return null;
};

const MapClickHandler = ({ setDestination, customLocationEnabled }) => {
  useMapEvent("click", (e) => {
    if (customLocationEnabled) {
      setDestination({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
};

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState("N/A");
  const [error, setError] = useState("");
  const [customLocationEnabled, setCustomLocationEnabled] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          navigator.geolocation.watchPosition(
            (pos) => {
              setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            },
            (err) => setError("Error detecting location: " + err.message),
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
          );
        },
        (err) => setError("Error detecting location: " + err.message),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const getShortestPath = async () => {
    if (!userLocation || !destination) return;
    const apiKey = `${import.meta.env.VITE_ORS_API_KEY}`;
    const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${userLocation.lng},${userLocation.lat}&end=${destination.lng},${destination.lat}`;
    try {
      const response = await axios.get(url);
      const coordinates = response.data.features[0].geometry.coordinates.map((coord) => ({
        lat: coord[1],
        lng: coord[0],
      }));
      setPath(coordinates);
      setDistance((response.data.features[0].properties.segments[0].distance / 1000).toFixed(2) + " km");
    } catch (err) {
      setError("Error fetching shortest path.");
    }
  };

  useEffect(() => {
    if (userLocation && destination) {
      getShortestPath();
    }
  }, [userLocation, destination]);

  return (
    <div className="h-screen w-full">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex justify-center gap-4">
        <select
          onChange={(e) => {
            if (e.target.value === "custom") {
              setCustomLocationEnabled(true);
              setDestination(null);
            } else {
              const [lat, lng] = e.target.value.split(",").map(parseFloat);
              setDestination({ lat, lng });
              setCustomLocationEnabled(false);
            }
          }}
        >
          <option value="">Select Destination</option>
          {locations.map((loc, index) => (
            <option key={index} value={`${loc.lat},${loc.lng}`}>{loc.name}</option>
          ))}
          <option value="custom">Custom Location</option>
        </select>
      </div>
      
      <p className="font-bold text-center">Distance: {distance}</p>
      <MapContainer center={userLocation || { lat: 23.530215, lng: 72.458111 }} zoom={ZOOM_LEVEL} className="h-full w-full">
        <FocusMap position={userLocation} />
        <MapClickHandler setDestination={setDestination} customLocationEnabled={customLocationEnabled} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>📍 You are here</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination} icon={destinationIcon}>
            <Popup>📍 Destination</Popup>
          </Marker>
        )}
        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

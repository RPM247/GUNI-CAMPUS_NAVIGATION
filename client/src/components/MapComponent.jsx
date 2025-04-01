import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const DEFAULT_LOCATION = { lat: 23.530215, lng: 72.458111 }; // GUNI Coordinates
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

const MapComponent = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState("N/A");
  const [error, setError] = useState("");

  const getShortestPath = async () => {
    if (!startLocation || !destination) return;
    const apiKey = `${import.meta.env.VITE_ORS_API_KEY}`;
    const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${startLocation.lng},${startLocation.lat}&end=${destination.lng},${destination.lat}`;
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
    if (startLocation && destination) {
      getShortestPath();
    }
  }, [startLocation, destination]);

  return (
    <div className="h-screen w-full">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex justify-center gap-4">
        <select onChange={(e) => {
          const [lat, lng] = e.target.value.split(",").map(parseFloat);
          setStartLocation({ lat, lng });
        }}>
          <option value="">Select Start Location</option>
          {locations.map((loc, index) => (
            <option key={index} value={`${loc.lat},${loc.lng}`}>{loc.name}</option>
          ))}
        </select>

        <select onChange={(e) => {
          const [lat, lng] = e.target.value.split(",").map(parseFloat);
          setDestination({ lat, lng });
        }}>
          <option value="">Select Destination</option>
          {locations.map((loc, index) => (
            <option key={index} value={`${loc.lat},${loc.lng}`}>{loc.name}</option>
          ))}
        </select>
      </div>
      
      <p className="font-bold text-center">Distance: {distance}</p>
      <MapContainer center={DEFAULT_LOCATION} zoom={ZOOM_LEVEL} className="h-full w-full">
        <FocusMap position={startLocation || DEFAULT_LOCATION} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {startLocation && (
          <Marker position={startLocation} icon={userIcon}>
            <Popup>Start Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination} icon={destinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

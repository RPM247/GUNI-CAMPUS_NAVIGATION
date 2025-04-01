import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const DEFAULT_LOCATION = { lat: 23.241999, lng: 72.528351 }; // GUNI Coordinates
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

// Component to set destination by clicking on the map
const DestinationMarker = ({ setDestination }) => {
  useMapEvents({
    click(e) {
      setDestination(e.latlng);
    },
  });
  return null;
};

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
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState("");
  const [path, setPath] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false); // Track if map has loaded once

  // Function to get accurate user location
  const trackUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        setError(""); 

        // Ensure initial focus on user's location when map loads
        if (!mapLoaded) {
          setMapLoaded(true);
        }
      },
      (err) => {
        setError("Unable to retrieve your location. Using default location.");
        setUserLocation(DEFAULT_LOCATION);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 } 
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  // Start tracking user location on mount
  useEffect(() => {
    const stopTracking = trackUserLocation();
    return () => stopTracking(); // Clean up watchPosition on unmount
  }, []);

  // Function to fetch shortest path using OpenRouteService API
  const getShortestPath = async () => {
    if (!destination) return;

    const apiKey = `${import.meta.env.VITE_ORS_API_KEY}`;
    const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${userLocation.lng},${userLocation.lat}&end=${destination.lng},${destination.lat}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.features[0].geometry.coordinates.map((coord) => ({
        lat: coord[1],
        lng: coord[0],
      }));
      setPath(coordinates);
    } catch (err) {
      setError("Error fetching shortest path.");
    }
  };

  // Get shortest path when destination is set
  useEffect(() => {
    if (destination) {
      getShortestPath();
    }
  }, [destination]);

  return (
    <div className="h-screen w-full">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <MapContainer center={userLocation} zoom={ZOOM_LEVEL} className="h-full w-full">
        {/* Auto-focus on user location */}
        {mapLoaded && <FocusMap position={userLocation} />}

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Marker (Draggable to allow manual correction) */}
        <Marker
          position={userLocation}
          icon={userIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              setUserLocation(e.target.getLatLng());
            },
          }}
        >
          <Popup>Move the marker if location is inaccurate.</Popup>
        </Marker>

        {/* Destination Marker */}
        {destination && (
          <Marker position={destination} icon={destinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Shortest Path */}
        {path.length > 0 && <Polyline positions={path} color="blue" />}

        {/* Click on map to set destination */}
        <DestinationMarker setDestination={setDestination} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;

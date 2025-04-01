import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";

const UserLocationTracker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting user location:", err);
          setError("Unable to retrieve your location.");
        },
        {
          enableHighAccuracy: true, // Uses GPS for higher accuracy
          timeout: 10000, // Wait up to 10 seconds for a response
          maximumAge: 0, // Prevent cached data
        }
      );

      return () => navigator.geolocation.clearWatch(watchId); // Clean up watcher on unmount
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div>
      <h2>User Live Location</h2>
      {error && <p className="text-red-500">{error}</p>}
      {userLocation ? <MapComponent userLocation={userLocation} /> : <p>Fetching location...</p>}
    </div>
  );
};

export default UserLocationTracker;

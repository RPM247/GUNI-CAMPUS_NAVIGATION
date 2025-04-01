import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";

const UserLocationTracker = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div>
      <h2>User Live Location</h2>
      {userLocation ? <MapComponent userLocation={userLocation} /> : <p>Fetching location...</p>}
    </div>
  );
};

export default UserLocationTracker;

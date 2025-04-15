import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const AddPlace = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    imageUrl: "",
    coordinates: { lat: "", lng: "" },
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // 📍 Custom map click handler for Leaflet
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setForm({
          ...form,
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
        });
      },
    });

    return form.coordinates.lat && form.coordinates.lng ? (
      <Marker position={[form.coordinates.lat, form.coordinates.lng]} />
    ) : null;
  };

  // 📷 Upload image to Cloudinary
  const handleUpload = async () => {
    if (!file) return ""; // Optional image
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "GUNI-CN-file");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        data
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Image upload failed:", err);
      return "";
    }
  };

  // 📝 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await handleUpload();
      const placeData = {
        ...form,
        imageUrl,
      };

      console.log("🔁 Submitting place data:", placeData);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/places/add`,
        placeData
      );
      console.log("✅ Response:", res.data);

      navigate("/admin");
    } catch (error) {
      console.error("❌ Error details:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
      alert("Something went wrong while adding the place.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add New Place</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Category (e.g., hostels, colleges)"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value.toLowerCase() })
          }
          required
        />
        <input
          type="text"
          placeholder="Place Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div>
          <label className="block font-medium mb-1">
            Coordinates (click on map or enter manually)
          </label>
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.coordinates.lat}
            onChange={(e) =>
              setForm({
                ...form,
                coordinates: {
                  ...form.coordinates,
                  lat: parseFloat(e.target.value),
                },
              })
            }
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.coordinates.lng}
            onChange={(e) =>
              setForm({
                ...form,
                coordinates: {
                  ...form.coordinates,
                  lng: parseFloat(e.target.value),
                },
              })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <div className="mt-8">
        <h3 className="mb-2 font-bold">Click on Map to Pick Coordinates</h3>
        <MapContainer
          center={[23.530, 72.458]}
          zoom={14}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
};

export default AddPlace;

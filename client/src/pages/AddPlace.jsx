import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const AddPlace = ({ editData }) => {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    imageUrl: "",
    coordinates: { lat: "", lng: "" },
    description: "",
    phone: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        category: editData.category || "",
        imageUrl: editData.imageUrl || "",
        coordinates: {
          lat: editData.coordinates?.lat || "",
          lng: editData.coordinates?.lng || "",
        },
        description: editData.description || "",
        phone: editData.phone || "",
      });
    }
  }, [editData]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [form.coordinates.lng || 72.458, form.coordinates.lat || 23.530],
      zoom: 15,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl());

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setForm((prevForm) => ({
        ...prevForm,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      }));

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
        }
  });

    if (form.coordinates.lat && form.coordinates.lng) {
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([form.coordinates.lng, form.coordinates.lat])
        .addTo(map);
    }

    return () => map.remove();
  }, []);

  const handleUpload = async () => {
    if (!file) return form.imageUrl || "";
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
      return form.imageUrl || "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await handleUpload();
      const placeData = {
        ...form,
        imageUrl,
        coordinates: {
          lat: parseFloat(form.coordinates.lat),
          lng: parseFloat(form.coordinates.lng),
        },
      };

      let res;
      if (editData && editData._id) {
        res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/places/${editData._id}`,
          placeData
        );
        console.log("✅ Place updated:", res.data);
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/places/add`,
          placeData
        );
        console.log("✅ Place added:", res.data);
      }

      navigate("/admin");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {editData ? "Update Place" : "Add New Place"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Category"
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
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editData ? "Update Place" : "Add Place"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="mb-2 font-bold">Click on Map to Pick Coordinates</h3>
        <div ref={mapContainer} style={{ height: "400px", width: "100%" }} />
      </div>
    </div>
  );
};

export default AddPlace;
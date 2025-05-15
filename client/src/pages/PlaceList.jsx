import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import AnimatedRoute from "../components/AnimatedRoute";

const PlaceList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state.category;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, _id } = useSelector((state) => state.user); // get current user

  const fetchPlaces = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
          setPlaces([]);
        } else {
          setPlaces(data);
          setError("");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load places");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaces();
  }, [category]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this place?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/places/${id}`);
      fetchPlaces(); // refresh after delete
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete place");
    }
  };

  const isAdmin = token && _id; // assume only admin reaches this route

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <AnimatedRoute />
      </div>
    );
  }


  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Places in {category}</h2>
      <ul className="space-y-4">
        {places.map((place) => (
          <li
            key={place._id}
            className="flex items-center bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition cursor-pointer"
            onClick={() => navigate("/mapbox", { state: { destination: place.coordinates } })}
          >
            <img
              src={place.imageUrl || "https://via.placeholder.com/80"}
              alt={place.name}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div className="ml-4 flex-1">
              <p className="font-semibold">{place.name}</p>
              {/* <p className="text-sm text-gray-500">{place.description}</p> */}
            </div>
            {isAdmin && (
              <>
                <button
                  className="ml-4 text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    navigate(`/admin/edit-place/${place._id}`);
                  }}
                >
                  Update
                </button>
                <button
                  className="ml-2 text-red-600 underline"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    handleDelete(place._id);
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaceList;

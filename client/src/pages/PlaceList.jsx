import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PlaceList = () => {
  const location = useLocation();
  const category = location.state.category;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8081/api/places/${category}`)
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
  }, [category]);

  if (loading) return <p className="text-center text-gray-500">Loading places...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Choose a place to visit</h2>
      <ul className="space-y-4">
        {places.map((place) => (
          <li key={place._id} className="flex items-center bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition cursor-pointer">
            <img 
              src={place.imageUrl || "https://via.placeholder.com/80"} 
              alt={place.name} 
              className="w-16 h-16 rounded-md object-cover"
            />
            <span className="flex-1 ml-4 font-semibold">{place.name}</span>
            <button className="text-gray-600">
              ➜
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaceList;

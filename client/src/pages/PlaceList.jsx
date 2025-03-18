import { use, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PlaceList = () => {
  const location = useLocation()
  const category = location.state.category
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(category)
  useEffect(() => {
    console.log(`http://localhost:5173/places/${category}`)
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

  if (loading) return <p>Loading places...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Places in {category}</h2>
      <ul>
        {places.map((place) => (
          <li key={place._id}>{place.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlaceList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import AddPlace from "./AddPlace";
import { useParams } from "react-router-dom";

const EditPlace = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/places/${id}`)
      .then(res => setPlace(res.data))
      .catch(err => {
        console.error("Error loading place:", err);
        alert("Failed to load place.");
      });
  }, [id]);

  return place ? <AddPlace editData={place} /> : <p>Loading...</p>;
};

export default EditPlace;

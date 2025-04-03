const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "hostels", "colleges"
  name: { type: String, required: true }, // e.g., "Boys Hostel 1"
  imageUrl: { type: String, required: false }, // URL to the place's image
  coordinates: {
    lat: { type: Number, required: true }, // Latitude
    lng: { type: Number, required: true }, // Longitude
  },
});

const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;

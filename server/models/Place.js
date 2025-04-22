const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: { type: String, required: false }, // 🆕 Description of the place
  phone: { type: String, required: false },       // 🆕 Contact number
});

const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;

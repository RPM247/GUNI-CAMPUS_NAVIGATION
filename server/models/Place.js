const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: { type: String, required: false }, 
  phone: { type: String, required: false },      
});

const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;

const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., "hostels", "colleges"
  name: { type: String, required: true }, // e.g., "Boys Hostel 1"
});

const Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;

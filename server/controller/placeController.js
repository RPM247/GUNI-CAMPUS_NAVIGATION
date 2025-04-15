const Place = require("../models/Place");

// 📌 GET all places by category
async function getPlacesByCategory(req, res) {
  try {
    const category = req.params.category.toLowerCase();
    const places = await Place.find({ category });

    if (!places || places.length === 0) {
      return res.status(404).json({ message: `No places found in category: ${category}` });
    }

    return res.status(200).json(places);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message || error });
  }
}

// 📌 POST - Admin adds a new place
async function addPlace(req, res) {
  try {
    const { category, name, imageUrl, coordinates } = req.body;

    if (!category || !name || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ message: "Missing required fields: category, name, or coordinates" });
    }

    const newPlace = new Place({ category, name, imageUrl, coordinates });
    await newPlace.save();

    return res.status(201).json({
      message: "Place added successfully",
      data: newPlace,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error adding place", error: error.message || error });
  }
}

module.exports = {
  getPlacesByCategory,
  addPlace,
};

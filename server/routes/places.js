const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// 📌 GET all places by category (e.g., hostels, colleges)
router.get("/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const places = await Place.find({ category });

    if (places.length === 0) {
      return res.status(404).json({ message: "No places found in this category" });
    }

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 POST (For admin to add new places)
router.post("/", async (req, res) => {
  try {
    const { category, name, imageUrl, coordinates } = req.body;

    if (!category || !name || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPlace = new Place({ category, name, imageUrl, coordinates });
    await newPlace.save();
    
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: "Error adding place" });
  }
});

module.exports = router;

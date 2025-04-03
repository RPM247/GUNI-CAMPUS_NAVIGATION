const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const verifyOTP = require('../controller/verifyOtp');
const { forgotPassword, VerifyOTP, resetPassword } = require('../controller/authController');
const Place = require('../models/Place');

const router = express.Router();

// User Authentication Routes
router.post('/register', registerUser);
router.post('/email', checkEmail);
router.post('/password', checkPassword);
router.get('/user-details', userDetails);
router.get('/logout', logout);
router.post('/update-user', updateUserDetails);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify', VerifyOTP);
router.post('/reset-password', resetPassword);

// 📌 Get Places by Category (with Image & Coordinates)
router.get('/places/:category', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const places = await Place.find({ category });

    if (places.length === 0) {
      return res.status(404).json({ message: "No places found in this category" });
    }

    res.json(places.map(place => ({
      name: place.name,
      imageUrl: place.imageUrl,
      coordinates: place.coordinates
    })));
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Add New Place (For Admin Only)
router.post('/places', async (req, res) => {
  try {
    const { category, name, imageUrl, coordinates } = req.body;

    if (!category || !name || !imageUrl || !coordinates) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPlace = new Place({ category, name, imageUrl, coordinates });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    console.error("Error adding place:", error);
    res.status(500).json({ message: "Error adding place" });
  }
});

module.exports = router;

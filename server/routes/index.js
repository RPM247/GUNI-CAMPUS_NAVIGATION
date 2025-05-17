const express = require('express');

// User-related Controllers
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const verifyOTP = require('../controller/verifyOTP');
const { forgotPassword, VerifyOTP, resetPassword } = require('../controller/authController');

//Place-related Controllers
const {
    getAllPlaces,               
    getPlacesByCategory,
    addPlace,
    getPlaceById,
    updatePlace,
    deletePlace
} = require("../controller/placeController");

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

// Place Routes (Admin and Public Access)
router.get('/places/all', getAllPlaces); // ✅ GET all places
router.get('/places/:id', getPlaceById); // GET place by ID
router.get('/places/category/:category', getPlacesByCategory); // GET by category
router.post('/places/add', addPlace); // Add new
router.put("/places/:id", updatePlace); // Update
router.delete('/places/:id', deletePlace); // Delete

module.exports = router;

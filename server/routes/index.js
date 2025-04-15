const express = require('express');

// 📌 User-related Controllers
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const verifyOTP = require('../controller/verifyOtp');
const { forgotPassword, VerifyOTP, resetPassword } = require('../controller/authController');

// 📌 Place-related Controllers
const { getPlacesByCategory, addPlace } = require('../controller/placeController')

const router = express.Router();

// 🔐 User Authentication Routes
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

// 📍 Place Routes (Admin and Public Access)
router.get('/places/:category', getPlacesByCategory); // Get places by category (e.g., hostels, colleges)
router.post('/places/add', addPlace);                    // Admin adds a new place

module.exports = router;

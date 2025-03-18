const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const verifyOTP = require('../controller/verifyOtp')
const placesRoutes = require('../routes/places')
const { forgotPassword, VerifyOTP, resetPassword } = require('../controller/authController')
const Place = require('../models/Place')

const router = express.Router()

//for creating user api
router.post('/register', registerUser)
//for checking user email
router.post('/email', checkEmail)
//for checking user password
router.post('/password', checkPassword)
//for login user details
router.get('/user-details', userDetails)
//for logout
router.get('/logout', logout)  
//for updating user details
router.post('/update-user', updateUserDetails) 
//for email verification
router.post('/verify-otp', verifyOTP)
//for forgot password
router.post("/forgot-password", forgotPassword)
//for otp verification while forgot password
router.post("/verify", VerifyOTP)
//for reset password 
router.post("/reset-password", resetPassword) 
//for showing various places
//router.use("/places", placesRoutes) 

router.get("/places/:category", async (req, res) => {
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


module.exports = router
const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const verifyOTP = require('../controller/verifyOtp')
const { forgotPassword, VerifyOTP, resetPassword } = require('../controller/authController')


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

module.exports = router
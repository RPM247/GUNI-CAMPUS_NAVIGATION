const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "provide name"] 
    },
    email : {
        type : String,
        required : [true, "provide email"], 
        unique : true
    },
    password : {
        type : String,
        required : [true, "provide password"] 
    },
    profile_pic : {
        type : String,
        default : ""
    },
    isVerified: { type: Boolean, default: false },  // NEW FIELD to check email verification
    otp: { type: String, default: null }, // NEW FIELD for storing OTP
    otpExpires: { type: Date, default: null },
    resetPasswordOtp: { type: String }, // New field for password reset OTP
    resetPasswordOtpExpires: { type: Date },
    isResetPasswordVerified: { type: Boolean, default: false }
}, {
    timestamps : true
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
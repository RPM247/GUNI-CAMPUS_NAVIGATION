const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const sendMail = require("../utils/mailer"); 
const crypto = require("crypto");

// 📌 1️⃣ Generate & Send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", error: true });
        }

        const otp = crypto.randomInt(100000, 999999).toString(); 
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 

        // Store OTP in database
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = otpExpires;
        await user.save();

        await sendMail(email, "Password Reset OTP", `Your OTP for password reset is: ${otp}`);

        return res.status(200).json({ message: "OTP sent to your email", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true });
    }
};

// 📌 2️⃣ Verify OTP
exports.VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", error: true });
        }

        // Check if OTP is expired or invalid
        if (!user.resetPasswordOtp || user.resetPasswordOtpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired or invalid", error: true });
        }

        if (user.resetPasswordOtp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP", error: true });
        }

        // Mark OTP as verified for password reset
        user.isResetPasswordVerified = true;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true });
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", error: true });
        }

        // Check if OTP was verified before allowing password reset
        if (!user.isResetPasswordVerified) {
            return res.status(400).json({ message: "OTP verification required before resetting password", error: true });
        }

        // Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        // Update password & reset verification status
        user.password = hashPassword;
        user.isResetPasswordVerified = false; // Reset field after use
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true });
    }
}


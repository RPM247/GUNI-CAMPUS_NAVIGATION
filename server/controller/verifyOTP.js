const UserModel = require("../models/UserModel");

async function verifyOTP(request, response) {
    try {
        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({ message: "User not found!", error: true });
        }

        if (user.isVerified) {
            return response.status(400).json({ message: "User already verified!", error: true });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return response.status(400).json({ message: "Invalid or expired OTP!", error: true });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return response.status(200).json({
            message: "Email verified successfully! You can now login.",
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = verifyOTP;

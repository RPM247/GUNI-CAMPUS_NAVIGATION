import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Reset Password
    const [isResetPasswordVerified, setIsResetPasswordVerified] = useState(false); // Track OTP verification

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`, { email });
            toast.success(response.data.message);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verify`, { email, otp });
            toast.success(response.data.message);
            setIsResetPasswordVerified(true); // ✅ Mark OTP as verified
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!isResetPasswordVerified) {
            toast.error("Please verify OTP first!");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, { email, otp, newPassword });
            toast.success(response.data.message);
            window.location.href = "/email"; // Redirect after success
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="mt-5">
            <div className="bg-white w-full max-w-md rounded p-4 mx-auto">
                {step === 1 && (
                    <>
                        <h3>Forgot Password?</h3>
                        <form onSubmit={handleSendOTP}>
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <button type="submit">Send OTP</button>
                        </form>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h3>Enter OTP</h3>
                        <form onSubmit={handleVerifyOTP}>
                            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                            <button type="submit">Verify OTP</button>
                        </form>
                    </>
                )}
                {step === 3 && (
                    <>
                        <h3>Reset Password</h3>
                        <form onSubmit={handleResetPassword}>
                            <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            <button type="submit">Reset Password</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verify-otp`, { email, otp });
            toast.success(response.data.message);
            navigate('/email');
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className='mt-5'>
            <h3>Verify Your Email</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default VerifyOTP;

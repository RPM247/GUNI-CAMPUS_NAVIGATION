// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Role for radio button
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid credentials");
    }
  };

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      role={role}
      setRole={setRole}
      handleLogin={handleLogin}
    />
  );
};

export default Login;

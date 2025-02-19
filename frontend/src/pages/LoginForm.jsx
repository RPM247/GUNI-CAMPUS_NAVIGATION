// frontend/src/pages/LoginForm.jsx
import React from "react";

const LoginForm = ({ email, setEmail, password, setPassword, role, setRole, handleLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Login As:</label>
          <input
            type="radio"
            value="user"
            checked={role === "user"}
            onChange={(e) => setRole(e.target.value)}
            className="mr-2"
          />{" "}
          User
          <input
            type="radio"
            value="admin"
            checked={role === "admin"}
            onChange={(e) => setRole(e.target.value)}
            className="ml-4 mr-2"
          />{" "}
          Admin
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate()
    const signUp = ()=>{
        navigate('/register')
    }
    const login = ()=>{
        navigate('/email')
    }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🌟 Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">GUNI - CAMPUS NAVIGATION</h1>
        <div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg mr-2 hover:bg-gray-200" onClick={signUp}>
            Sign Up
          </button>
          <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700" onClick={login}>
            Login
          </button>
        </div>
      </header>

      {/* 🌟 Hero Section */}
      <section className="text-center py-20 bg-blue-500 text-white">
        <h2 className="text-4xl font-bold mb-4">Find Your Way Around Campus</h2>
        <p className="text-lg mb-6">Navigate easily with our interactive map and directions.</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200" onClick={signUp}>
          Get Started
        </button>
      </section>

      {/* 🌟 Features Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-gray-600">Explore the campus with an easy-to-use map.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Real-Time Navigation</h3>
            <p className="text-gray-600">Get step-by-step directions to any location.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Campus Services</h3>
            <p className="text-gray-600">Find libraries, cafeterias, and other essential spots.</p>
          </div>
        </div>
      </section>

      {/* 🌟 Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p>&copy; 2025 Campus Navigator | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;

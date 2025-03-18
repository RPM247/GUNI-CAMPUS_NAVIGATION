import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import universityOffice from "../assets/GUNI_UNIVERSITY_OFFICE.jpeg";
import uvpceMB from "../assets/UVPCE_MB.jpg";
import uvpceNB from "../assets/UVPCE_NB.jpg";
import sportsComplex from "../assets/SPORTS_COMPLEX.jpeg";
import logo from "../assets/guni_logo.png";
import { useNavigate } from "react-router-dom";
import { BiSolidRightArrowCircle } from "react-icons/bi";

const LandingPage = () => {
    const navigate = useNavigate();
    const signUp = () => navigate("/register");
    const login = () => navigate("/email");
    const places = () => navigate("/places");

    const slides = [
        { image: universityOffice, title: "University Office", description: "The heart of our campus, where all the administrative offices are located." },
        { image: uvpceMB, title: "U V PATEL COLLEGE OF ENGG. (MAIN BUILDING)", description: "A vast collection of books and a peaceful study space for students." },
        { image: uvpceNB, title: "U V PATEL COLLEGE OF ENGG. (NEW BUILDING)", description: "State-of-the-art facilities for various sports and fitness activities." },
        { image: sportsComplex, title: "SPORTS COMPLEX", description: "State-of-the-art facilities for various sports and fitness activities." }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [fade, setFade] = useState(false);

    const nextSlide = () => {
        setFade(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setFade(false);
        }, 500);
    };

    const prevSlide = () => {
        setFade(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setFade(false);
        }, 500);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
                <img src={logo} alt="Ganpat University Logo" className="h-10" />
                <div>
                    <button onClick={login} className="bg-primary text-white px-4 py-2 rounded-lg mr-2 hover:bg-secondary">Login</button>
                    <button onClick={signUp} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary">Sign Up</button>
                </div>
            </header>

            <section className="text-center py-20 bg-primary text-white">
                <h2 className="text-4xl font-bold mb-4">Welcome to our Campus!</h2>
                <p className="text-lg mb-6">Explore our university campus and discover all the amazing places it has to offer.</p>
                <div className="flex justify-center">
                    <button onClick={places} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 flex items-center">
                        Start Exploring <span className="ml-2"><BiSolidRightArrowCircle/></span>
                    </button>
                </div>
            </section>

            <div className="max-w-2xl mx-auto mt-10 relative">
                <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-600 shadow-lg">
                    <FaChevronLeft size={24} />
                </button>

                <div className="relative overflow-hidden">
                    <img src={slides[currentSlide].image} alt="Campus" className={`rounded-lg shadow-md w-full h-80 object-cover transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`} />
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white p-4 w-full rounded-b-lg">
                        <h3 className="text-lg font-bold">{slides[currentSlide].title}</h3>
                        <p className="text-sm">{slides[currentSlide].description}</p>
                    </div>
                </div>

                <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 hover:bg-gray-600 shadow-lg">
                    <FaChevronRight size={24} />
                </button>

                <div className="flex justify-center mt-4">
                    {slides.map((_, index) => (
                        <span key={index} onClick={() => setCurrentSlide(index)} className={`h-3 w-3 mx-1 rounded-full cursor-pointer transition-all duration-300 ${index === currentSlide ? "bg-black scale-125" : "bg-gray-400"}`}></span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

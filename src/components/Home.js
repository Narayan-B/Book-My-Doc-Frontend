import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import bg1 from '../assets/images/bg-1.jpg';
import bg2 from '../assets/images/bg-2.jpg';
import bg3 from '../assets/images/bg-3.webp';
import bg4 from '../assets/images/bg-4.jpg'
import bg5 from '../assets/images/bg-5.jpg'
import bg6 from '../assets/images/bg-6.jpg'
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const backgrounds = [bg1, bg2, bg3,bg4,bg5,bg6];

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleRegisterClick = () => {
        if (!user) {
            navigate('/register');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
        }, 4000); // Change background every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <main
                className="flex-grow flex flex-col items-center justify-center bg-cover bg-center mt-16 p-4 rounded-lg"
                style={{
                    backgroundImage: `url(${backgrounds[activeIndex]})`,
                    minHeight: '100vh',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    display: 'flex',
                    alignItems: 'center', 
                    textAlign: 'center'   
                }}
            >
                <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center text-white max-w-2xl md:p-10">
                    <h1 className="text-3xl font-bold mb-4 md:text-5xl">The art of medicine consists of amusing the patient while nature cures the disease.</h1>
                    <p className="text-sm mb-8 md:text-lg">
                        Welcome to our platform where healthcare meets technology to provide the best care possible. Whether you are a patient seeking medical advice or a doctor looking to connect with patients, we're here to make healthcare accessible and efficient for everyone.
                    </p>
                    <button
                        onClick={handleRegisterClick}
                        disabled={user}
                        className={`btn btn-primary ${user ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} md:px-6 md:py-2`}
                    >
                        {user ? 'Registered' : 'Register Now'}
                    </button>
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default Home;

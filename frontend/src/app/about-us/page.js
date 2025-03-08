'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const teamMembers = [
    {
        name: 'Mashrur Rahman',
        position: 'Full-stack Developer ( LEAD )',
        email: 'mashrur950@gmail.com',
        image: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741471461/mashrur_azdkeq.jpg',
    },
    {
        name: 'Ahnuf Karim Chowdhury',
        position: 'Full-stack Developer',
        email: 'ahnufkarimchowdhury@gmail.com',
        image: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741471461/ahnuf_jzsghz.jpg',
    },
    {
        name: 'Nahid Asef',
        position: 'Frontend Developer',
        email: 'naas50dx@gmail.com',
        image: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741471472/nahid_bbhsju.jpg',
    },
    {
        name: 'Chowdhury Ajmayeen Adil',
        position: 'Frontend Developer',
        email: 'ajmayeen.cse.20220104121@aust.edu',
        image: 'https://res.cloudinary.com/dv97iagt7/image/upload/v1741471461/ajmayeen_oso6ox.jpg',
    },
];

export default function AboutUs() {
    const router = useRouter();

    const handleContactClick = (email) => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}`;
        window.open(gmailUrl, '_blank');
    };

    return (
        <div className="font-sans bg-gray-50 pt-16 relative min-h-screen">
            {/* Back Arrow */}
            <button 
                onClick={() => router.push('/')}
                className="fixed top-4 left-4 z-50 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                aria-label="Return to home page"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                    />
                </svg>
            </button>

            {/* About Section */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                    <div className="relative">
                        <div className="h-80 w-full relative">
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: "url('https://res.cloudinary.com/dv97iagt7/image/upload/v1741471462/aboutus_weze37.jpg')" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-900 opacity-75"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="text-center text-white">
                                <h1 className="text-5xl font-bold mb-6">About Us</h1>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 md:p-10">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Welcome to our centralized defense operations management system, a powerful web-based solution designed to enhance efficiency, security, and transparency in defense operations. Our platform streamlines resource allocation, optimizes operational planning, and delivers real-time insights to facilitate informed decision-making.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Built with Laravel and MySQL, our system ensures secure access, seamless coordination, and comprehensive analytics, empowering defense teams to manage large-scale operations with precision and agility.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                This platform is tailored for defense operations teams, military command centers, and resource management units that require an advanced, secure, and reliable system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-center text-4xl font-bold mb-16 text-gray-800">Our Team</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="p-6 flex flex-col items-center">
                                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 shadow-md mb-6">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                    <p className="text-blue-600 font-medium mb-1">{member.position}</p>
                                    <p className="text-gray-500 text-sm mb-6">{member.email}</p>
                                    
                                    <button
                                        onClick={() => handleContactClick(member.email)}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg transition-colors duration-300 hover:bg-blue-700 font-medium flex items-center justify-center space-x-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span>Contact</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
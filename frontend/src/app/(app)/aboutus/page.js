'use client'; // Mark this component as a Client Component

import React from 'react';
import Layout from '@/components/layout';

const teamMembers = [
    {
        name: 'Mashrur Rahman',
        position: 'Full-stack Developer (Lead)',
        email: 'mashrur950@gmail.com',
        image: '/mashrur.jpg',
    },
    {
        name: 'Ahnuf Karim Chowdhury',
        position: 'Full-stack Developer',
        email: 'ahnufkarimchowdhury@gmail.com',
        image: '/ahnuf.jpg',
    },
    {
        name: 'Nahid Asef',
        position: 'Frontend Developer',
        email: 'naas50dx@gmail.com',
        image: '/nahid.jpg',
    },
    {
        name: 'Chowdhury Ajmayeen Adil',
        position: 'Frontend Developer',
        email: 'ajmayeen.cse.20220104121@aust.edu',
        image: '/ajmayeen.jpeg',
    },
];

export default function AboutUs() {
    const handleContactClick = (email) => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}`;
        window.open(gmailUrl, '_blank');
    };

    return (
        <Layout>
            <div className="font-sans">
                {/* About Section */}
                <div
                    className="about-section text-center py-20 px-12 text-white bg-cover bg-center relative"
                    style={{
                        backgroundImage: "url('/aboutus.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(80%)',
                        position: 'relative',
                        padding: '60px',
                        textAlign: 'center',
                        minHeight: '50vh',
                    }}
                >
                    <div 
                        id="about-us-text" 
                        className="bg-black bg-opacity-75 text-white p-8 border border-gray-400 rounded-lg overflow-auto max-h-96"
                        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                    >
                        <h1 className="text-5xl font-bold mb-6">About Us</h1>
                        <p className="text-xl mb-6">
                            Welcome to our centralized defense operations management system, a powerful web-based solution designed to enhance efficiency, security, and transparency in defense operations. Our platform streamlines resource allocation, optimizes operational planning, and delivers real-time insights to facilitate informed decision-making.
                        </p>
                        <p className="text-xl mb-6">
                            Built with Laravel and MySQL, our system ensures secure access, seamless coordination, and comprehensive analytics, empowering defense teams to manage large-scale operations with precision and agility. Our goal is to revolutionize the management of defense operations by centralizing resource tracking, real-time updates, and detailed reporting.
                        </p>
                        <p className="text-xl">
                            This platform is tailored for defense operations teams, military command centers, and resource management units that require an advanced, secure, and reliable system to manage operations, track resources, and generate insightful reports.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <h2 className="text-center text-4xl font-semibold mt-16 mb-12">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-12">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="card bg-white shadow-xl rounded-3xl overflow-hidden"
                            style={{ boxShadow: '0 6px 12px 0 rgba(0, 0, 0, 0.3)', margin: '12px' }}
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-72 object-cover"
                            />
                            <div className="container p-6 text-center">
                                <h2 className="text-2xl font-bold text-black">{member.name}</h2>
                                <p className="text-gray-600 mb-3">{member.position}</p>
                                <p className="text-blue-500 mb-5">{member.email}</p>
                                <button
                                    onClick={() => handleContactClick(member.email)}
                                    className="button w-full py-3 bg-black text-white rounded-lg hover:bg-gray-700"
                                    style={{
                                        border: 'none',
                                        outline: '0',
                                        display: 'inline-block',
                                        padding: '10px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        width: '100%',
                                    }}
                                >
                                    Contact
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
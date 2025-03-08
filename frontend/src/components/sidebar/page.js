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
        // Construct the Gmail compose URL
        const gmailUrl = https://mail.google.com/mail/?view=cm&to=${email};
        // Open Gmail in a new tab
        window.open(gmailUrl, '_blank');
    };

    return (
        <Layout>
            <div className="font-sans">
                {/* About Section */}
                <div
                    className="about-section text-center py-16 px-8 text-black bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/aboutus.jpg')", // Set the background image
                        padding: '50px',
                        textAlign: 'center',
                        color: 'black',
                    }}
                >
                    <h1 className="text-4xl font-bold mb-4">About Us</h1>
                    <p className="text-lg mb-4">
                        Welcome to our centralized defense operations management system, a robust web-based solution designed to enhance the efficiency, security, and transparency of defense operations. Our platform streamlines resource allocation, optimizes operational planning, and provides real-time insights to support informed decision-making. Built with Laravel and MySQL, the system ensures secure access, seamless coordination, and comprehensive analytics, empowering defense teams to manage large-scale operations with precision and agility.
                    </p>
                    <p className="text-lg mb-4">
                        Our objective is to revolutionize the management of defense operations by offering an integrated platform that centralizes resource tracking, real-time updates, and detailed reporting. By leveraging cutting-edge technology, we aim to improve decision-making, enhance operational efficiency, and enable better resource utilization for defense organizations.
                    </p>
                    <p className="text-lg">
                        Our target audience includes defense operations teams, military command centers, and resource management units that require an advanced, secure, and reliable system for managing operations, tracking resources, and generating insightful reports.
                    </p>
                </div>

                {/* Team Section */}
                <h2 className="text-center text-3xl font-semibold mt-12 mb-8">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="card bg-white shadow-lg rounded-2xl overflow-hidden" // Increased border radius
                            style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', margin: '8px' }}
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-64 object-cover" // Increased image height
                            />
                            <div className="container p-4 text-center">
                                <h2 className="text-xl font-bold">{member.name}</h2>
                                <p className="text-gray-600 mb-2">{member.position}</p>
                                <p className="text-blue-500 mb-4">{member.email}</p>
                                <button
                                    onClick={() => handleContactClick(member.email)}
                                    className="button w-full py-2 bg-black text-white rounded-lg hover:bg-gray-700"
                                    style={{
                                        border: 'none',
                                        outline: '0',
                                        display: 'inline-block',
                                        padding: '8px',
                                        color: 'white',
                                        backgroundColor: '#000',
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
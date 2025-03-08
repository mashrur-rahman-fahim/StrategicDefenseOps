"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "@/lib/axios";

const Navbar = ({ toggleSidebar, logout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [user, setUser] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sidebarButtonRef = useRef(null);
    const menuButtonRef = useRef(null);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
                );
                setUser(response.data.id || null);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (!user) return; 
    
        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${user}`
                );
    
                const sortedLogs = response.data
                    .filter(log => log.log_name !== 'user_details_access') 
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 2); 
    
                setLogs(sortedLogs);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch logs");
            } finally {
                setLoading(false);
            }
        };
    
        fetchLogs(); 
    
        const interval = setInterval(fetchLogs, 10000);
    
        return () => clearInterval(interval); 
    }, [user]);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu when resizing to larger screen
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogoutClick = () => setShowLogoutPrompt(true);
    const handleCancelLogout = () => setShowLogoutPrompt(false);

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        logout();
    };

    return (
        <header className="bg-white shadow-lg">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and sidebar toggle */}
                    <div className="flex items-center">
                        <button
                            ref={sidebarButtonRef}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                            onClick={toggleSidebar}
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="ml-2 text-xl font-bold text-gray-800 md:text-2xl">
                            StrategicDefenseOps
                        </h1>
                    </div>
                    
                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <button
                            ref={menuButtonRef}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                        >
                            <svg className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notifications
                        </button>

                        <button
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            onClick={handleLogoutClick}
                        >
                            <svg className="mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Mobile menu, show/hide based on menu state */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-200 space-y-2">
                        <button
                            className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md"
                            onClick={() => {
                                setDropdownOpen(!isDropdownOpen);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <svg className="mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notifications
                        </button>
                        <button
                            className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md"
                            onClick={() => {
                                handleLogoutClick();
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <svg className="mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Notifications dropdown - positioned absolutely */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-4 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 overflow-hidden"
                    style={{
                        top: "64px",
                        [window.innerWidth >= 768 ? "right" : "left"]: window.innerWidth >= 768 ? "16px" : "50%",
                        transform: window.innerWidth >= 768 ? "none" : "translateX(-50%)"
                    }}
                >
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200">
                        Recent Notifications
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
                        ) : logs.length > 0 ? (
                            logs.map((log, index) => (
                                <div 
                                    key={index}
                                    className={`px-4 py-3 hover:bg-gray-50 ${index !== logs.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <p className="text-sm text-gray-700">{log.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(log.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                        )}
                    </div>
                    <div className="px-4 py-2 text-xs text-blue-600 border-t border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                        View all notifications
                    </div>
                </div>
            )}

            {/* Logout confirmation modal */}
            {showLogoutPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-gray-700">Are you sure you want to log out?</p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                            <button
                                onClick={handleCancelLogout}
                                disabled={isLoggingOut}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                disabled={isLoggingOut}
                                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                            >
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
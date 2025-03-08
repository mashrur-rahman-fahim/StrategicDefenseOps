"use client";
import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import axios from "@/lib/axios";

const Navbar = ({ toggleSidebar, logout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [user, setUser] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${user}`,
                );

                const sortedLogs = response.data
                    .filter((log) => log.log_name !== "user_details_access")
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                    )
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

    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
    });

    useEffect(() => {
        if (menuButtonRef.current && isDropdownOpen) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom,
                left: rect.left,
            });
        }
    }, [isDropdownOpen]);

    const handleLogoutClick = () => setShowLogoutPrompt(true);
    const handleCancelLogout = () => setShowLogoutPrompt(false);

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        logout();
    };

    return (
        <header className="bg-white shadow-md py-4 px-6">
            <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
                <div className="relative w-full">
                    <button
                        ref={sidebarButtonRef}
                        className="text-2xl text-gray-600 hover:text-black focus:outline-none fixed top-7 left-7"
                        onClick={toggleSidebar}
                    >
                        ☰
                    </button>

                    <h1 className="text-xl font-semibold text-gray-800 mx-auto">
                        StrategicDefenseOps
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        ref={menuButtonRef}
                        className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-black hover:text-gray-700 dropdown-hover-effect"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                        Notifications
                    </button>

                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-48"
                            style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`,
                            }}
                        >
                            {logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <p
                                        key={index}
                                        className="text-sm text-gray-700"
                                    >
                                        {log.description}
                                    </p>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No notifications
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-black hover:text-gray-700 custom-hover-effect"
                        onClick={handleLogoutClick}
                    >
                        LogOut
                    </button>
                </div>
            </nav>

            {showLogoutPrompt && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <p className="text-lg text-gray-800">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                onClick={handleConfirmLogout}
                                disabled={isLoggingOut}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg transition duration-200 hover:bg-red-600 disabled:opacity-50"
                            >
                                {isLoggingOut ? "Logging out..." : "Yes"}
                            </button>
                            <button
                                onClick={handleCancelLogout}
                                disabled={isLoggingOut}
                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition duration-200 hover:bg-gray-400 disabled:opacity-50"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

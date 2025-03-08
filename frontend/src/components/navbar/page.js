import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar/page";

const Navbar = ({ toggleSidebar, logout }) => {
    const menuButtonRef = useRef(null); // Define the ref inside Navbar

    return (
        <header className="bg-white shadow-lg p-4">
            <nav className="flex justify-between items-center">
                <div className="flex items-center">
                    <button
                        ref={menuButtonRef}
                        className="text-2xl p-2 rounded-md hover:bg-gray-200 transition"
                        onClick={toggleSidebar}
                    >
                        ☰
                    </button>
                    <Link href="/dashboard" className="ml-4 text-xl font-semibold text-gray-800">
                        StrategicDefenseOps
                    </Link>
                </div>

                <div>
                    <button
                        className="px-4 py-2 rounded-md bg-red-500 text-white font-medium transition duration-300 
                                   hover:bg-red-600 hover:shadow-md focus:outline-none"
                        onClick={logout}
                    >
                        Log Out
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

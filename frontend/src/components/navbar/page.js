"use client"
import React, { useState, useEffect, useRef } from "react"
import "./navbar.css"
import Link from "next/link"

const Navbar = ({ toggleSidebar, logout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false)
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const menuButtonRef = useRef(null) // Ref for the "three dots" button

    useEffect(() => {
        setDropdownOpen(false)
    }, [])

    const handleLogoutClick = () => setShowLogoutPrompt(true)
    const handleCancelLogout = () => setShowLogoutPrompt(false)

    const handleConfirmLogout = () => {
        setIsLoggingOut(true)
        logout()
    }

    return (
        <header className="bg-white shadow navbar">
            <nav className="navbar-container">
                <div className="left-side">
                    {/* Three dots button to toggle sidebar */}
                    <button
                        ref={menuButtonRef} // Attach the ref
                        className="menu-button"
                        onClick={toggleSidebar}
                        style={{ display: "block" }}
                    >
                        ☰
                    </button>
                    <Link href="/dashboard" className="text-decoration-none"><h1 className="navbar-title">StrategicDefenseOps</h1></Link>
                </div>

                <div className="right-side">
                    {/* Logout button */}
                    <button className="nav-button" onClick={handleLogoutClick}>🚪</button>
                </div>
            </nav>

            {/* Logout prompt */}
            {showLogoutPrompt && (
                <div className="logout-prompt">
                    <p>Are you sure you want to log out?</p>
                    <button onClick={handleConfirmLogout} disabled={isLoggingOut}>
                        {isLoggingOut ? "Logging out..." : "Yes"}
                    </button>
                    <button onClick={handleCancelLogout} disabled={isLoggingOut}>No</button>
                </div>
            )}
        </header>
    )
}

export default Navbar
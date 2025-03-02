"use client"
import React, { useState, useEffect } from "react"
import "./navbar.css"

const Navbar = ({ title, toggleSidebar, logout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setDropdownOpen(false) 
  }, [title]) 

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
          <button className="menu-button" onClick={toggleSidebar} style={{ display: "block" }}>
            ☰
          </button>
          <h1 className="navbar-title">StrategicDefenseOps</h1>
        </div>

        <div className="right-side">
          <button className="nav-button new-button">New</button>

   
          <button className="nav-button" onClick={() => setDropdownOpen(!isDropdownOpen)}>🔔</button>

          {isDropdownOpen && (
            <div className="nav-dropdown">
              <p>Notification 1</p>
              <p>Notification 2</p>
            </div>
          )}

    
          <button className="nav-button" onClick={handleLogoutClick}>🚪</button>
        </div>
      </nav>

      {showLogoutPrompt && (
        <div className="logout-prompt">
          <p>Are you sure you want to log out?</p>
          <button onClick={handleConfirmLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Yes"}
          </button>
          <button onClick={handleCancelLogout} disabled={isLoggingOut}>No</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">{title}</h2>
      </div>
    </header>
  )
}

export default Navbar

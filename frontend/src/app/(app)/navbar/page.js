'use client'
import React, { useState } from 'react';
import './navbar.css';

const Header = ({ title, toggleSidebar, user, logout }) => {
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutPrompt(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    logout(); // Trigger logout
  };

  const handleCancelLogout = () => {
    setShowLogoutPrompt(false);
  };

  return (
    <header className="bg-white shadow">
      <nav className="navbar">
        <div className="navbar-container left-side">
          <button className="menu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="navbar-title">StrategicDefenseOps</h1>
        </div>
        <div className="navbar-container right-side">
          <button className="nav-button new-button" data-tooltip="New button">New</button>
          <button className="nav-button" data-tooltip="Notifications">🔔</button>

          {/* Conditional render for logout confirmation */}
          {!isLoggingOut ? (
            <button
              className="nav-button"
              data-tooltip="Logout"
              onClick={handleLogoutClick} 
            >
              🚪
            </button>
          ) : (
            <button
              className="nav-button"
              data-tooltip="Logout"
              onClick={handleConfirmLogout} 
            >
              
            </button>
          )}
        </div>
      </nav>

      
      {showLogoutPrompt && (
        <div className="logout-prompt">
          <p>Are you sure you want to log out?</p>
          <button onClick={handleConfirmLogout}>Yes</button>
          <button onClick={handleCancelLogout}>No</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {title}
        </h2>
      </div>
    </header>
  );
};

export default Header;

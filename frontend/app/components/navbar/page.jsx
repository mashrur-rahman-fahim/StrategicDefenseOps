'use client'; 

import React from 'react';
import './navbar.css';

const Navbar = ({ toggleSidebar }) => {
  return (
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
        <button className="nav-button" data-tooltip="Settings">⚙️</button>
      </div>
    </nav>
  );
};

export default Navbar;

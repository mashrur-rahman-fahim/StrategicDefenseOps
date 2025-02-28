"use client";
import React, { useEffect, useRef } from "react";
import "./sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar, selectedItem, handleNavigation }) => {
  const sidebarRef = useRef();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="back-button" onClick={toggleSidebar}>←</button>

      {/* Profile */}
      <div className="profile">
        <img
          src="https://www.lexpress.fr/resizer/BtP_kaudrTSss-e5I9p9gCwh0gk=/arc-photo-lexpress/eu-central-1-prod/public/ENBOXHVYU5EOVLIYIJ6NNM5ET4.jpg"
          alt="Profile"
          className="profile-pic"
        />
        <h2>Simon Riley</h2>
        <p className="rank">Lieutenant</p>
      </div>

      <nav className="menu">
        {["Dashboard", "Resources", "Operation", "Reports","Chatbot"].map((item) => (
          <div
            key={item}
            className={`menu-item ${selectedItem === item.toLowerCase() ? "active" : ""}`}
            onClick={() => {
              handleNavigation(item);
              setTimeout(() => toggleSidebar(), 300); // Close sidebar after navigating
            }}
          >
            {item}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

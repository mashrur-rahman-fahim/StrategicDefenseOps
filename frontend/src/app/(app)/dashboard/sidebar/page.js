
"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import "./sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar, selectedItem, setSelectedItem }) => {
  const sidebarRef = useRef();
  const router = useRouter(); // Initialize Next.js router

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

  // Function to handle navigation
  const handleNavigation = (item) => {
    setSelectedItem(item.toLowerCase());
    toggleSidebar();

    // Define route paths based on selected menu item
    const routes = {
      dashboard: "/dashboard",
      reports: "/report",
      // Add more routes as needed
    };

    router.push(routes[item.toLowerCase()]); // Navigate to the selected page
  };

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
        {["Dashboard", "Resources", "Operation", "Reports"].map((item) => (
          <div
            key={item}
            className={`menu-item ${selectedItem === item.toLowerCase() ? "active" : ""}`}
            onClick={() => handleNavigation(item)}
          >
            {item}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
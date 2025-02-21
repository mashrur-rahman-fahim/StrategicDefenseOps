'use client';
import React, { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/auth"; // Import authentication hook
import { useRouter } from "next/navigation";
import "./sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar, selectedItem, setSelectedItem }) => {
  const { user } = useAuth({ middleware: "auth" }); // Ensure authentication
  const router = useRouter();
  const sidebarRef = useRef();

  useEffect(() => {
    if (user === undefined) return; // Wait for authentication check

    if (!user) {
      router.push("/login"); // Redirect unauthenticated users
    }
  }, [user, router]);

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

  if (!user) {
    return null; // Don't render sidebar if not authenticated
  }

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
        <h2>{user?.name || "User"}</h2> {/* Display logged-in user’s name */}
        <p className="rank">Lieutenant</p>
      </div>

      <nav className="menu">
        {["Dashboard", "Resources", "Operation", "Reports"].map((item) => (
          <div
            key={item}
            className={`menu-item ${selectedItem === item.toLowerCase() ? "active" : ""}`}
            onClick={() => {
              setSelectedItem(item.toLowerCase());
              toggleSidebar();
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

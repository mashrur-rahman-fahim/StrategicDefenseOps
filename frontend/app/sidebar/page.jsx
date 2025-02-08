'use client'; // Mark this as a Client Component
import React, { useEffect, useRef } from 'react';
import './sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, selectedItem, setSelectedItem }) => {
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="back-button" onClick={toggleSidebar}>←</button>
      
      <ul>
        <li className={selectedItem === 'dashboard' ? 'active' : ''} onClick={() => setSelectedItem('dashboard')}>Dashboard</li>
        <li className={selectedItem === 'resources' ? 'active' : ''} onClick={() => setSelectedItem('resources')}>Resources</li>
        <li className={selectedItem === 'resourceUsage' ? 'active' : ''} onClick={() => setSelectedItem('resourceUsage')}>Resource Usage</li>
      </ul>
    </div>
  );
};

export default Sidebar;

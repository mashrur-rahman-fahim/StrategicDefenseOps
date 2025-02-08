"use client";
import { useState } from 'react';
import Navbar from './navbar/page';
import Sidebar from './sidebar/page';
import Dashboard from './Dashboard/page';
import './globals.css';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
        <div className="content">
          {selectedItem === 'dashboard' && <Dashboard />}
          {selectedItem === 'resources' && (
            <div>
              <h1>Resources</h1>
              <p>Displaying resources information.</p>
            </div>
          )}
          {selectedItem === 'resourceUsage' && (
            <div>
              <h1>Resource Usage</h1>
              <p>Displaying resource usage information.</p>
            </div>
          )}
          {children}
        </div>
      </body>
    </html>
  );
}

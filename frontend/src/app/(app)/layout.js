"use client";
import { useState } from 'react';
import Navbar from './navbar/page';
//import Sidebar from './sidebar/page';
import Dashboard from './dashboard/page';
import { useAuth } from '@/hooks/auth'
//import './globals.css';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const { user, logout } = useAuth(); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} user={user} logout={logout} />

        {/* Sidebar 
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />*/}

        {/* Main Content */}
        <div className="content">
          {/* Conditional Rendering Based on Selected Item */}
          {selectedItem === 'dashboard' && <Dashboard />}
          
          {selectedItem === 'resourceUsage' && (
            <div>
              <h1>Resource Usage</h1>
              <p>Displaying resource usage information.</p>
            </div>
          )}

          {/* Render Children (Other Pages/Components) */}
          {children}
        </div>
      </body>
    </html>
  );
}
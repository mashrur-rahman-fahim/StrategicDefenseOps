"use client";
import { useState } from 'react';
import Navbar from './navbar/page';
import Sidebar from './sidebar/page';
import Dashboard from './dashboard/page';
import { useAuth } from '@/hooks/auth'


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
        

        {/* Sidebar  */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}  />
        

        
        <div className="content">
         
          {selectedItem === 'dashboard' && <Dashboard />}
          
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
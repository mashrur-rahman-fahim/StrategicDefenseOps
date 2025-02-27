"use client";
import { useState } from 'react';
import Navbar from './navbar/page';
import Sidebar from './sidebar/page';
import Dashboard from './page';
import { useAuth } from '@/hooks/auth'
import Loading from '../Loading';


export default function RootLayout({ children }) {
   const{user}=useAuth({middleware:'auth'})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const {  logout } = useAuth(); 
    if(!user){
        return <Loading/>
    }
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
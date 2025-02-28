"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import Navbar from '../components/navbar/page';
import Sidebar from '../components/sidebar/page';
import { useAuth } from '@/hooks/auth';
import Loading from '../Loading';

export default function RootLayout({ children }) {
  const { user } = useAuth({ middleware: 'auth' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const { logout } = useAuth();
  const router = useRouter(); // Initialize Next.js router
  const pathname = usePathname(); // Get the current route

  // Update selectedItem based on the current route
  useEffect(() => {
    const routeToItemMap = {
      '/dashboard': 'dashboard',
      '/operation': 'operation',
      '/report': 'reports',
      // Add more mappings as needed
    };
    setSelectedItem(routeToItemMap[pathname] || '');
  }, [pathname]);

  if (!user) {
    return <Loading />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle navigation
  const handleNavigation = (item) => {
    setSelectedItem(item.toLowerCase());
    toggleSidebar();

    // Define route paths based on selected menu item
    const routes = {
      dashboard: "/dashboard",
      operation: "/operation",
      reports: "/report",
      // Add more routes as needed
    };

    router.push(routes[item.toLowerCase()]); // Navigate to the selected page
  };

  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} user={user} logout={logout} />

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedItem={selectedItem}
          handleNavigation={handleNavigation} // Pass the navigation handler
        />

        {/* Content */}
        <div className="content">
          {children} {/* The Operation page will render here */}
        </div>
      </body>
    </html>
  );
}
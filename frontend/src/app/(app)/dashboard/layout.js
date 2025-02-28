"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '../components/navbar/page';
import Sidebar from '../components/sidebar/page';
import { useAuth } from '@/hooks/auth';
import Loading from '../Loading';

export default function Layout({ children }) {
  const { user } = useAuth({ middleware: 'auth' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Map routes to menu items
  useEffect(() => {
    const routeToItemMap = {
      '/dashboard': 'dashboard',
      '/operation': 'operation',
      '/report': 'reports',
      '/resources': 'resources', // Added resources mapping
    };
    setSelectedItem(routeToItemMap[pathname] || '');
  }, [pathname]);

  if (!user) {
    return <Loading />;
  }

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle navigation to different routes
  const handleNavigation = (item) => {
    const routes = {
      dashboard: "/dashboard",
      operation: "/operation",
      reports: "/report",
      resources: "/resources", // Added resources route
    };

    const route = routes[item.toLowerCase()];
    if (route) {
      setSelectedItem(item.toLowerCase());
      toggleSidebar();
      router.push(route); // Navigate to the selected page
    } else {
      console.error(`Route not found for item: ${item}`);
    }
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
          handleNavigation={handleNavigation}
        />

        {/* Content */}
        <div className="content">
          {children}
        </div>
      </body>
    </html>
  );
}
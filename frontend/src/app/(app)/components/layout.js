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

  useEffect(() => {
    const routeToItemMap = {
      '/dashboard': 'dashboard',
      '/operation': 'operation',
      '/report': 'reports',
    };
    setSelectedItem(routeToItemMap[pathname] || '');
  }, [pathname]);

  if (!user) {
    return <Loading />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (item) => {
    setSelectedItem(item.toLowerCase());
    toggleSidebar();

    const routes = {
      dashboard: "/dashboard",
      operation: "/operation",
      reports: "/report",
    };

    router.push(routes[item.toLowerCase()]);
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
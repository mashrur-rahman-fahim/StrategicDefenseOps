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
      '/resources': 'resources', 
      '/chatbot':'chatbot',
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
    const routes = {
      dashboard: "/dashboard",
      operation: "/operation",
      reports: "/report",
      resources: "/resources", 
      chatbot:"/chatbot"
    };

    const route = routes[item.toLowerCase()];
    if (route) {
      setSelectedItem(item.toLowerCase());
      toggleSidebar();
      router.push(route); 
    } else {
      console.error(`Route not found for item: ${item}`);
    }
  };

  return (
    <html lang="en">
      <body>
       
        <Navbar toggleSidebar={toggleSidebar} user={user} logout={logout} />

        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedItem={selectedItem}
          handleNavigation={handleNavigation}
        />

        
        <div className="content">
          {children}
        </div>
      </body>
    </html>
  );
}
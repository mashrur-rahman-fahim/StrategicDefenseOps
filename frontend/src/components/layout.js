"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "./navbar/page";
import Sidebar from "./sidebar/page";
import { useAuth } from "@/hooks/auth";
import Loading from "./Loading";
import { Toaster } from "sonner";

export default function Layout({ children }) {
    const { user } = useAuth({ middleware: "auth" });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const { logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const routeToItemMap = {
            "/dashboard": "dashboard",
            "/operation": "operation",
            "/report": "reports",
            "/resources": "resources",
            "/chatbot": "chatbot",
        };
        setSelectedItem(routeToItemMap[pathname] || "");
    }, [pathname]);

    if (!user) {
        return <Loading />;
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
    }

    const handleNavigation = (item) => {
        const routes = {
            dashboard: "/dashboard",
            operation: "/operation",
            reports: "/report",
            resources: "/resources",
            chatbot: "/chatbot",
        };

        const route = routes[item.toLowerCase()];
        if (route) {
            setSelectedItem(item.toLowerCase());
            toggleSidebar(); // Close the sidebar after navigation
            router.push(route);
        } else {
            console.error(`Route not found for item: ${item}`);
        }
    };

    return (
        <>
            <Toaster position="bottom-right" theme="light" richColors />

            <Navbar toggleSidebar={toggleSidebar} user={user} logout={logout} />

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                selectedItem={selectedItem}
                handleNavigation={handleNavigation}
            />

            <div className="content">{children}</div>
        </>
    );
}

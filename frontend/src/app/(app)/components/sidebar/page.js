'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation' // ✅ Import Next.js Router
import axios from '../../../../lib/axios'
import './sidebar.css'

const Sidebar = ({ isOpen, toggleSidebar, selectedItem, setSelectedItem }) => {
    const sidebarRef = useRef();
    const router = useRouter(); // ✅ Initialize Router

    const [userName, setUserName] = useState('Error');
    const [roleId, setRoleId] = useState(null);
    const [roleName, setRoleName] = useState('');

    const roleMapping = {
        1: 'Admin',
        2: 'Manager',
        3: 'Operator',
        4: 'Viewer',
    };

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                toggleSidebar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, toggleSidebar]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
                );
                setUserName(response.data.name || 'Unknown');
                setRoleId(response.data.role_id || 'Unknown');
                setRoleName(roleMapping[response.data.role_id] || 'Unknown');
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="back-button" onClick={toggleSidebar}>
                ←
            </button>

            {/* Profile  */}
            <div className="profile">
                <h2>{userName}</h2>
                <p className="rank">Role : {roleName}</p>
            </div>

            <nav className="menu">
                {['Dashboard', 'Resources', 'Operation', 'Reports'].map(
                    item => (
                        <div
                            key={item}
                            className={`menu-item ${selectedItem === item.toLowerCase() ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedItem(item.toLowerCase());
                                toggleSidebar();
                                router.push(`/${item.toLowerCase()}`); // ✅ Navigate to page
                            }}>
                            {item}
                        </div>
                    ),
                )}
            </nav>
        </div>
    );
};

export default Sidebar;

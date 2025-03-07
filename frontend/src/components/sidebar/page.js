'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from '@/lib/axios'
import './sidebar.css'
import { Icon } from '@iconify/react'

const Sidebar = ({ isOpen, toggleSidebar, selectedItem, handleNavigation }) => {
    const sidebarRef = useRef()
    const [userName, setUserName] = useState('Error')
    const [roleName, setRoleName] = useState("")
    const roleMapping = {
        1: 'Admin',
        2: 'Manager',
        3: 'Operator',
        4: 'Viewer',
    }

    useEffect(() => {
        const handleClickOutside = event => {
            const menuButton = document.querySelector('.menu-button') // Get the "three dots" button
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !menuButton.contains(event.target) // Exclude the "three dots" button
            ) {
                toggleSidebar()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, toggleSidebar])

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`/api/user`)
                setUserName(response?.data.name || 'Unknown')
                setRoleName(roleMapping[response.data.role_id] || 'Unknown')
            } catch (error) {
                console.error('Error fetching user details:', error)
            }
        }

        fetchUserDetails()
    }, [])

    return (
        <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Arrow button to close sidebar */}
            <div className="icon-container d-flex justify-content-between align-items-center">
                <button className="back-button" onClick={toggleSidebar}>
                    ←
                </button>
                <button className="back-button" onClick={toggleSidebar}>
                    <Icon icon="bi:pencil-square" width="16" height="16" />
                </button>
            </div>

            {/* Profile section */}
            <div className="profile">
                <h2>{userName}</h2>
                <p className="rank">{roleName}</p>
            </div>

            {/* Menu items */}
            <nav className="menu">
                {['Dashboard', 'Resources', 'Operation', 'Reports'].map(
                    item => (
                        <div
                            key={item}
                            className={`menu-item ${selectedItem === item.toLowerCase() ? 'active' : ''}`}
                            onClick={() => {
                                handleNavigation(item.toLowerCase())
                                toggleSidebar() // Close the sidebar after navigation
                            }}>
                            {item}
                        </div>
                    ),
                )}
            </nav>
        </div>
    )
}

export default Sidebar
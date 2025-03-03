'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from '@/lib/axios'
import './sidebar.css'

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
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
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
                const response = await axios.get(
                    `/api/user`,
                )
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
            <button className="back-button" onClick={toggleSidebar}>
                ←
            </button>

            {/* Profile  */}
            <div className="profile">
                {/* Profile Picture */}
                {/* <img
          src="https://www.lexpress.fr/resizer/BtP_kaudrTSss-e5I9p9gCwh0gk=/arc-photo-lexpress/eu-central-1-prod/public/ENBOXHVYU5EOVLIYIJ6NNM5ET4.jpg"
          alt="Profile"
          className="profile-pic"
        /> */}

                {/* Profile Name */}
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
                                handleNavigation(item.toLowerCase())
                                toggleSidebar()
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

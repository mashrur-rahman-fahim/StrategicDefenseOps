'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from '../../lib/axios'
import './navbar.css'

const Navbar = ({ toggleSidebar, logout, user }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false)
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const sidebarButtonRef = useRef(null)
    const menuButtonRef = useRef(null)
    const dropdownRef = useRef(null)
    const sidebarRef = useRef(null)

    useEffect(() => {
        if (!user) return

        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${user}`
                )
                setLogs(response.data.filter(log => log.log_name !== 'user_details_access'))
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch logs')
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()

        const interval = setInterval(fetchLogs, 5000) // Polling every 5 seconds
        return () => clearInterval(interval)
    }, [user])

    const sortedLogs = [...logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const handleLogoutClick = () => setShowLogoutPrompt(true)
    const handleCancelLogout = () => setShowLogoutPrompt(false)

    const handleConfirmLogout = () => {
        setIsLoggingOut(true)
        logout()
    }

    return (
        <header className="bg-white shadow-md py-4 px-6">
            <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
                <div className="flex items-center space-x-4">
                    <button
                        ref={sidebarButtonRef}
                        className="text-2xl text-gray-600 hover:text-black focus:outline-none"
                        onClick={toggleSidebar}>
                        ☰
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">
                        StrategicDefenseOps
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        ref={menuButtonRef}
                        className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-lg hover:bg-black hover:text-gray-700"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}>
                        Notifications
                    </button>

                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-48 right-0 mt-2">
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : sortedLogs.length > 0 ? (
                                sortedLogs.slice(0, 2).map(log => (
                                    <p key={log.id} className="text-sm text-gray-700 border-b last:border-b-0 py-1">
                                        {log.description}
                                    </p>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No notifications</p>
                            )}
                        </div>
                    )}

                    <button
                        className="bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-lg hover:bg-black hover:text-gray-700"
                        onClick={handleLogoutClick}>
                        LogOut
                    </button>
                </div>
            </nav>

            {showLogoutPrompt && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <p className="text-lg text-gray-800">Are you sure you want to log out?</p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                onClick={handleConfirmLogout}
                                disabled={isLoggingOut}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
                                {isLoggingOut ? 'Logging out...' : 'Yes'}
                            </button>
                            <button
                                onClick={handleCancelLogout}
                                disabled={isLoggingOut}
                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar

'use client';
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';
import Layout from '@/components/layout';

export default function UnAssign() {
    const { user } = useAuth({ middleware: 'auth' });
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('operator'); // Default to 'operator' for managers
    const [managerEmail, setManagerEmail] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [userRole, setUserRole] = useState(null); // Store user role
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (user) {
            setUserRole(user.role_id);
        }
    }, [user]);

    const handleUnassign = async () => {
        // Form validation
        if (!email) {
            showNotification('Please enter a user email.', 'error');
            return;
        }

        if ((role === 'operator' || role === 'viewer') && !managerEmail) {
            showNotification("Please enter the assigned manager's email.", 'error');
            return;
        }

        setIsProcessing(true);

        try {
            let endpoint = '';
            let data = {};

            if (role === 'manager' && userRole === 1) {
                endpoint = '/api/manager-unassign';
                data = { managerEmail: email };
            } else if (
                (role === 'operator' || role === 'viewer') &&
                (userRole === 1 || userRole === 2)
            ) {
                endpoint = `/api/${role}-unassign`;
                data = { [`${role}Email`]: email, managerEmail };
            } else {
                showNotification('You do not have permission to unassign this role.', 'error');
                setIsProcessing(false);
                return;
            }

            const response = await axios.post(endpoint, data);
            showNotification(response.data.message, 'success');
            setEmail('');
            setManagerEmail('');
        } catch (error) {
            showNotification(error.response?.data?.message || error.message, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({
            show: true,
            message,
            type
        });

        // Auto hide notification after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Helper to get role name from ID
    const getRoleName = (roleId) => {
        const roles = {
            1: 'Admin',
            2: 'Manager',
            3: 'Operator',
            4: 'Viewer'
        };
        return roles[roleId] || 'Unknown';
    };

    // Restrict Access for Unauthorized Users (Operators & Viewers)
    if (userRole > 2) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m5-10a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="font-medium">You do not have permission to unassign users.</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {notification.show && (
                    <div className={`mb-6 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center`}>
                        {notification.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {notification.message}
                    </div>
                )}

                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg mb-6 shadow-sm">
                    <div className="flex items-center space-x-2">
                        <div className="bg-red-600 text-white rounded-full h-10 w-10 flex items-center justify-center">
                            <span className="font-bold">{user?.id}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Role Removal
                            </h1>
                            <p className="text-gray-600">
                                Current role: {getRoleName(user?.role_id)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg">
                    <h2 className="text-xl font-semibold text-red-600 mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                        </svg>
                        Unassign Role
                    </h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Role to Unassign:
                        </label>
                        <select
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            {/* Admin (Role 1) sees all roles */}
                            {userRole === 1 && (
                                <option value="manager">Manager</option>
                            )}
                            <option value="operator">Operator</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            User Email:
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter user email"
                        />
                    </div>

                    {role !== 'manager' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Manager Email:
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                value={managerEmail}
                                onChange={(e) => setManagerEmail(e.target.value)}
                                placeholder="Enter manager email"
                            />
                        </div>
                    )}

                    <button
                        className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        onClick={handleUnassign}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Unassign Role
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Layout>
    );
}
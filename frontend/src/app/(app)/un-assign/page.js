'use client';
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '@/hooks/auth';
import Layout from '@/components/layout';

export default function UnAssign() {
    const { user } = useAuth({ middleware: 'auth' });
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('operator'); // Default to 'operator' for managers
    const [managerEmail, setManagerEmail] = useState('');
    const [message, setMessage] = useState('');
    const [userRole, setUserRole] = useState(null); // Store user role

    useEffect(() => {
        if (user) {
            setUserRole(user.role_id);
        }
    }, [user]);

    const handleUnassign = async () => {
        if (!email) {
            setMessage('⚠️ Please enter a user email.');
            return
        }

        if ((role === 'operator' || role === 'viewer') && !managerEmail) {
            setMessage("⚠️ Please enter the assigned manager's email.");
            return
        }

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
                setMessage(
                    '❌ You do not have permission to unassign this role.'
                );
                return
            }

            const response = await axios.post(endpoint, data);
            setMessage(`✅ Success: ${response.data.message}`);
            setEmail('');
            setManagerEmail('');
        } catch (error) {
            setMessage(
                `❌ Error: ${error.response?.data?.message || error.message}`
            );
        }
    };

    // ❌ Restrict Access for Unauthorized Users (Operators & Viewers)
    if (userRole > 2) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger text-center">
                    <i className="bi bi-lock-fill" /> ❌ You do not have
                    permission to unassign users.
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="container mt-4">
                <div className="card shadow-lg p-4">
                    <h2 className="text-danger mb-3">
                        <i className="bi bi-person-x-fill" /> Unassign Role
                    </h2>

                    <div className="mb-3">
                        <label className="form-label">Role to Unassign:</label>
                        <select
                            className="form-select"
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

                    <div className="mb-3">
                        <label className="form-label">User Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter user email"
                        />
                    </div>

                    {role !== 'manager' && (
                        <div className="mb-3">
                            <label className="form-label">Manager Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={managerEmail}
                                onChange={(e) =>
                                    setManagerEmail(e.target.value)
                                }
                                placeholder="Enter manager email"
                            />
                        </div>
                    )}

                    <button
                        className="btn btn-danger w-100"
                        onClick={handleUnassign}
                    >
                        <i className="bi bi-trash" /> Unassign Role
                    </button>

                    {message && (
                        <div
                            className={`alert mt-3 ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

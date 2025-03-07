'use client'
import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import Layout from '@/components/layout'

export default function Assign() {
    const { user } = useAuth({ middleware: 'auth' })
    const [role, setRole] = useState(null)
    const [managerEmail, setManagerEmail] = useState('')
    const [operatorEmail, setOperatorEmail] = useState('')
    const [viewerEmail, setViewerEmail] = useState('')
    const [operatorManagerEmail, setOperatorManagerEmail] = useState('') // Separate manager email for operators
    const [viewerManagerEmail, setViewerManagerEmail] = useState('') // Separate manager email for viewers

    useEffect(() => {
        if (user) {
            setRole(user.role_id)
        }
    }, [user])

    const assignRole = async (roleType) => {
        try {
            let payload = {}
            let endpoint = ''

            if (roleType === 'manager') {
                endpoint = '/api/manager-assign'
                payload = { managerEmail }
            } else if (roleType === 'operator') {
                endpoint = '/api/operator-assign'
                payload = { operatorEmail, managerEmail: operatorManagerEmail }
            } else if (roleType === 'viewer') {
                endpoint = '/api/viewer-assign'
                payload = { viewerEmail, managerEmail: viewerManagerEmail }
            }

            const response = await axios.post(endpoint, payload)

            alert(response.data.message || 'Role assigned successfully')

            // Clear input fields after assignment
            if (roleType === 'manager') setManagerEmail('')
            if (roleType === 'operator') {
                setOperatorEmail('')
                setOperatorManagerEmail('')
            }
            if (roleType === 'viewer') {
                setViewerEmail('')
                setViewerManagerEmail('')
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign role')
        }
    }

    return (
        <Layout>
            <div className="container mt-4">
                <h1 className="mb-3">
                    User ID: {user?.id} | Role: {user?.role_id}
                </h1>

                {role === 1 && (
                    <div className="card p-3 mb-3">
                        <h2 className="h5">Assign Manager</h2>
                        <div className="input-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                value={managerEmail}
                                onChange={(e) =>
                                    setManagerEmail(e.target.value)
                                }
                                placeholder="Manager Email"
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => assignRole('manager')}
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                )}

                {(role === 1 || role === 2) && (
                    <div className="card p-3 mb-3">
                        <h2 className="h5">Assign Operator</h2>
                        <div className="input-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                value={operatorEmail}
                                onChange={(e) =>
                                    setOperatorEmail(e.target.value)
                                }
                                placeholder="Operator Email"
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                value={operatorManagerEmail}
                                onChange={(e) =>
                                    setOperatorManagerEmail(e.target.value)
                                }
                                placeholder="Manager Email"
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => assignRole('operator')}
                        >
                            Assign
                        </button>
                    </div>
                )}

                {(role === 1 || role === 2) && (
                    <div className="card p-3">
                        <h2 className="h5">Assign Viewer</h2>
                        <div className="input-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                value={viewerEmail}
                                onChange={(e) => {
                                    setViewerEmail(e.target.value)
                                    // Auto-fill Manager Email only if empty
                                    if (!viewerManagerEmail) {
                                        setViewerManagerEmail(e.target.value)
                                    }
                                }}
                                placeholder="Viewer Email"
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                value={viewerManagerEmail}
                                onChange={(e) =>
                                    setViewerManagerEmail(e.target.value)
                                }
                                placeholder="Manager Email"
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => assignRole('viewer')}
                        >
                            Assign
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    )
}

"use client"
import React, { useState } from 'react'
import axios from '@/lib/axios'
import "./unAssign.css"

export default function UnAssign( ) {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('manager')
    const [managerEmail, setManagerEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleUnassign = async () => {
        try {
            let endpoint = ''
            let data = {}

            switch (role) {
                case 'manager':
                    endpoint = '/api/manager-unassign'
                    data = { managerEmail: email }
                    break
                case 'operator':
                    endpoint = '/api/operator-unassign'
                    data = { operatorEmail: email, managerEmail }
                    break
                case 'viewer':
                    endpoint = '/api/viewer-unassign'
                    data = { viewerEmail: email, managerEmail }
                    break
                default:
                    setMessage('Invalid role selected')
                    return
            }

            const response = await axios.post(endpoint, data)
            setMessage(`Success: ${response.data.message}`)
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`)
        }
    }

    return (
        <div className='unassign'>
            <h1>Unassign Role</h1>
            <div>
                <label>
                    Role to Unassign:
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="manager">Manager</option>
                        <option value="operator">Operator</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    User Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter user email"
                    />
                </label>
            </div>
            {role !== 'manager' && (
                <div>
                    <label>
                        Manager Email:
                        <input
                            type="email"
                            value={managerEmail}
                            onChange={(e) => setManagerEmail(e.target.value)}
                            placeholder="Enter manager email"
                        />
                    </label>
                </div>
            )}
            <button onClick={handleUnassign}>Unassign Role</button>
            {message && <p>{message}</p>}
        </div>
    )
}
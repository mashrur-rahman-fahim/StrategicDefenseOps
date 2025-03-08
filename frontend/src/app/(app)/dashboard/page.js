'use client'
import React, { useEffect, useState } from 'react'
import axios from '../../../lib/axios'
import CreateOperation from '../../../components/CreateOperation'
import ListOperations from '../../../components/ListOperations'
import './dashboard.css'
import Layout from '@/components/layout'
import AuditLogs from '@/components/AuditLogs'
import Notification from '@/components/Notification'


const Dashboard = () => {
    const [userName, setUserName] = useState('Unknown')
    const [roleId, setRoleId] = useState(null)
    const [roleName, setRoleName] = useState('')
    const [operations, setOperations] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const roleMapping = {
        1: 'Admin',
        2: 'Manager',
        3: 'Operator',
        4: 'Viewer',
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`)
                console.log('API response:', response.data)
                setUserName(response.data.name || 'Unknown')
                setRoleId(response.data.role_id || null)
                setRoleName(roleMapping[response.data.role_id] || 'Unknown')
                setUser(response.data.id || null)
            } catch (error) {
                console.error('Error fetching user details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserDetails()
    }, [])

    const handleOperationCreated = (newOperation) => {
        setOperations([...operations, newOperation])
    }

    return (
        <Layout>
            <div className="dashboard">
                <h2>Welcome, {userName} ({roleName}) ({user})</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {roleId === 1 && <CreateOperation onOperationCreated={handleOperationCreated} />}
                        <ListOperations />
                        {user && <AuditLogs user={user} />}
                        {/* {user && <Notification user={user} />} */}
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Dashboard

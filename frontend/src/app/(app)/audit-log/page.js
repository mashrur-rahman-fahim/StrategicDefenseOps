'use client'
import React, { useEffect, useState } from 'react'
import axios from '../../../lib/axios'
import Layout from '@/components/layout'
import AuditLogs from '@/components/AuditLogs'
import './audit-log.css'

const Dashboard = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)


    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`)
                console.log('API response:', response.data)
                setUser(response.data.id || null)
            } catch (error) {
                console.error('Error fetching user details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserDetails()
    }, [])


    return (
        <Layout>
            <div className="dashboard">
                <h2></h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {user && <AuditLogs user={user} />}
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Dashboard

'use client';
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '@/components/layout';
import axios from '@/lib/axios';
import Notification from '@/components/Notification'
import './notifications.css'

const Notifications = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)



    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`)
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
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {user && <Notification user={user} />}
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Notifications
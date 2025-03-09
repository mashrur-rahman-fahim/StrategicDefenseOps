'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/layout'
import axios from '@/lib/axios'
import Notification from '@/components/Notification'

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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
            >
                <div className="space-y-6">
                   
                    {loading ? (
                        <div className="h-48 sm:h-64 bg-gray-100 animate-pulse rounded-xl" />
                    ) : (
                        user && <Notification user={user} />
                    )}
                </div>
            </motion.div>
        </Layout>
    )
}

export default Notifications
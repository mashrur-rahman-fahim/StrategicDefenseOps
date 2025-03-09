'use client';
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '@/components/layout';
import axios from '@/lib/axios';
import AuditLogs from '@/components/AuditLogs';

const AuditLog = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`);
                setUser(response.data.id || null);
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <Layout>
            <div className="dashboard bg-gray-50 min-h-screen">
                <Container className="py-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {user && <AuditLogs user={user} />}
                        </>
                    )}
                </Container>
            </div>
        </Layout>
    );
};

export default AuditLog;
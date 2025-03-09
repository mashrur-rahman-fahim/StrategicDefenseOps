'use client';
import React, { useState, useEffect } from 'react';
import { Container, Spinner, Row, Col, Card, Badge } from 'react-bootstrap';
import Layout from '@/components/layout';
import axios from '@/lib/axios';
import Notification from '@/components/Notification';

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
            <div className="notifications-page bg-light">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={8} className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="h3 mb-0 text-primary font-weight-bold">
                                    <i className="fas fa-bell me-2"></i>Notifications
                                </h1>
                                <Badge pill bg="secondary" className="align-self-start">
                                    New
                                </Badge>
                            </div>
                            
                            <Card className="shadow-sm">
                                <Card.Body className="p-0">
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                            <p className="mt-2 text-muted">Loading notifications...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {user && <Notification user={user} />}
                                            {!loading && !user && (
                                                <div className="text-center py-5">
                                                    <i className="fas fa-bell-slash text-muted fa-2x mb-3"></i>
                                                    <p className="text-muted">No notifications available</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <style jsx global>{`
                    .notifications-page {
                        min-height: calc(100vh - 120px);
                    }
                    .notification-item {
                        padding: 1.25rem;
                        border-bottom: 1px solid rgba(0,0,0,.05);
                        transition: all 0.3s ease;
                    }
                    .notification-item:last-child {
                        border-bottom: none;
                    }
                    .notification-item:hover {
                        background-color: #f8f9fa;
                        transform: translateX(5px);
                    }
                    .notification-time {
                        font-size: 0.85rem;
                        color: #6c757d;
                    }
                    .card {
                        border-radius: 0.75rem;
                        border: none;
                    }
                    .badge-pill {
                        font-size: 0.75rem;
                        padding: 0.35em 0.65em;
                    }
                `}</style>
            </div>
        </Layout>
    )
}

export default Notifications
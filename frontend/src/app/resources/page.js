'use client'
import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Container } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import ResourceFormModal from './ResourceFormModal'
import { Toaster, toast } from 'sonner'

export default function Resources() {
    //const { user } = useAuth({ middleware: 'auth', redirectIfAuthenticated: '/resources' });
    const [resourceData, setResourceData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const resourceCategories = [
        {
            type: 'Weapons',
            icon: 'tabler:bomb-filled',
            totalAvailable: 3669,
            inUse: 369,
            underMaintenance: 40,
        },
        {
            type: 'Vehicles',
            icon: 'mdi:tank',
            totalAvailable: 3134,
            inUse: 269,
            underMaintenance: 10,
        },
        {
            type: 'Personnel',
            icon: 'fa6-solid:person-military-rifle',
            totalAvailable: 12669,
            inUse: 33032,
            underMaintenance: 404,
        },
        {
            type: 'Equipments',
            icon: 'mdi:medical-bag',
            totalAvailable: 7711,
            inUse: 3469,
            underMaintenance: 0,
        },
    ]

    const fetchResources = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/get-all-resources')
            console.log('Resources:', response.data)
            setResourceData(response.data)
            setError(null)
        } catch (err) {
            setError('Failed to fetch resources')
            console.error('Error fetching resources:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchResources()
    }, [])

    const handleOpenModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    return (
        <Container fluid className="p-4">
            {/* Resource Overview*/}

            {loading ? (
                <div className="text-center">Loading resources...</div>
            ) : error ? (
                <div className="text-danger">{error}</div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <h1 className="mb-4">Resource Overview</h1>
                        <Button
                            variant="outline-primary"
                            className="mb-4"
                            onClick={handleOpenModal}>
                            New Resource
                        </Button>
                    </div>

                    <Row className="g-3">
                        {resourceCategories.map((category, index) => (
                            <Col key={index} xs={12} sm={6} lg={3}>
                                <Card className="shadow-sm bg-light">
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <Icon
                                                icon={category.icon}
                                                width="24"
                                                height="24"
                                            />
                                            <h5 className="fw-bold mb-0 ms-1">
                                                {category.type}
                                            </h5>
                                        </div>
                                        <div className="mb-2">
                                            <div className="d-flex justify-content-between">
                                                <span>Total Available:</span>
                                                <span className="text-success fw-bold">
                                                    {category.totalAvailable}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>In Use:</span>
                                                <span className="text-danger">
                                                    {category.inUse}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Under Maintenance:</span>
                                                <span className="text-warning">
                                                    {category.underMaintenance}
                                                </span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <h3>Total Resources: {resourceData[0]}</h3>

                    <ResourceFormModal
                        show={showModal}
                        handleClose={handleCloseModal}
                        refreshResources={fetchResources}
                    />
                </>
            )}
        </Container>
    )
}

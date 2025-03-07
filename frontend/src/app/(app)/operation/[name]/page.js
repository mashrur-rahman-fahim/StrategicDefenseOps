'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Spinner,
    Table
} from 'react-bootstrap'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import Layout from '@/components/layout'
import Link from 'next/link'

export default function OperationDetail() {
    const params = useParams()
    const router = useRouter()
    const [operation, setOperation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [resources, setResources] = useState([])

    const operationName = params?.name ? decodeURIComponent(params.name) : null

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')

        // Combine date and time
        return `${day}/${month}/${year} at ${hours}:${minutes}`
    }

    const fetchOperationDetails = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `/api/search-operations/${operationName}`
            )
            console.log('Operation details:', response.data[1][0])
            setOperation(response.data[1][0])
        } catch (error) {
            console.error('Error fetching operation details:', error)
            setError('Failed to load operation details')
            toast.error('Failed to load operation details')
        } finally {
            setLoading(false)
        }
    }

    const fetchOperationResources = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `/api/get-operation-resources/${operation.id}`
            )
            console.log('Operation resources:', response.data)
            const {
                vehicle = [],
                weapon = [],
                personnel = [],
                equipment = []
            } = response.data || {}
            const allResources = [
                ...vehicle.map((v) => ({ ...v, type: 'Vehicle' })),
                ...weapon.map((w) => ({ ...w, type: 'Weapon' })),
                ...personnel.map((p) => ({ ...p, type: 'Personnel' })),
                ...equipment.map((e) => ({ ...e, type: 'Equipment' }))
            ]
            setResources(allResources)
            console.log('All resources:', allResources)
        } catch (error) {
            console.error('Error fetching operation resources:', error)
            setError('Failed to fetch operation resources')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (operationName) {
            fetchOperationDetails()
        } else {
            setError('Operation not found')
        }
    }, [operationName])

    useEffect(() => {
        if (operation?.id) {
            fetchOperationResources()
        }
    }, [operation])

    const getStatusColor = (status) => {
        switch (status) {
            case 'ongoing':
                return 'success'
            case 'upcoming':
                return 'warning'
            case 'completed':
                return 'primary'
            default:
                return 'secondary'
        }
    }

    if (loading) {
        return (
            <Layout>
                <Container fluid className="p-4">
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '300px' }}
                    >
                        <Spinner animation="border" variant="primary" />
                    </div>
                </Container>
            </Layout>
        )
    }

    if (error || !operation) {
        return (
            <Layout>
                <Container fluid className="p-4">
                    <div className="text-center my-5">
                        <h3 className="text-danger mb-3">Error</h3>
                        <p>{error || 'Operation not found'}</p>
                        <Button
                            variant="primary"
                            onClick={() => router.push('/operation')}
                        >
                            Return to Operations
                        </Button>
                    </div>
                </Container>
            </Layout>
        )
    }

    return (
        <Layout>
            <Container fluid className="p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>{operation.name}</h1>
                    <Link href="/operation" passHref>
                        <Button variant="outline-secondary">
                            <Icon icon="mdi:arrow-left" className="me-2" /> Back
                            to Operations
                        </Button>
                    </Link>
                </div>

                {/* Main Content */}
                <Row>
                    {/* Left Column - Operation Details */}
                    <Col lg={8}>
                        <Card className="shadow-sm mb-4">
                            <Card.Header className="bg-white">
                                <h4 className="mb-0">Operation Details</h4>
                            </Card.Header>
                            <Card.Body>
                                <Row className="mb-4">
                                    <Col sm={4} className="fw-bold">
                                        Status
                                    </Col>
                                    <Col sm={8}>
                                        <Badge
                                            bg={getStatusColor(
                                                operation.status
                                            )}
                                            className="px-3 py-2"
                                        >
                                            {operation.status.toUpperCase()}
                                        </Badge>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col sm={4} className="fw-bold">
                                        Description
                                    </Col>
                                    <Col sm={8}>
                                        {operation.description ||
                                            'No description provided'}
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col sm={4} className="fw-bold">
                                        Budget
                                    </Col>
                                    <Col sm={8}>
                                        {`$${operation?.budget}` || '$0'}
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col sm={4} className="fw-bold">
                                        Start Date
                                    </Col>
                                    <Col sm={8}>
                                        {formatDate(operation.start_date) ||
                                            'Not specified'}
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col sm={4} className="fw-bold">
                                        End Date
                                    </Col>
                                    <Col sm={8}>
                                        {formatDate(operation.end_date) ||
                                            'Not specified'}
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col sm={4} className="fw-bold">
                                        Location
                                    </Col>
                                    <Col sm={8}>
                                        {operation.location || 'Not specified'}
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col sm={4} className="fw-bold">
                                        Created
                                    </Col>
                                    <Col sm={8}>
                                        {operation.created_at
                                            ? formatDate(operation.created_at)
                                            : 'Not available'}
                                    </Col>
                                </Row>

                                {operation?.updated_at && (
                                    <Row>
                                        <Col sm={4} className="fw-bold">
                                            Updated
                                        </Col>
                                        <Col sm={8}>
                                            {formatDate(operation.updated_at)}
                                        </Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>

                        <Col lg={12}>
                            <Card className="shadow-sm mb-4">
                                <Card.Header className="bg-white">
                                    <h5 className="mb-0">Resources Used</h5>
                                </Card.Header>
                                <Card.Body>
                                    {resources.length > 0 ? (
                                        <Table
                                            striped
                                            bordered
                                            hover
                                            responsive
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Name</th>
                                                    <th>Count</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resources.map((res, index) => {
                                                    // Dynamically determine the keys
                                                    const nameKey = `${res.type.toLowerCase()}_name`
                                                    const countKey = `${res.type.toLowerCase()}_count`

                                                    return (
                                                        <tr key={index}>
                                                            <td>{res.type}</td>
                                                            <td>
                                                                {res[nameKey] ||
                                                                    'N/A'}
                                                            </td>
                                                            <td>
                                                                {res[
                                                                    countKey
                                                                ] || 'N/A'}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p>No resources assigned.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Col>

                    {/* Right Column - Additional Information */}
                    <Col lg={4}>
                        {/* Status Card */}
                        <Card className="shadow-sm mb-4">
                            <Card.Body className="p-0">
                                <div
                                    className={`bg-${getStatusColor(operation.status)} text-white p-3`}
                                >
                                    <h5 className="mb-0">Current Status</h5>
                                </div>
                                <div className="p-3">
                                    <h3 className="mb-0">
                                        {operation.status === 'ongoing'
                                            ? 'Operation In Progress'
                                            : operation.status === 'upcoming'
                                              ? 'Scheduled Operation'
                                              : 'Operation Completed'}
                                    </h3>
                                    {operation.status === 'ongoing' &&
                                        operation.start_date && (
                                            <p className="mt-2 mb-0">
                                                Started on{' '}
                                                {formatDate(
                                                    operation.start_date
                                                )}
                                            </p>
                                        )}
                                    {operation.status === 'upcoming' &&
                                        operation.start_date && (
                                            <p className="mt-2 mb-0">
                                                Starts on{' '}
                                                {formatDate(
                                                    operation.start_date
                                                )}
                                            </p>
                                        )}
                                    {operation.status === 'completed' &&
                                        operation.end_date && (
                                            <p className="mt-2 mb-0">
                                                Completed on{' '}
                                                {formatDate(operation.end_date)}
                                            </p>
                                        )}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Quick Actions Card */}
                        {/* <Card className="shadow-sm mb-4">
                            <Card.Body>
                                <h5 className="mb-3">Quick Actions</h5>
                                <div className="d-grid gap-2">
                                    <Button variant="outline-secondary">
                                        <Icon
                                            icon="mdi:file-document"
                                            className="me-2"
                                        />{' '}
                                        Generate Report
                                    </Button>
                                    <Button variant="outline-secondary">
                                        <Icon
                                            icon="grommet-icons:resources"
                                            className="me-2"
                                        />{' '}
                                        View Resources
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card> */}

                        {/* Location Card (if location exists) */}
                        {operation.location && (
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <h5 className="mb-3">
                                        <Icon
                                            icon="mdi:map-marker"
                                            className="me-2"
                                        />
                                        Location
                                    </h5>
                                    <p>{operation.location}</p>
                                    <div
                                        className="bg-light rounded"
                                        style={{
                                            height: '150px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div className="text-center position-absolute top-50 start-50 translate-middle">
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    window.open(
                                                        `https://maps.google.com/?q=${operation.location}`,
                                                        '_blank'
                                                    )
                                                }
                                            >
                                                <Icon
                                                    icon="mdi:map"
                                                    className="me-2"
                                                />
                                                View on Map
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}

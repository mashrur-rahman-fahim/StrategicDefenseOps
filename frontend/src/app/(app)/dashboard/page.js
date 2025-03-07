'use client'
import React, { useState, useEffect } from 'react'
import {
    Card,
    Row,
    Col,
    Container,
    Button,
    Table,
    ProgressBar,
    Badge,
} from 'react-bootstrap'
import { Icon } from '@iconify/react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import Layout from '@/components/layout'
import Loading from '@/components/Loading'
import Link from 'next/link'

export default function Dashboard() {
    const { user } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({
        resources: {
            weapons: 0,
            vehicles: 0,
            personnel: 0,
            equipment: 0,
            total: 0,
        },
        operations: {
            ongoing: 0,
            upcoming: 0,
            completed: 0,
            total: 0,
        },
    })
    const [recentOperations, setRecentOperations] = useState([])
    const [topResources, setTopResources] = useState([])

    const role = {
        1: 'Admin',
        2: 'Manager',
        3: 'Operator',
        4: 'Viewer',
    }

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            // Get resource counts
            const resourcesResponse = await axios.get('/api/get-all-resources')
            const resourceData = resourcesResponse.data[1] || []

            // Get operations
            const operationsResponse = await axios.get(
                '/api/get-all-operations',
            )
            const operationsData = operationsResponse.data[1] || []

            // Calculate resource stats
            const totalWeaponCount = resourceData.reduce((total, resource) => {
                return total + (resource.weapon_count || 0)
            }, 0)

            const totalVehicleCount = resourceData.reduce((total, resource) => {
                return total + (resource.vehicle_count || 0)
            }, 0)

            const totalPersonnelCount = resourceData.reduce(
                (total, resource) => {
                    return total + (resource.personnel_count || 0)
                },
                0,
            )

            const totalEquipmentCount = resourceData.reduce(
                (total, resource) => {
                    return total + (resource.equipment_count || 0)
                },
                0,
            )

            // Calculate operation stats
            const ongoingOps = operationsData.filter(
                op => op.status === 'ongoing',
            ).length
            const upcomingOps = operationsData.filter(
                op => op.status === 'upcoming',
            ).length
            const completedOps = operationsData.filter(
                op => op.status === 'completed',
            ).length

            setStats({
                resources: {
                    weapons: totalWeaponCount,
                    vehicles: totalVehicleCount,
                    personnel: totalPersonnelCount,
                    equipment: totalEquipmentCount,
                    total:
                        totalWeaponCount +
                        totalVehicleCount +
                        totalPersonnelCount +
                        totalEquipmentCount,
                },
                operations: {
                    ongoing: ongoingOps,
                    upcoming: upcomingOps,
                    completed: completedOps,
                    total: operationsData.length,
                },
            })

            // Get recent operations (5 most recent)
            const sortedOperations = [...operationsData]
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 5)

            setRecentOperations(sortedOperations)

            // Get top resources (most available)
            const topResourcesList = [...resourceData]
                .sort((a, b) => {
                    const countA =
                        a.weapon_count ||
                        a.vehicle_count ||
                        a.personnel_count ||
                        a.equipment_count ||
                        0
                    const countB =
                        b.weapon_count ||
                        b.vehicle_count ||
                        b.personnel_count ||
                        b.equipment_count ||
                        0
                    return countB - countA
                })
                .slice(0, 5)

            setTopResources(topResourcesList)

            setError(null)
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
            setError('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const getResourceName = resource => {
        return (
            resource.weapon_name ||
            resource.vehicle_name ||
            resource.personnel_name ||
            resource.equipment_name ||
            'Unknown Resource'
        )
    }

    const getResourceCount = resource => {
        return (
            resource.weapon_count ||
            resource.vehicle_count ||
            resource.personnel_count ||
            resource.equipment_count ||
            0
        )
    }

    const getResourceType = resource => {
        if (resource.weapon_name) return 'Weapon'
        if (resource.vehicle_name) return 'Vehicle'
        if (resource.personnel_name) return 'Personnel'
        if (resource.equipment_name) return 'Equipment'
        return 'Unknown'
    }

    const getStatusBadge = status => {
        switch (status) {
            case 'ongoing':
                return <Badge bg="primary">Ongoing</Badge>
            case 'upcoming':
                return <Badge bg="warning">Upcoming</Badge>
            case 'completed':
                return <Badge bg="success">Completed</Badge>
            default:
                return <Badge bg="secondary">Unknown</Badge>
        }
    }

    const formatDate = dateString => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <Layout>
            <Container fluid className="p-4">
                {loading ? (
                    <Loading text={'Loading Dashboard...'} />
                ) : error ? (
                    <div className="text-center text-danger">{error}</div>
                ) : (
                    <>
                        <div>
                            <h1 className="mb-1">Dashboard</h1>
                            <p className="text-muted mb-0">
                                Welcome back, {`${user?.name} (${role[user.role_id]})` || 'User'}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <h4 className="mt-4 mb-3">Quick Actions</h4>
                        <Row className="g-3 mb-4">
                            <Col xs={6} sm={4} md={3} xl={2}>
                                <Card className="shadow-sm h-100 border-0 text-center">
                                    <Card.Body className="p-3">
                                        <Link
                                            href="/operation"
                                            className="text-decoration-none">
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                                <Icon
                                                    icon="mdi:plus-circle-outline"
                                                    width="28"
                                                    height="28"
                                                    className="text-primary"
                                                />
                                            </div>
                                            <h6 className="mb-0 text-body">
                                                New Operation
                                            </h6>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={6} sm={4} md={3} xl={2}>
                                <Card className="shadow-sm h-100 border-0 text-center">
                                    <Card.Body className="p-3">
                                        <Link
                                            href="/resources"
                                            className="text-decoration-none">
                                            <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                                <Icon
                                                    icon="mdi:cube-outline"
                                                    width="28"
                                                    height="28"
                                                    className="text-success"
                                                />
                                            </div>
                                            <h6 className="mb-0 text-body">
                                                Resources
                                            </h6>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={6} sm={4} md={3} xl={2}>
                                <Card className="shadow-sm h-100 border-0 text-center">
                                    <Card.Body className="p-3">
                                        <Link
                                            href="/assign"
                                            className="text-decoration-none">
                                            <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                                <Icon
                                                    icon="mdi:arrow-right-bold-box"
                                                    width="28"
                                                    height="28"
                                                    className="text-info"
                                                />
                                            </div>
                                            <h6 className="mb-0 text-body">
                                                Assign Resources
                                            </h6>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={6} sm={4} md={3} xl={2}>
                                <Card className="shadow-sm h-100 border-0 text-center">
                                    <Card.Body className="p-3">
                                        <Link
                                            href="/un-assign"
                                            className="text-decoration-none">
                                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                                <Icon
                                                    icon="mdi:arrow-left-bold-box"
                                                    width="28"
                                                    height="28"
                                                    className="text-warning"
                                                />
                                            </div>
                                            <h6 className="mb-0 text-body">
                                                Unassign Resources
                                            </h6>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={6} sm={4} md={3} xl={2}>
                                <Card className="shadow-sm h-100 border-0 text-center">
                                    <Card.Body className="p-3">
                                        <Link
                                            href="/view-roles"
                                            className="text-decoration-none">
                                            <div className="bg-secondary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                                <Icon
                                                    icon="mdi:account-group"
                                                    width="28"
                                                    height="28"
                                                    className="text-secondary"
                                                />
                                            </div>
                                            <h6 className="mb-0 text-body">
                                                View Roles
                                            </h6>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Resource Stats */}
                        <h4 className="mt-4 mb-3">Resource Overview</h4>
                        <Row className="g-3 mb-4">
                            <Col xs={12} sm={6} lg={3}>
                                <Card className="shadow-sm h-100 border-0">
                                    <Card.Body>
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div>
                                                <div className="text-muted mb-1">
                                                    Weapons
                                                </div>
                                                <h3 className="mb-0">
                                                    {stats.resources.weapons}
                                                </h3>
                                            </div>
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                                                <Icon
                                                    icon="tabler:bomb-filled"
                                                    width="24"
                                                    height="24"
                                                    className="text-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <ProgressBar
                                                now={
                                                    stats.resources.total
                                                        ? (stats.resources
                                                              .weapons /
                                                              stats.resources
                                                                  .total) *
                                                          100
                                                        : 0
                                                }
                                                variant="primary"
                                                className="mt-2"
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} sm={6} lg={3}>
                                <Card className="shadow-sm h-100 border-0">
                                    <Card.Body>
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div>
                                                <div className="text-muted mb-1">
                                                    Vehicles
                                                </div>
                                                <h3 className="mb-0">
                                                    {stats.resources.vehicles}
                                                </h3>
                                            </div>
                                            <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                                                <Icon
                                                    icon="mdi:tank"
                                                    width="24"
                                                    height="24"
                                                    className="text-success"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <ProgressBar
                                                now={
                                                    stats.resources.total
                                                        ? (stats.resources
                                                              .vehicles /
                                                              stats.resources
                                                                  .total) *
                                                          100
                                                        : 0
                                                }
                                                variant="success"
                                                className="mt-2"
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} sm={6} lg={3}>
                                <Card className="shadow-sm h-100 border-0">
                                    <Card.Body>
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div>
                                                <div className="text-muted mb-1">
                                                    Personnel
                                                </div>
                                                <h3 className="mb-0">
                                                    {stats.resources.personnel}
                                                </h3>
                                            </div>
                                            <div className="bg-info bg-opacity-10 p-2 rounded-circle">
                                                <Icon
                                                    icon="fa6-solid:person-military-rifle"
                                                    width="24"
                                                    height="24"
                                                    className="text-info"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <ProgressBar
                                                now={
                                                    stats.resources.total
                                                        ? (stats.resources
                                                              .personnel /
                                                              stats.resources
                                                                  .total) *
                                                          100
                                                        : 0
                                                }
                                                variant="info"
                                                className="mt-2"
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} sm={6} lg={3}>
                                <Card className="shadow-sm h-100 border-0">
                                    <Card.Body>
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div>
                                                <div className="text-muted mb-1">
                                                    Equipment
                                                </div>
                                                <h3 className="mb-0">
                                                    {stats.resources.equipment}
                                                </h3>
                                            </div>
                                            <div className="bg-warning bg-opacity-10 p-2 rounded-circle">
                                                <Icon
                                                    icon="mdi:medical-bag"
                                                    width="24"
                                                    height="24"
                                                    className="text-warning"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <ProgressBar
                                                now={
                                                    stats.resources.total
                                                        ? (stats.resources
                                                              .equipment /
                                                              stats.resources
                                                                  .total) *
                                                          100
                                                        : 0
                                                }
                                                variant="warning"
                                                className="mt-2"
                                            />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Operations Stats */}
                        <h4 className="mt-4 mb-3">Operations Status</h4>
                        <Row className="g-3 mb-4">
                            <Col xs={12} md={6} xl={3}>
                                <Card className="shadow-sm border-primary border-start border-4 border-top-0 border-bottom-0 border-end-0 h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="text-muted mb-1">
                                                    Ongoing Operations
                                                </h6>
                                                <h4 className="mb-0">
                                                    {stats.operations.ongoing}
                                                </h4>
                                            </div>
                                            <div className="bg-primary bg-opacity-10 p-2 rounded">
                                                <Icon
                                                    icon="mdi:chart-timeline-variant"
                                                    width="24"
                                                    height="24"
                                                    className="text-primary"
                                                />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} md={6} xl={3}>
                                <Card className="shadow-sm border-warning border-start border-4 border-top-0 border-bottom-0 border-end-0 h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="text-muted mb-1">
                                                    Upcoming Operations
                                                </h6>
                                                <h4 className="mb-0">
                                                    {stats.operations.upcoming}
                                                </h4>
                                            </div>
                                            <div className="bg-warning bg-opacity-10 p-2 rounded">
                                                <Icon
                                                    icon="mdi:calendar-clock"
                                                    width="24"
                                                    height="24"
                                                    className="text-warning"
                                                />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} md={6} xl={3}>
                                <Card className="shadow-sm border-success border-start border-4 border-top-0 border-bottom-0 border-end-0 h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="text-muted mb-1">
                                                    Completed Operations
                                                </h6>
                                                <h4 className="mb-0">
                                                    {stats.operations.completed}
                                                </h4>
                                            </div>
                                            <div className="bg-success bg-opacity-10 p-2 rounded">
                                                <Icon
                                                    icon="mdi:check-circle-outline"
                                                    width="24"
                                                    height="24"
                                                    className="text-success"
                                                />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} md={6} xl={3}>
                                <Card className="shadow-sm border-info border-start border-4 border-top-0 border-bottom-0 border-end-0 h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="text-muted mb-1">
                                                    Total Operations
                                                </h6>
                                                <h4 className="mb-0">
                                                    {stats.operations.total}
                                                </h4>
                                            </div>
                                            <div className="bg-info bg-opacity-10 p-2 rounded">
                                                <Icon
                                                    icon="mdi:clipboard-list-outline"
                                                    width="24"
                                                    height="24"
                                                    className="text-info"
                                                />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Recent Operations and Top Resources */}
                        <Row className="g-4 mt-2">
                            <Col xs={12} lg={6}>
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Header className="bg-white border-bottom-0 pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">
                                                Recent Operations
                                            </h5>
                                            <Button
                                                as={Link}
                                                href="/operations"
                                                variant="link"
                                                className="p-0">
                                                View All
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="pt-0">
                                        {recentOperations.length === 0 ? (
                                            <div className="text-center py-4 text-muted">
                                                <Icon
                                                    icon="mdi:clipboard-text-outline"
                                                    width="48"
                                                    height="48"
                                                    className="mb-2"
                                                />
                                                <p>No operations found</p>
                                            </div>
                                        ) : (
                                            <Table
                                                responsive
                                                hover
                                                className="mt-3">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentOperations.map(
                                                        (operation, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <Link
                                                                        href={`/operations/${operation.id}`}
                                                                        className="text-decoration-none">
                                                                        {
                                                                            operation.name
                                                                        }
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    {getStatusBadge(
                                                                        operation.status,
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {formatDate(
                                                                        operation.start_date,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12} lg={6}>
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Header className="bg-white border-bottom-0 pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">
                                                Top Resources
                                            </h5>
                                            <Button
                                                as={Link}
                                                href="/resources"
                                                variant="link"
                                                className="p-0">
                                                View All
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="pt-0">
                                        {topResources.length === 0 ? (
                                            <div className="text-center py-4 text-muted">
                                                <Icon
                                                    icon="mdi:package-variant-closed"
                                                    width="48"
                                                    height="48"
                                                    className="mb-2"
                                                />
                                                <p>No resources found</p>
                                            </div>
                                        ) : (
                                            <Table
                                                responsive
                                                hover
                                                className="mt-3">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Type</th>
                                                        <th>Available</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topResources.map(
                                                        (resource, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {getResourceName(
                                                                        resource,
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {getResourceType(
                                                                        resource,
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <span className="fw-bold">
                                                                        {getResourceCount(
                                                                            resource,
                                                                        )}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Resource Allocation Chart */}
                        <Row className="mt-4">
                            <Col xs={12}>
                                <Card className="shadow-sm border-0">
                                    <Card.Header className="bg-white pt-4 border-bottom-0">
                                        <h5 className="mb-0">
                                            Resource Allocation
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col
                                                md={6}
                                                className="mb-4 mb-md-0">
                                                <h6 className="text-muted mb-3">
                                                    Resource Distribution
                                                </h6>
                                                {stats.resources.total === 0 ? (
                                                    <div className="text-center py-4 text-muted">
                                                        <p>
                                                            No resource data
                                                            available
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="mb-3">
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span>
                                                                    Weapons
                                                                </span>
                                                                <span>
                                                                    {Math.round(
                                                                        (stats
                                                                            .resources
                                                                            .weapons /
                                                                            stats
                                                                                .resources
                                                                                .total) *
                                                                            100,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <ProgressBar
                                                                now={
                                                                    (stats
                                                                        .resources
                                                                        .weapons /
                                                                        stats
                                                                            .resources
                                                                            .total) *
                                                                    100
                                                                }
                                                                variant="primary"
                                                            />
                                                        </div>

                                                        <div className="mb-3">
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span>
                                                                    Vehicles
                                                                </span>
                                                                <span>
                                                                    {Math.round(
                                                                        (stats
                                                                            .resources
                                                                            .vehicles /
                                                                            stats
                                                                                .resources
                                                                                .total) *
                                                                            100,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <ProgressBar
                                                                now={
                                                                    (stats
                                                                        .resources
                                                                        .vehicles /
                                                                        stats
                                                                            .resources
                                                                            .total) *
                                                                    100
                                                                }
                                                                variant="success"
                                                            />
                                                        </div>

                                                        <div className="mb-3">
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span>
                                                                    Personnel
                                                                </span>
                                                                <span>
                                                                    {Math.round(
                                                                        (stats
                                                                            .resources
                                                                            .personnel /
                                                                            stats
                                                                                .resources
                                                                                .total) *
                                                                            100,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <ProgressBar
                                                                now={
                                                                    (stats
                                                                        .resources
                                                                        .personnel /
                                                                        stats
                                                                            .resources
                                                                            .total) *
                                                                    100
                                                                }
                                                                variant="info"
                                                            />
                                                        </div>

                                                        <div className="mb-3">
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span>
                                                                    Equipment
                                                                </span>
                                                                <span>
                                                                    {Math.round(
                                                                        (stats
                                                                            .resources
                                                                            .equipment /
                                                                            stats
                                                                                .resources
                                                                                .total) *
                                                                            100,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                            <ProgressBar
                                                                now={
                                                                    (stats
                                                                        .resources
                                                                        .equipment /
                                                                        stats
                                                                            .resources
                                                                            .total) *
                                                                    100
                                                                }
                                                                variant="warning"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </Layout>
    )
}

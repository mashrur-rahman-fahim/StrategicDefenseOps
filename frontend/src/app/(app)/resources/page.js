'use client'
import React, { useState, useEffect } from 'react'
import {
    Card,
    Button,
    Row,
    Col,
    Container,
    Form,
    InputGroup,
    Pagination,
    Dropdown
} from 'react-bootstrap'
import { Icon } from '@iconify/react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import ResourceFormModal from './ResourceFormModal'
import Layout from '@/components/layout'
import Loading from '../../../components/Loading'
import { toast } from 'sonner'

export default function Resources() {
    const { user } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/resources'
    })
    const [resourceData, setResourceData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [activeFilter, setActiveFilter] = useState('All')
    const [filteredResources, setFilteredResources] = useState([])
    const [selectedResource, setSelectedResource] = useState(null)
    const [editModalShow, setEditModalShow] = useState(false)
    const [totalCounts, setTotalCounts] = useState({
        weapons: 0,
        vehicles: 0,
        personnel: 0,
        equipment: 0
    })
    const itemsPerPage = 9

    const resourceCategories = [
        {
            type: 'Weapons',
            icon: 'tabler:bomb-filled',
            totalAvailable: totalCounts.weapons
        },
        {
            type: 'Vehicles',
            icon: 'mdi:tank',
            totalAvailable: totalCounts.vehicles
        },
        {
            type: 'Personnel',
            icon: 'fa6-solid:person-military-rifle',
            totalAvailable: totalCounts.personnel
        },
        {
            type: 'Equipments',
            icon: 'mdi:medical-bag',
            totalAvailable: totalCounts.equipment
        }
    ]

    const fetchResources = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/get-all-resources')
            console.log('Resources:', response.data)
            setResourceData(response.data)
            setFilteredResources(response.data[1] || [])
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

    //total counts for each resource category
    useEffect(() => {
        const totalWeaponCount = resourceData[1]?.reduce((total, resource) => {
            return total + (resource.weapon_count || 0)
        }, 0)

        const totalVehicleCount = resourceData[1]?.reduce((total, resource) => {
            return total + (resource.vehicle_count || 0)
        }, 0)

        const totalPersonnelCount = resourceData[1]?.reduce(
            (total, resource) => {
                return total + (resource.personnel_count || 0)
            },
            0
        )

        const totalEquipmentCount = resourceData[1]?.reduce(
            (total, resource) => {
                return total + (resource.equipment_count || 0)
            },
            0
        )

        setTotalCounts({
            weapons: totalWeaponCount,
            vehicles: totalVehicleCount,
            personnel: totalPersonnelCount,
            equipment: totalEquipmentCount
        })
    }, [resourceData])

    // Filter resources when activeFilter changes
    useEffect(() => {
        if (!resourceData[1]) return

        if (activeFilter === 'All') {
            setFilteredResources(resourceData[1])
        } else {
            let filtered = resourceData[1].filter((resource) => {
                switch (activeFilter) {
                    case 'Weapons':
                        return resource.weapon_name || resource.weapon_count
                    case 'Vehicles':
                        return resource.vehicle_name || resource.vehicle_count
                    case 'Personnel':
                        return (
                            resource.personnel_name || resource.personnel_count
                        )
                    case 'Equipments':
                        return (
                            resource.equipment_name || resource.equipment_count
                        )
                    default:
                        return true
                }
            })
            setFilteredResources(filtered)
        }
        // Reset to first page when filter changes
        setCurrentPage(1)
    }, [activeFilter, resourceData])

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredResources(resourceData[1] || [])
            setCurrentPage(1)
        }
    }, [searchTerm, resourceData])

    const handleOpenModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    const handleSearch = (e) => {
        e.preventDefault()
        if (!resourceData[1] || searchTerm.trim() === '') {
            setFilteredResources(resourceData[1] || [])
            return
        }

        const term = searchTerm.toLowerCase()
        let searchResults = resourceData[1].filter((resource) => {
            const weaponName = (resource.weapon_name || '').toLowerCase()
            const vehicleName = (resource.vehicle_name || '').toLowerCase()
            const personnelName = (resource.personnel_name || '').toLowerCase()
            const equipmentName = (resource.equipment_name || '').toLowerCase()
            const weaponType = (resource.weapon_type || '').toLowerCase()
            const vehicleType = (resource.vehicle_type || '').toLowerCase()
            const personnelCategory = (
                resource.personnel_category || ''
            ).toLowerCase()
            const equipmentType = (resource.equipment_type || '').toLowerCase()

            return (
                weaponName.includes(term) ||
                vehicleName.includes(term) ||
                personnelName.includes(term) ||
                equipmentName.includes(term) ||
                weaponType.includes(term) ||
                vehicleType.includes(term) ||
                personnelCategory.includes(term) ||
                equipmentType.includes(term)
            )
        })

        setFilteredResources(searchResults)
        setCurrentPage(1)
    }

    // Get current resources for pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentResources =
        filteredResources?.slice(indexOfFirstItem, indexOfLastItem) || []

    const totalPages = filteredResources
        ? Math.ceil(filteredResources.length / itemsPerPage)
        : 0

    // Generate pagination items
    const paginationItems = []
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        )
    }

    const getResourceName = (resource) => {
        return (
            resource.weapon_name ||
            resource.vehicle_name ||
            resource.personnel_name ||
            resource.equipment_name ||
            'Unknown Resource'
        )
    }

    // const getResourceImage = resource => {
    //     return (
    //         resource.weapon_image ||
    //         resource.vehicle_image ||
    //         resource.personnel_image ||
    //         resource.equipment_image ||
    //         'https://easydrawingguides.com/wp-content/uploads/2020/09/Tank-Step-10.png'
    //     )
    // }

    const getResourceType = (resource) => {
        return (
            resource.weapon_type ||
            resource.vehicle_type ||
            resource.personnel_category ||
            resource.equipment_type ||
            'N/A'
        )
    }

    const getResourceCount = (resource) => {
        return (
            resource.weapon_count ||
            resource.vehicle_count ||
            resource.personnel_count ||
            resource.equipment_count ||
            0
        )
    }

    const getResourceTypeCategory = (resource) => {
        if (resource.weapon_name) return 'weapon'
        if (resource.vehicle_name) return 'vehicle'
        if (resource.personnel_name) return 'personnel'
        if (resource.equipment_name) return 'equipment'
        return ''
    }

    const handleDelete = async (resource) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            const resourceName = getResourceName(resource)
            try {
                let endpoint = ''
                const resourceType = getResourceTypeCategory(resource)

                switch (resourceType) {
                    case 'weapon':
                        endpoint = `/api/delete-weapon/${resource.id}`
                        break
                    case 'vehicle':
                        endpoint = `/api/delete-vehicle/${resource.id}`
                        break
                    case 'personnel':
                        endpoint = `/api/delete-personnel/${resource.id}`
                        break
                    case 'equipment':
                        endpoint = `/api/delete-equipment/${resource.id}`
                        break
                    default:
                        throw new Error('Invalid resource type')
                }

                await axios.delete(endpoint)
                toast.success(
                    `${resourceName} deleted successfully` ||
                        'Resource deleted successfully'
                )
                fetchResources()
            } catch (error) {
                console.error('Delete error:', error)
                toast.error(
                    `Failed to delete ${resourceName}` ||
                        'Failed to delete resource'
                )
            }
        }
    }

    const handleEdit = (resource) => {
        const type = getResourceTypeCategory(resource)
        setSelectedResource({ ...resource, resourceType: type })
        setEditModalShow(true)
    }

    return (
        <Layout>
            <Container fluid className="p-4">
                {loading ? (
                    <Loading text={'Loading Resources...'} />
                ) : error ? (
                    <div className="text-center text-danger">{error}</div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <h1 className="mb-4">Resource Overview</h1>
                            {user?.role_id === 1 && (
                                <Button
                                    variant="primary"
                                    className="mb-4"
                                    onClick={handleOpenModal}
                                >
                                    New Resource
                                </Button>
                            )}
                        </div>

                        <Row className="g-3 mb-4">
                            {resourceCategories.map((category, index) => (
                                <Col key={index} xs={12} sm={6} lg={3}>
                                    <Card
                                        className={`shadow-sm ${activeFilter === category.type ? 'border border-primary' : 'bg-light'}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            setActiveFilter(category.type)
                                        }
                                    >
                                        <Card.Body>
                                            <div className="d-flex align-items-center mb-3">
                                                <Icon
                                                    icon={category.icon}
                                                    width="24"
                                                    height="24"
                                                    className={
                                                        activeFilter ===
                                                        category.type
                                                            ? 'text-primary'
                                                            : ''
                                                    }
                                                />
                                                <h5
                                                    className={`fw-bold mb-0 ms-1 ${activeFilter === category.type ? 'text-primary' : ''}`}
                                                >
                                                    {category.type}
                                                </h5>
                                            </div>
                                            <div className="mb-2">
                                                <div className="d-flex gap-1">
                                                    <span>
                                                        Total Available:
                                                    </span>
                                                    <span className="text-success fw-bold">
                                                        {
                                                            category.totalAvailable
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* All Resources Section */}
                        <div className="mt-5">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="mb-0">
                                    {activeFilter === 'All'
                                        ? 'All Resources'
                                        : activeFilter}
                                    {filteredResources.length > 0 && (
                                        <span className="ms-2 fs-5 text-secondary">
                                            ({filteredResources.length})
                                        </span>
                                    )}
                                </h1>

                                {activeFilter !== 'All' && (
                                    <Button
                                        variant="outline-secondary"
                                        className="mb-0"
                                        onClick={() => setActiveFilter('All')}
                                    >
                                        <Icon
                                            icon="mdi:filter-remove"
                                            className="me-1"
                                        />{' '}
                                        Clear Filter
                                    </Button>
                                )}
                            </div>

                            {/* Filter and Search */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="outline-primary"
                                        id="dropdown-filter"
                                        className="px-4"
                                    >
                                        <Icon
                                            icon="mdi:filter"
                                            className="me-1"
                                        />{' '}
                                        Filter
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            active={activeFilter === 'All'}
                                            onClick={() =>
                                                setActiveFilter('All')
                                            }
                                        >
                                            All Resources
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        {resourceCategories.map(
                                            (category, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    active={
                                                        activeFilter ===
                                                        category.type
                                                    }
                                                    onClick={() =>
                                                        setActiveFilter(
                                                            category.type
                                                        )
                                                    }
                                                >
                                                    {category.type}
                                                </Dropdown.Item>
                                            )
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Form onSubmit={handleSearch}>
                                    <InputGroup className="w-auto">
                                        <Form.Control
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        <Button variant="primary" type="submit">
                                            <Icon icon="bi:search" />
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </div>

                            {filteredResources.length === 0 ? (
                                <div className="text-center py-5">
                                    <Icon
                                        icon="mdi:file-search-outline"
                                        width="64"
                                        height="64"
                                        className="text-muted mb-3"
                                    />
                                    <h4>No resources found</h4>
                                    <p className="text-muted">
                                        {searchTerm
                                            ? `No results found for "${searchTerm}"`
                                            : `No ${activeFilter.toLowerCase()} resources available`}
                                    </p>
                                    {(searchTerm || activeFilter !== 'All') && (
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => {
                                                setSearchTerm('')
                                                setActiveFilter('All')
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Resource Cards */}
                                    <Row className="g-4">
                                        {currentResources.map(
                                            (resource, index) => (
                                                <Col
                                                    key={index}
                                                    sm={12}
                                                    md={6}
                                                    lg={4}
                                                >
                                                    <Card className="shadow-sm h-100">
                                                        {/* <Card.Img
                                                            variant="top"
                                                            src={getResourceImage(
                                                                resource,
                                                            )}
                                                            alt={getResourceName(
                                                                resource,
                                                            )}
                                                            style={{
                                                                height: '200px',
                                                                objectFit:
                                                                    'cover',
                                                            }}
                                                        /> */}
                                                        <Card.Body>
                                                            <Card.Title className="fs-4">
                                                                {getResourceName(
                                                                    resource
                                                                )}
                                                            </Card.Title>
                                                            <div className="mb-3">
                                                                <div className="d-flex gap-1">
                                                                    <span className="fw-bold">
                                                                        Type:
                                                                    </span>
                                                                    <span>
                                                                        {getResourceType(
                                                                            resource
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {resource.personnel_rank && (
                                                                    <div className="d-flex gap-1">
                                                                        <span className="fw-bold">
                                                                            Rank:
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                resource.personnel_rank
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="d-flex gap-1">
                                                                    <span className="fw-bold">
                                                                        Available:
                                                                    </span>
                                                                    <span>
                                                                        {getResourceCount(
                                                                            resource
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex gap-2 mt-3">
                                                                {(user?.role_id ===
                                                                    1 ||
                                                                    user?.role_id ===
                                                                        2) && (
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                resource
                                                                            )
                                                                        }
                                                                    >
                                                                        <Icon icon="mdi:pencil" />
                                                                    </Button>
                                                                )}
                                                                {user?.role_id ===
                                                                    1 && (
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                resource
                                                                            )
                                                                        }
                                                                    >
                                                                        <Icon icon="mdi:delete" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )
                                        )}
                                    </Row>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center mt-4">
                                            <Pagination>
                                                <Pagination.Prev
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.max(
                                                                prev - 1,
                                                                1
                                                            )
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                />
                                                {paginationItems}
                                                <Pagination.Next
                                                    onClick={() =>
                                                        setCurrentPage((prev) =>
                                                            Math.min(
                                                                prev + 1,
                                                                totalPages
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                />
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <ResourceFormModal
                            show={showModal || editModalShow}
                            handleClose={() => {
                                handleCloseModal()
                                setEditModalShow(false)
                                setSelectedResource(null)
                            }}
                            refreshResources={fetchResources}
                            resource={selectedResource}
                        />
                    </>
                )}
            </Container>
        </Layout>
    )
}

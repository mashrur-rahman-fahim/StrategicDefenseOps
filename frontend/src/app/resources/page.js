'use client'
import React, { useState, useEffect } from 'react';
import {Card,Button,Row,Col,Container,Form,InputGroup,Pagination} from 'react-bootstrap';
import { Icon } from '@iconify/react';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';
import ResourceFormModal from './ResourceFormModal';

export default function Resources() {
    //const { user } = useAuth({ middleware: 'auth', redirectIfAuthenticated: '/resources' });
    const [resourceData, setResourceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCounts, setTotalCounts] = useState({
        weapons: 0,
        vehicles: 0,
        personnel: 0,
        equipment: 0,
    });
    const itemsPerPage = 9;

    const resourceCategories = [
        {
            type: 'Weapons',
            icon: 'tabler:bomb-filled',
            totalAvailable: totalCounts.weapons,
            // inUse: 369,
            // underMaintenance: 40,
        },
        {
            type: 'Vehicles',
            icon: 'mdi:tank',
            totalAvailable: totalCounts.vehicles,
            // inUse: 269,
            // underMaintenance: 10,
        },
        {
            type: 'Personnel',
            icon: 'fa6-solid:person-military-rifle',
            totalAvailable: totalCounts.personnel,
            // inUse: 33032,
            // underMaintenance: 404,
        },
        {
            type: 'Equipments',
            icon: 'mdi:medical-bag',
            totalAvailable: totalCounts.equipment,
            // inUse: 3469,
            // underMaintenance: 0,
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

    useEffect(() => {
        const totalWeaponCount = resourceData[1]?.reduce((total, resource) => {
            return total + (resource.weapon_count || 0);
        }, 0);

        const totalVehicleCount = resourceData[1]?.reduce((total, resource) => {
            return total + (resource.vehicle_count || 0);
        }, 0);

        const totalPersonnelCount = resourceData[1]?.reduce((total, resource) => {
            return total + (resource.personnel_count || 0);
        }, 0);

        const totalEquipmentCount = resourceData[1]?.reduce((total, resource) => {
            return total + (resource.equipment_count || 0);
        }, 0);

        setTotalCounts({
            weapons: totalWeaponCount,
            vehicles: totalVehicleCount,
            personnel: totalPersonnelCount,
            equipment: totalEquipmentCount
        });

        console.log('Total Counts:', {
            weapons: totalWeaponCount,
            vehicles: totalVehicleCount,
            personnel: totalPersonnelCount,
            equipment: totalEquipmentCount,
        });
    }, [resourceData]);

    const handleOpenModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    // Get current resources for pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentResources =
        resourceData[1]?.slice(indexOfFirstItem, indexOfLastItem) || []

    const totalPages = resourceData[1]
        ? Math.ceil(resourceData[1].length / itemsPerPage)
        : 0

    // Generate pagination items
    const paginationItems = []
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>,
        )
    }

    return (
        <Container fluid className="p-4">
            {loading ? (
                <div className="text-center">Loading resources...</div>
            ) : error ? (
                <div className="text-center text-danger">{error}</div>
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

                    <Row className="g-3 mb-4">
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
                                            <div className="d-flex gap-1">
                                                <span>Total Available:</span>
                                                <span className="text-success fw-bold">
                                                    {category.totalAvailable}
                                                </span>
                                            </div>
                                            {/* <div className="d-flex gap-1">
                                                <span>In Use:</span>
                                                <span className="text-danger">
                                                    {category.inUse}
                                                </span>
                                            </div> */}
                                            {/* <div className="d-flex gap-1">
                                                <span>Under Maintenance:</span>
                                                <span className="text-warning">
                                                    {category.underMaintenance}
                                                </span>
                                            </div> */}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* All Resources Section */}
                    <div className="mt-5">
                        <h1 className="mb-4">All Resources</h1>

                        {/* Filter and Search */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <Button variant="primary" className="px-4">
                                Filter
                            </Button>

                            <InputGroup className="w-auto">
                                <Form.Control
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={e =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <Button variant="primary">
                                    <Icon icon="bi:search" />
                                </Button>
                            </InputGroup>
                        </div>

                        {/* Resource Cards */}
                        <Row className="g-4">
                            {currentResources.map((resource, index) => (
                                <Col key={index} sm={12} md={6} lg={4}>
                                    <Card className="shadow-sm h-100">
                                        <Card.Img
                                            variant="top"
                                            src={
                                                resource.weapon_image ||
                                                resource.vehicle_image ||
                                                resource.personnel_image ||
                                                resource.equipment_image ||
                                                'https://easydrawingguides.com/wp-content/uploads/2020/09/Tank-Step-10.png'
                                            }
                                            alt={
                                                resource.weapon_name ||
                                                resource.vehicle_name ||
                                                resource.personnel_name ||
                                                resource.equipment_name
                                            }
                                            style={{
                                                height: '200px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <Card.Body>
                                            <Card.Title className="fs-4">
                                                {resource.weapon_name ||
                                                    resource.vehicle_name ||
                                                    resource.personnel_name ||
                                                    resource.equipment_name}
                                            </Card.Title>
                                            <div className="mb-3">
                                                <div className="d-flex gap-1">
                                                    <span className="fw-bold">
                                                        Type:
                                                    </span>
                                                    <span>
                                                        {resource.weapon_type ||
                                                            resource.vehicle_type ||
                                                            resource.personnel_category ||
                                                            resource.equipment_type ||
                                                            'N/A'}
                                                    </span>
                                                </div>
                                                {resource.personnel_rank && (
                                                    <div className="d-flex gap-1">
                                                        <span className="fw-bold">
                                                            Rank:
                                                        </span>
                                                        <span>
                                                            {resource.personnel_rank || 'N/A'}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="d-flex gap-1">
                                                    <span className="fw-bold">
                                                        Available:
                                                    </span>
                                                    <span>
                                                        {resource.weapon_count ||
                                                            resource.vehicle_count ||
                                                            resource.personnel_count ||
                                                            resource.equipment_count ||
                                                            0}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() =>
                                            setCurrentPage(prev =>
                                                Math.max(prev - 1, 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                    />
                                    {paginationItems}
                                    <Pagination.Next
                                        onClick={() =>
                                            setCurrentPage(prev =>
                                                Math.min(prev + 1, totalPages),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </div>

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

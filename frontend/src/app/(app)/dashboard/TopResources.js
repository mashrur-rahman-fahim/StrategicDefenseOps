import React from 'react'
import { Card, Button, Table } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import Link from 'next/link'

const TopResources = ({ resources }) => {
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

    return (
        <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom-0 pt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Top Resources</h5>
                    <Button as={Link} href="/resources" variant="link" className="p-0">
                        View All
                    </Button>
                </div>
            </Card.Header>
            <Card.Body className="pt-0">
                {resources.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <Icon icon="mdi:package-variant-closed" width="48" height="48" className="mb-2" />
                        <p>No resources found</p>
                    </div>
                ) : (
                    <Table responsive hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource, index) => (
                                <tr key={index}>
                                    <td>{getResourceName(resource)}</td>
                                    <td>{getResourceType(resource)}</td>
                                    <td>
                                        <span className="fw-bold">{getResourceCount(resource)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    )
}

export default TopResources
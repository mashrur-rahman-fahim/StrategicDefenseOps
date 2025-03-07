import React from 'react'
import { Card, Button, Table, Badge } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import Link from 'next/link'

const RecentOperations = ({ operations }) => {
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
        <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom-0 pt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Operations</h5>
                    <Button as={Link} href="/operations" variant="link" className="p-0">
                        View All
                    </Button>
                </div>
            </Card.Header>
            <Card.Body className="pt-0">
                {operations.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <Icon icon="mdi:clipboard-text-outline" width="48" height="48" className="mb-2" />
                        <p>No operations found</p>
                    </div>
                ) : (
                    <Table responsive hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operations.map((operation, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link href={`/operations/${operation.id}`} className="text-decoration-none">
                                            {operation.name}
                                        </Link>
                                    </td>
                                    <td>{getStatusBadge(operation.status)}</td>
                                    <td>{formatDate(operation.start_date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    )
}

export default RecentOperations
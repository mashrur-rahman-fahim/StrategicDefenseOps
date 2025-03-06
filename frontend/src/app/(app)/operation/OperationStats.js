import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function OperationStats({ stats }) {
    const statCards = [
        { label: 'Ongoing', value: stats.ongoing, color: '#2ecc71' },
        { label: 'Upcoming', value: stats.upcoming, color: '#f39c12' },
        { label: 'Completed', value: stats.completed, color: '#3498db' },
    ]

    return (
        <Row className="mb-4">
            {statCards.map(stat => (
                <Col md={4} key={stat.label}>
                    <Card className="bg-light">
                        <Card.Body className="text-center">
                            <div>
                                <span
                                    className="d-inline-block me-2"
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: stat.color,
                                        borderRadius: '50%',
                                    }}
                                />
                                <span className="h5">{stat.label}</span>
                            </div>
                            <h1 className="my-3">{stat.value}</h1>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

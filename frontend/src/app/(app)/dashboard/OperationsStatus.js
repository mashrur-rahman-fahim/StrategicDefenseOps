import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { Icon } from '@iconify/react'

const OperationsStatus = ({ stats }) => {
    const operations = [
        {
            title: 'Ongoing Operations',
            icon: 'mdi:chart-timeline-variant',
            count: stats.ongoing,
            color: 'primary',
        },
        {
            title: 'Upcoming Operations',
            icon: 'mdi:calendar-clock',
            count: stats.upcoming,
            color: 'warning',
        },
        {
            title: 'Completed Operations',
            icon: 'mdi:check-circle-outline',
            count: stats.completed,
            color: 'success',
        },
        {
            title: 'Total Operations',
            icon: 'mdi:clipboard-list-outline',
            count: stats.total,
            color: 'info',
        },
    ]

    return (
        <>
            <h4 className="mt-4 mb-3">Operations Status</h4>
            <Row className="g-3 mb-4">
                {operations.map((operation, index) => (
                    <Col key={index} xs={12} md={6} xl={3}>
                        <Card className={`shadow-sm border-${operation.color} border-start border-4 border-top-0 border-bottom-0 border-end-0 h-100`}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted mb-1">{operation.title}</h6>
                                        <h4 className="mb-0">{operation.count}</h4>
                                    </div>
                                    <div className={`bg-${operation.color} bg-opacity-10 p-2 rounded`}>
                                        <Icon
                                            icon={operation.icon}
                                            width="24"
                                            height="24"
                                            className={`text-${operation.color}`}
                                        />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default OperationsStatus
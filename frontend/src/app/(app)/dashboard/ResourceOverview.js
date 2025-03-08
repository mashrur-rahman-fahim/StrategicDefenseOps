import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { Icon } from '@iconify/react';

const ResourceOverview = ({ stats }) => {
    const resources = [
        {
            title: 'Weapons',
            icon: 'tabler:bomb-filled',
            count: stats.weapons,
            color: 'primary',
        },
        {
            title: 'Vehicles',
            icon: 'mdi:tank',
            count: stats.vehicles,
            color: 'success',
        },
        {
            title: 'Personnel',
            icon: 'fa6-solid:person-military-rifle',
            count: stats.personnel,
            color: 'info',
        },
        {
            title: 'Equipment',
            icon: 'mdi:medical-bag',
            count: stats.equipment,
            color: 'warning',
        },
    ];

    return (
        <>
            <h4 className="mt-4 mb-3">Resource Overview</h4>
            <Row className="g-3 mb-4">
                {resources.map((resource, index) => (
                    <Col key={index} xs={12} sm={6} lg={3}>
                        <Card className="shadow-sm h-100 border-0">
                            <Card.Body>
                                <div className="d-flex align-items-start justify-content-between">
                                    <div>
                                        <div className="text-muted mb-1">
                                            {resource.title}
                                        </div>
                                        <h3 className="mb-0">
                                            {resource.count}
                                        </h3>
                                    </div>
                                    <div
                                        className={`bg-${resource.color} bg-opacity-10 p-2 rounded-circle`}
                                    >
                                        <Icon
                                            icon={resource.icon}
                                            width="24"
                                            height="24"
                                            className={`text-${resource.color}`}
                                        />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <ProgressBar
                                        now={
                                            stats.total
                                                ? (resource.count /
                                                      stats.total) *
                                                  100
                                                : 0
                                        }
                                        variant={resource.color}
                                        className="mt-2"
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default ResourceOverview;

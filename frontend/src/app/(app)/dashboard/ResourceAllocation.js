import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';

const ResourceAllocation = ({ resourceStats }) => {
    const resourceTypes = [
        { name: 'Weapons', value: resourceStats.weapons, color: 'primary' },
        { name: 'Vehicles', value: resourceStats.vehicles, color: 'success' },
        { name: 'Personnel', value: resourceStats.personnel, color: 'info' },
        { name: 'Equipment', value: resourceStats.equipment, color: 'warning' },
    ];

    return (
        <Row className="mt-4">
            <Col xs={12}>
                <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white pt-4 border-bottom-0">
                        <h5 className="mb-0">Resource Allocation</h5>
                    </Card.Header>
                    <Card.Body>
                        <h6 className="text-muted mb-3">
                            Resource Distribution
                        </h6>
                        {resourceStats.total === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <p>No resource data available</p>
                            </div>
                        ) : (
                            <>
                                {resourceTypes.map((resource, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>{resource.name}</span>
                                            <span>
                                                {Math.round(
                                                    (resource.value /
                                                        resourceStats.total) *
                                                        100
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <ProgressBar
                                            now={
                                                (resource.value /
                                                    resourceStats.total) *
                                                100
                                            }
                                            variant={resource.color}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default ResourceAllocation;

'use client';
import React from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';

export default function Resources() {
  const overviewData = {
    totalResources: 230940,
    inUse: 1400,
    available: 22890,
    maintenance: 100
  };

  const resourceCategories = [
    {
      type: "Weapons",
      totalAvailable: 3669,
      inUse: 369,
      underMaintenance: 40
    },
    {
      type: "Vehicles",
      totalAvailable: 3134,
      inUse: 269,
      underMaintenance: 10
    },
    {
      type: "Personnel",
      totalAvailable: 12669,
      inUse: 33032,
      underMaintenance: 404
    },
    {
      type: "Equipments",
      totalAvailable: 7711,
      inUse: 3469,
      underMaintenance: 0
    }
  ];

  return (
    <Container fluid className="p-4">
      {/* Resource Overview*/}
      <h1 className="mb-4">Resource Overview</h1>
      
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} md={3}>
          <Card border="primary" className="shadow rounded-5">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="text-muted">Total Resources</Card.Title>
              <Card.Text className="fs-1 fw-bold">
                {overviewData.totalResources}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} sm={6} md={3}>
          <Card border="primary" className="shadow rounded-5">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="text-muted">In use</Card.Title>
              <Card.Text className="fs-1 fw-bold">
                {overviewData.inUse}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} sm={6} md={3}>
          <Card border="primary" className="shadow rounded-5">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="text-muted">Available</Card.Title>
              <Card.Text className="fs-1 fw-bold">
                {overviewData.available}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} sm={6} md={3}>
          <Card border="primary" className="shadow rounded-5">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="text-muted">Maintenance</Card.Title>
              <Card.Text className="fs-1 fw-bold">
                {overviewData.maintenance}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="primary" className="mb-4">
        View All Resources
      </Button>
      
      {/* Resources*/}
      <h1 className="mb-4">Resources</h1>
      
      <Row className="g-3">
        {resourceCategories.map((category, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card className="shadow-sm bg-light">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="fw-bold mb-0">{category.type}</h5>
                </div>
                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>Total Available:</span> 
                    <span className="text-success fw-bold">{category.totalAvailable}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>In Use:</span> 
                    <span className="text-danger">{category.inUse}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Under Maintenance:</span> 
                    <span className="text-warning">{category.underMaintenance}</span>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Button variant="primary" className='rounded-pill'>View Details</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
import React from 'react';
import { Button, Form, InputGroup, Dropdown, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';

const OperationSearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  handleSearch,
}) => {
  const filterOptions = ['All', 'Ongoing', 'Upcoming', 'Completed'];

  return (
    <Row className="mb-4 g-3">
      {/* Filter Dropdown and Clear Filter Button */}
      <Col xs={12} md={6} className="d-flex align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary" id="dropdown-filter">
            <Icon icon="mdi:filter" className="me-1" /> Filter
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {filterOptions.map((filter, index) => (
              <Dropdown.Item
                key={index}
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {activeFilter !== 'All' && (
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={() => setActiveFilter('All')}
          >
            <Icon icon="mdi:filter-remove" className="me-1" /> Clear Filter
          </Button>
        )}
      </Col>

      {/* Search Input */}
      <Col xs={12} md={6}>
        <Form onSubmit={handleSearch}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" type="submit">
              <Icon icon="bi:search" />
            </Button>
          </InputGroup>
        </Form>
      </Col>
    </Row>
  );
};

export default OperationSearchAndFilter;
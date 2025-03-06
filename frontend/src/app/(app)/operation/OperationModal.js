import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';

export default function OperationModal({
    show,
    onHide,
    title,
    formData,
    onChange,
    onSubmit,
    loading,
    submitButtonText,
    loadingText
}) {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={onChange}>
                            <option value="ongoing">Ongoing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                        </Form.Select>
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={onChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Budget ($)</Form.Label>
                        <Form.Control
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={onChange}
                            min={0}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? loadingText : submitButtonText}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
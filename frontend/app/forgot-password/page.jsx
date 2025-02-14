'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import api from '../../utils/axios';

export default function ForgotPassword() {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    // setMessage('');
    // setError('');
    e.preventDefault();
    setValidated(true);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    else {
      try {
        setLoading(true);
        const response = await api.post(`/forgot-password`, { email });
        setMessage(response.data.message);
      } catch (error) {
        setError(error.response?.data?.message || 'Something went wrong!');
      } finally {
        setLoading(false);
    } 
  }
};

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col>
          <h2 className="text-center mb-4">Reset Password</h2>
          <Card className="shadow" style={{ width: '400px', border: 'none', backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleForgotPassword}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
                {loading ? (
                  <Button className="w-100" variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit" className="w-100" variant="primary">
                    Register
                  </Button>
                )}
              </Form>
              <div className="text-center mt-3">
                <p style={{ color: '#6C757D' }}>
                  Remembered your password? <a href="/login" className='link-primary'>Login</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

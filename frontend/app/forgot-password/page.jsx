'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../../utils/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const response = await api.post(`/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong!');
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
              <Form onSubmit={handleForgotPassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100" variant="primary">
                  Send Reset Link
                </Button>
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

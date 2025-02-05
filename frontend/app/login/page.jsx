'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import api from '../../utils/axios';

export default function LoginPage() {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    else {
      try {
        setLoading(true);
        console.log(formData); 
        const response = await api.post(`/login`, formData);
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
    }
  }
};

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col>
          <h2 className="text-center mb-4">StrategicDefenseOps</h2>
          <Card className="shadow" style={{ width: '400px', border: 'none', backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a password.
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="text-end mb-3">
                  <a href="/forgot-password" className='link-primary'>Forgot Password?</a>
                </div>
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
                    Login
                  </Button>
                )}
              </Form>
              <Button onClick={handleGoogleLogin} variant="outline-danger" className="w-100 mt-3">
                Continue with Google
              </Button>
              <div className="text-center mt-3">
                <p style={{ color: '#6C757D' }}>
                  Don’t have an account? <a href="/register" className='link-primary'>Register</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
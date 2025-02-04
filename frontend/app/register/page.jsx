'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import api from '../../utils/axios';

export default function RegisterPage() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role_id: 1,
    parent_id: null,
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    setValidated(true);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    else {
      try {
        console.log(formData);
        const response = await api.post(`/register`, formData);
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
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
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a name.
                  </Form.Control.Feedback>
                </Form.Group>
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
                    Please provide a valid email.
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
                <Button type="submit" className="w-100" variant="primary">Register</Button>
              </Form>
              <Button onClick={handleGoogleLogin} variant="outline-danger" className="w-100 mt-3">
                Continue with Google
              </Button>
              <div className="text-center mt-3">
                <p style={{ color: '#6C757D' }}>
                  Already have an account? <a href="/login" className='link-primary'>Login</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
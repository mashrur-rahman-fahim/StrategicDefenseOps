'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData); 
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, formData);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
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
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100" style={{ backgroundColor: '#0D6EFD', border: 'none' }}>
                  Login
                </Button>
              </Form>
              <Button onClick={handleGoogleLogin} variant="outline-danger" className="w-100 mt-3">
                Login with Google
              </Button>
              <div className="text-center mt-3">
                <p style={{ color: '#6C757D' }}>
                  Don’t have an account? <a href="/register" style={{ color: '#0D6EFD' }}>Register</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
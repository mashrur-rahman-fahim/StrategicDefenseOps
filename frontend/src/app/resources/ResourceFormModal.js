'use client';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '@/lib/axios';
import { toast } from 'sonner';

const ResourceFormModal = ({ show, handleClose, refreshResources}) => {
  const [resourceType, setResourceType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset form when modal closes or type changes
  const resetForm = () => {
    setFormData({});
  };

  const handleTypeChange = (e) => {
    setResourceType(e.target.value);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let endpoint = '';
      let payload = { ...formData };
      
      // Set endpoint based on resource type
      switch (resourceType) {
        case 'weapon':
          endpoint = '/api/add-weapon';
          break;
        case 'vehicle':
          endpoint = '/api/add-vehicle';
          break;
        case 'personnel':
          endpoint = '/api/add-personnel';
          break;
        case 'equipment':
          endpoint = '/api/add-equipment';
          break;
        default:
          throw new Error('Invalid resource type');
      }

      // Add count as integer
      if (payload.weapon_count) payload.weapon_count = parseInt(payload.weapon_count);
      if (payload.vehicle_count) payload.vehicle_count = parseInt(payload.vehicle_count);
      if (payload.personnel_count) payload.personnel_count = parseInt(payload.personnel_count);
      if (payload.equipment_count) payload.equipment_count = parseInt(payload.equipment_count);
      
      const response = await axios.post(endpoint, payload);
      console.log('Resource added:', response.data);

      toast.success(response?.data?.message || 'Resource added successfully');

      handleClose();
      resetForm();
      refreshResources();
      
    } catch (err) {
      console.error('Error adding resource:', err);
      toast.error(err.response?.data?.message || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  // Rendering different form fields based on resource type
  const renderFormFields = () => {
    switch (resourceType) {
      case 'weapon':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Weapon Name*</Form.Label>
              <Form.Control 
                type="text" 
                name="weapon_name" 
                value={formData.weapon_name || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Count*</Form.Label>
              <Form.Control 
                type="number" 
                name="weapon_count" 
                value={formData.weapon_count || ''} 
                onChange={handleInputChange} 
                required 
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type*</Form.Label>
              <Form.Select 
                name="weapon_type" 
                value={formData.weapon_type || ''} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="Rifle">Rifle</option>
                <option value="Pistol">Pistol</option>
                <option value="Shotgun">Shotgun</option>
                <option value="Sniper">Sniper</option>
                <option value="Grenade">Grenade</option>
                <option value="Bomb">Bomb</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number*</Form.Label>
              <Form.Control 
                type="text" 
                name="weapon_serial_number" 
                value={formData.weapon_serial_number || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
          </>
        );
      
      case 'vehicle':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Name*</Form.Label>
              <Form.Control 
                type="text" 
                name="vehicle_name" 
                value={formData.vehicle_name || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Count*</Form.Label>
              <Form.Control 
                type="number" 
                name="vehicle_count" 
                value={formData.vehicle_count || ''} 
                onChange={handleInputChange} 
                required 
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type*</Form.Label>
              <Form.Select 
                name="vehicle_type" 
                value={formData.vehicle_type || ''} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="Utility Vehicle">Utility Vehicle</option>
                <option value="Tank">Tank</option>
                <option value="Drone">Drone</option>
                <option value="Helicopter">Helicopter</option>
                <option value="Ship">Ship</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number*</Form.Label>
              <Form.Control 
                type="text" 
                name="vehicle_serial_number" 
                value={formData.vehicle_serial_number || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
          </>
        );
      
      case 'personnel':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Personnel Name*</Form.Label>
              <Form.Control 
                type="text" 
                name="personnel_name" 
                value={formData.personnel_name || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Count*</Form.Label>
              <Form.Control 
                type="number" 
                name="personnel_count" 
                value={formData.personnel_count || ''} 
                onChange={handleInputChange} 
                required 
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type*</Form.Label>
              <Form.Select 
                name="personnel_category" 
                value={formData.personnel_category || ''} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="Medic">Medic</option>
                <option value="Engineer">Engineer</option>
                <option value="Combat">Combat</option>
                <option value="Logistics">Logistics</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rank</Form.Label>
              <Form.Control 
                type="text" 
                name="personnel_rank" 
                value={formData.personnel_rank || ''} 
                onChange={handleInputChange} 
                placeholder="e.g. Captain, Lieutenant"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number*</Form.Label>
              <Form.Control 
                type="text" 
                name="personnel_serial_number" 
                value={formData.personnel_serial_number || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
          </>
        );
      
      case 'equipment':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Equipment Name*</Form.Label>
              <Form.Control 
                type="text" 
                name="equipment_name" 
                value={formData.equipment_name || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Count*</Form.Label>
              <Form.Control 
                type="number" 
                name="equipment_count" 
                value={formData.equipment_count || ''} 
                onChange={handleInputChange} 
                required 
                min="1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type*</Form.Label>
              <Form.Select 
                name="equipment_type" 
                value={formData.equipment_type || ''} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Surveillance & Communication">Surveillance & Communication</option>
                <option value="Protective Gear">Protective Gear</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Serial Number*</Form.Label>
              <Form.Control 
                type="text" 
                name="equipment_serial_number" 
                value={formData.equipment_serial_number || ''} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Resource Type*</Form.Label>
            <Form.Select 
              value={resourceType} 
              onChange={handleTypeChange}
              required
            >
              <option value="">Select resource type</option>
              <option value="weapon">Weapon</option>
              <option value="vehicle">Vehicle</option>
              <option value="personnel">Personnel</option>
              <option value="equipment">Equipment</option>
            </Form.Select>
          </Form.Group>
          
          {resourceType && renderFormFields()}
          
          {resourceType && (
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Resource'}
              </Button>
            </div>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ResourceFormModal;
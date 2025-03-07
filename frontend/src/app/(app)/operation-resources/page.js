// OperationResources.jsx
'use client'
import Layout from '@/components/layout'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios.js'
import { useState, useEffect } from 'react'
import {
    Table,
    Form,
    Button,
    Container,
    Row,
    Col,
    Alert,
    Modal,
} from 'react-bootstrap'

export default function OperationResources() {
    const { user } = useAuth({ middleware: 'auth' })
    const [operations, setOperations] = useState([])
    const [allResources, setAllResources] = useState([])
    const [selectedOperation, setSelectedOperation] = useState(null)
    const [formEntries, setFormEntries] = useState([{ 
        category: '',
        serialNumber: '',
        count: ''
    }])
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [fetchedResources, setFetchedResources] = useState([])
    const [showResourceModal, setShowResourceModal] = useState(false)
    const [currentEntryIndex, setCurrentEntryIndex] = useState(0)

    useEffect(() => {
        fetchOperations()
        fetchAllResources()
    }, [])

    const fetchOperations = async () => {
        try {
            const response = await axios.get('/api/get-all-operations')
            setOperations(response.data[1])
        } catch (err) {
            setError('Failed to fetch operations')
        }
    }

    const fetchAllResources = async () => {
        try {
            const response = await axios.get('/api/get-all-resources')
            setAllResources(response.data[1])
        } catch (err) {
            setError('Failed to fetch resources')
        }
    }

    const handleFormChange = (index, field, value) => {
        const updatedEntries = [...formEntries]
        updatedEntries[index][field] = value
        
        if (field === 'category') {
            updatedEntries[index].serialNumber = ''
        }
        
        setFormEntries(updatedEntries)
    }

    const addFormEntry = () => {
        setFormEntries([...formEntries, { 
            category: '',
            serialNumber: '',
            count: ''
        }])
    }

    const handleResourceSelect = (resource, category) => {
        const updatedEntries = [...formEntries]
        const entry = updatedEntries[currentEntryIndex]
        
        entry.serialNumber = getSerialNumber(resource, category)
        entry.category = category
        
        setFormEntries(updatedEntries)
        setShowResourceModal(false)
    }

    const getSerialNumber = (resource, category) => {
        switch(category) {
            case '1': return resource.vehicle_serial_number
            case '2': return resource.weapon_serial_number
            case '3': return resource.personnel_serial_number
            case '4': return resource.equipment_serial_number
            default: return ''
        }
    }

    const filteredResources = (category) => {
        return allResources.filter(resource => {
            if (category === '1') return resource.vehicle_name
            if (category === '2') return resource.weapon_name
            if (category === '3') return resource.personnel_name
            if (category === '4') return resource.equipment_name
            return false
        })
    }

    const handleSubmit = async (actionType) => {
        try {
            const payload = {
                category: formEntries.map(entry => Number(entry.category)),
                serial_number: formEntries.map(entry => entry.serialNumber),
                count: formEntries.map(entry => Number(entry.count))
            }

            const response = await axios({
                method: actionType === 'add' ? 'post' : 'put',
                url: `/api/${actionType}-operation-resources/${selectedOperation}`,
                data: payload
            })

            setMessage(`Resources ${actionType}ed successfully`)
            setError('')
            setFormEntries([{ category: '', serialNumber: '', count: '' }])
            handleViewResources() // Refresh the view after submission
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred')
            setMessage('')
        }
    }

    const handleViewResources = async () => {
        try {
            const response = await axios.get(`/api/get-operation-resources/${selectedOperation}`)
            const transformed = []
            
            // Transform backend response to match frontend structure
            Object.entries(response.data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        transformed.push({
                            type: key.charAt(0).toUpperCase() + key.slice(1),
                            id: item.id,
                            serialNumber: item[`${key}_serial_number`],
                            count: item[`${key}_count`]
                        })
                    })
                }
            })
            
            setFetchedResources(transformed)
            setMessage('Resources fetched successfully')
        } catch (err) {
            setError('Failed to fetch resources')
        }
    }

    return (
        <Layout>
            <Container>
                <h1 className="my-4">Operation Resources</h1>
                
                {/* Operations Selection */}
                <div className="mb-4">
                    <h3>Select Operation</h3>
                    <Row>
                        {operations.map(op => (
                            <Col key={op.id} md={3} className="mb-3">
                                <Button
                                    variant={selectedOperation === op.id ? 'primary' : 'outline-primary'}
                                    onClick={() => setSelectedOperation(op.id)}
                                    block>
                                    Operation #{op.id}
                                    {selectedOperation === op.id && ' ✓'}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </div>

                {selectedOperation && (
                    <>
                        {/* Resource Management Section */}
                        <div className="mb-4">
                            <h3>Manage Resources</h3>
                            
                            {formEntries.map((entry, index) => (
                                <div key={index} className="resource-entry mb-3 p-3 border rounded">
                                    <Row className="align-items-center">
                                        <Col md={3}>
                                            <Form.Select
                                                value={entry.category}
                                                onChange={(e) => handleFormChange(index, 'category', e.target.value)}
                                                required>
                                                <option value="">Select Category</option>
                                                <option value="1">Vehicle</option>
                                                <option value="2">Weapon</option>
                                                <option value="3">Personnel</option>
                                                <option value="4">Equipment</option>
                                            </Form.Select>
                                        </Col>

                                        <Col md={3}>
                                            <Button
                                                variant="outline-secondary"
                                                disabled={!entry.category}
                                                onClick={async() => {
                                                    try{
                                                        await fetchAllResources()
                                                        setCurrentEntryIndex(index)
                                                        setShowResourceModal(true)
                                                    }
                                                    catch(err) {
                                                        setError('Failed to refresh resources')
                                                    }
                                                    
                                                }}>
                                                {entry.serialNumber || 'Select Resource'}
                                            </Button>
                                        </Col>

                                        <Col md={3}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Count"
                                                value={entry.count}
                                                onChange={(e) => handleFormChange(index, 'count', e.target.value)}
                                                min="1"
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            <div className="mb-3">
                                <Button variant="success" onClick={addFormEntry}>
                                    + Add Another Resource
                                </Button>
                            </div>

                            <div className="button-group">
                                <Button variant="primary" onClick={() => handleSubmit('add')} className="me-2">
                                    Add Resources
                                </Button>
                                <Button variant="warning" onClick={() => handleSubmit('update')} className="me-2">
                                    Update Resources
                                </Button>
                                <Button variant="info" onClick={handleViewResources}>
                                    View Current Resources
                                </Button>
                            </div>
                        </div>

                        {/* Resource Selection Modal */}
                        <Modal show={showResourceModal} onHide={() => setShowResourceModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Select Resource</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Serial Number</th>
                                            <th>Available</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResources(formEntries[currentEntryIndex]?.category).map(resource => (
                                            <tr key={resource.id}>
                                                <td>{resource.id}</td>
                                                <td>
                                                    {resource.vehicle_name || 
                                                     resource.weapon_name || 
                                                     resource.personnel_name || 
                                                     resource.equipment_name}
                                                </td>
                                                <td>
                                                    {resource.vehicle_serial_number || 
                                                     resource.weapon_serial_number || 
                                                     resource.personnel_serial_number || 
                                                     resource.equipment_serial_number}
                                                </td>
                                                <td>
                                                    {resource.vehicle_count || 
                                                     resource.weapon_count || 
                                                     resource.personnel_count || 
                                                     resource.equipment_count}
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleResourceSelect(
                                                            resource,
                                                            formEntries[currentEntryIndex].category
                                                        )}>
                                                        Select
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Modal.Body>
                        </Modal>

                        {/* Display Messages */}
                        {message && <Alert variant="success" className="mt-3">{message}</Alert>}
                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                        {/* Display Fetched Resources */}
                        {fetchedResources.length > 0 && (
                            <div className="mt-4">
                                <h4>Current Operation Resources</h4>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Serial Number</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchedResources.map((resource, index) => (
                                            <tr key={index}>
                                                <td>{resource.type}</td>
                                                <td>{resource.serialNumber}</td>
                                                <td>{resource.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </Layout>
    )
}
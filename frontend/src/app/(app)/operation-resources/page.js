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
    Badge,
} from 'react-bootstrap'

export default function OperationResources() {
    useAuth({ middleware: 'auth' })
    const [operations, setOperations] = useState([])
    const [allResources, setAllResources] = useState([])
    const [selectedOperation, setSelectedOperation] = useState(null)
    const [formEntries, setFormEntries] = useState([
        {
            category: '',
            serialNumber: '',
            count: '',
        },
    ])
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [fetchedResources, setFetchedResources] = useState([])
    const [showResourceModal, setShowResourceModal] = useState(false)
    const [currentEntryIndex, setCurrentEntryIndex] = useState(0)

    useEffect(() => {
        fetchOperations()
        fetchAllResources()
    }, [])

    // Clear state when operation changes
    useEffect(() => {
        if (selectedOperation) {
            // Reset form entries and other state when operation changes
            setFormEntries([
                {
                    category: '',
                    serialNumber: '',
                    count: '',
                },
            ])
            setFetchedResources([])
            setMessage('')
            setError('')
        }
    }, [selectedOperation])

    const fetchOperations = async () => {
        try {
            const response = await axios.get('/api/get-all-operations')
            // Filter to only show completed operations
            const completedOps = response.data[1].filter(
                op => op.status === 'completed',
            )
            setOperations(completedOps)
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
        setFormEntries([
            ...formEntries,
            {
                category: '',
                serialNumber: '',
                count: '',
            },
        ])
    }

    const handleResourceSelect = (resource, category) => {
        const updatedEntries = [...formEntries]
        const entry = updatedEntries[currentEntryIndex]

        // Still store serial number in state for backend logic
        entry.serialNumber = getSerialNumber(resource, category)
        entry.category = category

        // Also store resource name for display purposes
        entry.resourceName = getResourceName(resource, category)
        entry.resourceDescription = getResourceDescription(resource, category)

        setFormEntries(updatedEntries)
        setShowResourceModal(false)
    }

    // Helper to get resource name based on category
    const getResourceName = (resource, category) => {
        switch (category) {
            case '1':
                return resource.vehicle_name
            case '2':
                return resource.weapon_name
            case '3':
                return resource.personnel_name
            case '4':
                return resource.equipment_name
            default:
                return ''
        }
    }

    // Helper to get resource description based on category
    const getResourceDescription = (resource, category) => {
        switch (category) {
            case '1':
                return resource.vehicle_description || 'No description'
            case '2':
                return resource.weapon_description || 'No description'
            case '3':
                return resource.personnel_description || 'No description'
            case '4':
                return resource.equipment_description || 'No description'
            default:
                return ''
        }
    }

    const getSerialNumber = (resource, category) => {
        switch (category) {
            case '1':
                return resource.vehicle_serial_number
            case '2':
                return resource.weapon_serial_number
            case '3':
                return resource.personnel_serial_number
            case '4':
                return resource.equipment_serial_number
            default:
                return ''
        }
    }

    const filteredResources = category => {
        if (!allResources || !Array.isArray(allResources)) return []

        return allResources.filter(resource => {
            if (category === '1') return resource.vehicle_name
            if (category === '2') return resource.weapon_name
            if (category === '3') return resource.personnel_name
            if (category === '4') return resource.equipment_name
            return false
        })
    }

    const getCategoryName = categoryId => {
        switch (categoryId) {
            case '1':
                return 'Vehicle'
            case '2':
                return 'Weapon'
            case '3':
                return 'Personnel'
            case '4':
                return 'Equipment'
            default:
                return 'Unknown'
        }
    }

    const getStatusBadgeVariant = status => {
        switch (status) {
            case 'ongoing':
                return 'success'
            case 'upcoming':
                return 'info'
            case 'completed':
                return 'secondary'
            default:
                return 'primary'
        }
    }

    const handleSubmit = async actionType => {
        if (!selectedOperation) {
            setError('Please select an operation first')
            return
        }

        try {
            // Validate entries
            const invalidEntries = formEntries.some(
                entry => !entry.category || !entry.serialNumber || !entry.count,
            )

            if (invalidEntries) {
                setError('Please fill in all resource details')
                return
            }

            // Use the original payload structure for backend compatibility
           

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
        if (!selectedOperation) {
            setError('Please select an operation first')
            return
        }

        setError('')
        setMessage('')

        try {
            const response = await axios.get(
                `/api/get-operation-resources/${selectedOperation}`,
            )
            const transformed = []

            // Transform backend response to match frontend structure
            Object.entries(response.data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        transformed.push({
                            type: key.charAt(0).toUpperCase() + key.slice(1),
                            id: item.id,
                            name: item[`${key}_name`] || 'N/A', // Add name field
                            description:
                                item[`${key}_description`] || 'No description', // Add description field
                            serialNumber: item[`${key}_serial_number`],
                            count: item[`${key}_count`],
                        })
                    })
                }
            })

            setFetchedResources(transformed)
            setMessage('Resources fetched successfully')
        } catch (err) {
            setError('Failed to fetch resources for this operation')
            setFetchedResources([])
        }
    }

    const handleOperationSelect = operationId => {
        setSelectedOperation(operationId)
    }

    return (
        <Layout>
            <Container>
                <h1 className="my-4">Operation Resources</h1>

                {/* Operations Selection */}
                <div className="mb-4">
                    <h3>Select Completed Operation</h3>

                    {operations.length === 0 && (
                        <Alert variant="info">
                            No completed operations found.
                        </Alert>
                    )}

                    <Row>
                        {operations.map(op => (
                            <Col key={op.id} md={4} className="mb-3">
                                <Button
                                    variant={
                                        selectedOperation === op.id
                                            ? 'primary'
                                            : 'outline-primary'
                                    }
                                    onClick={() => handleOperationSelect(op.id)}
                                    className="w-100 text-start py-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{op.name}</strong>
                                            {op.description && (
                                                <p className="mb-0 text-muted small">
                                                    {op.description.substring(
                                                        0,
                                                        50,
                                                    )}
                                                    ...
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            {op.status && (
                                                <Badge
                                                    bg={getStatusBadgeVariant(
                                                        op.status,
                                                    )}>
                                                    {op.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
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
                                <div
                                    key={index}
                                    className="resource-entry mb-3 p-3 border rounded">
                                    <Row className="align-items-center">
                                        <Col md={3}>
                                            <Form.Select
                                                value={entry.category}
                                                onChange={e =>
                                                    handleFormChange(
                                                        index,
                                                        'category',
                                                        e.target.value,
                                                    )
                                                }
                                                required>
                                                <option value="">
                                                    Select Category
                                                </option>
                                                <option value="1">
                                                    Vehicle
                                                </option>
                                                <option value="2">
                                                    Weapon
                                                </option>
                                                <option value="3">
                                                    Personnel
                                                </option>
                                                <option value="4">
                                                    Equipment
                                                </option>
                                            </Form.Select>
                                        </Col>

                                        <Col md={5}>
                                            <Button
                                                variant="outline-secondary"
                                                disabled={!entry.category}
                                                onClick={async () => {
                                                    try {
                                                        await fetchAllResources()
                                                        setCurrentEntryIndex(
                                                            index,
                                                        )
                                                        setShowResourceModal(
                                                            true,
                                                        )
                                                    } catch (err) {
                                                        setError(
                                                            'Failed to refresh resources',
                                                        )
                                                    }
                                                }}>
                                                {entry.resourceName ||
                                                    'Select Resource'}
                                            </Button>
                                            {entry.resourceDescription && (
                                                <div className="small text-muted mt-1">
                                                    {entry.resourceDescription.substring(
                                                        0,
                                                        50,
                                                    )}
                                                </div>
                                            )}
                                        </Col>

                                        <Col md={3}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Count"
                                                value={entry.count}
                                                onChange={e =>
                                                    handleFormChange(
                                                        index,
                                                        'count',
                                                        e.target.value,
                                                    )
                                                }
                                                min="1"
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            <div className="mb-3">
                                <Button
                                    variant="success"
                                    onClick={addFormEntry}>
                                    + Add Another Resource
                                </Button>
                            </div>

                            <div className="button-group">
                                <Button
                                    variant="primary"
                                    onClick={() => handleSubmit('add')}
                                    className="me-2">
                                    Add Resources
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={() => handleSubmit('update')}
                                    className="me-2">
                                    Update Resources
                                </Button>
                                <Button
                                    variant="info"
                                    onClick={handleViewResources}>
                                    View Current Resources
                                </Button>
                            </div>
                        </div>

                        {/* Resource Selection Modal */}
                        <Modal
                            show={showResourceModal}
                            onHide={() => setShowResourceModal(false)}
                            size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Select{' '}
                                    {formEntries[currentEntryIndex]?.category
                                        ? getCategoryName(
                                              formEntries[currentEntryIndex]
                                                  .category,
                                          )
                                        : 'Resource'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Available</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResources(
                                            formEntries[currentEntryIndex]
                                                ?.category,
                                        ).map(resource => {
                                            const category =
                                                formEntries[currentEntryIndex]
                                                    ?.category
                                            const name = getResourceName(
                                                resource,
                                                category,
                                            )
                                            const description =
                                                getResourceDescription(
                                                    resource,
                                                    category,
                                                )
                                            const count =
                                                category === '1'
                                                    ? resource.vehicle_count
                                                    : category === '2'
                                                      ? resource.weapon_count
                                                      : category === '3'
                                                        ? resource.personnel_count
                                                        : category === '4'
                                                          ? resource.equipment_count
                                                          : 0

                                            return (
                                                <tr key={resource.id}>
                                                    <td>{name}</td>
                                                    <td>{description}</td>
                                                    <td>{count}</td>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleResourceSelect(
                                                                    resource,
                                                                    formEntries[
                                                                        currentEntryIndex
                                                                    ].category,
                                                                )
                                                            }>
                                                            Select
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Modal.Body>
                        </Modal>

                        {/* Display Messages */}
                        {message && (
                            <Alert variant="success" className="mt-3">
                                {message}
                            </Alert>
                        )}
                        {error && (
                            <Alert variant="danger" className="mt-3">
                                {error}
                            </Alert>
                        )}

                        {/* Display Fetched Resources */}
                        {fetchedResources.length > 0 && (
                            <div className="mt-4">
                                <h4>Current Operation Resources</h4>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchedResources.map(
                                            (resource, index) => (
                                                <tr key={index}>
                                                    <td>{resource.type}</td>
                                                    <td>{resource.name}</td>
                                                    <td>
                                                        {resource.description}
                                                    </td>
                                                    <td>{resource.count}</td>
                                                </tr>
                                            ),
                                        )}
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

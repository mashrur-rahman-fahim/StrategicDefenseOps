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
} from 'react-bootstrap'

export default function OperationResources() {
    const { user } = useAuth({ middleware: 'auth' })
    const [operations, setOperations] = useState([])
    const [selectedOperation, setSelectedOperation] = useState(null)
    const [formData, setFormData] = useState({
        category: [''],
        serial_number: [''],
        count: [''],
    })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [fetchedResources, setFetchedResources] = useState([]) // To store fetched resources

    useEffect(() => {
        fetchOperations()
    }, [])

    const fetchOperations = async () => {
        try {
            const response = await axios.get('/api/get-all-operations')
            setOperations(response.data[1])
        } catch (err) {
            setError('Failed to fetch operations')
        }
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target
        const list = { ...formData }
        list[name][index] = value
        setFormData(list)
    }

    const addFields = () => {
        setFormData({
            category: [...formData.category, ''],
            serial_number: [...formData.serial_number, ''],
            count: [...formData.count, ''],
        })
    }

    const handleSubmit = async type => {
        try {
            // Convert category and count to integers
            const processedData = {
                category: formData.category.map(Number), // Convert to integers
                serial_number: formData.serial_number,
                count: formData.count.map(Number), // Convert to integers
            }

            let url = `/api/${type}-operation-resources/${selectedOperation}`
            let method = type === 'add' ? 'post' : 'put'

            const response = await axios({
                method,
                url,
                data: processedData,
            })

            setMessage(
                `${type.charAt(0).toUpperCase() + type.slice(1)} successful`,
            )
            setError('')
            console.log(response.data)
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred')
            setMessage('')
        }
    }

    const handleView = async () => {
        try {
            const response = await axios.get(
                `/api/get-operation-resources/${selectedOperation}`,
            )
            const resources = response.data

            if (
                resources &&
                resources.vehicle &&
                resources.weapon &&
                resources.personnel &&
                resources.equipment
            ) {
                const allResources = [
                    ...resources.vehicle.map(v => ({ ...v, type: 'Vehicle' })),
                    ...resources.weapon.map(w => ({ ...w, type: 'Weapon' })),
                    ...resources.personnel.map(p => ({
                        ...p,
                        type: 'Personnel',
                    })),
                    ...resources.equipment.map(e => ({
                        ...e,
                        type: 'Equipment',
                    })),
                ]
                setFetchedResources(allResources) // Store fetched resources
            }

            setMessage('Resources fetched successfully')
            setError('')
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch resources')
            setMessage('')
        }
    }

    return (
        <Layout>
            <Container>
                <h1 className="my-4">Operation Resources</h1>
                <p>Welcome, {user?.name}!</p>

                {/* Operations Table */}
                <Table striped bordered hover responsive className="mb-4">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Operation ID</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((op, index) => (
                            <tr key={op.id}>
                                <td>{index + 1}</td>
                                <td>{op.id}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            setSelectedOperation(op.id)
                                        }
                                        disabled={selectedOperation === op.id}>
                                        {selectedOperation === op.id
                                            ? 'Selected'
                                            : 'Select'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {!selectedOperation && <p>Please select an operation first</p>}

                {selectedOperation && (
                    <>
                        {/* Messages */}
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        {/* Add Resources Form */}
                        <h3>Add Resources</h3>
                        {formData.category.map((field, index) => (
                            <Row key={index} className="mb-3">
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Category (1-4)"
                                        name="category"
                                        value={formData.category[index]}
                                        onChange={e =>
                                            handleInputChange(e, index)
                                        }
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Serial Number"
                                        name="serial_number"
                                        value={formData.serial_number[index]}
                                        onChange={e =>
                                            handleInputChange(e, index)
                                        }
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Count"
                                        name="count"
                                        value={formData.count[index]}
                                        onChange={e =>
                                            handleInputChange(e, index)
                                        }
                                        required
                                    />
                                </Col>
                            </Row>
                        ))}

                        <div className="mb-3">
                            <Button variant="success" onClick={addFields}>
                                Add More
                            </Button>
                            <Button
                                variant="primary"
                                className="ms-2"
                                onClick={() => handleSubmit('add')}>
                                Submit
                            </Button>
                        </div>

                        {/* View Resources Button */}
                        <Button
                            variant="info"
                            className="me-2 mb-3"
                            onClick={handleView}>
                            View Resources
                        </Button>

                        {/* Display Fetched Resources */}
                        {fetchedResources.length > 0 && (
                            <>
                                <h3 className="mt-4">Fetched Resources</h3>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Serial Number</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchedResources.map(
                                            (resource, index) => (
                                                <tr key={index}>
                                                    <td>{resource.type}</td>
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
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </Table>
                            </>
                        )}

                        {/* Update Resources Form */}
                        <h3 className="mt-4">Update Resources</h3>
                        <p>Use the same form above to update resources</p>
                        <Button
                            variant="warning"
                            onClick={() => handleSubmit('update')}>
                            Update Resources
                        </Button>
                    </>
                )}
            </Container>
        </Layout>
    )
}

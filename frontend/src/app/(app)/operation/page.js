'use client'
import React, { useState, useEffect } from 'react'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import { toast } from 'sonner'
import { Icon } from '@iconify/react'
import axios from '@/lib/axios'
import Layout from '@/components/layout'
import Loading from '@/components/Loading'
import OperationStats from './OperationStats'
import OperationsTable from './OperationsTable'
import OperationModal from './OperationModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'

export default function Operation() {
    const [operations, setOperations] = useState([])
    const [stats, setStats] = useState({
        ongoing: 0,
        upcoming: 0,
        completed: 0,
    })
    const [showModal, setShowModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [editingOperation, setEditingOperation] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ongoing',
        start_date: '',
        end_date: '',
        location: '',
        budget: 0,
    })
    const [loading, setLoading] = useState(false)
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false)
    const [operationToDelete, setOperationToDelete] = useState(null)

    // Helper functions
    const formatDate = dateString => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    const formatDateForInput = dateString => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
    }

    const calculateStats = operations => {
        const counts = {
            ongoing: 0,
            upcoming: 0,
            completed: 0,
        }

        operations.forEach(op => {
            counts[op.status]++
        })

        return counts
    }

    const fetchOperations = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/get-all-operations')
            console.log('Operations:', response.data)
            setOperations(response.data)

            // Calculate stats from the operations data
            const counts = calculateStats(response.data[1])
            setStats(counts)
        } catch (error) {
            toast.error('Failed to fetch operations')
            console.error('Error fetching operations:', error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchOperations()
    }, [])

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.post('/api/create-operation', formData)
            toast.success('Operation created successfully')
            setShowModal(false)
            resetForm()
            fetchOperations()
        } catch (error) {
            toast.error('Failed to create operation')
            console.error('Error creating operation:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.put(
                `/api/update-operation/${editingOperation.id}`,
                formData,
            )
            toast.success('Operation updated successfully')
            setShowUpdateModal(false)
            resetForm()
            fetchOperations()
        } catch (error) {
            toast.error('Failed to update operation')
            console.error('Error updating operation:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteOperation = async () => {
        if (!operationToDelete) return

        try {
            setLoading(true)
            await axios.delete(`/api/delete-operation/${operationToDelete.id}`)
            toast.success('Operation deleted successfully')
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Unknown error occurred'
            toast.error(
                operationToDelete.status === 'ongoing'
                    ? `Cannot delete ongoing operations!`
                    : `Failed to delete operation: ${errorMessage}`,
            )
            console.error('Error deleting operation:', error)
        } finally {
            setDeleteConfirmModal(false)
            setOperationToDelete(null)
            setLoading(false)
            fetchOperations()
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            status: 'ongoing',
            start_date: '',
            end_date: '',
            location: '',
        })
        setEditingOperation(null)
    }

    const openUpdateModal = operation => {
        setEditingOperation(operation)
        setFormData({
            name: operation.name || '',
            description: operation.description || '',
            status: operation.status || 'ongoing',
            start_date: formatDateForInput(operation.start_date),
            end_date: formatDateForInput(operation.end_date),
            location: operation.location || '',
        })
        setShowUpdateModal(true)
    }

    const openDeleteConfirmation = operation => {
        setOperationToDelete(operation)
        setDeleteConfirmModal(true)
    }

    return (
        <Layout>
            {loading ? (
                <Loading text={'Loading Operations...'} />
            ) : (
                <Container fluid className="p-4">
                    <h1 className="mb-4">Operations</h1>

                    {/* Stats Cards */}
                    <OperationStats stats={stats} />

                    {/* Filter and Search */}
                    <Row className="mt-4 mb-4">
                        <Col>
                            <Button
                                variant="primary"
                                className="me-2"
                                onClick={() => setShowModal(true)}>
                                New Operation
                            </Button>
                            <Button
                                variant="outline-primary"
                                className="dropdown-toggle">
                                All Operations
                            </Button>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                style={{ maxWidth: '250px' }}
                            />
                            <Button variant="primary">
                                <Icon icon="mdi:magnify" />
                            </Button>
                        </Col>
                    </Row>

                    {/* view operations*/}
                    {operations[0] > 0 ? (
                        <OperationsTable
                            operations={operations[1]}
                            onEdit={openUpdateModal}
                            onDelete={openDeleteConfirmation}
                            formatDate={formatDate}
                        />
                    ) : (
                        <div className="text-center py-4 bg-light rounded">
                            <h4 className="mb-3">No operations yet</h4>
                        </div>
                    )}

                    {/* New Operation Modal */}
                    <OperationModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        title="Add New Operation"
                        formData={formData}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                        submitButtonText="Create Operation"
                        loadingText="Creating..."
                    />

                    {/* Update Operation Modal */}
                    <OperationModal
                        show={showUpdateModal}
                        onHide={() => setShowUpdateModal(false)}
                        title="Update Operation"
                        formData={formData}
                        onChange={handleInputChange}
                        onSubmit={handleUpdateSubmit}
                        loading={loading}
                        submitButtonText="Update Operation"
                        loadingText="Updating..."
                    />

                    {/* Delete Confirmation Modal */}
                    <DeleteConfirmationModal
                        show={deleteConfirmModal}
                        onHide={() => setDeleteConfirmModal(false)}
                        operationName={operationToDelete?.name}
                        onDelete={handleDeleteOperation}
                        loading={loading}
                    />
                </Container>
            )}
        </Layout>
    )
}

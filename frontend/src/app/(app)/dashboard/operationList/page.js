'use client'
import React, { useEffect, useState } from 'react'
import axios from '../../../../lib/axios' // Use your existing axios instance

const OperationsList = () => {
    const [operations, setOperations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const response = await axios.get('/api/get-all-operations') // Use the relative path
                setOperations(response.data)
                setLoading(false)
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        fetchOperations()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="operations-list">
            <h2>Operations</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Location</th>
                        <th>Budget</th>
                        <th>Created By</th>
                        <th>Updated By</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {operations.map((operation) => (
                        <tr key={operation.id}>
                            <td>{operation.id}</td>
                            <td>{operation.name}</td>
                            <td>{operation.description}</td>
                            <td>{operation.status}</td>
                            <td>{operation.start_date ? new Date(operation.start_date).toLocaleString() : 'N/A'}</td>
                            <td>{operation.end_date ? new Date(operation.end_date).toLocaleString() : 'N/A'}</td>
                            <td>{operation.location || 'N/A'}</td>
                            <td>{operation.budget ? `$${operation.budget.toFixed(2)}` : 'N/A'}</td>
                            <td>{operation.created_by}</td>
                            <td>{operation.updated_by || 'N/A'}</td>
                            <td>{new Date(operation.created_at).toLocaleString()}</td>
                            <td>{new Date(operation.updated_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OperationsList
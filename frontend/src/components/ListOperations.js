import React, { useEffect, useState } from 'react'
import axios from '../lib/axios'
import UpdateOperation from './UpdateOperation'

const ListOperations = () => {
    const [setRoleId] = useState(null)
    const [operations, setOperations] = useState([])
    const [loading, setLoading] = useState(true) // Track loading state

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
                )
                setRoleId(response.data.role_id || 'Unknown')
            } catch (error) {
                console.error('Error fetching user details:', error)
            }
        }

        fetchUserDetails()
    }, [])

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-all-operations`,
                )
                const operationsData = response.data[1] || []
                setOperations(operationsData)
                setLoading(false) // Data has been fetched, stop loading
            } catch (error) {
                console.error('Error fetching operations:', error)
                setLoading(false) // Stop loading even if there's an error
            }
        }

        fetchOperations()
    }, [])

    const handleOperationUpdated = updatedOperation => {
        setOperations(
            operations.map(op =>
                op.id === updatedOperation.id ? updatedOperation : op,
            ),
        )
    }

<<<<<<< HEAD

=======
>>>>>>> f8e84d97afa57eb7024559109a48e562e354158b
    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : operations.length === 0 ? (
                <p>No operations found.</p>
            ) : (
                operations.map(operation => (
                    <div key={operation.id}>
                        <h2>{operation.name || 'No Name'}</h2>
                        <p>{operation.description || 'No Description'}</p>
                        <UpdateOperation
                            operation={operation}
                            onOperationUpdated={handleOperationUpdated}
                        />
                    </div>
                ))
            )}
        </div>
    )
}

export default ListOperations

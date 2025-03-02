import React from 'react'
import axios from '../lib/axios'

const DeleteOperation = ({ operationId, onOperationDeleted }) => {
    const handleDelete = async () => {
        console.log('Deleting operation with ID:', operationId) // Debugging line
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-operation/${operationId}`,
                { data: { operationId } } // Adding body data if needed
            );
            
            onOperationDeleted(operationId)
            alert('Operation deleted successfully')
        } catch (error) {
            console.error('Error deleting operation:', error)
            alert('Failed to delete operation')
        }
    };

    return <button onClick={handleDelete}>Delete Operation</button>
}

export default DeleteOperation

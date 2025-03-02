import React, { useEffect, useState } from 'react';
import axios from '../lib/axios';
import UpdateOperation from './UpdateOperation';
import DeleteOperation from './DeleteOperation';

const ListOperations = () => {
    const [operations, setOperations] = useState([]);

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-all-operations`);
                const operationsData = response.data[1] || []; 
                setOperations(operationsData);
                /* console.log('Fetched operations:', operationsData);  */
            } catch (error) {
                console.error('Error fetching operations:', error);
            }
        };
    
        fetchOperations();
    }, []);
    

    const handleOperationUpdated = (updatedOperation) => {
        setOperations(operations.map(op => op.id === updatedOperation.id ? updatedOperation : op));
    };

    const handleOperationDeleted = (operationId) => {
        setOperations(operations.filter(op => op.id !== operationId));
    };

    return (
        <div>
            {(!operations || operations.length === 0) ? <p>No operations found.</p> : (
                operations.map(operation => (
                    <div key={operation.id}>
                        <h2>{operation.name || "No Name"}</h2>
                        <p>{operation.description || "No Description"}</p>
                        <UpdateOperation operation={operation} onOperationUpdated={handleOperationUpdated} />
                        <DeleteOperation operationId={operation.id} onOperationDeleted={handleOperationDeleted} />
                    </div>
                ))
            )}
        </div>
    );
};

export default ListOperations;

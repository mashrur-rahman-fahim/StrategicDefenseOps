import React from "react";
import axios from "../lib/axios";

const DeleteOperation = ({ operationId, onOperationDeleted }) => {
    const handleDelete = async () => {
        console.log("Deleting operation with ID:", operationId); // Debugging line
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-operation/${operationId}`,
                { data: { operationId } }, // Adding body data if needed
            );

            onOperationDeleted(operationId);
            alert("Operation deleted successfully");
        } catch (error) {
            console.error("Error deleting operation:", error);
            alert("Failed to delete operation");
        }
    };

    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={handleDelete}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
            >
                Delete Operation
            </button>
        </div>
    );
}

export default DeleteOperation;

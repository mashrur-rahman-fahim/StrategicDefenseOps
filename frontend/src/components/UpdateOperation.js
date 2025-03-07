import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import DeleteOperation from "./DeleteOperation";

const UpdateOperation = ({ operation, onOperationUpdated }) => {
    const [roleId, setRoleId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(operation);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
                );
                setRoleId(response.data.role_id || null);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-operation/${operation.id}`,
                formData,
            );
            onOperationUpdated(response.data);
            setIsEditing(false);
            alert("Operation updated successfully");
        } catch (error) {
            console.error("Error updating operation:", error);
            alert("Failed to update operation");
        }
    };

    // Handle operation deletion
    const handleOperationDeleted = (operationId) => {
        alert(`Operation with ID ${operationId} deleted successfully`);
    }

    return roleId === null ? (
        <div>Loading...</div> // Prevent rendering before roleId is set
    ) : (
        <div className="p-4 border rounded-lg shadow-md">
            {isEditing && roleId !== 4 ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="ongoing">Ongoing</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                    </select>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Submit Update
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-400 text-white rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <ul className="list-disc pl-5">
                        <li>
                            <strong>Name:</strong> {operation.name}
                        </li>
                        <li>
                            <strong>Description:</strong>{" "}
                            {operation.description}
                        </li>
                        <li>
                            <strong>Status:</strong> {operation.status}
                        </li>
                        <li>
                            <strong>Start Date:</strong> {operation.start_date}
                        </li>
                        <li>
                            <strong>End Date:</strong> {operation.end_date}
                        </li>
                        <li>
                            <strong>Location:</strong> {operation.location}
                        </li>
                        <li>
                            <strong>Budget:</strong> ${operation.budget}
                        </li>
                    </ul>
                    {roleId !== 4 && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-0.5 bg-green-500 text-white rounded"
                            >
                                Update
                            </button>
                            {roleId == 1 && (
                                <DeleteOperation
                                    operationId={operation.id}
                                    onOperationDeleted={handleOperationDeleted}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UpdateOperation;

import React, { useState } from 'react';
import axios from '../lib/axios';

const UpdateOperation = ({ operation, onOperationUpdated }) => {
    const [formData, setFormData] = useState(operation);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-operation/${operation.id}`, formData);
            onOperationUpdated(response.data);
            alert('Operation updated successfully');
        } catch (error) {
            console.error('Error updating operation:', error);
            alert('Failed to update operation');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
            </select>
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
            <input type="number" name="budget" value={formData.budget} onChange={handleChange} />
            <button type="submit">Update Operation</button>
        </form>
    );
};

export default UpdateOperation;
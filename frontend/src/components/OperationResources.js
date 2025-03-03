import React, { useState, useEffect } from 'react';
import axios from '../lib/axios';

const OperationResources = ({ operationId }) => {
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        category: [],
        serial_number: [],
        count: []
    });
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`);
                setUserID(response.data.id || null);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
        fetchOperationResources();
    }, [operationId]);

    const fetchOperationResources = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-operation-resources/${operationId}`);
            setResources(response.data);
        } catch (error) {
            console.error('Error fetching operation resources:', error);
        }
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newFormData = { ...formData };
        newFormData[name][index] = value;
        setFormData(newFormData);
    };

    const addResourceField = () => {
        setFormData({
            category: [...formData.category, ''],
            serial_number: [...formData.serial_number, ''],
            count: [...formData.count, '']
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userID) {
            alert('User not identified. Please try again.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-operation-resources/${operationId}`, formData);
            console.log('API Response:', response);
            alert('Operation resources added successfully');
            fetchOperationResources();
        } catch (error) {
            console.error('Error adding operation resources:', error);
            alert('Failed to add operation resources');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!userID) {
            alert('User not identified. Please try again.');
            return;
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-operation-resources/${operationId}`, formData);
            console.log('API Response:', response);
            alert('Operation resources updated successfully');
            fetchOperationResources();
        } catch (error) {
            console.error('Error updating operation resources:', error);
            alert('Failed to update operation resources');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Operation Resources</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.category.map((_, index) => (
                    <div key={index} className="sm:col-span-2">
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category[index]}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="text"
                            name="serial_number"
                            placeholder="Serial Number"
                            value={formData.serial_number[index]}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="number"
                            name="count"
                            placeholder="Count"
                            value={formData.count[index]}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                ))}
                <div className="sm:col-span-2">
                    <button
                        type="button"
                        onClick={addResourceField}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
                        Add Resource
                    </button>
                </div>
                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200">
                        Submit Resources
                    </button>
                </div>
            </form>
            <button
                onClick={handleUpdate}
                className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-200 mt-4">
                Update Resources
            </button>
            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Current Resources</h3>
                {resources.map((resource, index) => (
                    <div key={index} className="mb-2">
                        <p>Category: {resource.category}</p>
                        <p>Serial Number: {resource.serial_number}</p>
                        <p>Count: {resource.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OperationResources;
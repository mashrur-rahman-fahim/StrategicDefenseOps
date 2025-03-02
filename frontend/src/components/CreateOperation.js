import React, { useState, useEffect } from 'react';
import axios from '../lib/axios';

const CreateOperation = ({ onOperationCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ongoing',
        start_date: '',
        end_date: '',
        location: '',
        budget: ''
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
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userID) {
            alert('User not identified. Please try again.');
            return;
        }
    
        const operationData = {
            ...formData,
            created_by: userID,
            updated_by: null 
        };
    
        
        console.log('Form Data being sent to the API:', operationData);
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-operation`, operationData);
            console.log('API Response:', response); 
            onOperationCreated(response.data);
            alert('Operation created successfully');
        } catch (error) {
            console.error('Error creating operation:', error);
            alert('Failed to create operation');
        }
        
    };

    return (
       <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
            <select name="status" onChange={handleChange} required>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
            </select>
            <input type="date" name="start_date" onChange={handleChange} required />
            <input type="date" name="end_date" onChange={handleChange} required />
            <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
            <input type="number" name="budget" placeholder="Budget" onChange={handleChange} required />
            <button type="submit">Create Operation</button>
        </form>
        </>
    );
};

export default CreateOperation;
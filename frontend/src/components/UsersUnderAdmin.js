'use client';

import React, { useState, useEffect } from 'react';
import axios from '../lib/axios';

const UsersUnderAdmin = () => {
    const [userData, setUserData] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`);
                console.log('API response:', response.data);
                setRoleId(response.data.role_id || null);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Failed to fetch user details. Please try again later.');
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/role-view`);
                
                // Log the backend response
                console.log('Backend Response:', response.data);

                // Extract the actual data from the response
                const data = response.data;

                // If the data is an array, take the second element (the actual data)
                const processedData = Array.isArray(data) ? data[1] : data;

                // Log the processed data
                console.log('Processed Data:', processedData);

                // Set the processed data to state
                setUserData(processedData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data. Please try again later.');
            }
        };

        fetchUserData();
    }, []);

    const renderUserData = () => {
        if (error) {
            return <p>{error}</p>;
        }

        if (!userData) {
            return <p>Loading...</p>;
        }

        // Ensure userData is an object before accessing its properties
        if (typeof userData !== 'object' || userData === null) {
            return <p>Invalid data received from the server.</p>;
        }

        if (roleId === 1) {
            // Extract managers from userData
            const managerIds = Object.keys(userData); // Get all manager IDs
            const managers = managerIds.map((managerId) => userData[managerId]); // Convert to array of managers

            return (
                <div>
                    <h3>Managers:</h3>
                    {managers.map((manager, index) => {
                        const safeOperators = manager.operators || [];
                        const safeViewers = manager.viewers || [];
                        return (
                            <div key={index}>
                                <h4>Manager {index + 1}:</h4>
                                <h5>Operators:</h5>
                                {safeOperators.map((operator) => (
                                    <p key={operator.id}>{operator.name}</p>
                                ))}
                                <h5>Viewers:</h5>
                                {safeViewers.map((viewer) => (
                                    <p key={viewer.id}>{viewer.name}</p>
                                ))}
                            </div>
                        );
                    })}
                </div>
            );
        } else if (roleId === 2) {
            const safeOperators = userData.operators || [];
            const safeViewers = userData.viewers || [];
            return (
                <div>
                    <h3>Admin:</h3>
                    <p>{userData.admin.name}</p>
                    <h3>Operators:</h3>
                    {safeOperators.map((operator) => (
                        <p key={operator.id}>{operator.name}</p>
                    ))}
                    <h3>Viewers:</h3>
                    {safeViewers.map((viewer) => (
                        <p key={viewer.id}>{viewer.name}</p>
                    ))}
                </div>
            );
        } else if (roleId === 3 || roleId === 4) {
            return (
                <div>
                    <h3>Admin:</h3>
                    <p>{userData.admin.name}</p>
                    <h3>Manager:</h3>
                    <p>{userData.manager.name}</p>
                </div>
            );
        } else {
            return <p>Unauthorized</p>;
        }
    };

    return (
        <div>
            <h1> roleId : {roleId}</h1>
            <h2>User Roles</h2>
            {renderUserData()}
        </div>
    );
};

export default UsersUnderAdmin;
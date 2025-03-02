'use client'
import React, { useEffect, useState } from 'react';
import axios from '../../../lib/axios';
import CreateOperation from '../../../components/CreateOperation';
import ListOperations from '../../../components/ListOperations';
import './dashboard.css';

const Dashboard = () => {
    const [userName, setUserName] = useState('Unknown');
    const [roleId, setRoleId] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);

    const roleMapping = {
        1: 'Admin',
        2: 'Manager',
        3: 'Operator',
        4: 'Viewer',
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`);
                console.log('API response:', response.data);
                setUserName(response.data.name || 'Unknown');
                setRoleId(response.data.role_id || null);
                setRoleName(roleMapping[response.data.role_id] || 'Unknown');
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleOperationCreated = (newOperation) => {
        setOperations([...operations, newOperation]);
    };

    return (
        <div className="dashboard">
            <h2>Welcome, {userName} ({roleName})</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {roleId === 1 && <CreateOperation onOperationCreated={handleOperationCreated} />}
                    <ListOperations />
                </>
            )}
        </div>
    );
};

export default Dashboard;
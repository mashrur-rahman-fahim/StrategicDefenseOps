'use client';
import Layout from '@/components/layout';
import { useAuth } from '@/hooks/auth';
import axios from '@/lib/axios';
import React, { useEffect, useState } from 'react';

export default function ViewRoles() {
    const { user } = useAuth({ middleware: 'auth' });
    const [rolesData, setRolesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/role-view');
                console.log('API Response:', response.data); // Log the response
                setRolesData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error)
        return <div className="alert alert-danger mt-5">Error: {error}</div>;

    const renderRoles = () => {
        if (!rolesData) return null;

        switch (user?.role_id) {
            case 1: // Admin
                return (
                    <div className="container mt-5">
                        <h2>Admin View</h2>
                        {rolesData.managers && rolesData.managers.length > 0 ? (
                            rolesData.managers.map((managerGroup, index) => (
                                <div key={index} className="card mb-3">
                                    <div className="card-header">
                                        Manager:{' '}
                                        {managerGroup.manager?.name ||
                                            'Unknown'}
                                        <div></div>
                                        Email :{' '}
                                        {managerGroup.manager?.email || 'Unknown'}
                                    </div>
                                   
                                    <div className="card-body">
                                        <h5>Operators:</h5>
                                        <ul className="list-group">
                                            {managerGroup.operators &&
                                            managerGroup.operators[1]?.length >
                                                0 ? (
                                                managerGroup.operators[1].map(
                                                    (operator, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="list-group-item"
                                                        >
                                                            {operator.name}
                                                            <div></div>
                                                            {operator.email}
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <li className="list-group-item">
                                                    No operators found
                                                </li>
                                            )}
                                        </ul>
                                        <h5 className="mt-3">Viewers:</h5>
                                        <ul className="list-group">
                                            {managerGroup.viewers &&
                                            managerGroup.viewers[1]?.length >
                                                0 ? (
                                                managerGroup.viewers[1].map(
                                                    (viewer, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="list-group-item"
                                                        >
                                                            {viewer.name}
                                                            <div></div>
                                                            {viewer.email}
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <li className="list-group-item">
                                                    No viewers found
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-warning">
                                No managers found
                            </div>
                        )}
                    </div>
                );

            case 2: // Manager
                return (
                    <div className="container mt-5">
                        <h2>Manager View</h2>
                        <div className="card">
                            <div className="card-header">
                                Admin:{' '}
                                {(rolesData.admin &&
                                    rolesData.admin[1]?.name) ||
                                    'Unknown'}
                                    <div></div>
                                    Email :{' '}
                                    {rolesData.admin && rolesData.admin[1]?.email || 'Unknown'}
                            </div>
                            <div className="card-body">
                                <h5>Operators:</h5>
                                <ul className="list-group">
                                    {rolesData.operators &&
                                    rolesData.operators[1]?.length > 0 ? (
                                        rolesData.operators[1].map(
                                            (operator, idx) => (
                                                <li
                                                    key={idx}
                                                    className="list-group-item"
                                                >
                                                    {operator.name}
                                                    <div></div>
                                                    {operator.email}
                                                </li>
                                            )
                                        )
                                    ) : (
                                        <li className="list-group-item">
                                            No operators found
                                        </li>
                                    )}
                                </ul>
                                <h5 className="mt-3">Viewers:</h5>
                                <ul className="list-group">
                                    {rolesData.viewers &&
                                    rolesData.viewers[1]?.length > 0 ? (
                                        rolesData.viewers[1].map(
                                            (viewer, idx) => (
                                                <li
                                                    key={idx}
                                                    className="list-group-item"
                                                >
                                                    {viewer.name}
                                                    <div></div>
                                                    {viewer.email}
                                                </li>
                                            )
                                        )
                                    ) : (
                                        <li className="list-group-item">
                                            No viewers found
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Operator
            case 4: // Viewer
                return (
                    <div className="container mt-5">
                        <h2>
                            {user?.role_id === 3 ? 'Operator' : 'Viewer'} View
                        </h2>
                        <div className="card">
                            <div className="card-header">
                                Manager:{' '}
                                {(rolesData.manager &&
                                    rolesData.manager[1]?.name) ||
                                    'Unknown'}
                                    <div></div>
                                    {rolesData.manager && rolesData.manager[1]?.email || 'Unknown'}
                            </div>
                            <div className="card-body">
                                <h5>Admin:</h5>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        {(rolesData.admin &&
                                            rolesData.admin[1]?.name) ||
                                            'Unknown'}
                                            <div></div>
                                            {rolesData.admin && rolesData.admin[1]?.email || 'Unknown'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="alert alert-warning mt-5">
                        Unauthorized access
                    </div>
                );
        }
    };

    return (
        <Layout>
            <div>{renderRoles()}</div>
        </Layout>
    );
}

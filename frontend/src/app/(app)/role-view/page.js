"use client";
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function RoleView({ user }) {
    const [roleData, setRoleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoleView = async () => {
            try {
                const response = await axios.get('/api/role-view');
                setRoleData(response.data);
            } catch (err) {
                setError('Failed to fetch role data');
            } finally {
                setLoading(false);
            }
        };

        fetchRoleView();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Role View</h2>
            <pre className="bg-gray-100 p-3 rounded-lg overflow-auto">
                {JSON.stringify(roleData, null, 2)}
            </pre>
        </div>
    );
}

import { useEffect, useState } from 'react';
import axios from '../lib/axios';

const UsersUnderAdmin = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/role-view`);
                setData(response.data);
            } catch (err) {
                setError(err.response?.data || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div>
            <h2>Users Under Admin</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default UsersUnderAdmin;

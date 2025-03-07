import { useEffect, useState } from 'react'
import axios from '../lib/axios' // Ensure the axios instance is in the correct location

const AuditLogs = ({ user }) => {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) return // Ensure user is provided

        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audit-logs/${user}`,
                )
                setLogs(response.data)
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch logs')
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [user])

    if (loading) return <p>Loading audit logs...</p>
    if (error) return <p className="text-red-500">Error: {error}</p>

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
            {logs.length > 0 ? (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Action</th>
                            <th className="border p-2">Used Email</th>
                            <th className="border p-2">Details</th>
                            <th className="border p-2">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs
                            .filter(
                                log => log.log_name !== 'user_details_access',
                            )
                            .map(log => (
                                <tr key={log.id} className="border">
                                    <td className="p-2">{log.log_name}</td>
                                    <td className="p-2">{log.user_email}</td>
                                    <td className="p-2">{log.description}</td>
                                    <td className="p-2">
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            ) : (
                <p>No logs found.</p>
            )}
        </div>
    )
}

export default AuditLogs

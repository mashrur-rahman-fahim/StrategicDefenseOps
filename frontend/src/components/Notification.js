import { useEffect, useState } from 'react'
import axios from '../lib/axios'
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline'

const Notification = ({ user }) => {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) return

        const fetchLogs = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${user}`,
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

    const getIcon = (logName) => {
        switch (logName) {
            case 'user_login':
                return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'user_registration':
                return <DocumentTextIcon className="w-6 h-6 text-blue-500" />;
            default:
                return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
        }
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) return (
        <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
        </div>
    )

    if (error) return (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700 font-medium">{error}</p>
        </div>
    )

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BellIcon className="w-6 h-6 text-purple-600" />
                    Activity Log
                </h2>
            </div>
            
            <div className="flow-root">
                <ul className="divide-y divide-gray-100">
                    {logs
                        .filter(log => log.log_name !== 'user_details_access')
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((log) => (
                            <li key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        {getIcon(log.log_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {log.description}
                                            </p>
                                            <time 
                                                className="flex-shrink-0 text-xs text-gray-500 flex items-center gap-1"
                                                title={new Date(log.created_at).toLocaleString()}
                                            >
                                                <ClockIcon className="w-4 h-4" />
                                                {formatTime(log.created_at)}
                                            </time>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {log.log_name.replace(/_/g, ' ')}
                                                </span>
                                                <span className="truncate">
                                                    {log.user_email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>

            {logs.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    <p className="text-lg">No activity found</p>
                    <p className="text-sm mt-2">Your security activities will appear here</p>
                </div>
            )}
        </div>
    )
}

export default Notification
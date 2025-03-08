'use client';
import Layout from '@/components/layout';
import { useAuth } from '@/hooks/auth';
import axios from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import { UserIcon, ShieldCheckIcon, UserGroupIcon, EyeIcon, CogIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ViewRoles() {
    const { user } = useAuth({ middleware: 'auth' });
    const [rolesData, setRolesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/role-view');
                setRolesData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    if (loading) return (
        <Layout>
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="flex space-x-2 animate-pulse">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        </Layout>
    );

    if (error) return (
        <Layout>
            <div className="max-w-4xl mx-auto mt-8 px-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-2" />
                        <div>
                            <h3 className="text-sm font-semibold text-red-800">Authorization Error</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );

    const RoleBadge = ({ role }) => {
        const roleStyles = {
            1: 'bg-gradient-to-r from-blue-600 to-blue-400',
            2: 'bg-gradient-to-r from-green-600 to-green-400',
            3: 'bg-gradient-to-r from-purple-600 to-purple-400',
            4: 'bg-gradient-to-r from-gray-600 to-gray-400'
        };

        return (
            <span className={`${roleStyles[role]} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                {role === 1 && 'Admin'}
                {role === 2 && 'Manager'}
                {role === 3 && 'Operator'}
                {role === 4 && 'Viewer'}
            </span>
        );
    };

    const UserCard = ({ user, role }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out group">
            <div className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <RoleBadge role={role} />
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        <span>{user.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const SectionHeader = ({ title, icon, count }) => {
        const Icon = icon;
        return (
            <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="ml-2 text-lg font-semibold text-gray-800">{title}</h3>
                {count !== undefined && (
                    <span className="ml-2 bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600">
                        {count} {count === 1 ? 'member' : 'members'}
                    </span>
                )}
            </div>
        );
    };

    const renderRoles = () => {
        if (!rolesData) return null;

        switch (user?.role_id) {
            case 1: // Admin
                return (
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-2" />
                                Administrator Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2">Manage and monitor all organization roles</p>
                        </div>

                        {rolesData.managers?.map((managerGroup, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center text-white">
                                        <div className="mb-4 md:mb-0">
                                            <h2 className="text-xl font-semibold flex items-center">
                                                <UserGroupIcon className="h-6 w-6 mr-2" />
                                                {managerGroup.manager?.name || 'Unassigned Manager'}
                                            </h2>
                                            <div className="flex items-center mt-2 space-x-4">
                                                <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg">
                                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                                    {managerGroup.manager?.email || 'No email available'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-8">
                                    <div>
                                        <SectionHeader 
                                            title="Operators" 
                                            icon={CogIcon} 
                                            count={managerGroup.operators?.[1]?.length || 0} 
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {managerGroup.operators?.[1]?.map((operator, idx) => (
                                                <UserCard key={idx} user={operator} role={3} />
                                            )) || (
                                                <div className="col-span-full text-center py-6 text-gray-500">
                                                    No operators assigned
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <SectionHeader 
                                            title="Viewers" 
                                            icon={EyeIcon} 
                                            count={managerGroup.viewers?.[1]?.length || 0} 
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {managerGroup.viewers?.[1]?.map((viewer, idx) => (
                                                <UserCard key={idx} user={viewer} role={4} />
                                            )) || (
                                                <div className="col-span-full text-center py-6 text-gray-500">
                                                    No viewers assigned
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 2: // Manager
                return (
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <UserGroupIcon className="h-8 w-8 text-green-600 mr-2" />
                                Team Management
                            </h1>
                            <p className="text-gray-600 mt-2">Manage your operators and viewers</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
                                <div className="text-white">
                                    <h2 className="text-xl font-semibold flex items-center">
                                        <ShieldCheckIcon className="h-6 w-6 mr-2" />
                                        {(rolesData.admin && rolesData.admin[1]?.name) || 'System Admin'}
                                    </h2>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg">
                                            <EnvelopeIcon className="h-4 w-4 mr-2" />
                                            {rolesData.admin && rolesData.admin[1]?.email || 'admin@example.com'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-8">
                                <div>
                                    <SectionHeader 
                                        title="Operators" 
                                        icon={CogIcon} 
                                        count={rolesData.operators?.[1]?.length || 0} 
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {rolesData.operators?.[1]?.map((operator, idx) => (
                                            <UserCard key={idx} user={operator} role={3} />
                                        )) || (
                                            <div className="col-span-full text-center py-6 text-gray-500">
                                                No operators in your team
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader 
                                        title="Viewers" 
                                        icon={EyeIcon} 
                                        count={rolesData.viewers?.[1]?.length || 0} 
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {rolesData.viewers?.[1]?.map((viewer, idx) => (
                                            <UserCard key={idx} user={viewer} role={4} />
                                        )) || (
                                            <div className="col-span-full text-center py-6 text-gray-500">
                                                No viewers in your team
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Operator
            case 4: // Viewer
                return (
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                {user?.role_id === 3 ? (
                                    <>
                                        <CogIcon className="h-8 w-8 text-purple-600 mr-2" />
                                        Operator Portal
                                    </>
                                ) : (
                                    <>
                                        <EyeIcon className="h-8 w-8 text-gray-600 mr-2" />
                                        Viewer Portal
                                    </>
                                )}
                            </h1>
                            <p className="text-gray-600 mt-2">Your system access and hierarchy</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <SectionHeader title="Your Manager" icon={UserGroupIcon} />
                                <div className="mt-4">
                                    {rolesData.manager?.[1] ? (
                                        <UserCard user={rolesData.manager[1]} role={2} />
                                    ) : (
                                        <div className="text-gray-500 text-center py-4">
                                            No manager assigned
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <SectionHeader title="System Admin" icon={ShieldCheckIcon} />
                                <div className="mt-4">
                                    {rolesData.admin?.[1] ? (
                                        <UserCard user={rolesData.admin[1]} role={1} />
                                    ) : (
                                        <div className="text-gray-500 text-center py-4">
                                            Admin information not available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="max-w-4xl mx-auto mt-8 px-4">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-2" />
                                <div>
                                    <h3 className="text-sm font-semibold text-red-800">Access Restricted</h3>
                                    <p className="text-sm text-red-700">You don't have permission to view this content</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">{renderRoles()}</div>
        </Layout>
    );
}
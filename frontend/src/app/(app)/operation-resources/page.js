'use client';
import Layout from '@/components/layout';
import { useAuth } from '@/hooks/auth';
import axios from '@/lib/axios.js';
import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    Plus,
    Eye,
    Edit,
    RefreshCw,
} from 'lucide-react';

export default function OperationResources() {
    useAuth({ middleware: 'auth' });

    const [operations, setOperations] = useState([]);
    const [completedOperations, setCompletedOperations] = useState([]);
    const [allResources, setAllResources] = useState([]);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [formEntries, setFormEntries] = useState([
        {
            category: '',
            serialNumber: '',
            count: '',
        },
    ]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fetchedResources, setFetchedResources] = useState([]);
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
    const [showCompletedOnly, setShowCompletedOnly] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOperations();
        fetchAllResources();
    }, []);

    useEffect(() => {
        if (operations.length > 0) {
            if (showCompletedOnly) {
                const filtered = operations.filter(
                    (op) => op.status === 'completed'
                );
                setCompletedOperations(filtered);
            } else {
                setCompletedOperations(operations);
            }
        }
    }, [operations, showCompletedOnly]);

    useEffect(() => {
        if (selectedOperation) {
            setFormEntries([
                {
                    category: '',
                    serialNumber: '',
                    count: '',
                },
            ]);
            setFetchedResources([]);
            setMessage('');
            setError('');
        }
    }, [selectedOperation]);

    const fetchOperations = async () => {
        try {
            const response = await axios.get('/api/get-all-operations');
            setOperations(response.data[1]);
        } catch (err) {
            setError('Failed to fetch operations');
        }
    };

    const fetchAllResources = async () => {
        try {
            const response = await axios.get('/api/get-all-resources');
            setAllResources(response.data[1]);
        } catch (err) {
            setError('Failed to fetch resources');
        }
    };

    const handleFormChange = (index, field, value) => {
        const updatedEntries = [...formEntries];
        updatedEntries[index][field] = value;

        if (field === 'category') {
            updatedEntries[index].serialNumber = '';
        }

        setFormEntries(updatedEntries);
    }

    const addFormEntry = () => {
        setFormEntries([
            ...formEntries,
            {
                category: '',
                serialNumber: '',
                count: '',
            },
        ]);
    }

    const handleResourceSelect = (resource, category) => {
        const updatedEntries = [...formEntries];
        const entry = updatedEntries[currentEntryIndex];

        entry.serialNumber = getSerialNumber(resource, category);
        entry.category = category;
        entry.resourceName = getResourceName(resource, category);
        entry.resourceDescription = getResourceDescription(resource, category);

        setFormEntries(updatedEntries);
        setShowResourceModal(false);
    }

    const getResourceName = (resource, category) => {
        switch (category) {
            case '1':
                return resource.vehicle_name;
            case '2':
                return resource.weapon_name;
            case '3':
                return resource.personnel_name;
            case '4':
                return resource.equipment_name;
            default:
                return '';
        }
    };

    const getResourceDescription = (resource, category) => {
        switch (category) {
            case '1':
                return resource.vehicle_description || 'No description';
            case '2':
                return resource.weapon_description || 'No description';
            case '3':
                return resource.personnel_description || 'No description';
            case '4':
                return resource.equipment_description || 'No description';
            default:
                return '';
        }
    };

    const getSerialNumber = (resource, category) => {
        switch (category) {
            case '1':
                return resource.vehicle_serial_number;
            case '2':
                return resource.weapon_serial_number;
            case '3':
                return resource.personnel_serial_number;
            case '4':
                return resource.equipment_serial_number;
            default:
                return '';
        }
    };

    const filteredResources = (category) => {
        if (!allResources || !Array.isArray(allResources)) return [];

        let filtered = allResources.filter((resource) => {
            if (category === '1') return resource.vehicle_name;
            if (category === '2') return resource.weapon_name;
            if (category === '3') return resource.personnel_name;
            if (category === '4') return resource.equipment_name;
            return false;
        })

        if (searchTerm) {
            filtered = filtered.filter((resource) => {
                const name = getResourceName(resource, category).toLowerCase();
                const description = getResourceDescription(
                    resource,
                    category
                ).toLowerCase();
                return (
                    name.includes(searchTerm.toLowerCase()) ||
                    description.includes(searchTerm.toLowerCase())
                );
            })
        }

        return filtered;
    }

    const getCategoryName = (categoryId) => {
        switch (categoryId) {
            case '1':
                return 'Vehicle';
            case '2':
                return 'Weapon';
            case '3':
                return 'Personnel';
            case '4':
                return 'Equipment';
            default:
                return 'Unknown';
        }
    };

    const getCategoryIcon = (categoryId) => {
        switch (categoryId) {
            case '1':
                return '🚗';
            case '2':
                return '🔫';
            case '3':
                return '👤';
            case '4':
                return '🔧';
            default:
                return '📦';
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'ongoing':
                return 'bg-green-500';
            case 'upcoming':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-gray-500';
            default:
                return 'bg-purple-500';
        }
    };

    const handleSubmit = async (actionType) => {
        if (!selectedOperation) {
            setError('Please select an operation first');
            return
        }

        try {
            const invalidEntries = formEntries.some(
                (entry) =>
                    !entry.category || !entry.serialNumber || !entry.count
            );

            if (invalidEntries) {
                setError('Please fill in all resource details');
                return
            }

            setMessage(
                `Resources ${actionType === 'add' ? 'added' : 'updated'} successfully`
            );
            setError('');
            setFormEntries([{ category: '', serialNumber: '', count: '' }]);
            handleViewResources();
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            setMessage('');
        }
    };

    const handleViewResources = async () => {
        if (!selectedOperation) {
            setError('Please select an operation first');
            return
        }

        setError('');
        setMessage('');

        try {
            const response = await axios.get(
                `/api/get-operation-resources/${selectedOperation}`
            );
            const transformed = [];

            Object.entries(response.data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        transformed.push({
                            type: key.charAt(0).toUpperCase() + key.slice(1),
                            id: item.id,
                            name: item[`${key}_name`] || 'N/A',
                            description:
                                item[`${key}_description`] || 'No description',
                            serialNumber: item[`${key}_serial_number`],
                            count: item[`${key}_count`],
                        });
                    })
                }
            });

            setFetchedResources(transformed);
            setMessage('Resources fetched successfully');
        } catch (err) {
            setError('Failed to fetch resources for this operation');
            setFetchedResources([]);
        }
    };

    const handleOperationSelect = (operationId) => {
        setSelectedOperation(operationId);
    }

    const toggleOperationFilter = () => {
        setShowCompletedOnly(!showCompletedOnly);
    }

    const filteredOperations = completedOperations.filter(
        (op) =>
            op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (op.description &&
                op.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Operation Resources
                        </h1>
                        <div className="flex space-x-2">
                            <button
                                onClick={toggleOperationFilter}
                                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                                    showCompletedOnly
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                {showCompletedOnly
                                    ? 'Completed Only'
                                    : 'All Operations'}
                            </button>
                        </div>
                    </div>

                    {/* Search & Operations Selection */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Select Operation
                            </h2>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search operations..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            </div>
                        </div>

                        {filteredOperations.length === 0 && (
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4">
                                {showCompletedOnly
                                    ? 'No completed operations found.'
                                    : 'No operations found.'}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredOperations.map((op) => (
                                <div
                                    key={op.id}
                                    onClick={() => handleOperationSelect(op.id)}
                                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                                        selectedOperation === op.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-medium text-lg">
                                                {op.name}
                                            </h3>
                                            {op.description && (
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                    {op.description}
                                                </p>
                                            )}
                                        </div>
                                        {op.status && (
                                            <span
                                                className={`${getStatusBadgeVariant(op.status)} text-white text-xs px-2 py-1 rounded-full h-fit`}
                                            >
                                                {op.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedOperation && (
                        <>
                            {/* Resource Management Section */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                    Manage Resources
                                </h2>

                                {formEntries.map((entry, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            <div className="md:col-span-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Resource Type
                                                </label>
                                                <select
                                                    value={entry.category}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            index,
                                                            'category',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Category
                                                    </option>
                                                    <option value="1">
                                                        🚗 Vehicle
                                                    </option>
                                                    <option value="2">
                                                        🔫 Weapon
                                                    </option>
                                                    <option value="3">
                                                        👤 Personnel
                                                    </option>
                                                    <option value="4">
                                                        🔧 Equipment
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Resource
                                                </label>
                                                <button
                                                    disabled={!entry.category}
                                                    onClick={async () => {
                                                        try {
                                                            await fetchAllResources();
                                                            setCurrentEntryIndex(
                                                                index
                                                            );
                                                            setShowResourceModal(
                                                                true
                                                            );
                                                        } catch (err) {
                                                            setError(
                                                                'Failed to refresh resources'
                                                            );
                                                        }
                                                    }}
                                                    className={`w-full px-4 py-2 text-left border rounded-lg flex justify-between items-center ${
                                                        !entry.category
                                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                            : entry.resourceName
                                                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                              : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="truncate">
                                                        {entry.resourceName
                                                            ? `${getCategoryIcon(entry.category)} ${entry.resourceName}`
                                                            : 'Select Resource'}
                                                    </span>
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                                {entry.resourceDescription && (
                                                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                                                        {
                                                            entry.resourceDescription
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="md:col-span-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Count"
                                                    value={entry.count}
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            index,
                                                            'count',
                                                            e.target.value
                                                        )
                                                    }
                                                    min="1"
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mb-6">
                                    <button
                                        onClick={addFormEntry}
                                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Resource
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => handleSubmit('add')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Resources
                                    </button>
                                    <button
                                        onClick={() => handleSubmit('update')}
                                        className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Update Resources
                                    </button>
                                    <button
                                        onClick={handleViewResources}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Current Resources
                                    </button>
                                </div>
                            </div>

                            {/* Resource Selection Modal */}
                            {showResourceModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                            <h3 className="text-lg font-medium">
                                                Select{' '}
                                                {formEntries[currentEntryIndex]
                                                    ?.category
                                                    ? getCategoryName(
                                                          formEntries[
                                                              currentEntryIndex
                                                          ].category
                                                      )
                                                    : 'Resource'}
                                            </h3>
                                            <button
                                                onClick={() =>
                                                    setShowResourceModal(false)
                                                }
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="p-4 border-b border-gray-200">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search resources..."
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="overflow-y-auto max-h-[60vh]">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Description
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Available
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredResources(
                                                        formEntries[
                                                            currentEntryIndex
                                                        ]?.category
                                                    ).map((resource) => {
                                                        const category =
                                                            formEntries[
                                                                currentEntryIndex
                                                            ]?.category;
                                                        const name =
                                                            getResourceName(
                                                                resource,
                                                                category
                                                            );
                                                        const description =
                                                            getResourceDescription(
                                                                resource,
                                                                category
                                                            );
                                                        const count =
                                                            category === '1'
                                                                ? resource.vehicle_count
                                                                : category ===
                                                                    '2'
                                                                  ? resource.weapon_count
                                                                  : category ===
                                                                      '3'
                                                                    ? resource.personnel_count
                                                                    : category ===
                                                                        '4'
                                                                      ? resource.equipment_count
                                                                      : 0;

                                                        return (
                                                            <tr
                                                                key={
                                                                    resource.id
                                                                }
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {name}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                                    {
                                                                        description
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {count}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleResourceSelect(
                                                                                resource,
                                                                                formEntries[
                                                                                    currentEntryIndex
                                                                                ]
                                                                                    .category
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                                                    >
                                                                        Select
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}

                                                    {filteredResources(
                                                        formEntries[
                                                            currentEntryIndex
                                                        ]?.category
                                                    ).length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan="4"
                                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                                            >
                                                                No resources
                                                                found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Display Messages */}
                            {message && (
                                <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
                                    <div className="mr-3 mt-0.5">✓</div>
                                    <div>{message}</div>
                                </div>
                            )}

                            {error && (
                                <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
                                    <div className="mr-3 mt-0.5">⚠</div>
                                    <div>{error}</div>
                                </div>
                            )}

                            {/* Display Fetched Resources */}
                            {fetchedResources.length > 0 && (
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-700">
                                            Current Operation Resources
                                        </h2>
                                        <button
                                            onClick={handleViewResources}
                                            className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3 mr-1" />
                                            Refresh
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Count
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {fetchedResources.map(
                                                    (resource, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                                ${
                                                                    resource.type ===
                                                                    'Vehicle'
                                                                        ? 'bg-purple-100 text-purple-800'
                                                                        : resource.type ===
                                                                            'Weapon'
                                                                          ? 'bg-red-100 text-red-800'
                                                                          : resource.type ===
                                                                              'Personnel'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-blue-100 text-blue-800'
                                                                }`}
                                                                >
                                                                    {resource.type ===
                                                                    'Vehicle'
                                                                        ? '🚗'
                                                                        : resource.type ===
                                                                            'Weapon'
                                                                          ? '🔫'
                                                                          : resource.type ===
                                                                              'Personnel'
                                                                            ? '👤'
                                                                            : '🔧'}{' '}
                                                                    {
                                                                        resource.type
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {resource.name}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                                {
                                                                    resource.description
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {resource.count}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

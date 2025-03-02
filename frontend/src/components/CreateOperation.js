import React, { useState, useEffect, useRef } from 'react'
import axios from '../lib/axios'

const CreateOperation = ({ onOperationCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ongoing',
        start_date: '',
        end_date: '',
        location: '',
        budget: '',
    })
    const [userID, setUserID] = useState(null)
    const startDateRef = useRef(null)
    const endDateRef = useRef(null)

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
                )
                setUserID(response.data.id || null)
            } catch (error) {
                console.error('Error fetching user details:', error)
            }
        }

        fetchUserDetails()
    }, [])

    const validateDate = dateString => {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleDateChange = e => {
        const { name, value } = e.target
        const formattedValue = value.replace(/[^0-9-]/g, '') // Prevent invalid characters
        setFormData({ ...formData, [name]: formattedValue })
    }

    const handleBlur = name => {
        if (!validateDate(formData[name])) {
            alert('Please enter a valid date in YYYY-MM-DD format.')
            setFormData({ ...formData, [name]: '' })
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!userID) {
            alert('User not identified. Please try again.')
            return
        }

        if (
            !validateDate(formData.start_date) ||
            !validateDate(formData.end_date)
        ) {
            alert('Please enter valid dates in YYYY-MM-DD format.')
            return
        }

        const operationData = {
            ...formData,
            created_by: userID,
            updated_by: null,
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-operation`,
                operationData,
            )
            console.log('API Response:', response)
            onOperationCreated(response.data)
            alert('Operation created successfully')

            // ✅ Clear the form after successful submission
            setFormData({
                name: '',
                description: '',
                status: 'ongoing',
                start_date: '',
                end_date: '',
                location: '',
                budget: '',
            })
            
        } catch (error) {
            console.error('Error creating operation:', error)
            alert('Failed to create operation')
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Create Operation
            </h2>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Operation Name"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>
                <div className="sm:col-span-2">
                    <textarea
                        name="description"
                        placeholder="Description"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
                <div>
                    <select
                        name="status"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
                        <option value="ongoing">Ongoing</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <div className="relative">
                    <input
                        type="text"
                        name="start_date"
                        placeholder="YYYY-MM-DD"
                        value={formData.start_date}
                        onChange={handleDateChange}
                        onBlur={() => handleBlur('start_date')}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => startDateRef.current.showPicker()}
                        className="absolute right-3 top-3 text-gray-500">
                        📅
                    </button>
                    <input
                        ref={startDateRef}
                        type="date"
                        className="hidden"
                        onChange={e =>
                            setFormData({
                                ...formData,
                                start_date: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="relative">
                    <input
                        type="text"
                        name="end_date"
                        placeholder="YYYY-MM-DD"
                        value={formData.end_date}
                        onChange={handleDateChange}
                        onBlur={() => handleBlur('end_date')}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => endDateRef.current.showPicker()}
                        className="absolute right-3 top-3 text-gray-500">
                        📅
                    </button>
                    <input
                        ref={endDateRef}
                        type="date"
                        className="hidden"
                        onChange={e =>
                            setFormData({
                                ...formData,
                                end_date: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="sm:col-span-2">
                    <input
                        type="number"
                        name="budget"
                        placeholder="Budget"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>
                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
                        Create Operation
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateOperation

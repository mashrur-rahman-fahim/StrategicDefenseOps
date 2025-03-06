'use client'
import React, { useState } from 'react'
import axios from '../lib/axios'

const CreateOperationResources = ({ operationId }) => {
    const [resources, setResources] = useState({
        category: [],
        serial_number: [],
        count: []
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setResources({ ...resources, [name]: value.split(',') })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            // Log the resources to check if data is correctly structured
            console.log('Resources to submit:', resources)

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-operation-resources/${operationId}`,
                resources
            )
            console.log('Operation resources added:', response.data)
            alert('Resources added successfully')
        } catch (err) {
            console.error('Error adding operation resources:', err)
            setError('Failed to add resources')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Add Resources to Operation
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium">Category</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        placeholder="Enter categories separated by commas"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="serial_number" className="block text-sm font-medium">Serial Number</label>
                    <input
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        placeholder="Enter serial numbers separated by commas"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="count" className="block text-sm font-medium">Count</label>
                    <input
                        type="text"
                        id="count"
                        name="count"
                        placeholder="Enter counts separated by commas"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <div className="mb-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Resources'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateOperationResources

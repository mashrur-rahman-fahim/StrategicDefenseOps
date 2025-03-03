import axios from './axios' 

export const createOperation = async (operationData) => {
    try {
        const response = await axios.post('/create-operation', operationData)
        return response.data
    } catch (error) {
        console.error('Error creating operation:', error.response?.data || error)
        throw error
    }
}

export const updateOperation = async (id, operationData) => {
    try {
        const response = await axios.put(`/update-operation/${id}`, operationData)
        return response.data
    } catch (error) {
        console.error('Error updating operation:', error.response?.data || error)
        throw error
    }
}

export const deleteOperation = async (id) => {
    try {
        await axios.delete(`/delete-operation/${id}`)
        return { message: 'Deleted successfully' }
    } catch (error) {
        console.error('Error deleting operation:', error.response?.data || error)
        throw error
    }
}

export const getAllOperations = async () => {
    try {
        const response = await axios.get('/get-all-operations')
        return response.data
    } catch (error) {
        console.error('Error fetching operations:', error.response?.data || error)
        throw error
    }
}

export const searchOperations = async (name) => {
    try {
        const response = await axios.get(`/search-operations/${name}`)
        return response.data
    } catch (error) {
        console.error('Error searching operations:', error.response?.data || error)
        throw error
    }
}

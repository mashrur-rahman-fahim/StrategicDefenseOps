import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
})

// Add an interceptor to set the Authorization header dynamically
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('api_token') // Fetch token dynamically

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    },
)

export default axios

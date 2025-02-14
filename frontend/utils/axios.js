import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api", // Adjust if necessary
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;

import axios from "axios";

// Create axios instance with base configuration for API calls
// This centralizes our API configuration and makes it easier to manage
const api = axios.create({
  baseURL: "http://localhost:5000", // Backend server URL
});

export default api;
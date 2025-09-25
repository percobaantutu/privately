import axios from "axios";

// Get the backend URL from Vite's environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  // Use the dynamic URL here
  baseURL: backendUrl,
  withCredentials: true,
});

export default instance;

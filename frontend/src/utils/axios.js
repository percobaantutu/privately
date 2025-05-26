import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000',  // Your backend server URL
  withCredentials: true
});

export default instance; 
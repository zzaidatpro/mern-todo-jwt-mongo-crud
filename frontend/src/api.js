import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  });

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export default API;

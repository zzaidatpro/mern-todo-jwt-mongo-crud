import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-mern-http-only.vercel.app',
  withCredentials: true, // Crucial pour l'envoi/réception automatique des cookies HttpOnly
});

export default API;
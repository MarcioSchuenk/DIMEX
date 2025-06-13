import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    withCredentials: true,
    "ngrok-skip-browser-warning": "true", // mantém se estiver usando ngrok
  },
});

export default api;

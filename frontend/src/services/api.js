import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ⬅️ ISSO PERMITE ENVIAR COOKIES AUTOMATICAMENTE
  headers: {
    "ngrok-skip-browser-warning": "true", // mantém se estiver usando ngrok
  },
});

export default api;

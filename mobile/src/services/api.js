import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export const api = axios.create({
  baseURL: API_URL,
});

console.log("API_URL:", API_URL);

api.interceptors.request.use(async (config) => {
  try {
    const stored = await AsyncStorage.getItem("@auth");
    const { token } = stored ? JSON.parse(stored) : {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Erro ao adicionar token na requisição", error);
  }
  return config;
});

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Ahora la URL viene del .env (flexible)
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// 🔹 Instancia de axios
export const api = axios.create({
  baseURL: API_URL,
});

// 🔹 Interceptor para agregar JWT automáticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;

    } catch (error) {
      console.log("Error al obtener el token", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expirado o inválido");
      // 👉 acá después podemos hacer logout automático
    }

    return Promise.reject(error);
  }
);
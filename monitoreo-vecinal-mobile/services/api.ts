import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 URL de tu backend en Render
export const api = axios.create({
  baseURL: "https://monitoreo-vecinal-backend.onrender.com/api",
});

// 🔹 Interceptor para agregar JWT automáticamente a cada request
api.interceptors.request.use(
  async (config) => {
    try {
      // Trae el token desde AsyncStorage (guardado al loguearse)
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

// 🔹 Interceptor para manejar errores globales de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expirado o no válido - redirigir a login");
      // Aquí podés limpiar AsyncStorage o redirigir al login
    }
    return Promise.reject(error);
  }
);
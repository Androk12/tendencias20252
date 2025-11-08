import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

// Interceptor de petición para agregar el token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para refrescar token automáticamente
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verificamos si es 401 y no es la ruta de refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccess = response.data.access;
          localStorage.setItem("access", newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest); // Reintenta la petición original
        } catch (err) {
          console.error("Refresh token inválido o expirado", err);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login"; // Redirige a login
        }
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
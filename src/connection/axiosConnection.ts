import axios from "axios";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch (e) {
    return true;
  }
}

export const connection = axios.create({
  baseURL: "https://localhost:7000/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

connection.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token.startsWith("ey")) {
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
      return Promise.reject("Sessão expirada. Faça login novamente.");
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

connection.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequestUrl = error.config.url;

    const loginRoute = "/usuarios/login";

    if (status === 401 && originalRequestUrl !== loginRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

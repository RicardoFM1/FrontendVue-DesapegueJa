import axios from "axios";

export const connection = axios.create({
  baseURL: "http://localhost:5000/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});


connection.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token.startsWith("ey")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

import axiosDefault from "axios";

const isProduction = process.env.NODE_ENV === "production";

const baseURL = isProduction
  ? "https://<your-production-domain>/api"
  : "http://176.130.244.28:5000";

const defaultOptions = {
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
};

const axios = axiosDefault.create(defaultOptions);

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token || "";
  return config;
});

export const getImageUrl = (path) => {
  return `${baseURL}/${path}`;
};

export default axios;
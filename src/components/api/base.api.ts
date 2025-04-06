import axios from "axios";

const BASE_URL = "https://uninav-backend-production.up.railway.app";
// const BASE_URL = "http://localhost:3200";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

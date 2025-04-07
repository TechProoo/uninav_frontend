import axios from "axios";

// * Production
const BASE_URL = "https://uninav-backend.up.railway.app";
// * Local
// const BASE_URL = "http://localhost:3200";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

import axios from "axios";
import { getSession } from "@/lib/utils";

// * Production
export const BASE_URL = "https://uninav-backend.up.railway.app";
// * Local

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Expose-Headers": "Authorization",
  },
});

// Initialize token from session
const session = getSession();
if (session?.session) {
  api.defaults.headers.common["Authorization"] = `Bearer ${session.session}`;
}

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

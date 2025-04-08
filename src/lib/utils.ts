import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { setAuthToken } from "@/api/base.api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSession() {
  const session = Cookies.get("session-token");
  if (!session) {
    return null;
  }
  return { session };
}

export function storeSession(session: string) {
  Cookies.set("session-token", session, {
    path: "/",
    sameSite: "strict",
    expires: 7, // Set an expiration date for better security
  });
}

export function updateAuthToken(token: string) {
  if (!token) return;
  storeSession(token);
  setAuthToken(token);
}

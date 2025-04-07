import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
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
  Cookies.set("session-token", session);
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { setAuthToken } from "@/api/base.api";
import { UserProfile } from "@/lib/types/response.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSession() {
  const token = Cookies.get("uninav-session-token");
  const profile = Cookies.get("uninav-session-profile");
  if (!token) {
    return {token:null, profile:null};
  }
  return {token, profile: profile ? JSON.parse(profile) as UserProfile : null};
}

export function storeSession({token, profile}:{token?:string, profile?:UserProfile}) {
  if(
    token
  ){
    Cookies.set("uninav-session-token", token, {
      path: "/",
      sameSite: "strict",
      expires: 7, // Set an expiration date for better security
    });
  }
  if(profile){
    // this will expire when browser is closed
    Cookies.set("uninav-session-profile", JSON.stringify(profile), {
      path: "/",
      sameSite: "strict",
    });
  }
}

export function updateAuthToken(token: string) {
  if (!token) return;
  storeSession({token});
  setAuthToken(token);
}

export function deleteSession() {
  Cookies.remove("uninav-session-token", { path: "/" });
  Cookies.remove("uninav-session-profile", { path: "/" });
}
"use client";

import { loginData } from "@/lib/data.type";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
// import path from "path";

interface AuthContextType {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check for user authentication status on mount using cookies
    const token = Cookies.get("uninav_");

    if (token) {
      // const decodedUser: any = jwtDecode(token);
      setUser(token);
      console.log(token);
      setIsAuthenticated(true);
    } else {
      console.log("No toojen");
    }
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove("uninav_", { path: "" });

    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

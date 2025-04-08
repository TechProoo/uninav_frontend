"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types/response.type";
import { fetchUserProfile } from "@/api/user.api";
import { getSession } from "@/lib/utils";

interface AuthContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUserProfile = async () => {
    try {
      const profileData = await fetchUserProfile();
      if (profileData) {
        setUser(profileData);
        setIsAuthenticated(true);
        return;
      }
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Check for session token
        const session = getSession();

        if (session?.session) {
          await refreshUserProfile();
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove("session-token", { path: "/" });

    // Also remove legacy cookie if it exists
    Cookies.remove("uninav_", { path: "" });

    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        loading,
        refreshUserProfile,
      }}
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

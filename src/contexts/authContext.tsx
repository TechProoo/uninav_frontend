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
import { logout as logoutApi } from "@/api/auth.api";
interface AuthContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
  needsEmailVerification: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
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
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Error refreshing user profile:", error);
    }
  };

  // Check if user needs email verification
  const needsEmailVerification = () => {
    return !!user && user.auth && user.auth.emailVerified === false;
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
    logoutApi();
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
        needsEmailVerification,
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

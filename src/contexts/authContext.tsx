"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types/response.type";
import { fetchUserProfile } from "@/api/user.api";
import { logout as logoutApi } from "@/api/auth.api";
import { deleteSession, getSession, updateAuthToken as setApiAuthToken, storeSession } from "@/lib/utils";

interface AuthContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
  loading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUserProfile: () => Promise<void>;
  needsEmailVerification: () => boolean;
  setAuthTokenAndFetchUser: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    deleteSession();
    setApiAuthToken('');
  };

  const refreshUserProfile = useCallback(async () => {
    try {
      const profileData = await fetchUserProfile();
      if (profileData) {
        setUser(profileData);
        setIsAuthenticated(true);
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      clearAuthData();
    }
  }, []);

  const setAuthTokenAndFetchUser = useCallback(async (token: string) => {
    setLoading(true);
    try {
      storeSession(token);
      setApiAuthToken(token);
      await refreshUserProfile();
      const session = getSession()
      if (!session) {
        throw new Error("Authentication failed after token processing.")
      }
    } catch (error) {
      console.error("Failed to set auth token and fetch user:", error);
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshUserProfile, setLoading]);

  const needsEmailVerification = () => {
    return !!user && user.auth && user.auth.emailVerified === false;
  };

  useEffect(() => {
    const loadUserProfileOnMount = async () => {
      setLoading(true);
      const session = getSession()
      if (session) {
        setApiAuthToken(session);
        await refreshUserProfile();
      }
      setLoading(false);
    };

    loadUserProfileOnMount();
  }, [refreshUserProfile]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearAuthData();
      setLoading(false);
      router.push("/auth/login");
    }
  }, [router, setLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        loading,
        setAuthLoading: setLoading,
        refreshUserProfile,
        needsEmailVerification,
        setAuthTokenAndFetchUser,
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

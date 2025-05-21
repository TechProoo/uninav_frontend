"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types/response.type";
import { fetchUserProfile } from "@/api/user.api";
import { logout as logoutApi } from "@/api/auth.api";
import { deleteSession, getSession,  updateAuthToken, storeSession } from "@/lib/utils";

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
    updateAuthToken('');
  };

  const refreshUserProfile = useCallback(async () => {
    try {
      const profileData = await fetchUserProfile();
      if (profileData) {
        setUser(profileData);
        setIsAuthenticated(true);
        storeSession({profile:profileData});
      } else {
        clearAuthData();
      }
      return profileData
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      clearAuthData();
    }
  }, [setUser, setIsAuthenticated]);

  const setAuthTokenAndFetchUser = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const sessionToken = token;
      storeSession({token: sessionToken});
      updateAuthToken(sessionToken);
      await refreshUserProfile();
      const {token: storedToken} = getSession();
      if (!storedToken) {
        throw new Error("Authentication failed after token processing.")
      }
    } catch (error) {
      console.error("Failed to set auth token and fetch user:", error);
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshUserProfile]);

  const needsEmailVerification = () => {
    return !!user && user.auth && user.auth.emailVerified === false;
  };

  useEffect(() => {
    const loadUserProfileOnMount = async () => {
      const {token, profile} = getSession()
      if(token && profile){
        console.log('profile found in cookies', profile )
        setUser(profile);
        setIsAuthenticated(true);
        setLoading(false);
      } else if (token ) {
        console.log('loading user profile on mount', token, profile)
        setLoading(true);
        updateAuthToken(token);
        await refreshUserProfile();
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadUserProfileOnMount();
  }, []);

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

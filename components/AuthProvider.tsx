"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { generateAvatarUrl } from "../lib/avatar";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (userData: any, token: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  verifyTokenAndFetchUser: () => Promise<boolean>;
}

interface User {
  id: string;
  uuid?: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role?: string;
  roles?: string[];
  avatar?: string;
  verification_level?: number;
  preferences?: {
    theme?: string;
    language?: string;
    timezone?: string;
    email_notifications?: boolean;
    push_notifications?: boolean;
  };
  profile?: {
    is_public_profile?: boolean;
    avatar_url?: string;
    bio?: string;
    graduation_year?: number;
    school?: string;
    website?: string;
    social_links?: any;
  };
  created_at?: string;
  updated_at?: string;
  version?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing auth token on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check localStorage for auth token
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        // Set cookie for middleware
        document.cookie = `auth-token=${token}; path=/; max-age=86400`; // 24 hours
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: any, token: string): Promise<boolean> => {
    try {
      // Store auth data from successful API login
      localStorage.setItem("auth-token", token);
      localStorage.setItem("user-data", JSON.stringify(userData));

      // Set cookie for middleware
      document.cookie = `auth-token=${token}; path=/; max-age=28800`; // 8 hours

      // Generate avatar if not provided
      const userWithAvatar = {
        ...userData,
        avatar:
          userData.avatar || generateAvatarUrl(userData.name || userData.email),
      };

      setIsAuthenticated(true);
      setUser(userWithAvatar);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const verifyTokenAndFetchUser = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        return false;
      }

      // Step 1: Verify token
      const verifyResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.VERIFY_TOKEN}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!verifyResponse.ok) {
        // Token is invalid, clear auth data
        logout();
        return false;
      }

      const verifyData = await verifyResponse.json();
      const userId = verifyData.data?.user_id;

      if (!userId) {
        console.error("No user_id found in verify response");
        return false;
      }

      // Store user_id
      localStorage.setItem("user_id", userId);

      // Step 2: Fetch full user data
      const userResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GET_USER}/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!userResponse.ok) {
        console.error("Failed to fetch user data");
        return false;
      }

      const userData = await userResponse.json();
      const fullUserData = userData.data;

      if (fullUserData) {
        // Create comprehensive user object
        const userWithAvatar = {
          ...fullUserData,
          name:
            fullUserData.first_name && fullUserData.last_name
              ? `${fullUserData.first_name} ${fullUserData.last_name}`
              : fullUserData.username || fullUserData.email,
          avatar:
            fullUserData.profile?.avatar_url ||
            generateAvatarUrl(
              fullUserData.first_name ||
                fullUserData.username ||
                fullUserData.email
            ),
        };

        // Update stored user data
        localStorage.setItem("user-data", JSON.stringify(userWithAvatar));
        setUser(userWithAvatar);
        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Token verification or user fetch failed:", error);
      return false;
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-data");

    // Clear cookie
    document.cookie = "auth-token=; path=/; max-age=0";

    setIsAuthenticated(false);
    setUser(null);

    // Redirect to auth page
    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        verifyTokenAndFetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

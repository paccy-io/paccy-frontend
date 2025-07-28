"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { generateAvatarUrl } from "../lib/avatar";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if we're in development mode
      const isDevelopment = process.env.NODE_ENV === "development";

      if (!isDevelopment) {
        // In production, block all dashboard access
        console.log("Dashboard access blocked in production mode");
        return false;
      }

      // In development, only allow specific admin credentials
      const ADMIN_EMAIL = "admin@paccy.io";
      const ADMIN_PASSWORD = "123";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 1,
          email: ADMIN_EMAIL,
          name: "Paccy Admin",
          role: "admin",
          avatar: generateAvatarUrl("Paccy Admin"),
        };

        const devToken = `dev-token-${Date.now()}`;

        // Store auth data
        localStorage.setItem("auth-token", devToken);
        localStorage.setItem("user-data", JSON.stringify(adminUser));

        // Set cookie for middleware
        document.cookie = `auth-token=${devToken}; path=/; max-age=86400`;

        setIsAuthenticated(true);
        setUser(adminUser);

        return true;
      }

      // Invalid credentials in development
      console.log("Invalid development credentials");
      return false;
    } catch (error) {
      console.error("Login failed:", error);
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

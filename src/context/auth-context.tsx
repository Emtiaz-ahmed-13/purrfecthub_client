"use client";

import { API_BASE_URL } from "@/lib/config";
import { User as BaseUser, UserRole } from "@/models/types";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User extends BaseUser {
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<User>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        logout();
        setIsLoading(false);
        return;
      }

      // Fetch full profile from API to get all fields (homeType, experience, etc.)
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const fullUser = data.data?.user || data.user || data;
        setUser({ ...decoded, ...fullUser });
      } else {
        setUser(decoded); // Fallback to decoded token if API fails
      }
    } catch (error) {
      console.error("Auth context refresh error:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, refreshToken?: string) => {
    localStorage.setItem("accessToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    try {
      const decoded = jwtDecode<User>(token);
      setUser(decoded);

      // Redirect based on role
      switch (decoded.role) {
        case UserRole.ADMIN:
          router.push("/dashboard/admin");
          break;
        case UserRole.SHELTER:
          router.push("/dashboard/shelter");
          break;
        case UserRole.ADOPTER:
          router.push("/dashboard/adopter");
          break;
        default:
          router.push("/");
      }
    } catch (error) {
      console.error("Error decoding token during login:", error);
      toast.error("Failed to process login credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
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

"use client";

import { UserRole, UserStatus } from "@/models/types";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

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

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User, LoginData, RegisterData } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userData, setUserData] = useState<User | null>(() => {
    // Try to get user from localStorage on init
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Fetch current user if token exists but no user data
  const { data: fetchedUser, isLoading } = useQuery<User>({
    queryKey: ["/api/users/me"],
    enabled: !!token && !userData,
    retry: false,
  });

  // Use fetched user if available, otherwise use stored user data
  const user = fetchedUser || userData;

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest<{ token: string; user: User }>("POST", "/api/auth/login", data);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUserData(data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest<{ token: string; user: User }>("POST", "/api/auth/register", data);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUserData(data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUserData(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
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

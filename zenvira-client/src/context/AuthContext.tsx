"use client";

import { authClient } from "@/lib/auth-client";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth data from Better Auth session on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        // Use Better Auth to get session
        const { data: session } = await authClient.getSession();

        if (session?.user) {
          setUser({
            ...session.user,
            createdAt: session.user.createdAt.toString(),
            updatedAt: session.user.updatedAt.toString(),
          } as User);
        }
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const fetchUser = async () => {
    try {
      // Use Better Auth to get fresh session
      const { data: session } = await authClient.getSession();

      if (session?.user) {
        setUser({
          ...session.user,
          createdAt: session.user.createdAt.toString(),
          updatedAt: session.user.updatedAt.toString(),
        } as User);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const logout = async () => {
    try {
      // Use Better Auth signOut
      await authClient.signOut();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, logout, fetchUser, setUser }}
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

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
  fetchUser: () => Promise<boolean>;
  setUser: (user: User | null) => void;
  setUserFromData: (userData: any, token?: string) => void;
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
        setIsLoading(true);
        // Use Better Auth to get session
        const session = await authClient.getSession();

        if (session?.data?.user) {
          setUser({
            id: session.data.user.id,
            name: session.data.user.name || "",
            email: session.data.user.email || "",
            emailVerified: session.data.user.emailVerified || false,
            image: session.data.user.image || undefined,
            role: (session.data.user as any).role,
            createdAt: new Date(session.data.user.createdAt).toISOString(),
            updatedAt: new Date(session.data.user.updatedAt).toISOString(),
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load auth data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const setUserFromData = (userData: any, token?: string) => {
    if (userData) {
      const user: User = {
        id: userData.id,
        name: userData.name || "",
        email: userData.email || "",
        emailVerified: userData.emailVerified || false,
        image: userData.image || undefined,
        role: userData.role,
        createdAt:
          typeof userData.createdAt === "string"
            ? userData.createdAt
            : new Date(userData.createdAt).toISOString(),
        updatedAt:
          typeof userData.updatedAt === "string"
            ? userData.updatedAt
            : new Date(userData.updatedAt).toISOString(),
      };
      setUser(user);
      if (token) {
        setToken(token);
      }
    }
  };

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const session = await authClient.getSession();

      if (session?.data?.user) {
        setUserFromData(session.data.user);
        return true;
      } else if (user) {
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (user) {
        return true;
      }
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
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
      value={{
        user,
        token,
        isLoading,
        logout,
        fetchUser,
        setUser,
        setUserFromData,
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

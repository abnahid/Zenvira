// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient<{
  user: {
    role: "customer" | "seller" | "admin";
    status: string;
  };
}>({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});
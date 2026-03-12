// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

// Use relative URL to go through Next.js rewrite proxy
// This makes cookies first-party (same domain) instead of third-party
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  fetchOptions: {
    credentials: "include", // Include cookies in all requests
  },
  // Use the proxy endpoint for all auth requests
  // This ensures cookies from better-auth match the client domain
  plugins: [],
});

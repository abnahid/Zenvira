import { NextRequest, NextResponse } from "next/server";

const AUTH_SERVER_URL =
  process.env.AUTH_SERVER_URL ??
  process.env.NEXT_PUBLIC_AUTH_SERVER_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://zenvira-server.vercel.app";

export function GET(request: NextRequest) {
  const callbackPath =
    request.nextUrl.searchParams.get("callbackPath") ?? "/dashboard";
  const safeCallbackPath = callbackPath.startsWith("/")
    ? callbackPath
    : "/dashboard";
  const callbackURL = new URL(
    safeCallbackPath,
    request.nextUrl.origin,
  ).toString();

  const redirectURL = new URL("/api/auth/signin/google", AUTH_SERVER_URL);
  redirectURL.searchParams.set("callbackURL", callbackURL);

  // Create a response that redirects to the auth server
  // This allows the auth server to set its cookies properly
  const response = NextResponse.redirect(redirectURL);

  // Store the callback URL in a short-lived cookie on the client domain
  // This helps with redirect preservation
  response.cookies.set("oauth_callback", callbackURL, {
    maxAge: 600, // 10 minutes
    sameSite: "none",
    secure: true,
    httpOnly: false, // Allow JavaScript to read if needed
  });

  return response;
}

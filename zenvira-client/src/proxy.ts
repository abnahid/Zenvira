import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/orders", "/checkout"];

// Routes that require specific roles
const adminOnlyRoutes = [
  "/dashboard/users",
  "/dashboard/products",
  "/dashboard/categories",
  "/dashboard/seller-applications",
];

const sellerOrAdminRoutes = [
  "/dashboard/my-products",
  "/dashboard/orders",
  "/dashboard/settings",
];

// Routes that should redirect to home if already logged in
const authRoutes = ["/auth/login", "/auth/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token from cookies (Better Auth uses this cookie name)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session")?.value;

  // Check if user is authenticated
  const isAuthenticated = !!sessionToken;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For role-based protection, we can't check roles in middleware without
  // making a request to the server. The role check is handled client-side
  // in the dashboard layout. This middleware just ensures authentication.

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and api
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

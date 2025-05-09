import { NextRequest, NextResponse } from "next/server";
import type { auth } from "./lib/auth";
import { betterFetch } from "@better-fetch/fetch";
type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".") // This will skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Skip middleware for invalid paths
  if (
    request.nextUrl.pathname.includes("null") ||
    request.nextUrl.pathname.includes("undefined")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const protectedRoutes = ["/dashboard", "/admin", "/manager", "/user"];
  const publicRoutes = ["/"];

  // Check if we have a valid session
  const hasValidSession = session?.session?.token != null;
  const userRole = session?.user?.role;

  // If we have a session but no role, redirect to home
  if (hasValidSession && !userRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If we're on a public route and have a valid session with a role, redirect to appropriate dashboard
  if (
    publicRoutes.includes(request.nextUrl.pathname) &&
    hasValidSession &&
    userRole
  ) {
    const validRoles = ["admin", "manager", "user"];
    const role = validRoles.includes(userRole) ? userRole : "user";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // If we're on a protected route without a session, redirect to home
  if (
    protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    ) &&
    !hasValidSession
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If we're on an admin route but not an admin, redirect to appropriate dashboard
  if (request.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
    const validRoles = ["manager", "user"];
    const role =
      typeof userRole === "string" && validRoles.includes(userRole)
        ? userRole
        : "user";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

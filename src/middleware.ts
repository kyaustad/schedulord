import { NextRequest, NextResponse } from "next/server";
import type { auth } from "./lib/auth";
import { betterFetch } from "@better-fetch/fetch";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }
  if (session && request.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(
      new URL(`/dashboard/${session.user.role}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

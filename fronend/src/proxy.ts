import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_NAMES,
  isPublicPath,
} from "@/lib/auth-routes";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/un-verified",
  "/unauthorized",
  "/reset-password",
  "/user-verification",
  "/selected-candidates",
  "/verify-email",
  "/auth/callback",
];

function hasCookie(request: NextRequest, names: readonly string[]) {
  return names.some((name) => Boolean(request.cookies.get(name)?.value));
}

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`))
  );
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname === "/favicon.ico" ||
    /\.(?:woff2?|ttf|otf|svg|png|jpe?g|gif|webp|ico)$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API requests and static assets must pass through without page redirects.
  if (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    isStaticAsset(pathname)
  ) {
    return NextResponse.next();
  }

  const hasAccessToken = hasCookie(request, ACCESS_TOKEN_COOKIE_NAMES);
  const hasRefreshToken = Boolean(request.cookies.get("refreshToken")?.value);
  const isPublic = isPublicRoute(pathname) || isPublicPath(pathname);

  if (pathname.startsWith("/admin")) {
    if (!hasAccessToken) {
      if (hasRefreshToken) return NextResponse.next();

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (request.cookies.get("role")?.value !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  }

  if (!hasAccessToken && !isPublic) {
    if (hasRefreshToken) return NextResponse.next();

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasAccessToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

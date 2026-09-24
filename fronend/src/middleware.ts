import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAMES, isPublicPath } from "@/lib/auth-routes";

function hasAuthCookie(request: NextRequest) {
  return AUTH_COOKIE_NAMES.some((name) =>
    Boolean(request.cookies.get(name)?.value)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = hasAuthCookie(request);
  const publicPath = isPublicPath(pathname);

  if (!publicPath && !authed) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    authed &&
    (pathname === "/login" || pathname === "/register")
  ) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = "/";
    appUrl.search = "";
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

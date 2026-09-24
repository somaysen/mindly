export const AUTH_COOKIE_NAMES = [
  "token",
  "accessToken",
  "access_token",
  "refreshToken",
  "jwt",
] as const;

export const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/verify-email",
  "/auth/callback",
  "/forgot-password",
] as const;

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000")
    .trim()
    .replace(/\/$/, "")
    .replace(/\/api$/, "");
}

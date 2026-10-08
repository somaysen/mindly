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

const DEVELOPMENT_API_BASE_URL = "http://localhost:9000";
const PRODUCTION_API_BASE_URL = "https://mindly-backend-omega.vercel.app";

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function getApiBaseUrl() {
  const isProduction = process.env.NODE_ENV === "production";
  const configuredBaseUrl = process.env.API_BASE_URL?.trim();
  const legacyPublicBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const baseUrl = configuredBaseUrl || (
    isProduction
      ? PRODUCTION_API_BASE_URL
      : legacyPublicBaseUrl || DEVELOPMENT_API_BASE_URL
  );

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new Error("API_BASE_URL must be a valid absolute HTTP(S) URL.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("API_BASE_URL must use HTTP or HTTPS.");
  }

  const isLocalHost =
    parsedUrl.hostname === "localhost" ||
    parsedUrl.hostname.endsWith(".localhost") ||
    parsedUrl.hostname === "::1" ||
    /^127(?:\.\d{1,3}){3}$/.test(parsedUrl.hostname);

  if (isProduction) {
    if (parsedUrl.protocol !== "https:") {
      throw new Error("API_BASE_URL must use HTTPS in production.");
    }

    if (isLocalHost) {
      throw new Error("API_BASE_URL cannot point to localhost in production.");
    }
  }

  return baseUrl.replace(/\/+$/, "").replace(/\/api$/, "");
}

import Cookies from "js-cookie";
import {
  ACCESS_TOKEN_COOKIE_NAMES,
  AUTH_COOKIE_NAMES,
} from "@/lib/auth-routes";

export {
  AUTH_COOKIE_NAMES,
  PUBLIC_PATHS,
  isPublicPath,
  getApiBaseUrl,
} from "@/lib/auth-routes";

export function hasClientAuthCookie() {
  return AUTH_COOKIE_NAMES.some((name) => Boolean(Cookies.get(name)));
}

export function getAccessToken() {
  return ACCESS_TOKEN_COOKIE_NAMES
    .map((name) => Cookies.get(name))
    .find((token) => Boolean(token));
}

export function persistAuthToken(token?: string | null) {
  if (!token) return;

  Cookies.set("token", token, {
    expires: 7,
    sameSite: "lax",
    path: "/",
  });
}

export function clearAuthCookies() {
  AUTH_COOKIE_NAMES.forEach((name) => {
    Cookies.remove(name);
    Cookies.remove(name, { path: "/" });
  });
}

export function getSafeRedirectPath(value: string | null | undefined) {
  if (!value || typeof window === "undefined") return "/";

  try {
    const candidate = new URL(value, window.location.origin);
    if (candidate.origin === window.location.origin) {
      return `${candidate.pathname}${candidate.search}${candidate.hash}`;
    }
  } catch {
    // Fall back to the app home page for malformed redirect values.
  }

  return "/";
}

import Cookies from "js-cookie";
import { AUTH_COOKIE_NAMES, getApiBaseUrl } from "@/lib/auth-routes";

export {
  AUTH_COOKIE_NAMES,
  PUBLIC_PATHS,
  isPublicPath,
  getApiBaseUrl,
} from "@/lib/auth-routes";

export function hasClientAuthCookie() {
  return AUTH_COOKIE_NAMES.some((name) => Boolean(Cookies.get(name)));
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

export function getGoogleOAuthUrl() {
  const redirect =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "";

  const params = new URLSearchParams();
  if (redirect) {
    params.set("redirect", redirect);
  }

  const query = params.toString();
  return `${getApiBaseUrl()}/api/auth/google${query ? `?${query}` : ""}`;
}

export function startGoogleOAuth() {
  window.location.assign(getGoogleOAuthUrl());
}

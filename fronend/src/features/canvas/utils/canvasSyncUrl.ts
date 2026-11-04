import { getApiBaseUrl } from "@/lib/auth";

export function getCanvasSyncUrl(canvasId: string, ticket: string) {
  const configuredSyncBase = process.env.NEXT_PUBLIC_SYNC_BASE_URL?.trim();
  const url = new URL(configuredSyncBase || getApiBaseUrl());
  if (url.protocol === "https:") {
    url.protocol = "wss:";
  } else if (url.protocol === "http:") {
    url.protocol = "ws:";
  } else if (url.protocol !== "wss:" && url.protocol !== "ws:") {
    throw new Error("NEXT_PUBLIC_SYNC_BASE_URL must use HTTP(S) or WS(S).");
  }
  url.pathname = `/api/canvas/${encodeURIComponent(canvasId)}/sync`;
  url.searchParams.set("ticket", ticket);
  return url.toString();
}

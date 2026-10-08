import { NextRequest } from "next/server";
import { getApiBaseUrl } from "@/lib/auth-routes";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "origin",
  "proxy-authenticate",
  "proxy-authorization",
  "referer",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
];

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const origin = request.headers.get("origin");

  // Keep browser requests same-origin; reject cross-site writes before removing
  // Origin for the server-to-server request to the backend.
  if (origin && origin !== request.nextUrl.origin) {
    return Response.json({ success: false, message: "Origin is not allowed." }, { status: 403 });
  }

  const { path } = await context.params;
  const targetUrl = new URL(
    `/api/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`,
    getApiBaseUrl(),
  );

  const requestHeaders = new Headers(request.headers);
  for (const header of HOP_BY_HOP_HEADERS) {
    requestHeaders.delete(header);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers(upstream.headers);
    for (const header of HOP_BY_HOP_HEADERS) {
      responseHeaders.delete(header);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { success: false, message: "The API service is temporarily unavailable." },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;

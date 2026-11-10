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

function isSameOriginRequest(request: NextRequest, origin: string) {
  try {
    const originUrl = new URL(origin);
    if (originUrl.protocol !== "http:" && originUrl.protocol !== "https:") {
      return false;
    }

    const hosts = [
      request.nextUrl.host,
      request.headers.get("host"),
      request.headers.get("x-forwarded-host")?.split(",")[0].trim(),
    ].filter((host): host is string => Boolean(host));
    const protocols = [
      request.nextUrl.protocol,
      request.headers.get("x-forwarded-proto")?.split(",")[0].trim(),
    ]
      .filter((protocol): protocol is string => Boolean(protocol))
      .map((protocol) => protocol.endsWith(":") ? protocol : `${protocol}:`);

    return protocols.some((protocol) =>
      hosts.some((host) => {
        try {
          return new URL(`${protocol}//${host}`).origin === originUrl.origin;
        } catch {
          return false;
        }
      }),
    );
  } catch {
    return false;
  }
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const origin = request.headers.get("origin");

  // Validate browser mutations against the public host; reverse proxies can
  // expose a different internal origin through request.nextUrl.
  if (origin && !isSameOriginRequest(request, origin)) {
    return Response.json({ success: false, message: "Origin is not allowed." }, { status: 403 });
  }

  const { path } = await context.params;
  const rewrittenPath = request.nextUrl.searchParams.get("nxtPpath");
  const apiPath =
    path.length > 0
      ? path
      : rewrittenPath?.split("/").filter(Boolean) ?? [];
  if (apiPath.length === 0) {
    return Response.json(
      { success: false, message: "API endpoint not found." },
      { status: 404 },
    );
  }

  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  searchParams.delete("nxtPpath");
  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  const targetUrl = new URL(
    `/api/${apiPath.map(encodeURIComponent).join("/")}${query}`,
    getApiBaseUrl(),
  );

  const requestHeaders = new Headers(request.headers);
  for (const header of HOP_BY_HOP_HEADERS) {
    requestHeaders.delete(header);
  }
  // CORS does not apply to this server-to-server request. Forwarding a preview
  // deployment's browser Origin can make a backend allowlist reject valid API calls.
  requestHeaders.delete("origin");

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
  } catch (error) {
    console.error("API proxy request failed.", {
      method: request.method,
      path: `/api/${apiPath.join("/")}`,
      error: error instanceof Error ? error.message : String(error),
    });
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

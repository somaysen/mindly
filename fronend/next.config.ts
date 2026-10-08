import type { NextConfig } from "next";
import { getApiBaseUrl } from "./src/lib/auth-routes";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  async rewrites() {
    const apiBaseUrl = getApiBaseUrl();

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

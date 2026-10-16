"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { persistAuthToken } from "@/lib/auth";
import { Suspense } from "react";

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token =
      searchParams.get("token") ||
      searchParams.get("accessToken") ||
      searchParams.get("access_token");

    persistAuthToken(token);

    const next = searchParams.get("from") || "/";
    let destination = "/";

    try {
      const candidate = new URL(next, window.location.origin);
      if (candidate.origin === window.location.origin) {
        destination = `${candidate.pathname}${candidate.search}${candidate.hash}`;
      }
    } catch {
      // Stay on the safe home destination when the redirect is malformed.
    }

    router.replace(destination);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0c20] text-white/70">
      Signing you in...
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0d0c20] text-white/70">
          Signing you in...
        </div>
      }
    >
      <OAuthCallback />
    </Suspense>
  );
}

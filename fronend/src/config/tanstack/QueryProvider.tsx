"use client";

import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
} from "@tanstack/react-query";
import { useState } from "react";

function QueryLoadingIndicator() {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <div
      role="status"
      aria-label="Loading content"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-white/10"
    >
      <div className="h-full w-1/3 animate-[query-loading_1.2s_ease-in-out_infinite] rounded-full bg-[#8b8cff] shadow-[0_0_12px_rgba(139,140,255,0.8)]" />
    </div>
  );
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep recently viewed data ready when moving between screens.
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QueryLoadingIndicator />
      {children}
    </QueryClientProvider>
  );
}

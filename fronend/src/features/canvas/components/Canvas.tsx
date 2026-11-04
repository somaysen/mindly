"use client";

import { useMemo } from "react";
import MindlyCanvas from "./MindlyCanvas";
import Topbar from "@/components/Navber/Topbar";
import { useGetCanvasById } from "@/features/canvas/hooks/useCanvas";
import {
  getCanvasRecord,
  getCanvasRole,
  getCanvasTitle,
} from "@/features/canvas/utils/canvasAdapter";
import { getApiErrorMessage } from "@/lib/apiError";
import CanvasShareControl from "./CanvasShareControl";

export default function Canvas({ canvasId }: { canvasId: string }) {
  const canvasQuery = useGetCanvasById(canvasId);
  const canvas = useMemo(
    () => getCanvasRecord(canvasQuery.data),
    [canvasQuery.data],
  );
  const title = canvas ? getCanvasTitle(canvas) : "Thought Space";
  const role = canvas ? getCanvasRole(canvas) : null;

  return (
    <main className="fixed inset-0 z-[100] flex h-dvh w-full flex-col overflow-hidden bg-black text-white">
      <div className="relative z-20 shrink-0 border-b border-[#000000]/80 bg-[#000000]/95 px-1 shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-6">
        <Topbar
          title={title}
          backHref="/thoughtSpaces"
          rightAction={
            role === "owner" ? (
              <CanvasShareControl canvasId={canvasId} />
            ) : role ? (
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-white/60">
                {role}
              </span>
            ) : null
          }
        />
      </div>
      <section className="relative min-h-0 flex-1 overflow-hidden bg-black p-2 sm:p-3">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/[0.04] blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/[0.03] blur-[100px]" />
        </div>
        <div className="relative z-10 h-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_0_0_1px_rgba(0,0,0,0.4)]">
          {canvasQuery.isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-white/60">
              Loading canvas...
            </div>
          ) : canvasQuery.isError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
              <p className="text-sm text-red-200">
                Could not load this canvas.{" "}
                {getApiErrorMessage(canvasQuery.error)}
              </p>
              <button
                type="button"
                onClick={() => void canvasQuery.refetch()}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              >
                Try again
              </button>
            </div>
          ) : !canvas ? (
            <div className="flex h-full items-center justify-center px-5 text-center text-sm text-white/60">
              This canvas was not returned by the server.
            </div>
          ) : (
            <MindlyCanvas canvasId={canvasId} role={role} />
          )}
        </div>
      </section>
    </main>
  );
}

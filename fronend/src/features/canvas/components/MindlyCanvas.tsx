
"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { CanvasRole } from "@/types/canvas";

const TldrawEditor = dynamic(
  () => import("./MindlyCanvasEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-violet-500" />
      </div>
    ),
  }
);

export default function MindlyCanvas({
  canvasId,
  role,
}: {
  canvasId: string;
  role: CanvasRole | null;
}) {
  return (
    <div className="h-full w-full">
      <TldrawEditor canvasId={canvasId} role={role} />
    </div>
  );
}

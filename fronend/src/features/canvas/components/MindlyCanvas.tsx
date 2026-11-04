
"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { CanvasSnapshot } from "@/features/canvas/utils/canvasAdapter";

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
  projectId,
  title,
  snapshot,
}: {
  projectId: string;
  title: string;
  snapshot?: CanvasSnapshot;
}) {
  return (
    <div className="h-full w-full">
      <TldrawEditor projectId={projectId} title={title} snapshot={snapshot} />
    </div>
  );
}

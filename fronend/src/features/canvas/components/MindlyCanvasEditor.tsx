"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function MindlyCanvasEditor({
  projectId,
}: {
  projectId: string;
}) {
  return (
    <div className="mindly-tldraw h-full w-full">
      <Tldraw
        persistenceKey={`mindly-canvas-${projectId}`}
        colorScheme="dark"
        autoFocus
      />
    </div>
  );
}

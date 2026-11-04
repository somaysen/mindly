"use client";

import { useCallback, useState } from "react";
import { Tldraw } from "tldraw";
import type { Editor, TLStoreSnapshot } from "tldraw";
import "tldraw/tldraw.css";
import { useUpdateCanvas } from "@/features/canvas/hooks/useCanvas";
import type { CanvasSnapshot } from "@/features/canvas/utils/canvasAdapter";
import { getApiErrorMessage } from "@/lib/apiError";

export default function MindlyCanvasEditor({
  projectId,
  title,
  snapshot,
}: {
  projectId: string;
  title: string;
  snapshot?: CanvasSnapshot;
}) {
  const updateCanvas = useUpdateCanvas();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleMount = useCallback(
    (editor: Editor) => {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      let pendingSnapshot: TLStoreSnapshot | null = null;
      let isMounted = true;
      let saveQueue: Promise<void> = Promise.resolve();

      const enqueueSave = (documentSnapshot: TLStoreSnapshot) => {
        saveQueue = saveQueue
          .then(async () => {
            if (isMounted) setSaveStatus("Saving...");
            await updateCanvas.mutateAsync({
              canvasId: projectId,
              data: { title, snapshot: documentSnapshot },
            });
            if (isMounted) setSaveStatus("Saved");
          })
          .catch((error: unknown) => {
            if (isMounted) {
              setSaveStatus(
                `Save failed: ${getApiErrorMessage(error, "Please try again.")}`,
              );
            }
          });
      };

      const unsubscribe = editor.store.listen(
        () => {
          pendingSnapshot = editor.store.getStoreSnapshot();
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            timeout = null;
            if (pendingSnapshot) {
              enqueueSave(pendingSnapshot);
              pendingSnapshot = null;
            }
          }, 700);
        },
        { source: "user", scope: "document" },
      );

      return () => {
        isMounted = false;
        if (timeout) clearTimeout(timeout);
        unsubscribe();
        if (pendingSnapshot) enqueueSave(pendingSnapshot);
      };
    },
    [projectId, title, updateCanvas.mutateAsync],
  );

  return (
    <div className="mindly-tldraw relative h-full w-full">
      <Tldraw
        snapshot={snapshot}
        colorScheme="dark"
        autoFocus
        onMount={handleMount}
      />
      {saveStatus && (
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg border px-3 py-1.5 text-xs ${
            saveStatus.startsWith("Save failed:")
              ? "border-red-300/30 bg-red-950/90 text-red-100"
              : "border-white/10 bg-black/75 text-white/75"
          }`}
        >
          {saveStatus}
        </div>
      )}
    </div>
  );
}

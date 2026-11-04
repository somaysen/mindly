"use client";

import { useCallback, useState } from "react";
import { useSync } from "@tldraw/sync";
import { Loader2, RotateCw } from "lucide-react";
import { Tldraw } from "tldraw";
import type { Editor, TLAssetStore } from "tldraw";
import "tldraw/tldraw.css";
import { createCanvasSyncTicket } from "@/api/canvas/createCanvasSyncTicket";
import type { CanvasRole } from "@/types/canvas";
import { getApiErrorMessage } from "@/lib/apiError";
import { getCanvasSyncUrl } from "@/features/canvas/utils/canvasSyncUrl";
import { fileToBase64DataUri } from "@/lib/fileToBase64DataUri";

const canvasAssetStore: TLAssetStore = {
  upload: async (_asset, file) => ({
    src: await fileToBase64DataUri(file),
  }),
  resolve: (asset) => asset.props.src ?? null,
};

export default function MindlyCanvasEditor({
  canvasId,
  role,
}: {
  canvasId: string;
  role: CanvasRole | null;
}) {
  const [connectionAttempt, setConnectionAttempt] = useState(0);

  return (
    <CanvasSyncSession
      key={`${canvasId}:${connectionAttempt}`}
      canvasId={canvasId}
      role={role}
      onRetry={() => setConnectionAttempt((attempt) => attempt + 1)}
    />
  );
}

function CanvasSyncSession({
  canvasId,
  role,
  onRetry,
}: {
  canvasId: string;
  role: CanvasRole | null;
  onRetry: () => void;
}) {
  const remoteStore = useSync({
    assets: canvasAssetStore,
    uri: async () => {
      const response = await createCanvasSyncTicket(canvasId);
      const ticket = response?.data?.ticket;
      if (typeof ticket !== "string" || !ticket) {
        throw new Error("The server did not return a canvas sync ticket.");
      }
      return getCanvasSyncUrl(canvasId, ticket);
    },
  });

  const handleMount = useCallback(
    (editor: Editor) => {
      if (role === "viewer") {
        editor.updateInstanceState({ isReadonly: true });
      }
    },
    [role],
  );

  if (remoteStore.status === "loading") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-white/65">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
        Connecting to the shared canvas...
      </div>
    );
  }

  if (remoteStore.status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
        <p role="alert" className="max-w-lg text-sm text-red-200">
          Could not connect to this canvas.{" "}
          {getApiErrorMessage(remoteStore.error, "Check your connection and try again.")}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          <RotateCw size={15} />
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="mindly-tldraw relative h-full w-full">
      <Tldraw
        store={remoteStore.store}
        colorScheme="dark"
        autoFocus
        onMount={handleMount}
      />
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg border border-white/10 bg-black/75 px-3 py-1.5 text-xs text-white/75"
      >
        Live collaboration · Changes auto-saved
        {role === "viewer" ? " · View only" : ""}
      </div>
    </div>
  );
}

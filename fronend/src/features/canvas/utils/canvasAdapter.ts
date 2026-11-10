import type { TLEditorSnapshot, TLStoreSnapshot } from "tldraw";
import type { CanvasRole } from "@/types/canvas";

export type CanvasRecord = Record<string, unknown>;
export type CanvasSnapshot = TLEditorSnapshot | TLStoreSnapshot;

function isRecord(value: unknown): value is CanvasRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isStoreSnapshot(value: unknown): value is TLStoreSnapshot {
  return isRecord(value) && isRecord(value.schema) && isRecord(value.store);
}

function isEditorSnapshot(value: unknown): value is TLEditorSnapshot {
  return (
    isRecord(value) &&
    isStoreSnapshot(value.document) &&
    isRecord(value.session) &&
    typeof value.session.version === "number"
  );
}

export function getCanvasList(response: unknown, depth = 0): CanvasRecord[] {
  if (depth > 5) return [];
  if (Array.isArray(response)) return response.filter(isRecord);
  if (!isRecord(response)) return [];

  for (const key of ["canvases", "canvasList", "items", "data", "result"]) {
    if (key in response) {
      const canvases = getCanvasList(response[key], depth + 1);
      if (canvases.length > 0 || Array.isArray(response[key])) return canvases;
    }
  }

  return [];
}

export function getCanvasRecord(
  response: unknown,
  depth = 0,
): CanvasRecord | null {
  if (depth > 5 || !isRecord(response)) return null;

  const hasCanvasFields = [
    "id",
    "canvasId",
    "canvasID",
    "canvas_id",
    "_id",
    "title",
    "name",
    "canvasTitle",
    "canvasName",
    "snapshot",
  ].some((key) => key in response);
  if (hasCanvasFields) return response;

  for (const key of ["canvas", "data", "result"]) {
    const canvas = getCanvasRecord(response[key], depth + 1);
    if (canvas) return canvas;
  }

  return null;
}

export function getCanvasId(canvas: CanvasRecord): string | null {
  const id =
    canvas.id ??
    canvas.canvasId ??
    canvas.canvasID ??
    canvas.canvas_id ??
    canvas._id;
  return id === undefined || id === null || String(id).trim() === ""
    ? null
    : String(id);
}

export function getCanvasTitle(canvas: CanvasRecord): string {
  for (const key of ["title", "name", "canvasTitle", "canvasName"]) {
    const title = canvas[key];
    if (typeof title === "string" && title.trim()) return title.trim();
  }
  return "Untitled canvas";
}

export function getCanvasRole(canvas: CanvasRecord): CanvasRole | null {
  const role = canvas.role;
  return role === "owner" || role === "editor" || role === "viewer"
    ? role
    : null;
}

export function getCanvasSnapshot(
  canvas: CanvasRecord,
): CanvasSnapshot | undefined {
  const candidate =
    canvas.snapshot ??
    canvas.document ??
    canvas.canvasData ??
    canvas.content ??
    canvas.data;

  if (isStoreSnapshot(candidate)) return candidate;
  if (isEditorSnapshot(candidate)) return candidate;

  return undefined;
}

export function getCanvasDate(
  canvas: CanvasRecord,
  key: "createdAt" | "updatedAt",
): string {
  const value = canvas[key];
  return typeof value === "string" ? value : "";
}

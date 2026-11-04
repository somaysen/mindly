import * as api from "@/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCanvasId,
  type CanvasRecord,
} from "@/features/canvas/utils/canvasAdapter";

const canvasListQueryKey = ["canvases"] as const;
const canvasQueryKey = (canvasId: string) => ["canvas", canvasId] as const;

function mergeCanvasUpdate(
  value: unknown,
  canvasId: string,
  update: Record<string, unknown>,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => mergeCanvasUpdate(item, canvasId, update));
  }
  if (!value || typeof value !== "object") return value;

  const record = value as CanvasRecord;
  if (getCanvasId(record) === canvasId) return { ...record, ...update };

  let changed = false;
  const merged: CanvasRecord = { ...record };
  for (const [key, nestedValue] of Object.entries(record)) {
    if (!nestedValue || typeof nestedValue !== "object") continue;
    const updatedValue = mergeCanvasUpdate(nestedValue, canvasId, update);
    if (updatedValue !== nestedValue) {
      merged[key] = updatedValue;
      changed = true;
    }
  }
  return changed ? merged : value;
}

export const useGetCanvases = () =>
  useQuery({
    queryKey: canvasListQueryKey,
    queryFn: api.getCanvases,
    retry: 0,
  });

export const useGetCanvasById = (canvasId: string) =>
  useQuery({
    queryKey: canvasQueryKey(canvasId),
    queryFn: () => api.getCanvasById(canvasId),
    enabled: Boolean(canvasId),
    retry: 0,
  });

export const useCreateCanvas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCanvas"],
    mutationFn: api.createCanvas,
    retry: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: canvasListQueryKey });
    },
  });
};

export const useUpdateCanvas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCanvas"],
    mutationFn: api.updateCanvas,
    retry: 0,
    onSuccess: async (_, variables) => {
      const { canvasId, data } = variables;
      queryClient.setQueryData(
        canvasQueryKey(canvasId),
        (current: unknown) =>
          mergeCanvasUpdate(current, canvasId, { ...data }),
      );
      queryClient.setQueryData(
        canvasListQueryKey,
        (current: unknown) =>
          mergeCanvasUpdate(current, canvasId, { ...data }),
      );

      if (data.title !== undefined) {
        await queryClient.invalidateQueries({
          queryKey: canvasListQueryKey,
        });
      }
    },
  });
};

export const useDeleteCanvas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCanvas"],
    mutationFn: api.deleteCanvas,
    retry: 0,
    onSuccess: async (_, canvasId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: canvasListQueryKey }),
        queryClient.removeQueries({ queryKey: canvasQueryKey(canvasId) }),
      ]);
    },
  });
};

export const useCreateCanvasSyncTicket = () =>
  useMutation({
    mutationKey: ["createCanvasSyncTicket"],
    mutationFn: api.createCanvasSyncTicket,
    retry: 0,
  });

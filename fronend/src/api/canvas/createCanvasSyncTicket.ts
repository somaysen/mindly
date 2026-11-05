import api from "@/config/axios";
import type { AxiosError } from "axios";

export interface CanvasSyncTicket {
  ticket: string;
  roomId?: string;
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createCanvasSyncTicket = async (
  canvasId: string,
): Promise<CanvasSyncTicket> => {
  if (!canvasId) {
    throw new Error("Canvas ID is required");
  }

  const retries = 3;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await api.post(
        `/api/canvas/${encodeURIComponent(canvasId)}/sync-ticket`,
      );

      const data = response.data?.data ?? response.data;
      const ticket =
        typeof data?.ticket === "string"
          ? data.ticket.trim()
          : typeof data?.token === "string"
            ? data.token.trim()
            : "";

      if (!ticket) {
        throw new Error("Invalid canvas sync ticket response");
      }

      return {
        ticket,
        ...(typeof data?.roomId === "string" ? { roomId: data.roomId } : {}),
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const isAxiosError = axiosError.isAxiosError === true;

      const shouldRetry =
        (isAxiosError && !status) ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        status === 429;

      if (!shouldRetry || attempt === retries) {
        console.error("Canvas sync ticket failed:", {
          canvasId,
          status,
          message: error instanceof Error ? error.message : axiosError.message,
          response: axiosError.response?.data,
        });

        throw error;
      }

      await sleep(500 * Math.pow(2, attempt));
    }
  }

  throw new Error("Unable to create canvas sync ticket");
};

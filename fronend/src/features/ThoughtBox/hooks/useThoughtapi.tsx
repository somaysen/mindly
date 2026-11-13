import * as api from "@/api";
import { useMutation } from "@tanstack/react-query";

export type ThoughtAiPayload = {
  text?: string;
  ideaText?: string;
  taskText?: string;
};

export function useClassifyTaskIdea() {
  return useMutation({
    mutationKey: ["classifyTaskIdea"],
    mutationFn: (payload: ThoughtAiPayload) => api.classifyTaskIdea(payload),
    retry: 0,
  });
}

export function useCreateTaskIdeaPlan() {
  return useMutation({
    mutationKey: ["createTaskIdeaPlan"],
    mutationFn: (payload: ThoughtAiPayload) => api.createTaskIdeaPlan(payload),
    retry: 0,
  });
}

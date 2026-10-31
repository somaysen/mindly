const OPTIONAL_TASK_FIELDS = new Set([
  "dueDate",
  "dueTime",
  "priority",
  "project",
]);

/** Convert task form values into a JSON payload for the API. */
export function taskFormDataToPayload(formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    if (OPTIONAL_TASK_FIELDS.has(key) && !value.trim()) continue;

    if (key === "checklist") {
      try {
        payload[key] = JSON.parse(value) as unknown;
      } catch {
        payload[key] = value;
      }
      continue;
    }

    payload[key] = value;
  }

  return payload;
}

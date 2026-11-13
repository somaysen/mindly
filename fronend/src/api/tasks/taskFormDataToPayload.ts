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
    if (OPTIONAL_TASK_FIELDS.has(key) && !value.trim()) {
      // Send null so updates can clear these values without sending an empty
      // string (which is invalid for fields such as a Mongo project ID).
      payload[key] = null;
      continue;
    }

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

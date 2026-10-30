type ApiErrorShape = {
  message?: unknown;
  error?: unknown;
  response?: {
    data?: unknown;
  };
};

function getMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message.trim();
  }
  if (typeof record.error === "string" && record.error.trim()) {
    return record.error.trim();
  }
  return undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const apiError = error as ApiErrorShape | null | undefined;
  return (
    getMessage(apiError?.response?.data) ??
    getMessage(apiError) ??
    fallback
  );
}

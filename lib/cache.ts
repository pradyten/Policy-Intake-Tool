import { ApiResponseSchema, type ApiResponse } from "./schemas/api-response";

const CACHE_PREFIX = "guardian-shield-v1-";

export function getCachedResponse(sampleId: string): ApiResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + sampleId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = ApiResponseSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function setCachedResponse(
  sampleId: string,
  response: ApiResponse
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_PREFIX + sampleId, JSON.stringify(response));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

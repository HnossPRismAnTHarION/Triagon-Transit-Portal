import { HANDSHAKE_QUERY_PARAM, PEACE_HANDSHAKE_VALUE } from "./peace-token";

export { HANDSHAKE_QUERY_PARAM, PEACE_HANDSHAKE_VALUE };
export const PEACE_HANDSHAKE = PEACE_HANDSHAKE_VALUE;
export const HANDSHAKE_STORAGE_KEY = "triagon.peace_handshake_v2";

export interface StoredHandshake {
  token: string;
  exp: number; // seconds since epoch
}

export function readStoredHandshake(): StoredHandshake | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(HANDSHAKE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredHandshake;
    if (!parsed?.token || typeof parsed.exp !== "number") return null;
    if (Math.floor(Date.now() / 1000) >= parsed.exp) {
      // auto-invalidate expired handshakes
      window.localStorage.removeItem(HANDSHAKE_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function persistHandshake(value: StoredHandshake): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HANDSHAKE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function clearStoredHandshake(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(HANDSHAKE_STORAGE_KEY);
    // Also remove the pre-v2 marker if present.
    window.localStorage.removeItem("triagon.peace_handshake");
  } catch {
    /* ignore */
  }
}

/** Read a signed token from ?handshake=... (does not persist; caller must verify). */
export function readHandshakeFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(HANDSHAKE_QUERY_PARAM);
}

/** Strip the handshake query param from the current URL. */
export function stripHandshakeParam(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.searchParams.has(HANDSHAKE_QUERY_PARAM)) {
    url.searchParams.delete(HANDSHAKE_QUERY_PARAM);
    window.history.replaceState({}, "", url.toString());
  }
}

/** Append a signed handshake token to any URL. */
export function appendHandshakeToUrl(baseUrl: string, token: string): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set(HANDSHAKE_QUERY_PARAM, token);
    return url.toString();
  } catch {
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}${HANDSHAKE_QUERY_PARAM}=${encodeURIComponent(token)}`;
  }
}
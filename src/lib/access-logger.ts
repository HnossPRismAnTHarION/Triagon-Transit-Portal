export interface AccessLogEntry {
  sessionId: string;
  ip: string;
  userAgent: string;
  authenticated: boolean;
  ts?: string;
}

const STORAGE_KEY = "triagon.access_log";

export function generateSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function logAccess(entry: AccessLogEntry): void {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as AccessLogEntry[];
    existing.push({ ...entry, ts: new Date().toISOString() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-100)));
  } catch {
    /* ignore */
  }
}
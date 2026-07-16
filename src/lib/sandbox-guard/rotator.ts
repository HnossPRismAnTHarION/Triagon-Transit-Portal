/**
 * Connecting Sandbox Guard — Kinetic Vector / Rotating Coordinates (Pillar 3).
 *
 * Handshake token-names and endpoint suffixes rotate every EPOCH_MS. Malicious
 * requests replaying an old coordinate hit an invalid slot and are rejected.
 *
 * The seed comes from SANDBOX_GUARD_SECRET (server) or a public build salt
 * (client) — the client rotator only tells the UI which slot to display, the
 * server rotator is authoritative for validation.
 */
const EPOCH_MS = 30_000; // rotate every 30s
const GRACE_SLOTS = 2; // accept previous 2 slots for network jitter

export interface RotatingCoordinate {
  slot: number;
  token: string;
  expiresAt: number; // ms
}

async function hmacSlot(secret: string, slot: number): Promise<string> {
  // Web Crypto HMAC-SHA-256 (works in browser + workerd + node 20+).
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`sandbox-guard:${slot}`),
  );
  // Hex-encode.
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export async function currentCoordinate(secret: string): Promise<RotatingCoordinate> {
  const slot = Math.floor(Date.now() / EPOCH_MS);
  const token = await hmacSlot(secret, slot);
  return { slot, token, expiresAt: (slot + 1) * EPOCH_MS };
}

/** Verify a submitted token against current slot + `GRACE_SLOTS` older slots. */
export async function verifyCoordinate(
  secret: string,
  submittedToken: string,
): Promise<boolean> {
  if (typeof submittedToken !== "string" || submittedToken.length !== 32) {
    return false;
  }
  const currentSlot = Math.floor(Date.now() / EPOCH_MS);
  for (let i = 0; i <= GRACE_SLOTS; i++) {
    const t = await hmacSlot(secret, currentSlot - i);
    if (constantTimeEqual(t, submittedToken)) return true;
  }
  return false;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const SANDBOX_GUARD_EPOCH_MS = EPOCH_MS;

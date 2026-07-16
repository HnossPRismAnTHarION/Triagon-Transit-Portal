// Shared Peace-Handshake token helpers. Uses Web Crypto (HMAC-SHA256), which
// is available identically in the browser and in the Cloudflare Worker runtime.

export const PEACE_HANDSHAKE_VALUE = "Peace! For The World!";
export const HANDSHAKE_QUERY_PARAM = "handshake";
export const DEFAULT_TTL_SECONDS = 15 * 60; // 15 minutes
export const ROTATE_BEFORE_SECONDS = 5 * 60; // refresh when <5 min left

export interface PeaceTokenPayload {
  v: string; // must equal PEACE_HANDSHAKE_VALUE
  iat: number; // seconds since epoch
  exp: number; // seconds since epoch
  jti: string; // random nonce
}

export type VerifyStatus = "valid" | "invalid" | "expired" | "missing";

export interface VerifyResult {
  status: VerifyStatus;
  exp?: number;
  jti?: string;
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

const enc = new TextEncoder();

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function randomJti(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return b64urlEncode(bytes);
}

export async function signPeaceToken(secret: string, ttlSeconds = DEFAULT_TTL_SECONDS): Promise<{ token: string; exp: number }> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttlSeconds;
  const payload: PeaceTokenPayload = { v: PEACE_HANDSHAKE_VALUE, iat, exp, jti: randomJti() };
  const payloadStr = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr)));
  return { token: `${payloadStr}.${b64urlEncode(sig)}`, exp };
}

export async function verifyPeaceToken(secret: string, token: string | null | undefined): Promise<VerifyResult> {
  if (!token || typeof token !== "string") return { status: "missing" };
  const parts = token.split(".");
  if (parts.length !== 2) return { status: "invalid" };
  const [payloadB64, sigB64] = parts;
  let payload: PeaceTokenPayload;
  try {
    const key = await hmacKey(secret);
    const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64)));
    const provided = b64urlDecode(sigB64);
    if (!timingSafeEqual(expected, provided)) return { status: "invalid" };
    payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64))) as PeaceTokenPayload;
  } catch {
    return { status: "invalid" };
  }
  if (payload.v !== PEACE_HANDSHAKE_VALUE) return { status: "invalid" };
  if (typeof payload.exp !== "number" || typeof payload.iat !== "number") return { status: "invalid" };
  const now = Math.floor(Date.now() / 1000);
  if (now >= payload.exp) return { status: "expired", exp: payload.exp, jti: payload.jti };
  return { status: "valid", exp: payload.exp, jti: payload.jti };
}
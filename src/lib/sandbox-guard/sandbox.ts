/**
 * Connecting Sandbox Guard — Clean Variable Sandboxing (Pillar 1).
 *
 * Every incoming payload is copied into an isolated object, validated against
 * a Zod schema plus a hostile-signature regex sweep, then either returned as
 * a frozen sanitized copy or "shredded" (deleted + frozen to {}) so no
 * malicious structure reaches the main memory/DB layer.
 *
 * This is a DEFENSIVE UX layer, not a replacement for RLS/auth — it complements
 * Supabase's own validation.
 */
import { z } from "zod";

export interface SandboxResult<T> {
  ok: boolean;
  data?: T;
  reason?: string;
}

// Hostile signature patterns (injection, prototype pollution, XSS payloads).
const HOSTILE_PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "script_tag", re: /<\s*script[\s>]/i },
  { name: "on_event", re: /\son[a-z]+\s*=/i },
  { name: "js_uri", re: /javascript\s*:/i },
  { name: "data_uri_html", re: /data:text\/html/i },
  { name: "sql_union", re: /\bunion\s+select\b/i },
  { name: "sql_or_true", re: /'?\s*or\s+'?1'?\s*=\s*'?1/i },
  { name: "proto_pollution", re: /__proto__|constructor\s*\[/i },
  { name: "eval_call", re: /\beval\s*\(|Function\s*\(/i },
  { name: "path_traversal", re: /\.\.[/\\]/ },
  { name: "null_byte", re: /\u0000/ },
];

const MAX_STRING_LEN = 8192;
const MAX_BASE64_LEN = 2048;
const BASE64_RE = /^[A-Za-z0-9+/=]{100,}$/;

function scanValue(value: unknown, path: string): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    if (value.length > MAX_STRING_LEN) return `${path}: oversized string`;
    for (const { name, re } of HOSTILE_PATTERNS) {
      if (re.test(value)) return `${path}: ${name}`;
    }
    if (value.length > MAX_BASE64_LEN && BASE64_RE.test(value)) {
      return `${path}: suspicious base64 payload`;
    }
    return null;
  }
  if (typeof value === "number" || typeof value === "boolean") return null;
  if (Array.isArray(value)) {
    if (value.length > 200) return `${path}: oversized array`;
    for (let i = 0; i < value.length; i++) {
      const r = scanValue(value[i], `${path}[${i}]`);
      if (r) return r;
    }
    return null;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length > 100) return `${path}: oversized object`;
    for (const key of keys) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return `${path}.${key}: forbidden key`;
      }
      const r = scanValue(obj[key], `${path}.${key}`);
      if (r) return r;
    }
    return null;
  }
  return `${path}: unsupported type`;
}

/**
 * Isolate + validate + sanitize. On any failure the intermediate variable is
 * shredded (overwritten with a frozen empty object) before returning.
 */
export function sandboxValidate<T>(
  raw: unknown,
  schema: z.ZodType<T>,
): SandboxResult<T> {
  // 1. Deep-clone into an isolated variable — hostile references cannot alias
  //    into the caller's live objects.
  let isolated: unknown;
  try {
    isolated = JSON.parse(JSON.stringify(raw));
  } catch {
    return { ok: false, reason: "unserialisable_input" };
  }

  // 2. Structural hostile-signature sweep.
  const hostile = scanValue(isolated, "$");
  if (hostile) {
    isolated = Object.freeze({});
    return { ok: false, reason: `hostile_signature:${hostile}` };
  }

  // 3. Schema enforcement.
  const parsed = schema.safeParse(isolated);
  if (!parsed.success) {
    isolated = Object.freeze({});
    return {
      ok: false,
      reason: `schema:${parsed.error.issues[0]?.message ?? "invalid"}`,
    };
  }

  // 4. Return a frozen sanitized copy — mutations by the caller are blocked.
  return { ok: true, data: Object.freeze(parsed.data) as T };
}

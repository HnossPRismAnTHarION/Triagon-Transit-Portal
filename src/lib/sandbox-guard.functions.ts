/**
 * Server-side entry point for the Connecting Sandbox Guard.
 *
 * The handshake payload is deep-cloned into an isolated variable, hostile
 * signatures are swept, the rotating coordinate is verified against
 * SANDBOX_GUARD_SECRET, and — on any failure — a Zero-Persistence rejection
 * is returned. No logs contain the raw payload.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sandboxValidate } from "./sandbox-guard/sandbox";
import { verifyCoordinate, currentCoordinate } from "./sandbox-guard/rotator";

function getSecret(): string {
  const s = process.env.SANDBOX_GUARD_SECRET;
  if (!s) throw new Error("SANDBOX_GUARD_SECRET is not configured");
  return s;
}

const payloadSchema = z.object({
  email: z.string().trim().email().max(255),
  coordinate: z.string().length(32),
  clientAnomalyScore: z.number().min(0).max(1000).optional(),
});

export const sandboxHandshake = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => raw)
  .handler(async ({ data }) => {
    const result = sandboxValidate(data, payloadSchema);
    if (!result.ok || !result.data) {
      // Zero-Persistence: return a generic reject without leaking details.
      return { ok: false as const, reason: "sandbox_rejected" };
    }

    const coordOk = await verifyCoordinate(getSecret(), result.data.coordinate);
    if (!coordOk) {
      return { ok: false as const, reason: "coordinate_expired" };
    }

    // Heuristic score guard — if the client already exceeded threshold,
    // reject so the client can trigger a fresh collapse.
    if ((result.data.clientAnomalyScore ?? 0) >= 100) {
      return { ok: false as const, reason: "anomaly_threshold" };
    }

    return { ok: true as const };
  });

export const sandboxCurrentCoordinate = createServerFn({ method: "GET" }).handler(
  async () => {
    const { token, expiresAt, slot } = await currentCoordinate(getSecret());
    return { token, expiresAt, slot };
  },
);

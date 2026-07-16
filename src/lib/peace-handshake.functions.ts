import { createServerFn } from "@tanstack/react-start";
import {
  DEFAULT_TTL_SECONDS,
  signPeaceToken,
  verifyPeaceToken,
  type VerifyResult,
} from "./peace-token";

function getSecret(): string {
  const secret = process.env.PEACE_HANDSHAKE_SECRET;
  if (!secret) throw new Error("PEACE_HANDSHAKE_SECRET is not configured");
  return secret;
}

export const issuePeaceHandshake = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ token: string; exp: number; ttl: number }> => {
    const { token, exp } = await signPeaceToken(getSecret());
    return { token, exp, ttl: DEFAULT_TTL_SECONDS };
  },
);

export const verifyPeaceHandshake = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => {
    if (!data || typeof data.token !== "string" || data.token.length > 2048) {
      throw new Error("Invalid token");
    }
    return { token: data.token };
  })
  .handler(async ({ data }): Promise<VerifyResult> => {
    return verifyPeaceToken(getSecret(), data.token);
  });
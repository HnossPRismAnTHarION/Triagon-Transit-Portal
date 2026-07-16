import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  clearStoredHandshake,
  persistHandshake,
  readHandshakeFromUrl,
  readStoredHandshake,
  stripHandshakeParam,
  type StoredHandshake,
} from "@/lib/peace-handshake";
import {
  issuePeaceHandshake,
  verifyPeaceHandshake,
} from "@/lib/peace-handshake.functions";
import { ROTATE_BEFORE_SECONDS, type VerifyStatus } from "@/lib/peace-token";

export type HandshakeUiStatus =
  | "idle" // initial, no handshake attempted yet
  | "checking" // verifying against server
  | "connected"
  | "expired"
  | "invalid"
  | "missing";

export interface UsePeaceHandshakeState {
  status: HandshakeUiStatus;
  exp: number | null;
  handshake: StoredHandshake | null;
  connect: () => Promise<void>;
  refresh: () => Promise<void>;
  disconnect: () => void;
}

function toUiStatus(server: VerifyStatus): HandshakeUiStatus {
  switch (server) {
    case "valid":
      return "connected";
    case "expired":
      return "expired";
    case "invalid":
      return "invalid";
    case "missing":
      return "missing";
  }
}

export function usePeaceHandshake(): UsePeaceHandshakeState {
  const verify = useServerFn(verifyPeaceHandshake);
  const issue = useServerFn(issuePeaceHandshake);

  const [status, setStatus] = useState<HandshakeUiStatus>("idle");
  const [handshake, setHandshake] = useState<StoredHandshake | null>(null);
  const rotateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRotation = useCallback(
    (exp: number) => {
      if (rotateTimer.current) clearTimeout(rotateTimer.current);
      const msUntilRotate = Math.max(
        1000,
        (exp - Math.floor(Date.now() / 1000) - ROTATE_BEFORE_SECONDS) * 1000,
      );
      rotateTimer.current = setTimeout(() => {
        void refresh();
      }, msUntilRotate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const applyStored = useCallback(
    (value: StoredHandshake) => {
      persistHandshake(value);
      setHandshake(value);
      setStatus("connected");
      scheduleRotation(value.exp);
    },
    [scheduleRotation],
  );

  const clearAll = useCallback((next: HandshakeUiStatus) => {
    if (rotateTimer.current) clearTimeout(rotateTimer.current);
    clearStoredHandshake();
    setHandshake(null);
    setStatus(next);
  }, []);

  const verifyToken = useCallback(
    async (token: string): Promise<void> => {
      setStatus("checking");
      try {
        const result = await verify({ data: { token } });
        if (result.status === "valid" && result.exp) {
          applyStored({ token, exp: result.exp });
          return;
        }
        clearAll(toUiStatus(result.status));
      } catch {
        clearAll("invalid");
      }
    },
    [verify, applyStored, clearAll],
  );

  const refresh = useCallback(async () => {
    setStatus("checking");
    try {
      const { token, exp } = await issue();
      applyStored({ token, exp });
    } catch {
      clearAll("invalid");
    }
  }, [issue, applyStored, clearAll]);

  const connect = refresh;

  const disconnect = useCallback(() => {
    clearAll("missing");
  }, [clearAll]);

  // Bootstrap: URL param wins over stored token.
  useEffect(() => {
    const urlToken = readHandshakeFromUrl();
    if (urlToken) {
      stripHandshakeParam();
      void verifyToken(urlToken);
      return;
    }
    const stored = readStoredHandshake();
    if (stored) {
      void verifyToken(stored.token);
      return;
    }
    setStatus("missing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (rotateTimer.current) clearTimeout(rotateTimer.current);
    };
  }, []);

  return {
    status,
    exp: handshake?.exp ?? null,
    handshake,
    connect,
    refresh,
    disconnect,
  };
}
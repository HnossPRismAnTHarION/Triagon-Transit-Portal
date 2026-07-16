/**
 * Connecting Sandbox Guard — New Refresh Kollaps (Pillar 4).
 *
 * When the guard detects a threat, this triggers the "collapse":
 *  - cancel + clear TanStack Query cache
 *  - sign out of Supabase
 *  - wipe localStorage + sessionStorage
 *  - expire every cookie
 *  - hard-replace navigation to a fresh nonce so the entire DOM is reset
 */
import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearStoredHandshake } from "@/lib/peace-handshake";

let collapsing = false;

export interface CollapseOptions {
  queryClient?: QueryClient;
  reason: string;
  redirectTo?: string;
}

export async function triggerCollapse(opts: CollapseOptions): Promise<void> {
  if (typeof window === "undefined" || collapsing) return;
  collapsing = true;

  const { queryClient, reason, redirectTo } = opts;

  // Best-effort teardown — every step is wrapped so one failure cannot
  // stop the rest of the collapse.
  try {
    await queryClient?.cancelQueries();
  } catch {
    /* ignore */
  }
  try {
    queryClient?.clear();
  } catch {
    /* ignore */
  }
  try {
    await supabase.auth.signOut();
  } catch {
    /* ignore */
  }
  try {
    clearStoredHandshake();
  } catch {
    /* ignore */
  }
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {
    /* ignore */
  }
  try {
    // Expire every cookie visible to this document.
    document.cookie.split(";").forEach((c) => {
      const eq = c.indexOf("=");
      const name = (eq > -1 ? c.slice(0, eq) : c).trim();
      if (!name) return;
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    });
  } catch {
    /* ignore */
  }

  // Emit a diagnostic banner via a URL nonce — the page then reloads with
  // fresh handshake coordinates.
  const nonce = Math.floor(Math.random() * 1e9).toString(36);
  const target = redirectTo ?? window.location.pathname;
  const encodedReason = encodeURIComponent(reason.slice(0, 64));
  window.location.replace(`${target}?sbg=1&r=${nonce}&why=${encodedReason}`);
}

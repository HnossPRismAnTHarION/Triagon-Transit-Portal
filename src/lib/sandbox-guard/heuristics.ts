/**
 * Connecting Sandbox Guard — Interaction Heuristics (Pillar 2).
 *
 * Watches keystroke timing, paste behavior, dev-tools shortcuts, and other
 * bot/automation signals. Produces a running anomaly score. When the score
 * crosses THRESHOLD the caller triggers a collapse (see collapse.ts).
 *
 * Browser-only. Safe no-ops on the server.
 */
export interface HeuristicsState {
  score: number;
  events: number;
  lastReason: string | null;
}

export interface HeuristicsHandle {
  state: HeuristicsState;
  stop: () => void;
  reset: () => void;
}

export interface HeuristicsOptions {
  threshold?: number;
  onTrigger?: (reason: string, state: HeuristicsState) => void;
}

const DEFAULT_THRESHOLD = 100;

// Weights per signal — tuned to allow normal typing and one accidental
// devtools shortcut without collapsing.
const WEIGHTS = {
  devtools_shortcut: 60,
  fast_burst: 25,
  paste_flood: 40,
  contextmenu_spam: 15,
  visibility_flap: 5,
  submit_rate: 30,
  copy_from_form: 20,
};

// Interval floor: bursts under this many ms/keystroke count as bot-like.
const MIN_INTER_KEY_MS = 12;
const BURST_WINDOW = 8;

export function startHeuristics(opts: HeuristicsOptions = {}): HeuristicsHandle {
  const threshold = opts.threshold ?? DEFAULT_THRESHOLD;
  const state: HeuristicsState = { score: 0, events: 0, lastReason: null };

  if (typeof window === "undefined") {
    return { state, stop: () => {}, reset: () => {} };
  }

  const bump = (reason: keyof typeof WEIGHTS, extra?: string) => {
    state.score += WEIGHTS[reason];
    state.events += 1;
    state.lastReason = extra ? `${reason}:${extra}` : reason;
    if (state.score >= threshold) {
      opts.onTrigger?.(state.lastReason ?? reason, { ...state });
    }
  };

  // Keystroke timing.
  const times: number[] = [];
  const onKey = (e: KeyboardEvent) => {
    // DevTools shortcuts.
    const key = e.key.toLowerCase();
    if (
      key === "f12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
      (e.metaKey && e.altKey && ["i", "j", "c"].includes(key))
    ) {
      bump("devtools_shortcut", key);
      return;
    }
    const now = performance.now();
    times.push(now);
    if (times.length > BURST_WINDOW) times.shift();
    if (times.length === BURST_WINDOW) {
      const span = times[times.length - 1]! - times[0]!;
      const avg = span / (BURST_WINDOW - 1);
      if (avg < MIN_INTER_KEY_MS) bump("fast_burst", `${avg.toFixed(1)}ms`);
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData("text") ?? "";
    if (text.length > 512) bump("paste_flood", String(text.length));
  };

  let contextMenu = 0;
  const onContext = () => {
    contextMenu += 1;
    if (contextMenu >= 4) bump("contextmenu_spam");
  };

  let visFlaps = 0;
  const onVis = () => {
    visFlaps += 1;
    if (visFlaps >= 6) bump("visibility_flap");
  };

  const submits: number[] = [];
  const onSubmit = () => {
    const now = performance.now();
    submits.push(now);
    if (submits.length > 5) submits.shift();
    if (submits.length === 5 && submits[4]! - submits[0]! < 1500) {
      bump("submit_rate");
    }
  };

  const onCopy = (e: ClipboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
      bump("copy_from_form");
    }
  };

  window.addEventListener("keydown", onKey, true);
  window.addEventListener("paste", onPaste, true);
  window.addEventListener("contextmenu", onContext, true);
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("submit", onSubmit, true);
  window.addEventListener("copy", onCopy, true);

  return {
    state,
    stop: () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("paste", onPaste, true);
      window.removeEventListener("contextmenu", onContext, true);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("submit", onSubmit, true);
      window.removeEventListener("copy", onCopy, true);
    },
    reset: () => {
      state.score = 0;
      state.events = 0;
      state.lastReason = null;
      times.length = 0;
      submits.length = 0;
      contextMenu = 0;
      visFlaps = 0;
    },
  };
}

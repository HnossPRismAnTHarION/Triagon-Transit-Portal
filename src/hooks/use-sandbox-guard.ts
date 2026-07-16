/**
 * Wires the interaction-heuristics module (Pillar 2) into React and calls
 * `triggerCollapse` when the threshold is exceeded.
 */
import { useEffect, useRef, useState } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { startHeuristics, type HeuristicsState } from "@/lib/sandbox-guard/heuristics";
import { triggerCollapse } from "@/lib/sandbox-guard/collapse";

export function useSandboxGuard(enabled: boolean = true, queryClient?: QueryClient) {
  const [state, setState] = useState<HeuristicsState>({
    score: 0,
    events: 0,
    lastReason: null,
  });
  const handleRef = useRef<ReturnType<typeof startHeuristics> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const handle = startHeuristics({
      threshold: 100,
      onTrigger: (reason) => {
        void triggerCollapse({ queryClient, reason });
      },
    });
    handleRef.current = handle;
    const ticker = window.setInterval(() => {
      setState({ ...handle.state });
    }, 500);
    return () => {
      window.clearInterval(ticker);
      handle.stop();
      handleRef.current = null;
    };
  }, [enabled, queryClient]);

  return {
    state,
    reset: () => handleRef.current?.reset(),
  };
}

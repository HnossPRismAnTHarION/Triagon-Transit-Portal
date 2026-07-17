## Fix the failing handshake / sandbox-guard errors

### What's actually broken

The "bugs" in the preview come from two missing server-side secrets, not from broken code:

- `PEACE_HANDSHAKE_SECRET` — used by `src/lib/peace-handshake.functions.ts` to sign/verify peace tokens.
- `SANDBOX_GUARD_SECRET` — used by `src/lib/sandbox-guard.functions.ts` to sign the rotating login coordinate on `/auth`.

Both server functions throw `"... is not configured"` on the very first call. On `/auth` this makes the "Send magic link" button stay disabled ("handshake pending"), and on the home page the "sTarLighTs Portal" handshake fails. The transient `SyntaxError` / `hydrateStart.js` errors in the runtime log were a one-off Vite dep re-optimization reload — the dev server has since rebuilt cleanly (only harmless `inputValidator` deprecation warnings remain).

### Plan

Both secrets are **app-internal HMAC keys** — any strong random string works, no third-party service needs to know them. So generate them automatically, no manual paste:

1. Call `secrets--generate_secret` with:
   - `PEACE_HANDSHAKE_SECRET`, length 64
   - `SANDBOX_GUARD_SECRET`, length 64

That's the whole fix. Values are stored as env vars, server functions start returning tokens, `/auth` unblocks, and the portal handshake works.

### Notes

- No code changes needed. The deprecation warning about `inputValidator()` is cosmetic and unrelated — leaving it alone.
- If you'd rather set the values yourself (e.g. rotate later), say so and I'll switch to the secure update form instead.

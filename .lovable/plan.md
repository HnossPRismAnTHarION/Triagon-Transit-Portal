
## Ziel

1. Das hochgeladene Projekt **mission-control-gateway-main** wird 1:1 in dieses Lovable-Projekt übernommen (alle Routen, Komponenten, Hooks, Lib-Module, Styles, Supabase-Integration, SQL-Migration).
2. Neue Sicherheitsschicht **Connecting Sandbox Guard** (Frontend + Server-Function) wird integriert.
3. Vollständiger **PROPRIETARY LICENSE & PROJECT MANIFEST**-Text wird als sichtbarer Footer-Block direkt auf die Login-Seite (`/auth`) gesetzt.

---

## Teil A — 1:1 Rebuild

### A.1 Backend (Lovable Cloud)
- Lovable Cloud aktivieren (Supabase).
- Migration 1:1 übernehmen (`user_roles` enum + Tabelle, `requests`, `approved_entities`, `access_logs`, RLS-Policies, GRANTs, `has_role()` Security-Definer, Auto-Profile-Trigger).
- Auth: Magic-Link (E-Mail-OTP) — identisch zum Original.
- Erster User = Admin (via `user_roles` seed nach Sign-in — folgt Original-Muster; falls Original einen anderen Bootstrap hat, exakt spiegeln).

### A.2 Routen (`src/routes/`)
- `__root.tsx` — Root Shell inkl. Head-Metadaten (Titel „Triagon Transit Portal"), onAuthStateChange-Listener.
- `index.tsx` — Landing (Hero „Peace! For The World!", Feature-Cards, Institutions-Grid, Signatory-Card).
- `auth.tsx` — Magic-Link Sign-in Card + NEUER Legal-Footer (Teil C).
- `admin.tsx` — Requests-Triage-Tabelle, Filter, Detail-Sheet, Approve/Reject.
- `legal.tsx` — Voller Proprietary-License-Text.
- `sandbox.tsx` — Behavior-/Handshake-Demo (Original hatte bereits eine Sandbox-Seite; wird ausgebaut zum Live-Dashboard des Guards, siehe B).
- `request.partner.tsx`, `request.corporation.tsx` — Formulare.

### A.3 Komponenten
`site-nav`, `site-footer`, `triagon-logo` (Mark + Banner), `login-gate`, `request-form`, plus alle vorhandenen shadcn-UI-Komponenten (bereits im Projekt).

### A.4 Lib / Hooks
`peace-handshake.ts`, `peace-handshake.functions.ts`, `peace-token.ts`, `access-logger.ts`, `use-peace-handshake.ts`, `error-capture.ts`, `error-page.ts`.

### A.5 Styles
`src/styles.css` wird durch das Original ersetzt (dark theme, primary glow, `panel`-Utility, `glow-text`).

---

## Teil B — Connecting Sandbox Guard

Neuer Modulname: `src/lib/sandbox-guard/` mit vier Säulen.

### B.1 Clean Variable Sandboxing (Frontend + Server)
- `sandbox-guard/sandbox.ts` — jede eingehende Handshake-Payload wird in ein isoliertes Objekt kopiert, per Zod-Schema + Signatur-Regexen (SQLi, XSS, `<script`, `Function(`, `__proto__`, base64-Payloads > threshold) geprüft und bei Verstoß sofort per `delete`+`Object.freeze({})` „geschreddert".
- Server-Function `sandboxValidate` (`sandbox-guard.functions.ts`) mit `createServerFn` + `inputValidator` + rotierender Signatur; Zero-Persistence (kein DB-Write, kein Log außer generischem Access-Log).

### B.2 Interaction Heuristik
- `sandbox-guard/heuristics.ts` — Keystroke-Timing (min-Δt, Burst-Rate), Paste-Detection, DevTools-Shortcuts (F12, Ctrl+Shift+I/J/C), Auto-Fill-Speed. Score > Threshold → Trigger Collapse.

### B.3 Kinetic Vector (Rotating Coordinates)
- `sandbox-guard/rotator.ts` — HMAC-basierter, alle 30 s rotierender Endpoint-Path-Suffix + Token-Name. Server verifiziert mit `SANDBOX_GUARD_SECRET` (via `secrets--generate_secret`, server-only). Alte Suffixe werden nach 60 s ungültig.

### B.4 New-Refresh Kollaps
- `sandbox-guard/collapse.ts` — bei Trigger: `queryClient.cancelQueries+clear`, `supabase.auth.signOut`, komplettes `localStorage`/`sessionStorage.clear`, alle Cookies via `document.cookie` iterieren und `expires=Thu, 01 Jan 1970`, danach `window.location.replace(window.location.pathname + '?r=' + newNonce)`. Server-seitig wird die Session-Row invalidiert.

### B.5 Einbindung
- Wrapper-Komponente `<SandboxGuard>` in `__root.tsx` um `<Outlet />` → Heuristik aktiv auf allen Seiten.
- Handshake-Flow (`/auth`) nutzt `sandboxValidate` vor jedem `signInWithOtp`-Call.
- Live-Status-Panel unter `/sandbox` (Rotations-Ticker, Anomalie-Counter, letzter Collapse).

---

## Teil C — Legal-Footer auf `/auth`

Direkt unterhalb der Sign-in Card (vor `<SiteFooter/>`):
- Neue Komponente `src/components/legal-manifest.tsx` — rendert den **vollständigen** vom User gelieferten Markdown-Text als semantisches JSX (Sections: Proprietary License, Giving 4th, Gives-To Stakeholders, Appendix mit validierten URLs, Signatories, „A.d.L. ST. Daniel Pohl"-Block).
- Kein `dangerouslySetInnerHTML` — reines JSX mit Tailwind-Typografie.
- Alle Links `rel="noreferrer" target="_blank"`.
- Print-freundlich (`@media print`).

---

## Technisches

- Stack: TanStack Start v1 + React 19 + Tailwind v4 + shadcn (bereits vorhanden).
- Supabase Auth Magic-Link, RLS auf allen Tabellen, `has_role` Security-Definer.
- Secrets: `SANDBOX_GUARD_SECRET` (generiert via secrets-Tool, server-only).
- Neue Datei-Struktur:
```
src/
├── components/
│   ├── legal-manifest.tsx        (NEU — Teil C)
│   ├── login-gate.tsx, site-nav, site-footer, triagon-logo, request-form
├── lib/
│   ├── sandbox-guard/            (NEU — Teil B)
│   │   ├── sandbox.ts, heuristics.ts, rotator.ts, collapse.ts, index.ts
│   ├── sandbox-guard.functions.ts (NEU — Server-Fn)
│   ├── peace-handshake.ts + .functions.ts, peace-token.ts, access-logger.ts
├── hooks/use-peace-handshake.ts, hooks/use-sandbox-guard.ts (NEU)
├── routes/  (alle 1:1 + auth.tsx erweitert um LegalManifest)
```

### Hinweise
- Beim Kopieren wird `.git`, `bun.lock` (regeneriert), `routeTree.gen.ts` (autogeneriert) und `.env`-Werte NICHT übernommen — echte Cloud-Werte kommen aus Lovable Cloud.
- Der Guard ist eine **defensive UX-Schicht**, kein Ersatz für Supabase-RLS/Auth-Sicherheit; das wird im Code-Kommentar dokumentiert.
- Nach Rebuild: Build + smoke test (`/`, `/auth`, `/legal`, `/admin`, `/sandbox`).

Sag Bescheid, wenn ich loslegen soll — dann schalte auf Build-Mode.

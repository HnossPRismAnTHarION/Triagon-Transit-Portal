import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { logAccess, generateSessionId } from "@/lib/access-logger";
import { PEACE_HANDSHAKE_VALUE } from "@/lib/peace-token";
import { usePeaceHandshake, type HandshakeUiStatus } from "@/hooks/use-peace-handshake";

// Procedurally generated thunder SFX — no external assets, respects reduced-motion.
function playThunderSFX() {
  try {
    const Ctx =
      (typeof window !== "undefined" && (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)) || null;
    if (!Ctx) return;
    const ctx = new Ctx();
    const bufferSize = ctx.sampleRate * 2.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(12, ctx.currentTime + 2.2);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 2.5);
  } catch {
    /* ignore */
  }
}

const STATUS_META: Record<
  HandshakeUiStatus,
  { label: string; sub: string; dot: string; text: string; bg: string; border: string }
> = {
  idle: {
    label: "Prüfe Verbindung…",
    sub: "Peace-Handshake wird ausgewertet",
    dot: "bg-[#94a3b8]",
    text: "text-[#cbd5e1]",
    bg: "bg-[#1e293b]",
    border: "border-[#334155]",
  },
  checking: {
    label: "Verifikation läuft",
    sub: "Signatur wird serverseitig geprüft",
    dot: "bg-[#eab308] animate-pulse",
    text: "text-[#fde68a]",
    bg: "bg-[#1c1917]",
    border: "border-[#a16207]",
  },
  connected: {
    label: "Verbunden",
    sub: "Signierter Peace-Handshake gültig",
    dot: "bg-[#22c55e]",
    text: "text-[#86efac]",
    bg: "bg-[#052e16]",
    border: "border-[#15803d]",
  },
  expired: {
    label: "Abgelaufen",
    sub: "Handshake-Token abgelaufen — bitte erneuern",
    dot: "bg-[#f97316]",
    text: "text-[#fdba74]",
    bg: "bg-[#1c1917]",
    border: "border-[#c2410c]",
  },
  invalid: {
    label: "Ungültig",
    sub: "Signatur konnte nicht verifiziert werden",
    dot: "bg-[#f43f5e]",
    text: "text-[#fda4af]",
    bg: "bg-[#450a0a]",
    border: "border-[#b91c1c]",
  },
  missing: {
    label: "Kein Handshake",
    sub: "Kein aktives Peace-Token im Browser",
    dot: "bg-[#64748b]",
    text: "text-[#94a3b8]",
    bg: "bg-[#0f172a]",
    border: "border-[#334155]",
  },
};

function StatusBadge({ status, exp }: { status: HandshakeUiStatus; exp: number | null }) {
  const meta = STATUS_META[status];
  const remaining = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : null;
  return (
    <div
      data-testid="handshake-status"
      data-status={status}
      className={`mb-5 flex items-center gap-3 rounded-lg border ${meta.border} ${meta.bg} px-3 py-2`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
      <div className="flex-1 leading-tight">
        <div className={`text-[12px] font-bold uppercase tracking-wider ${meta.text}`}>
          Peace Handshake · {meta.label}
        </div>
        <div className="text-[11px] text-[#94a3b8]">{meta.sub}</div>
      </div>
      {remaining !== null && status === "connected" && (
        <span
          data-testid="handshake-ttl"
          className="font-mono text-[10px] text-[#4ade80]"
        >
          {Math.floor(remaining / 60)}m {remaining % 60}s
        </span>
      )}
    </div>
  );
}

// Password from secure vault documentation
const VIEW_PASSWORD = "saintsheavenlysince!";

interface LoginGateProps {
  children: ReactNode;
}

export default function LoginGate({ children }: LoginGateProps) {
  const [passwordAuth, setPasswordAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [acceptedRights, setAcceptedRights] = useState(false);
  const [error, setError] = useState("");
  const [sessionId] = useState(generateSessionId);
  const [hydrated, setHydrated] = useState(false);
  const [thunderPhase, setThunderPhase] = useState<"idle" | "thunder" | "done">("idle");
  const handshake = usePeaceHandshake();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const ip = (() => {
      try {
        return (window as { clientIP?: string }).clientIP || "localhost";
      } catch {
        return "localhost";
      }
    })();
    logAccess({
      sessionId,
      ip,
      userAgent: navigator.userAgent,
      authenticated: false,
    });
  }, [sessionId, hydrated]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== VIEW_PASSWORD) {
      setError("Zugriff verweigert. Ungültige Autorisierung.");
      return;
    }
    if (!acceptedRights) {
      setError("Die exklusive Rechtevereinbarung muss bestätigt werden.");
      return;
    }
    // Fire the thunder overlay BEFORE flipping to authenticated so the transition is visible.
    setThunderPhase("thunder");
    if (!prefersReducedMotion) playThunderSFX();
    await handshake.connect();
    const ip = (window as { clientIP?: string }).clientIP || "localhost";
    logAccess({
      sessionId,
      ip,
      userAgent: navigator.userAgent,
      authenticated: true,
    });
    // Hold the overlay for ~2.4s so copyright manifest is legible, then cross-fade into portal.
    window.setTimeout(() => {
      setPasswordAuth(true);
      setThunderPhase("done");
    }, 2400);
  };

  if (!hydrated) {
    return <div className="min-h-screen bg-[#0b0f19]" />;
  }

  const authenticated = (passwordAuth || handshake.status === "connected") && thunderPhase !== "thunder";

  if (authenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, filter: "blur(14px)", scale: 1.02 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {thunderPhase !== "thunder" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
            transition={{ duration: 0.4 }}
            className="bg-[#1e293b] border-2 border-[#334155] rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10"
          >
        <div className="flex justify-between items-center mb-5">
          <span className="bg-[#0369a1] text-[#38bdf8] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Protected View Mode
          </span>
          <span className="bg-[#15803d] text-[#4ade80] px-3 py-1 rounded-md text-[12px] font-mono font-bold">
            #ORIGINAL-{sessionId.slice(0, 12)}
          </span>
        </div>

        <StatusBadge status={handshake.status} exp={handshake.exp} />

        <h2 className="text-2xl font-bold text-[#f8fafc] mb-2">Sicherheits-Verbindung</h2>
        <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
          Sie versuchen, eine geschützte Verbindung zu einem privaten Entwicklungsportal herzustellen.
        </p>

        <div className="bg-[#111827] border-l-4 border-[#38bdf8] p-4 rounded mb-6">
          <h4 className="text-[#38bdf8] text-sm font-bold uppercase mb-1">Inhalt dieses Portals:</h4>
          <p className="text-[#cbd5e1] text-[13px] m-0">
            Dieses System beinhaltet die geschützte Web-Applikation sowie das dazugehörige Daten-Dashboard
            der HNOSS ® sTarLighTsMoveMenTs Corporation. Die Vorschau umfasst das gesamte Interface-Design,
            die Datenbank-Strukturen und vertrauliche Assets.
          </p>
        </div>

        <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4 text-[12px] text-[#94a3b8] max-h-[100px] overflow-y-auto mb-6 leading-relaxed">
          <strong>RECHTEVORBEHALT (ALL RIGHTS RESERVED):</strong><br />
          Jegliche Datenübertragung, das Erzeugen von Backlinks, Indexierungen oder automatisierte Abfragen
          (Scraping) dieser Webadresse sind strengstens untersagt. Durch das Laden dieser Seite werden keinerlei
          geistige Eigentumsrechte oder Verwertungsrechte übertragen oder abgetreten. Alle Rechte an Quellcode,
          Layout und Inhalten verbleiben exklusiv beim Betreiber.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer text-[13px] text-[#cbd5e1] select-none">
            <input
              type="checkbox"
              checked={acceptedRights}
              onChange={(e) => setAcceptedRights(e.target.checked)}
              className="mt-1 scale-110 cursor-pointer"
              required
            />
            <span>
              Ich erkenne den vollständigen Rechtevorbehalt an und bestätige, dass alle Datenansprüche
              beim Betreiber verbleiben.
            </span>
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sicherheits-Passwort eingeben"
            className="w-full p-3.5 rounded-lg border border-[#475569] bg-[#0f172a] text-white text-base focus:border-[#38bdf8] focus:outline-none transition-colors"
            required
          />

          <button
            type="submit"
            className="w-full p-3.5 rounded-lg bg-[#0284c7] text-white font-bold text-base hover:bg-[#0369a1] transition-colors"
          >
            Integrität bestätigen & Verbinden
          </button>

          {error && (
            <p className="text-[#f43f5e] text-center text-sm font-semibold mt-4">{error}</p>
          )}

          <p className="text-center text-[11px] text-[#64748b] font-mono pt-2">
            Handshake: <span className="text-[#38bdf8]">{PEACE_HANDSHAKE_VALUE}</span>
          </p>
        </form>
          </motion.div>
        ) : (
          <motion.div
            key="thunder"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: prefersReducedMotion ? 0 : [0, -12, 12, -8, 8, -4, 4, 0],
              y: prefersReducedMotion ? 0 : [0, 8, -8, 6, -6, 3, -3, 0],
            }}
            exit={{ opacity: 0, filter: "blur(18px)" }}
            transition={{
              opacity: { duration: 0.2 },
              x: { duration: 0.7, ease: "linear" },
              y: { duration: 0.7, ease: "linear" },
            }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 text-center select-none"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: prefersReducedMotion ? [0, 0.4, 0] : [0, 1, 0, 0.85, 0, 0.5, 0] }}
              transition={{ duration: 0.9, times: [0, 0.08, 0.18, 0.24, 0.32, 0.44, 1] }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#dbeafe] via-white to-[#fef3c7] mix-blend-screen"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)]" />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="relative max-w-xl space-y-5 rounded-xl border-y border-primary/30 bg-[#0b0f19]/85 px-6 py-8 backdrop-blur-xl"
            >
              <div className="text-primary text-xs font-mono uppercase tracking-[0.35em] animate-pulse">
                Verification &amp; Clearance Established
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-widest uppercase">
                sTarLighTsMoveMenTz
              </h2>
              <div className="space-y-2 text-sm font-light leading-relaxed text-slate-300">
                <p>„This access, connection, and data standard is registered and protected."</p>
                <p className="mt-4 font-mono text-xs text-slate-400">
                  © 2024–2026 Daniel Pohl — All Rights Reserved Worldwide.
                </p>
                <p className="font-mono text-[10px] tracking-wider text-primary/80">
                  Authorized Signatory: A.d.L. ST. Daniel Pohl · EU-UNION Expert ID EX2025D1218310 · Detmold, Germany
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
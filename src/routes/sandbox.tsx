import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Cpu, Terminal, FileCode, Copy, Check, Info, ExternalLink, Youtube, ShieldAlert } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useSandboxGuard } from "@/hooks/use-sandbox-guard";
import { sandboxCurrentCoordinate } from "@/lib/sandbox-guard.functions";

export const Route = createFileRoute("/sandbox")({
  component: SandboxPage,
  head: () => ({
    meta: [
      { title: "Express / NASA cFS Sandbox · sTarLighTsMoveMenTz" },
      {
        name: "description",
        content:
          "Read-only reference sandbox for the Node.js/Express secure handshake gateway and the NASA cFS Docker multi-container setup.",
      },
    ],
  }),
});

const scripts = {
  packageJson: `{
  "name": "cfs-secure-gateway",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2"
  }
}`,
  serverJs: `// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const dgram = require('dgram');

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'change_me_to_a_long_random_string';

const CFS_HOST = 'cfs-core';
const CFS_COMMAND_PORT = 1234;

app.use(express.json());
app.use(cookieParser());

const users = [
  { id: 1, email: 'user@test.com', passwordHash: '$2b$10$w8.f4/Vf6UuO4F6G.lH.0.Zq82jK1O2m/9.sRk39.vVn7w9H4yV.m' }
];

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' });
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, email, passwordHash: hashedPassword });
  res.status(201).json({ message: 'Benutzer registriert.' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Daten unvollständig.' });
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'E-Mail oder Passwort falsch.' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000,
  });
  res.status(200).json({ message: 'Handshake erfolgreich.' });
});

const requireAuth = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Nicht autorisiert.' });
  try { req.user = jwt.verify(token, SECRET_KEY); next(); }
  catch { res.status(401).json({ error: 'Sitzung ungültig.' }); }
};

app.post('/api/cfs/command', requireAuth, (req, res) => {
  const { commandPayload } = req.body;
  if (!commandPayload) return res.status(400).json({ error: 'Kein Befehl angegeben.' });
  const client = dgram.createSocket('udp4');
  client.send(Buffer.from(commandPayload), CFS_COMMAND_PORT, CFS_HOST, (err) => {
    client.close();
    if (err) return res.status(500).json({ error: 'Sandbox-Verbindungsfehler.' });
    res.status(200).json({ message: 'Befehl sicher an cFS-Sandbox übermittelt.' });
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Abgemeldet.' });
});

app.listen(PORT, () => console.log(\`Gateway läuft auf Port \${PORT}\`));`,
  dockerfileGateway: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
  dockerfileCfs: `# Stage 1: Build
FROM ubuntu:24.04 AS builder
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y build-essential git cmake libssl-dev \\
    && rm -rf /var/lib/apt/lists/*
WORKDIR /cFS
RUN git clone --recurse-submodules https://github.com/nasa/cFS.git .
RUN cp cfe/cmake/Makefile.sample Makefile && cp -r cfe/cmake/sample_defs .
RUN make prep && make && make install

# Stage 2: Runtime
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /cFS/build /cFS/build
WORKDIR /cFS/build/exe/cpu1
EXPOSE 1234/udp
EXPOSE 1235/udp
ENTRYPOINT ["./core-cpu1"]`,
  composeYaml: `services:
  api-gateway:
    build:
      context: .
      dockerfile: Dockerfile.gateway
    ports:
      - "3000:3000"
    depends_on:
      - cfs-core
    networks:
      - sandbox-net

  cfs-core:
    build:
      context: .
      dockerfile: Dockerfile.cfs
    expose:
      - "1234/udp"
      - "1235/udp"
    cap_add:
      - SYS_RESOURCE
    networks:
      - sandbox-net
    restart: unless-stopped

networks:
  sandbox-net:
    driver: bridge`,
  curlTests: `# 1. Build & start
docker compose up --build -d

# 2. Handshake
curl -i -X POST http://localhost:3000/api/login \\
  -H "Content-Type: application/json" \\
  -c cookies.txt \\
  -d '{"email":"user@test.com","password":"password123"}'

# 3. Send a command through the secure UDP proxy
curl -X POST http://localhost:3000/api/cfs/command \\
  -b cookies.txt \\
  -H "Content-Type: application/json" \\
  -d '{"commandPayload":"Verbindungstest an CPU1"}'`,
};

function CodeBlock({
  id,
  label,
  code,
  icon: Icon = FileCode,
}: {
  id: string;
  label: string;
  code: string;
  icon?: typeof FileCode;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/40 px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Kopiert" : "Kopieren"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-b-lg border border-border bg-[#0b0f19] p-4 text-xs font-mono leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function GuardStatusPanel() {
  const { state, reset } = useSandboxGuard(true);
  const fetchCoord = useServerFn(sandboxCurrentCoordinate);
  const [slot, setSlot] = useState<{ token: string; expiresAt: number } | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const c = await fetchCoord();
        if (alive) setSlot({ token: c.token, expiresAt: c.expiresAt });
      } catch {
        /* ignore */
      }
    };
    load();
    const id = window.setInterval(load, 25_000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [fetchCoord]);

  useEffect(() => {
    if (!slot) return;
    const tick = () => setCountdown(Math.max(0, Math.floor((slot.expiresAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [slot]);

  const pct = Math.min(100, (state.score / 100) * 100);
  const critical = state.score >= 80;

  return (
    <section className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <div className="mb-4 flex items-center gap-3">
        <ShieldAlert className={`h-5 w-5 ${critical ? "text-destructive" : "text-primary"}`} />
        <h2 className="text-lg font-semibold text-foreground">
          Connecting Sandbox Guard — Live Status
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Rotating Coordinate
          </div>
          <div className="mt-2 font-mono text-sm text-primary">
            {slot ? `${slot.token.slice(0, 12)}…` : "loading…"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            expires in {countdown}s
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Anomaly Score
          </div>
          <div className="mt-2 text-sm text-foreground">
            {state.score} / 100
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${critical ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Last Signal
          </div>
          <div className="mt-2 font-mono text-xs text-muted-foreground">
            {state.lastReason ?? "—"}
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-2 text-[11px] text-primary underline-offset-2 hover:underline"
          >
            reset counter
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Pillars: Clean Variable Sandboxing · Interaction Heuristics · Rotating Coordinates ·
        New-Refresh Collapse. Threshold ≥ 100 triggers full session teardown and hard reload
        with fresh coordinates.
      </p>
    </section>
  );
}

function SandboxPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="border-b border-border pb-8">
          <div className="flex items-center gap-3">
            <Cpu className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground glow-text md:text-4xl">
              Express / NASA cFS Sandbox
            </h1>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Dieses Portal läuft in einer serverlosen Edge-Runtime (Cloudflare Worker). Native Docker-Container,
            C-Binaries und rohe UDP-Sockets sind dort nicht ausführbar. Die folgenden Skripte bilden die
            vollständige, lokal ausführbare Multi-Container-Sandbox mit sicherem Login-Handshake (JWT + HttpOnly
            Cookie + bcrypt) und einer UDP-Brücke zum NASA core Flight System.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://github.com/nasa/cFS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-primary transition hover:border-primary/60"
            >
              <ExternalLink className="h-4 w-4" /> NASA cFS Repository
            </a>
            <a
              href="https://www.youtube.com/watch?v=rUUuJGj6Wy0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground transition hover:border-destructive/60"
            >
              <Youtube className="h-4 w-4" /> Lokales Kompilier-Tutorial
            </a>
          </div>
        </header>

        <GuardStatusPanel />


        <section className="mt-8 flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <strong className="block text-foreground">Identische Best Practices</strong>
            Das Live-Portal nutzt bereits denselben Handshake-Ansatz: signierte Tokens, serverseitige
            Verifikation, sichere Übertragung. Der Unterschied ist die Runtime — hier läuft es auf einer
            serverlosen Edge-Infrastruktur, dort auf zwei Docker-Containern in deinem eigenen Netzwerk.
          </div>
        </section>

        <section className="mt-10 space-y-8">
          <CodeBlock id="compose" label="compose.yaml" code={scripts.composeYaml} />
          <CodeBlock id="server" label="server.js — Secure Gateway + UDP Proxy" code={scripts.serverJs} icon={Terminal} />
          <div className="grid gap-6 md:grid-cols-2">
            <CodeBlock id="pkg" label="package.json" code={scripts.packageJson} />
            <CodeBlock id="dfg" label="Dockerfile.gateway" code={scripts.dockerfileGateway} />
          </div>
          <CodeBlock id="dfc" label="Dockerfile.cfs" code={scripts.dockerfileCfs} />
          <CodeBlock id="curl" label="Lokaler Test-Handshake" code={scripts.curlTests} icon={Terminal} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

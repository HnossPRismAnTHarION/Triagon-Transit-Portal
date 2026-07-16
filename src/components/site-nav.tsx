import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import bannerAsset from "@/assets/triagon-banner.png.asset.json";
import { appendHandshakeToUrl } from "@/lib/peace-handshake";
import { issuePeaceHandshake } from "@/lib/peace-handshake.functions";

const STARLIGHTS_URL =
  (import.meta.env.VITE_STARLIGHTS_URL as string | undefined) ??
  "https://starlightsmovements.org";

const STARLIGHTS_GITHUB_URL =
  "https://github.com/WorldWide-Since-2026-We-Trusted-Since/sTarLighTsMoveMenTs---Official-Corporation-from-EU-UNION-NATO-Pentagon-UN";

export function SiteNav() {
  const [email, setEmail] = useState<string | null>(null);
  const issue = useServerFn(issuePeaceHandshake);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const openStarlights = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (minting) return;
    setMinting(true);
    try {
      const { token } = await issue();
      window.open(appendHandshakeToUrl(STARLIGHTS_URL, token), "_blank", "noopener");
    } catch {
      window.open(STARLIGHTS_URL, "_blank", "noopener");
    } finally {
      setMinting(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={bannerAsset.url}
            alt="Triagon Transit"
            className="h-9 w-9 rounded object-cover"
            style={{ objectPosition: "12% center" }}
          />
          <div className="leading-tight">
            <div className="font-semibold tracking-wide text-foreground glow-text">Triagon Transit</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Peace 4 The World</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/request/partner" className="hover:text-primary">Partner Request</Link>
          <Link to="/request/corporation" className="hover:text-primary">Corporation Request</Link>
          <Link to="/legal" className="hover:text-primary">License</Link>
          <Link to="/sandbox" className="hover:text-primary">Sandbox</Link>
          <a
            href={STARLIGHTS_URL}
            onClick={openStarlights}
            className="hover:text-primary"
            rel="noopener"
          >
            {minting ? "Handshake…" : "sTarLighTs Portal ↗"}
          </a>
          <a
            href={STARLIGHTS_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-primary hover:border-primary/60 hover:bg-primary/10 transition"
          >
            <Github className="h-3.5 w-3.5" />
            sTarLighTsMoveMenTz Portal
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <Link to="/admin"><Button variant="secondary" size="sm">Admin</Button></Link>
              <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <Link to="/auth"><Button size="sm">Sign in</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}
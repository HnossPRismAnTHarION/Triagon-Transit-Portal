import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TriagonMark } from "@/components/triagon-logo";
import { LegalManifest } from "@/components/legal-manifest";
import {
  sandboxHandshake,
  sandboxCurrentCoordinate,
} from "@/lib/sandbox-guard.functions";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [{ title: "Sign in · Triagon Transit" }],
  }),
});

const schema = z.object({ email: z.string().trim().email().max(255) });

const EXTERNAL_PORTAL_URL = "http://treetripacinghexagoenneapasing.statesflowwishes.eu/";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coordinate, setCoordinate] = useState<string | null>(null);
  
  const validateHandshake = useServerFn(sandboxHandshake);
  const fetchCoordinate = useServerFn(sandboxCurrentCoordinate);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = EXTERNAL_PORTAL_URL;
      }
    });
  }, []);

  // Fetch a fresh rotating coordinate every 25s (rotation is 30s).
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      try {
        const c = await fetchCoordinate();
        if (!cancelled) setCoordinate(c.token);
      } catch {
        if (!cancelled) setCoordinate(null);
      }
    };
    refresh();
    const id = window.setInterval(refresh, 25_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [fetchCoordinate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    if (!coordinate) {
      toast.error("Sandbox coordinate not ready — retry in a moment.");
      return;
    }
    setLoading(true);
    // Sandbox Guard pre-flight: server-side isolated validation.
    const guard = await validateHandshake({
      data: { email: parsed.data.email, coordinate },
    });
    if (!guard.ok) {
      setLoading(false);
      toast.error(`Sandbox Guard rejected the handshake (${guard.reason}).`);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: { emailRedirectTo: EXTERNAL_PORTAL_URL },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Magic link sent — check your inbox.");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-16">
        <Card className="panel w-full p-8">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <TriagonMark />
            <h1 className="text-xl font-semibold text-foreground glow-text">
              Triagon Transit Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              Request-and-Verify: we email you a signed one-time link to activate your
              session.
            </p>
          </div>

          {sent ? (
            <div className="text-center text-sm text-muted-foreground">
              A verification link has been sent to{" "}
              <span className="text-foreground">{email}</span>. Click the link in the email
              to activate your session.
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.org"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !coordinate}>
                {loading ? "Sending link…" : "Send magic link"}
              </Button>
              <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Connecting Sandbox Guard ·{" "}
                <span className={coordinate ? "text-primary" : "text-destructive"}>
                  {coordinate ? `slot ${coordinate.slice(0, 8)}…` : "handshake pending"}
                </span>
              </p>
            </form>
          )}
        </Card>
      </main>

      <LegalManifest />

      <SiteFooter />
    </div>
  );
}

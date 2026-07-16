import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-semibold text-foreground">Triagon Transit</div>
            <p className="mt-2 text-xs leading-relaxed">
              Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
              A pilot project by EU-KOMMISSION Expert (ID: EX2025D1218310), Detmold, Germany.
            </p>
          </div>
          <div>
            <div className="font-semibold text-foreground">Portal</div>
            <ul className="mt-2 space-y-1">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/request/partner" className="hover:text-primary">Partner Request</Link></li>
              <li><Link to="/request/corporation" className="hover:text-primary">Corporation Request</Link></li>
              <li><Link to="/auth" className="hover:text-primary">Sign in</Link></li>
              <li><Link to="/sandbox" className="hover:text-primary">NASA cFS Sandbox</Link></li>
              <li><Link to="/legal" className="hover:text-primary">Proprietary License</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-foreground">Pledge Partners</div>
            <ul className="mt-2 space-y-1">
              <li><a href="https://america250.org" target="_blank" rel="noreferrer" className="hover:text-primary">America250</a></li>
              <li><a href="http://freedom250.likewise.live" target="_blank" rel="noreferrer" className="hover:text-primary">Freedom 250</a></li>
              <li><a href="https://www.nationalshrine.org" target="_blank" rel="noreferrer" className="hover:text-primary">Basilica of the National Shrine</a></li>
              <li><a href="https://www.walsingham.org.uk" target="_blank" rel="noreferrer" className="hover:text-primary">Walsingham</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/60 pt-4 text-xs">
          Big greetings from: EU Commission · Council of the EU · Deutscher Bundestag · BfV · INTERPOL · Deutsche Börse · BaFin · Europol · Pentagon Force Protection Agency · Supreme Court of the U.S. · NATO · United Nations · Freedom 250.
        </div>
        <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-4 text-[11px] font-mono text-muted-foreground sm:flex-row">
          <p>© 2024–2026 Daniel Pohl — All Rights Reserved Worldwide. Proprietary License.</p>
          <Link to="/legal" className="text-primary hover:underline">Read full manifest →</Link>
        </div>
      </div>
    </footer>
  );
}
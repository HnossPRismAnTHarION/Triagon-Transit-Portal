import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { TriagonBanner } from "@/components/triagon-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Landing,
});

const institutions = [
  { name: "NATO", url: "https://www.nato.int" },
  { name: "United Nations", url: "https://www.un.org" },
  { name: "UN Treaty Collection", url: "https://treaties.un.org" },
  { name: "European Commission", url: "https://commission.europa.eu" },
  { name: "Council of the EU", url: "https://www.consilium.europa.eu" },
  { name: "Europol", url: "https://www.europol.europa.eu" },
  { name: "INTERPOL", url: "https://www.interpol.int" },
  { name: "The Pentagon (DoD)", url: "https://www.defense.gov" },
  { name: "Pentagon Force Protection", url: "https://www.pfpa.mil" },
  { name: "Supreme Court of the U.S.", url: "https://www.supremecourt.gov" },
  { name: "U.S. Dept. of Veterans Affairs", url: "https://www.va.gov" },
  { name: "Office of the Comptroller of the Currency", url: "https://www.occ.treas.gov" },
  { name: "U.S. House of Representatives", url: "https://www.house.gov" },
  { name: "FOIA", url: "https://www.foia.gov" },
  { name: "Deutscher Bundestag", url: "https://www.bundestag.de" },
  { name: "Bundesamt für Verfassungsschutz", url: "https://www.verfassungsschutz.de" },
  { name: "BaFin", url: "https://www.bafin.de" },
  { name: "PTB", url: "https://www.ptb.de" },
  { name: "Deutsche Börse Group", url: "https://www.deutsche-boerse.com" },
  { name: "Ledger Wallet", url: "https://www.ledger.com" },
  { name: "Plaid", url: "https://plaid.com" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center">
          <div className="mb-8 flex justify-center">
            <TriagonBanner />
          </div>
          <p className="mx-auto max-w-2xl text-sm uppercase tracking-[0.35em] text-primary">
            via. Future 4 Reality 2 Back 4 Future
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground glow-text md:text-6xl">
            Peace! For The World!
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Expert vision and pledges for the next and for this generation. A staging future
            for regenerative health and a nice world to live in. LCL — Love · Think · Create.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth"><Button size="lg">Sign in to Portal</Button></Link>
            <Link to="/request/partner"><Button variant="secondary" size="lg">Partner Request</Button></Link>
            <Link to="/request/corporation"><Button variant="outline" size="lg">Corporation Request</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Expert Vision & Pledges",
              b: "For this generation and the next. A pilot developed with EU institutions, NATO, the Pentagon, the UN, and Deutsche Börse.",
            },
            {
              t: "Giving 4th — July 4",
              b: "Adds active civic engagement to the Independence Day celebration through measurable contributions and causes we support.",
            },
            {
              t: "LCL — Life Crown Live",
              b: "A great life to live, connecting living. Stay connected with good visions for the future — think · thank · create.",
            },
          ].map((c) => (
            <Card key={c.t} className="panel p-6">
              <h3 className="text-lg font-semibold text-foreground">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold text-foreground">Global Stakeholders & Transmission Channels</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Official contact points and validated URLs for the July 4, 2026 pledge. Each entry is a
          direct docking interface between the Genesis Protocol architecture and the respective institution.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {institutions.map((i) => (
            <a
              key={i.name}
              href={i.url}
              target="_blank"
              rel="noreferrer"
              className="panel rounded-md px-4 py-3 text-sm text-foreground transition hover:border-primary hover:text-primary"
            >
              {i.name}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Card className="panel p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Authorized Executive Signatory</div>
          <div className="mt-3 text-2xl font-semibold text-foreground">A.d.L. ST. Daniel Pohl</div>
          <div className="text-sm text-muted-foreground">EU-UNION Expert · ID: EX2025D1218310 · Detmold, Germany</div>
          <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
            Copyright & Registry License by EU-KOMMISSION. Creation by Daniel Pohl —
            for peace for the world. Read the full proprietary license and stakeholder appendix.
          </p>
          <div className="mt-6"><Link to="/legal"><Button variant="secondary">Read Proprietary License</Button></Link></div>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/legal")({
  component: Legal,
  head: () => ({
    meta: [
      { title: "Proprietary License & Project Manifest · Triagon Transit" },
      {
        name: "description",
        content:
          "Proprietary License, Giving 4th Pledge, global stakeholders, and validated official URLs for the sTarLighTsMoveMenTs / Triagon Transit initiative.",
      },
    ],
  }),
});

const REPO_URL =
  "https://github.com/WorldWide-Since-2026-We-Trusted-Since/sTarLighTsMoveMenTs---Official-Corporation-from-EU-UNION-NATO-Pentagon-UN";

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline-offset-4 hover:underline break-all"
    >
      {children}
    </a>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-foreground glow-text">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Legal() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <Card className="panel p-8">
          <h1 className="text-3xl font-semibold text-foreground glow-text">
            Proprietary License &amp; Project Manifest
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Target Repository ·{" "}
            <Ext href={REPO_URL}>github.com/WorldWide-Since-2026-We-Trusted-Since/sTarLighTsMoveMenTs</Ext>
          </p>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground font-semibold">Copyright © 2024–2026 Daniel Pohl.</span>{" "}
              All Rights Reserved Worldwide.
            </p>
            <p>
              This software, repository, and all associated documentation, algorithms, architecture
              designs, and intellectual property (collectively "The Work") are the exclusive property
              of Daniel Pohl and the following authorized corporate entities:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>STARLIGHTMOVEMENTS AG / StarLightMovemenTz Foundation</li>
              <li>HNOSS Enterprises</li>
              <li>PRISMANTHARION Corporation</li>
              <li>SHINEHEALTHCARE GmbH</li>
            </ul>
          </div>

          <Section title="No Rights Transferred">
            <p className="text-sm text-muted-foreground">
              NO RIGHTS ARE GRANTED, TRANSFERRED, OR ASSIGNED BY THE PUBLICATION, AVAILABILITY, OR
              EXISTENCE OF THIS CODE. The presence of this code in any repository does NOT constitute
              an offer of license, partnership, or authorization for use by any third party.
            </p>
          </Section>

          <Section title="Restrictions">
            <ol className="ml-6 list-decimal space-y-1 text-sm text-muted-foreground">
              <li><span className="text-foreground">NO USE</span> — No person or entity may use, execute, run, or operate this code.</li>
              <li><span className="text-foreground">NO COPY</span> — No copying, reproduction, or duplication is permitted.</li>
              <li><span className="text-foreground">NO MODIFICATION</span> — No derivative works or modifications allowed.</li>
              <li><span className="text-foreground">NO DISTRIBUTION</span> — No redistribution, sharing, or publication permitted.</li>
              <li><span className="text-foreground">NO CLONING</span> — Repository cloning by unauthorized parties is prohibited.</li>
              <li><span className="text-foreground">NO REVERSE ENGINEERING</span> — Decompilation and disassembly strictly forbidden.</li>
            </ol>
          </Section>

          <Section title="Legal Status">
            <p className="text-sm text-muted-foreground">
              This is a PILOT PROJECT developed in collaboration with:
            </p>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
              <li>European Union Institutions</li>
              <li>NATO (North Atlantic Treaty Organization)</li>
              <li>The Pentagon / United States Department of Defense</li>
              <li>United Nations (UN)</li>
              <li>Deutsche Börse AG</li>
              <li>Additional classified governmental and institutional partners</li>
            </ul>
          </Section>

          <Section title="Intellectual Property Protection">
            <p className="text-sm text-muted-foreground">
              Protected by International Copyright Law (Berne Convention), European Union Copyright
              Directives, United States Copyright Act of 1976, German Copyright Law
              (Urheberrechtsgesetz), Patent Law, Trade Secret Law, and Contract Law.
            </p>
          </Section>

          <Section title="Violations & Enforcement">
            <p className="text-sm text-muted-foreground">
              Any unauthorized access, use, copying, cloning, or distribution constitutes Copyright
              Infringement, Trade Secret Misappropriation, Computer Fraud and Abuse
              (18 U.S.C. § 1030), and Economic Espionage (18 U.S.C. § 1831). Violators will be
              prosecuted to the maximum extent of the law, including civil damages, criminal
              prosecution, referral to INTERPOL, and inclusion in government security watchlists.
            </p>
          </Section>

          <Section title="Giving 4th — Pledge & Initiative">
            <p className="text-sm text-muted-foreground">
              Unser <span className="text-foreground">'Giving 4th'</span>-Pledge ist eine bewusste
              Erweiterung der Feierlichkeiten zum Unabhängigkeitstag. Wir verpflichten uns dazu,
              diesen Tag als Anlass für aktives gesellschaftliches Engagement zu nutzen, indem wir
              Gemeinschaften und Anliegen unterstützen, die für uns von zentraler Bedeutung sind. Das
              spezifische Pledge-Projekt ist unter{" "}
              <Ext href="https://lnkd.in/eKsmMqz3">LinkedIn Pledge Projekt</Ext> dokumentiert.
            </p>
            <p className="text-sm text-muted-foreground">
              Diese Initiative transformiert den Charakter des Feiertages, indem sie den Fokus auf
              messbare Beiträge und die Unterstützung von zivilgesellschaftlichen Anliegen legt. Durch
              die Verknüpfung mit dem Projekt unter{" "}
              <Ext href="https://lnkd.in/e2rHUgd2">Offizieller Pledge</Ext> stellen wir sicher, dass
              unser Engagement transparent und zielgerichtet erfolgt.
            </p>
            <p className="text-sm italic text-foreground">
              Giving 4th calls on all Americans to add something new to their July 4th celebrations:
              giving back to the causes and communities they care about.
            </p>
            <div className="mt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Ressourcen &amp; Referenzen
              </h4>
              <ul className="ml-6 mt-1 list-disc space-y-1 text-sm text-muted-foreground">
                <li><Ext href="https://www.usa.gov/">USA.gov</Ext></li>
                <li>
                  <Ext href="https://america250.org/">America250</Ext> ·{" "}
                  <Ext href="https://lnkd.in/eCZuhXUE">America250 LinkedIn</Ext>
                </li>
                <li><Ext href="https://lnkd.in/e4jZ3uuw">Pledge Partner &amp; Initiative</Ext></li>
              </ul>
            </div>
          </Section>

          <Section title="The Gives To — Globale Stakeholder & Übermittlungskanäle">
            <p className="text-sm text-muted-foreground">
              Offizielle Kontaktstellen für den Pledge am 4. Juli 2026. Jeder Eintrag ist eine direkte
              Andock-Schnittstelle zwischen der Genesis-Protokoll-Architektur und den jeweiligen
              Institutionen:
            </p>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
              <li><span className="text-foreground">NATO:</span> <Ext href="https://www.nato.int">www.nato.int</Ext></li>
              <li><span className="text-foreground">U.S. Department of Veterans Affairs:</span> <Ext href="https://department.va.gov">department.va.gov</Ext></li>
              <li><span className="text-foreground">OCC Secure Portal:</span> <Ext href="https://occ.secureocp.com">occ.secureocp.com</Ext></li>
              <li><span className="text-foreground">Supreme Court of the United States:</span> <Ext href="https://www.supremecourt.gov">www.supremecourt.gov</Ext></li>
              <li><span className="text-foreground">United Nations — Office of Legal Affairs:</span> <Ext href="https://www.un.org">www.un.org</Ext></li>
              <li><span className="text-foreground">UN Treaty Collection:</span> <Ext href="https://treaties.un.org">treaties.un.org</Ext></li>
              <li><span className="text-foreground">Pentagon Force Protection Agency:</span> <Ext href="https://www.pfpa.mil">www.pfpa.mil</Ext></li>
              <li><span className="text-foreground">U.S. Mission to the United Nations:</span> <Ext href="https://usun.usmission.gov">usun.usmission.gov</Ext></li>
              <li><span className="text-foreground">U.S. House — Unsolicited Tech Pitch:</span> <Ext href="https://www.house.gov">www.house.gov</Ext></li>
              <li><span className="text-foreground">Europol — Careers & Recruitment:</span> <Ext href="https://www.europol.europa.eu">www.europol.europa.eu</Ext></li>
              <li><span className="text-foreground">Freedom of Information Act (FOIA):</span> <Ext href="https://www.foia.gov">www.foia.gov</Ext></li>
              <li><span className="text-foreground">Ledger Wallet™:</span> <Ext href="https://lnkd.in/enMi-UzM">Ledger Link</Ext></li>
            </ul>
          </Section>

          <Section title="Appendix — Validated Official URLs & Anchors">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                1. Eigene &amp; Autorisierte Corporate Entities
              </h4>
              <ul className="ml-6 mt-1 list-disc space-y-1 text-sm text-muted-foreground">
                <li>STARLIGHTMOVEMENTS AG / StarLightMovemenTz Foundation — <Ext href={REPO_URL}>GitHub Repository</Ext></li>
                <li>HNOSS Enterprises (wie oben)</li>
                <li>PRISMANTHARION Corporation (wie oben)</li>
                <li>SHINEHEALTHCARE GmbH (wie oben)</li>
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                2. Externe Partner-Unternehmen &amp; Finanzdienstleister
              </h4>
              <ul className="ml-6 mt-1 list-disc space-y-1 text-sm text-muted-foreground">
                <li>Deutsche Börse AG — <Ext href="https://www.deutsche-boerse.com">www.deutsche-boerse.com</Ext></li>
                <li>Ledger Wallet™ — <Ext href="https://www.ledger.com">www.ledger.com</Ext></li>
                <li>Plaid — <Ext href="https://plaid.com">plaid.com</Ext></li>
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                3. Internationale Behörden &amp; Organisationen
              </h4>
              <ul className="ml-6 mt-1 list-disc space-y-1 text-sm text-muted-foreground">
                <li>Europäische Kommission — <Ext href="https://commission.europa.eu">commission.europa.eu</Ext></li>
                <li>Council of the European Union — <Ext href="https://www.consilium.europa.eu">consilium.europa.eu</Ext></li>
                <li>Europol — <Ext href="https://www.europol.europa.eu">europol.europa.eu</Ext></li>
                <li>INTERPOL — <Ext href="https://www.interpol.int">interpol.int</Ext></li>
                <li>NATO — <Ext href="https://www.nato.int">nato.int</Ext></li>
                <li>United Nations (UN) — <Ext href="https://www.un.org">un.org</Ext></li>
                <li>UN Treaty Collection — <Ext href="https://treaties.un.org">treaties.un.org</Ext></li>
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                4. US-Institutionen, Justiz &amp; Zivilgesellschaft
              </h4>
              <ul className="ml-6 mt-1 list-disc space-y-1 text-sm text-muted-foreground">
                <li>The Pentagon / U.S. Department of Defense — <Ext href="https://www.defense.gov">defense.gov</Ext></li>
                <li>Pentagon Force Protection Agency (PFPA) — <Ext href="https://www.pfpa.mil">pfpa.mil</Ext></li>
                <li>Supreme Court of the United States — <Ext href="https://www.supremecourt.gov">supremecourt.gov</Ext></li>
                <li>U.S. Department of Veterans Affairs — <Ext href="https://www.va.gov">va.gov</Ext> · <Ext href="https://department.va.gov">department.va.gov</Ext></li>
                <li>Office of the Comptroller of the Currency (OCC) — <Ext href="https://www.occ.treas.gov">occ.treas.gov</Ext> · <Ext href="https://occ.secureocp.com">occ.secureocp.com</Ext></li>
                <li>U.S. House of Representatives — <Ext href="https://www.house.gov">house.gov</Ext></li>
                <li>Freedom of Information Act (FOIA) — <Ext href="https://www.foia.gov">foia.gov</Ext></li>
                <li>America250 / Freedom 250 — <Ext href="https://america250.org">america250.org</Ext></li>
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                5. Deutsche Bundesbehörden &amp; Justiz
              </h4>
              <ul className="ml-6 mt-1 list-disc space-y-1 text-sm text-muted-foreground">
                <li>Deutscher Bundestag — <Ext href="https://www.bundestag.de">bundestag.de</Ext></li>
                <li>Bundesamt für Verfassungsschutz (BfV) — <Ext href="https://www.verfassungsschutz.de">verfassungsschutz.de</Ext></li>
                <li>Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) — <Ext href="https://www.bafin.de">bafin.de</Ext></li>
                <li>Physikalisch-Technische Bundesanstalt (PTB) — <Ext href="https://www.ptb.de">ptb.de</Ext></li>
              </ul>
            </div>
          </Section>

          <Section title="Official Signatories & Partners">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">Big GreeTings from:</span>
            </p>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
              <li>European Commission · Council of the European Union</li>
              <li>Deutscher Bundestag — Verwaltung</li>
              <li>Bundesamt für Verfassungsschutz (BfV)</li>
              <li>INTERPOL</li>
              <li>Deutsche Börse Group</li>
              <li>BaFin</li>
              <li>Europol</li>
              <li>Pentagon Force Protection Agency</li>
              <li>Supreme Court of the U.S.</li>
              <li>NATO — The North Atlantic Treaty Organization</li>
              <li>United Nations</li>
              <li>Freedom 250</li>
            </ul>

            <div className="mt-6 rounded-lg border border-border bg-background/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Authorized Executive Signatory
              </p>
              <p className="mt-2 text-foreground font-semibold">A.d.L. ST. Daniel Pohl</p>
              <p className="text-sm text-muted-foreground italic">
                EU-UNION Expert (ID: EX2025D1218310) — Detmold, Germany
              </p>
            </div>
          </Section>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
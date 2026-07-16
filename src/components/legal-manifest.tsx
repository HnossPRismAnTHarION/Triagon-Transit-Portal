/**
 * PROPRIETARY LICENSE & PROJECT MANIFEST — rendered as semantic JSX for the
 * login page footer. Text supplied by the app owner; keep in sync with
 * README.md / LICENSE.md at the repository root.
 */
type Link = { name: string; url: string };

const givesTo: Link[] = [
  { name: "NATO", url: "https://www.nato.int" },
  { name: "U.S. Department of Veterans Affairs", url: "https://department.va.gov" },
  { name: "OCC Secure Portal", url: "https://occ.secureocp.com" },
  { name: "Supreme Court of the United States", url: "https://www.supremecourt.gov" },
  { name: "United Nations — Office of Legal Affairs", url: "https://www.un.org" },
  { name: "UN Treaty Collection", url: "https://treaties.un.org" },
  { name: "Pentagon Force Protection Agency", url: "https://www.pfpa.mil" },
  { name: "U.S. Mission to the United Nations", url: "https://usun.usmission.gov" },
  { name: "U.S. House — Unsolicited Tech Pitch", url: "https://www.house.gov" },
  { name: "Europol — Careers & Recruitment", url: "https://www.europol.europa.eu" },
  { name: "Freedom of Information Act (FOIA)", url: "https://www.foia.gov" },
];

const partnerFinance: Link[] = [
  { name: "Deutsche Börse AG", url: "https://www.deutsche-boerse.com" },
  { name: "Ledger Wallet™", url: "https://www.ledger.com" },
  { name: "Plaid", url: "https://plaid.com" },
];

const international: Link[] = [
  { name: "European Commission", url: "https://commission.europa.eu" },
  { name: "Council of the European Union", url: "https://www.consilium.europa.eu" },
  { name: "Europol", url: "https://www.europol.europa.eu" },
  { name: "INTERPOL", url: "https://www.interpol.int" },
  { name: "NATO", url: "https://www.nato.int" },
  { name: "United Nations (UN)", url: "https://www.un.org" },
  { name: "UN Treaty Collection", url: "https://treaties.un.org" },
];

const usInstitutions: Link[] = [
  { name: "The Pentagon / U.S. Department of Defense", url: "https://www.defense.gov" },
  { name: "Pentagon Force Protection Agency (PFPA)", url: "https://www.pfpa.mil" },
  { name: "Supreme Court of the United States", url: "https://www.supremecourt.gov" },
  { name: "U.S. Department of Veterans Affairs", url: "https://www.va.gov" },
  { name: "Office of the Comptroller of the Currency (OCC)", url: "https://www.occ.treas.gov" },
  { name: "U.S. House of Representatives", url: "https://www.house.gov" },
  { name: "Freedom of Information Act (FOIA)", url: "https://www.foia.gov" },
  { name: "America250 / Freedom 250", url: "https://america250.org" },
];

const germanFederal: Link[] = [
  { name: "Deutscher Bundestag", url: "https://www.bundestag.de" },
  { name: "Bundesamt für Verfassungsschutz (BfV)", url: "https://www.verfassungsschutz.de" },
  { name: "Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)", url: "https://www.bafin.de" },
  { name: "Physikalisch-Technische Bundesanstalt (PTB)", url: "https://www.ptb.de" },
];

const signatories = [
  "European Commission — Council of the European Union",
  "Deutscher Bundestag — Verwaltung",
  "Bundesamt für Verfassungsschutz (BfV)",
  "INTERPOL",
  "Deutsche Börse Group",
  "BaFin",
  "Europol",
  "Pentagon Force Protection Agency",
  "Supreme Court of the U.S.",
  "NATO — The North Atlantic Treaty Organization",
  "United Nations",
  "Freedom 250",
];

const REPO_URL =
  "https://github.com/WorldWide-Since-2026-We-Trusted-Since/sTarLighTsMoveMenTs---Official-Corporation-from-EU-UNION-NATO-Pentagon-UN";

function LinkList({ items }: { items: Link[] }) {
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i.name}>
          <a
            href={i.url}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {i.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, kicker, children }: { title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-border pt-8">
      {kicker && (
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary">{kicker}</div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function LegalManifest() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm text-muted-foreground print:text-black">
      <div className="space-y-2 text-center">
        <div className="text-[10px] uppercase tracking-[0.35em] text-primary">
          Proprietary License & Project Manifest
        </div>
        <h2 className="text-2xl font-semibold text-foreground glow-text">
          All Rights Reserved Worldwide
        </h2>
        <p className="text-xs text-muted-foreground">
          Target Repository:{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            {REPO_URL}
          </a>
        </p>
      </div>

      <Section kicker="Copyright Notice" title="Proprietary License — All Rights Reserved">
        <p>
          Copyright © 2024–2026 <span className="text-foreground">Daniel Pohl</span>. All
          Rights Reserved Worldwide.
        </p>
        <p>
          This software, repository, and all associated documentation, algorithms, architecture
          designs, and intellectual property (collectively, <em>&ldquo;The Work&rdquo;</em>) are the
          exclusive property of Daniel Pohl and the following authorized corporate entities:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>STARLIGHTMOVEMENTS AG / StarLightMovemenTz Foundation</li>
          <li>HNOSS Enterprises</li>
          <li>PRISMANTHARION Corporation</li>
          <li>SHINEHEALTHCARE GmbH</li>
        </ul>
        <p>
          <strong className="text-foreground">No Rights Transferred.</strong> No rights are
          granted, transferred, or assigned by the publication, availability, or existence of this
          code. The presence of this code in any repository does not constitute an offer of
          license, partnership, or authorization for use by any third party.
        </p>
        <div>
          <div className="text-foreground">Restrictions:</div>
          <ol className="list-decimal space-y-1 pl-6">
            <li>No use — no person or entity may execute, run, or operate this code.</li>
            <li>No copy — no reproduction or duplication is permitted.</li>
            <li>No modification — no derivative works.</li>
            <li>No distribution — no redistribution, sharing, or publication.</li>
            <li>No cloning — repository cloning by unauthorized parties is prohibited.</li>
            <li>No reverse engineering — decompilation and disassembly strictly forbidden.</li>
          </ol>
        </div>
        <p>
          <strong className="text-foreground">Legal Status.</strong> This is a pilot project
          developed in collaboration with EU institutions, NATO, the Pentagon / U.S. Department of
          Defense, the United Nations, Deutsche Börse AG, and additional classified governmental
          and institutional partners.
        </p>
        <p>
          <strong className="text-foreground">Intellectual Property Protection.</strong> The Work
          is protected by International Copyright Law (Berne Convention), EU Copyright
          Directives, the U.S. Copyright Act of 1976, the German Urheberrechtsgesetz, patent law,
          trade secret law, and contract law.
        </p>
        <p>
          <strong className="text-foreground">Violations & Enforcement.</strong> Any unauthorized
          access, use, copying, cloning, or distribution constitutes copyright infringement, trade
          secret misappropriation, Computer Fraud and Abuse (18 U.S.C. § 1030), and Economic
          Espionage (18 U.S.C. § 1831). Violators will be prosecuted to the maximum extent of the
          law, including civil damages, criminal prosecution, referral to INTERPOL, and inclusion
          in government security watchlists.
        </p>
      </Section>

      <Section kicker="Giving 4th" title="Pledge & Initiative">
        <p>
          Our <em>Giving 4th</em> pledge is a deliberate extension of the U.S. Independence Day
          celebrations. We commit to using July 4th as an occasion for active civic engagement,
          supporting communities and causes of central importance to us.
        </p>
        <p>Documented pledge project and official pledge:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <a
              href="https://lnkd.in/eKsmMqz3"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn Pledge Project
            </a>
          </li>
          <li>
            <a
              href="https://lnkd.in/e2rHUgd2"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Official Pledge
            </a>
          </li>
          <li>
            <a
              href="https://america250.org"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              America250
            </a>{" "}
            ·{" "}
            <a
              href="https://lnkd.in/eCZuhXUE"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              America250 LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://lnkd.in/e4jZ3uuw"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Pledge Partner & Initiative
            </a>
          </li>
          <li>
            <a
              href="https://www.usa.gov/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              USA.gov
            </a>
          </li>
        </ul>
        <p className="italic">
          Giving 4th calls on all Americans to add something new to their July 4th celebrations:
          giving back to the causes and communities they care about.
        </p>
      </Section>

      <Section kicker="Gives-To" title="Global Stakeholders & Transmission Channels">
        <p>
          Official contact points for the pledge on 4 July 2026. Each entry is a direct docking
          interface between the Genesis Protocol architecture and the respective institution.
        </p>
        <LinkList items={givesTo} />
        <p>
          <a
            href="https://lnkd.in/enMi-UzM"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Ledger Wallet™ — Your assets. Your rules. Your future.
          </a>
        </p>
      </Section>

      <Section kicker="Appendix" title="Validated Official URLs & Anchors">
        <div>
          <div className="text-foreground">Corporate Entities</div>
          <p className="mt-1">
            For these entities the verified repository acts as the primary anchor and
            validation point of the architecture:{" "}
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              GitHub Repository
            </a>
            .
          </p>
        </div>
        <div>
          <div className="text-foreground">External Partners & Financial Services</div>
          <LinkList items={partnerFinance} />
        </div>
        <div>
          <div className="text-foreground">International Authorities & Organizations</div>
          <LinkList items={international} />
        </div>
        <div>
          <div className="text-foreground">U.S. Institutions, Justice & Civil Society</div>
          <LinkList items={usInstitutions} />
        </div>
        <div>
          <div className="text-foreground">German Federal Authorities & Justice</div>
          <LinkList items={germanFederal} />
        </div>
      </Section>

      <Section kicker="Signatories" title="Official Signatories & Partners">
        <p className="text-foreground">Big greetings from:</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {signatories.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="mt-6 border-t border-border pt-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
            Authorized Executive Signatory
          </div>
          <div className="mt-2 text-lg font-semibold text-foreground">A.d.L. ST. Daniel Pohl</div>
          <div className="text-xs text-muted-foreground">
            EU-UNION Expert · ID: EX2025D1218310 · Detmold, Germany
          </div>
        </div>
      </Section>
    </div>
  );
}

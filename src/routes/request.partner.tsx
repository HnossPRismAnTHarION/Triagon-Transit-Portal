import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RequestForm } from "@/components/request-form";

export const Route = createFileRoute("/request/partner")({
  component: PartnerRequest,
  head: () => ({ meta: [{ title: "Partner Request · Triagon Transit" }] }),
});

function PartnerRequest() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <RequestForm
          type="partner"
          title="Partner Request"
          subtitle="Submit a partner intake for the Instandsetzung log. All entries are queued for admin review."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
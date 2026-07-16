import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RequestForm } from "@/components/request-form";

export const Route = createFileRoute("/request/corporation")({
  component: CorporationRequest,
  head: () => ({ meta: [{ title: "Corporation Request · Triagon Transit" }] }),
});

function CorporationRequest() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <RequestForm
          type="corporation"
          title="Corporation Request"
          subtitle="Submit a corporate intake with tax / CRS reference. Approved corporations are copied into the operational log."
        />
      </main>
      <SiteFooter />
    </div>
  );
}
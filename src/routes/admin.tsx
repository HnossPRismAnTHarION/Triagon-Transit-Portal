import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin · Triagon Transit" }] }),
});

type RequestRow = {
  id: string;
  type: "user" | "partner" | "corporation";
  submitter_email: string;
  submitter_name: string | null;
  entity_name: string | null;
  tax_reference: string | null;
  project_name: string | null;
  message: string | null;
  links: string[];
  creative_metadata: Record<string, unknown>;
  status: "pending" | "verified" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
};

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [detail, setDetail] = useState<RequestRow | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sessionData.session.user.id);
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      setReady(true);
      if (admin) await refresh();
    })();
  }, [navigate]);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((data ?? []) as RequestRow[]);
  };

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (typeFilter === "all" || r.type === typeFilter) &&
          (statusFilter === "all" || r.status === statusFilter),
      ),
    [rows, typeFilter, statusFilter],
  );

  const setStatus = async (row: RequestRow, status: RequestRow["status"]) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("requests")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: sessionData.session?.user.id ?? null,
      })
      .eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (status === "approved" && (row.type === "partner" || row.type === "corporation")) {
      await supabase.from("approved_entities").insert({
        request_id: row.id,
        type: row.type,
        entity_name: row.entity_name,
        tax_reference: row.tax_reference,
        project_name: row.project_name,
        approved_by: sessionData.session?.user.id ?? null,
      });
    }
    toast.success(`Marked ${status}`);
    setDetail(null);
    await refresh();
  };

  if (!ready) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <main className="mx-auto max-w-xl px-4 py-24 text-center">
          <Card className="panel p-8">
            <h1 className="text-2xl font-semibold text-foreground">Access restricted</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This portal area is reserved for the authorized administrator.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground glow-text">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">
              Instandsetzung log — triage user, partner, and corporation requests.
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={refresh}>Refresh</Button>
          </div>
        </div>

        <Card className="panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Entity / Project</TableHead>
                <TableHead>Submitter</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No requests</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setDetail(r)}>
                  <TableCell className="capitalize">{r.type}</TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{r.entity_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.project_name ?? "—"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground">{r.submitter_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.submitter_email}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full max-w-lg overflow-y-auto sm:max-w-lg">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="capitalize">{detail.type} request</SheetTitle>
                <SheetDescription className="font-mono text-xs">{detail.id}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <Field label="Status"><StatusBadge status={detail.status} /></Field>
                <Field label="Submitter">
                  {detail.submitter_name ?? "—"}<br />
                  <span className="text-muted-foreground">{detail.submitter_email}</span>
                </Field>
                <Field label="Entity">{detail.entity_name ?? "—"}</Field>
                <Field label="Project">{detail.project_name ?? "—"}</Field>
                <Field label="Tax / CRS reference">{detail.tax_reference ?? "—"}</Field>
                <Field label="Message">
                  <div className="whitespace-pre-wrap text-muted-foreground">{detail.message ?? "—"}</div>
                </Field>
                {detail.links.length > 0 && (
                  <Field label="Links">
                    <ul className="space-y-1">
                      {detail.links.map((l) => (
                        <li key={l}><a className="text-primary hover:underline" href={l} target="_blank" rel="noreferrer">{l}</a></li>
                      ))}
                    </ul>
                  </Field>
                )}
                <Field label="Submitted">{new Date(detail.created_at).toLocaleString()}</Field>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setStatus(detail, "pending")}>Pending</Button>
                <Button variant="secondary" onClick={() => setStatus(detail, "verified")}>Verified</Button>
                <Button onClick={() => setStatus(detail, "approved")}>Approve</Button>
                <Button variant="destructive" onClick={() => setStatus(detail, "rejected")}>Reject</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-foreground">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestRow["status"] }) {
  const variant =
    status === "approved" ? "default" :
    status === "rejected" ? "destructive" :
    status === "verified" ? "secondary" : "outline";
  return <Badge variant={variant} className="capitalize">{status}</Badge>;
}
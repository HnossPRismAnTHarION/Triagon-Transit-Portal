import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const schema = z.object({
  submitter_name: z.string().trim().min(1).max(120),
  submitter_email: z.string().trim().email().max(255),
  entity_name: z.string().trim().min(1).max(200),
  tax_reference: z.string().trim().max(120).optional().or(z.literal("")),
  project_name: z.string().trim().min(1).max(200),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  links: z.string().trim().max(1000).optional().or(z.literal("")),
});

type Props = { type: "partner" | "corporation"; title: string; subtitle: string };

export function RequestForm({ type, title, subtitle }: Props) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [form, setForm] = useState({
    submitter_name: "",
    submitter_email: "",
    entity_name: "",
    tax_reference: "",
    project_name: "",
    message: "",
    links: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
      return;
    }
    setLoading(true);
    const links = (parsed.data.links || "")
      .split(/\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const { data, error } = await supabase
      .from("requests")
      .insert({
        type,
        submitter_name: parsed.data.submitter_name,
        submitter_email: parsed.data.submitter_email.toLowerCase(),
        entity_name: parsed.data.entity_name,
        tax_reference: parsed.data.tax_reference || null,
        project_name: parsed.data.project_name,
        message: parsed.data.message || null,
        links,
        creative_metadata: { source: "portal", submitted_at: new Date().toISOString() },
      })
      .select("id")
      .single();
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmitted(data.id);
    toast.success("Request received");
  };

  if (submitted) {
    return (
      <Card className="panel p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">Request received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reference ID: <span className="font-mono text-primary">{submitted}</span>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Your submission has been logged with a Creative Manifest and queued for admin review.
        </p>
      </Card>
    );
  }

  return (
    <Card className="panel p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-foreground glow-text">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Contact name" required>
          <Input value={form.submitter_name} onChange={update("submitter_name")} required />
        </Field>
        <Field label="E-mail" required>
          <Input type="email" value={form.submitter_email} onChange={update("submitter_email")} required />
        </Field>
        <Field label={type === "corporation" ? "Corporation / Entity" : "Partner organisation"} required>
          <Input value={form.entity_name} onChange={update("entity_name")} required />
        </Field>
        <Field label="Tax / CRS reference">
          <Input value={form.tax_reference} onChange={update("tax_reference")} placeholder="Optional — CRS, tax ID" />
        </Field>
        <Field label="Official project name" required className="md:col-span-2">
          <Input value={form.project_name} onChange={update("project_name")} required />
        </Field>
        <Field label="Message / purpose" className="md:col-span-2">
          <Textarea rows={5} value={form.message} onChange={update("message")} />
        </Field>
        <Field label="Links (space-separated)" className="md:col-span-2">
          <Input value={form.links} onChange={update("links")} placeholder="https://…" />
        </Field>
        <div className="md:col-span-2">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Submitting…" : "Submit request"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={"space-y-2 " + className}>
      <Label>
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}
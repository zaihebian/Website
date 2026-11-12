"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { deleteLeadAndEvents, getLead, updateLead } from "@/lib/adminQueries";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/behaviorEvents";

/**
 * Admin writes happen through form posts. Basic Auth is attached by the browser
 * automatically, so a cross-site form could otherwise mutate data: require the
 * Origin header to match this host (Playwright and curl send none).
 */
async function assertSameOrigin() {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (!origin) return;

  const host = headerList.get("host");
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new Error("Blocked: invalid Origin");
  }
  if (!host || originHost !== host) {
    throw new Error("Blocked: cross-origin admin action");
  }
}

function parseStatus(value: FormDataEntryValue | null): LeadStatus {
  const status = String(value ?? "");
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
    throw new Error("Unknown lead status");
  }
  return status as LeadStatus;
}

function parseLeadId(value: FormDataEntryValue | null) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid lead id");
  return id;
}

export async function updateLeadAction(formData: FormData) {
  await assertSameOrigin();
  const id = parseLeadId(formData.get("id"));
  const status = parseStatus(formData.get("status"));
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 4000) || null;

  await updateLead(id, { status, notes });
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLeadAction(formData: FormData) {
  await assertSameOrigin();
  const id = parseLeadId(formData.get("id"));
  const lead = await getLead(id);
  if (lead) await deleteLeadAndEvents(lead);

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  redirect(`/admin?deleted=${id}`);
}

type MauticContact = {
  email: string;
  name?: string;
  company?: string;
};

type MauticBehaviorSummary = {
  maxScrollDepth?: number;
  clickedTargets?: string[];
  viewedSections?: string[];
  hasQuery?: boolean;
  utmSource?: string | null;
  siteSource?: string;
};

type MauticContactResponse = {
  contact?: {
    id?: number | string;
  };
  contacts?: Record<string, { id?: number | string }>;
};

export function isMauticApiConfigured() {
  return Boolean(process.env.MAUTIC_BASE_URL && process.env.MAUTIC_USERNAME && process.env.MAUTIC_PASSWORD);
}

export async function syncBehaviorToMautic(contact: MauticContact, summary: MauticBehaviorSummary) {
  if (!isMauticApiConfigured() || !contact.email) return;

  const contactId = await upsertContact(contact, summary);
  if (!contactId) return;

  const points = calculatePoints(summary);
  if (points > 0) {
    await addPoints(contactId, points, "LiqenTech website behavior");
  }
}

function calculatePoints(summary: MauticBehaviorSummary) {
  let points = 50;
  if ((summary.maxScrollDepth ?? 0) >= 50) points += 5;
  if ((summary.maxScrollDepth ?? 0) >= 75) points += 10;
  if (summary.clickedTargets?.some((target) => target.includes("consultation") || target.includes("cta"))) points += 15;
  if (summary.viewedSections?.includes("systems")) points += 10;
  if (summary.hasQuery) points += 10;
  return points;
}

function buildTags(summary: MauticBehaviorSummary) {
  const tags = ["liqentech-lead", "landing-form-submit", `site:${summary.siteSource ?? "liqentech"}`];

  if (summary.utmSource) tags.push(`utm-source:${summary.utmSource}`);
  if ((summary.maxScrollDepth ?? 0) >= 75) tags.push("high-scroll-depth");
  if (summary.clickedTargets?.some((target) => target.includes("consultation") || target.includes("cta"))) {
    tags.push("clicked-consultation-cta");
  }
  if (summary.viewedSections?.includes("systems")) tags.push("viewed-systems");
  if (summary.hasQuery) tags.push("described-query");

  return tags;
}

async function upsertContact(contact: MauticContact, summary: MauticBehaviorSummary) {
  const existingId = await findContactIdByEmail(contact.email);
  const [firstname, ...rest] = (contact.name ?? "").trim().split(/\s+/);
  const fields = {
    email: contact.email,
    firstname: firstname || undefined,
    lastname: rest.join(" ") || undefined,
    company: contact.company || undefined,
    tags: buildTags(summary),
  };

  const path = existingId ? `/api/contacts/${existingId}/edit` : "/api/contacts/new";
  const method = existingId ? "PATCH" : "POST";
  const response = await mauticFetch<MauticContactResponse>(path, {
    method,
    body: new URLSearchParams(flattenFields(fields)),
  });

  return existingId ?? response.contact?.id;
}

async function findContactIdByEmail(email: string) {
  const data = await mauticFetch<MauticContactResponse>(`/api/contacts?search=${encodeURIComponent(`email:${email}`)}`);
  const contacts = data.contacts ?? {};
  return Object.values(contacts)[0]?.id ?? null;
}

async function addPoints(contactId: string | number, points: number, eventName: string) {
  await mauticFetch(`/api/contacts/${contactId}/points/plus/${points}`, {
    method: "POST",
    body: new URLSearchParams({ eventName }),
  });
}

async function mauticFetch<T>(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.MAUTIC_BASE_URL?.replace(/\/$/, "");
  const username = process.env.MAUTIC_USERNAME ?? "";
  const password = process.env.MAUTIC_PASSWORD ?? "";
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Mautic API failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as T;
}

function flattenFields(fields: Record<string, string | string[] | undefined>) {
  const params: Record<string, string> = {};
  Object.entries(fields).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        params[`${key}[${index}]`] = item;
      });
      return;
    }
    if (value) params[key] = value;
  });
  return params;
}

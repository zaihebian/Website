type MauticContact = {
  email: string;
  name?: string;
  company?: string;
};

type MauticBehaviorSummary = {
  maxScrollDepth?: number;
  clickedTargets?: string[];
  viewedSections?: string[];
  hasMessage?: boolean;
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

export async function updateTrackedMauticContact(
  contactId: string | null | undefined,
  contact: MauticContact,
  summary: MauticBehaviorSummary = {},
) {
  if (!isMauticApiConfigured() || !contact.email) return null;

  const resolvedContactId = contactId || (await findContactIdByEmail(contact.email));

  const [firstname, ...rest] = (contact.name ?? "").trim().split(/\s+/);
  const response = await mauticFetch<MauticContactResponse>(
    resolvedContactId ? `/api/contacts/${encodeURIComponent(resolvedContactId)}/edit` : "/api/contacts/new",
    {
      method: resolvedContactId ? "PATCH" : "POST",
      body: new URLSearchParams(
        flattenFields({
          email: contact.email,
          firstname: firstname || undefined,
          lastname: rest.join(" ") || undefined,
          company: contact.company || undefined,
          tags: buildTags(summary),
        }),
      ),
    },
  );

  const finalContactId = response.contact?.id ?? resolvedContactId;
  const points = calculatePoints(summary);
  if (finalContactId && points > 0) {
    await addPoints(finalContactId, points, "LiqenTech website lead behavior");
  }

  return finalContactId;
}

function calculatePoints(summary: MauticBehaviorSummary) {
  let points = 50;
  if ((summary.maxScrollDepth ?? 0) >= 50) points += 5;
  if ((summary.maxScrollDepth ?? 0) >= 75) points += 10;
  if ((summary.maxScrollDepth ?? 0) >= 100) points += 5;
  if (summary.clickedTargets?.some(isHighIntentTarget)) points += 15;
  if (summary.viewedSections?.some((section) => ["systems", "why-us", "contact"].includes(section))) points += 10;
  if (summary.hasMessage) points += 10;
  return points;
}

function buildTags(summary: MauticBehaviorSummary) {
  const tags = ["site:liqentech", "liqentech-lead", "landing-form-submit"];

  if ((summary.maxScrollDepth ?? 0) >= 75) tags.push("high-scroll-depth");
  if (summary.clickedTargets?.some(isHighIntentTarget)) tags.push("clicked-consultation-cta");
  if (summary.viewedSections?.includes("systems")) tags.push("viewed-systems");
  if (summary.viewedSections?.includes("why-us")) tags.push("viewed-why-us");
  if (summary.hasMessage) tags.push("submitted-message");

  return tags;
}

function isHighIntentTarget(target: string) {
  return target.includes("cta") || target.includes("consultation") || target.includes("contact");
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

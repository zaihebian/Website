import { buildTags, calculatePoints, flattenFields, type MauticBehaviorSummary } from "@/lib/leadScore";

type MauticContact = {
  email: string;
  name?: string;
  company?: string;
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

const DEFAULT_MAUTIC_TIMEOUT_MS = 5000;

function mauticTimeoutMs() {
  const configured = Number(process.env.MAUTIC_TIMEOUT_MS ?? DEFAULT_MAUTIC_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_MAUTIC_TIMEOUT_MS;
}

async function mauticFetch<T>(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.MAUTIC_BASE_URL?.replace(/\/$/, "");
  const username = process.env.MAUTIC_USERNAME ?? "";
  const password = process.env.MAUTIC_PASSWORD ?? "";
  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const timeoutMs = mauticTimeoutMs();

  // The lead submission awaits this chain (find -> create/edit -> points), so an
  // unresponsive Mautic must not hold the request open. Bounded per call keeps the
  // worst case (3 calls) under the 20s client timeout.
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        ...init.headers,
      },
      cache: "no-store",
      signal: init.signal ?? AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new Error(`Mautic request timed out after ${timeoutMs}ms: ${path}`);
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Mautic API failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as T;
}

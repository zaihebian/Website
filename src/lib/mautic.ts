type MauticContact = {
  email: string;
  name?: string;
  company?: string;
};

type MauticContactResponse = {
  contact?: {
    id?: number | string;
  };
};

export function isMauticApiConfigured() {
  return Boolean(process.env.MAUTIC_BASE_URL && process.env.MAUTIC_USERNAME && process.env.MAUTIC_PASSWORD);
}

export async function updateTrackedMauticContact(contactId: string | null | undefined, contact: MauticContact) {
  if (!isMauticApiConfigured() || !contactId || !contact.email) return null;

  const [firstname, ...rest] = (contact.name ?? "").trim().split(/\s+/);
  const response = await mauticFetch<MauticContactResponse>(`/api/contacts/${encodeURIComponent(contactId)}/edit`, {
    method: "PATCH",
    body: new URLSearchParams(
      flattenFields({
        email: contact.email,
        firstname: firstname || undefined,
        lastname: rest.join(" ") || undefined,
        company: contact.company || undefined,
        tags: ["site:liqentech", "liqentech-lead", "landing-form-submit"],
      }),
    ),
  });

  return response.contact?.id ?? contactId;
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

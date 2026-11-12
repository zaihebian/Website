/**
 * Single source of truth for the site identity. Preview deployments can point
 * NEXT_PUBLIC_SITE_URL at their own domain so canonical/OG tags do not claim to be
 * production. NEXT_PUBLIC_* is inlined at build time, so a change needs a rebuild.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://liqentech.com").replace(/\/$/, "");
export const SITE_SOURCE = "liqentech";
export const CONTACT_EMAIL = "ken.shao@liqentech.com";
export const CAREERS_EMAIL = "careers@liqentech.com";
export const CONTACT_PHONE = "+353892665691";
export const CONTACT_PHONE_LABEL = "+353 89 266 5691";

/** Bump when the marketing copy changes; used as sitemap lastModified. */
export const CONTENT_UPDATED_AT = "2026-11-12";

"use client";

import { useEffect, useRef } from "react";
import { readDelivery, type BehaviorDelivery } from "@/lib/delivery";
import { SITE_SOURCE } from "@/lib/site";
import { readStoredJson } from "@/lib/storage";

type EventPayload = {
  type: string;
  section?: string;
  target?: string;
  value?: string | number | boolean;
  metadata?: Record<string, unknown>;
  contact?: {
    email?: string;
    name?: string;
    company?: string;
    query?: string;
  };
};

type BehaviorEvent = ReturnType<typeof buildEvent>;

// The delivery contract and the storage helpers live in lib/ so they can be
// unit-tested without a browser (tests/unit/delivery.test.ts, storage.test.ts).
export type { BehaviorDelivery };

const DELIVERY_TIMEOUT_MS = 20_000;

type UtmParams = {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  term?: string | null;
  content?: string | null;
};

declare global {
  interface Window {
    mt?: (...args: unknown[]) => void;
  }
}

const STORAGE_PREFIX = "liqentech";

function getStoredId(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `${prefix}_${crypto.randomUUID()}`;
  window.localStorage.setItem(key, next);
  return next;
}

function readUtmParams(): UtmParams {
  const params = new URLSearchParams(window.location.search);
  const current: UtmParams = {
    source: params.get("utm_source"),
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    term: params.get("utm_term"),
    content: params.get("utm_content"),
  };

  const hasCurrentUtm = Object.values(current).some(Boolean);
  if (hasCurrentUtm) {
    window.localStorage.setItem(`${STORAGE_PREFIX}_utm`, JSON.stringify(current));
    return current;
  }

  const stored = window.localStorage.getItem(`${STORAGE_PREFIX}_utm`);
  if (!stored) return { source: SITE_SOURCE };

  try {
    return { source: SITE_SOURCE, ...(JSON.parse(stored) as UtmParams) };
  } catch {
    return { source: SITE_SOURCE };
  }
}

function buildEvent(payload: EventPayload, visitorId?: string | null, sessionId?: string | null) {
  return {
    ...payload,
    visitorId,
    sessionId,
    pageUrl: window.location.href,
    pagePath: window.location.pathname,
    referrer: document.referrer,
    mauticContactId: window.localStorage.getItem("mtc_id"),
    mauticDeviceId: window.localStorage.getItem("mautic_device_id"),
    utm: readUtmParams(),
    metadata: {
      siteSource: SITE_SOURCE,
      ...payload.metadata,
    },
  };
}

async function sendBehavior(event: BehaviorEvent, useBeacon = false): Promise<BehaviorDelivery> {
  if (useBeacon && navigator.sendBeacon) {
    const queued = navigator.sendBeacon("/api/behavior-events", JSON.stringify(event));
    return { ok: queued, status: 0, stored: queued, error: queued ? undefined : "beacon rejected" };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);

  try {
    const response = await fetch("/api/behavior-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
      signal: controller.signal,
    });
    return await readDelivery(response);
  } catch (error) {
    // Network failure or the timeout above: report it rather than swallowing it.
    // A caller that submits a lead must not mistake this for a delivered lead.
    return {
      ok: false,
      status: 0,
      stored: false,
      error: error instanceof Error && error.name === "AbortError" ? "timeout" : "network error",
    };
  } finally {
    window.clearTimeout(timer);
  }
}

function sendMauticEvent(payload: EventPayload) {
  if (!window.mt) return;

  window.mt("send", "event", {
    eventCategory: "liqentech_website",
    eventAction: payload.type,
    eventLabel: payload.target ?? payload.section ?? String(payload.value ?? ""),
  });
}

const SESSION_TTL_MS = 30 * 60 * 1000;

function touchSession(now = Date.now()) {
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}_session_seen`, String(now));
  } catch {
    /* storage can be unavailable in hardened browsers */
  }
}

/**
 * A session groups everything a visitor does until 30 minutes of inactivity.
 * It lives in sessionStorage so client-side navigations reuse it (each tracker
 * mount used to mint a fresh id, which inflated the "sessions" metric).
 */
function getSessionId() {
  const now = Date.now();
  try {
    const existing = window.sessionStorage.getItem(`${STORAGE_PREFIX}_session_id`);
    const lastSeen = Number(window.sessionStorage.getItem(`${STORAGE_PREFIX}_session_seen`) ?? 0);
    if (existing && now - lastSeen < SESSION_TTL_MS) {
      touchSession(now);
      return existing;
    }
    const next = `session_${crypto.randomUUID()}`;
    window.sessionStorage.setItem(`${STORAGE_PREFIX}_session_id`, next);
    touchSession(now);
    return next;
  } catch {
    return `session_${crypto.randomUUID()}`;
  }
}

export function VisitorTracker() {
  const visitorId = useRef<string | null>(null);
  const sessionId = useRef<string | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    visitorId.current = getStoredId(`${STORAGE_PREFIX}_visitor_id`, "visitor");
    sessionId.current = getSessionId();

    const send = (payload: EventPayload, useBeacon = false) => {
      const event = buildEvent(payload, visitorId.current, sessionId.current);
      sendBehavior(event, useBeacon);
    };

    send({
      type: "page_view",
      metadata: {
        language: document.documentElement.lang,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      },
    });

    const scrollMilestones = new Set<number>();
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const depth = Math.round((window.scrollY / maxScroll) * 100);
      [25, 50, 75, 100].forEach((milestone) => {
        if (depth >= milestone && !scrollMilestones.has(milestone)) {
          scrollMilestones.add(milestone);
          window.localStorage.setItem(`${STORAGE_PREFIX}_max_scroll_depth`, String(milestone));
          send({ type: "scroll_depth", value: milestone });
        }
      });
    };

    const visibleSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target.getAttribute("data-track-section");
          // 0.45 was unreachable for sections taller than the viewport on phones,
          // which silently dropped their section_view events.
          const enough = entry.intersectionRatio >= 0.15;
          if (entry.isIntersecting && enough && section && !visibleSections.has(section)) {
            visibleSections.add(section);
            window.localStorage.setItem(`${STORAGE_PREFIX}_viewed_sections`, JSON.stringify([...visibleSections]));
            send({ type: "section_view", section });
          }
        });
      },
      { threshold: [0.15, 0.3, 0.5], rootMargin: "0px 0px -8% 0px" },
    );

    document.querySelectorAll("[data-track-section]").forEach((section) => observer.observe(section));

    const clickHandler = (event: MouseEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-track-click]");
      if (!target) return;

      const clicked = JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}_clicked_targets`) ?? "[]") as string[];
      if (target.dataset.trackClick && !clicked.includes(target.dataset.trackClick)) {
        window.localStorage.setItem(`${STORAGE_PREFIX}_clicked_targets`, JSON.stringify([...clicked, target.dataset.trackClick]));
      }

      const payload = {
        type: "click",
        target: target.dataset.trackClick,
        section: target.closest("[data-track-section]")?.getAttribute("data-track-section") ?? undefined,
      };

      send(payload);
      sendMauticEvent(payload);
    };

    // beforeunload does not fire reliably on mobile Safari/Chrome iOS, so time on
    // page is flushed from pagehide and visibilitychange instead (beacon transport).
    // One flush per hide/leave cycle keeps the metric from being counted twice.
    let timeFlushed = false;
    const flushTimeOnPage = () => {
      if (timeFlushed) return;
      timeFlushed = true;
      touchSession();
      send(
        {
          type: "time_on_page",
          value: Math.round((Date.now() - startedAt.current) / 1000),
        },
        true,
      );
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushTimeOnPage();
        return;
      }
      timeFlushed = false;
      touchSession();
    };
    const onPageHide = () => flushTimeOnPage();

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", clickHandler);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", clickHandler);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return null;
}

export async function trackBehavior(payload: EventPayload): Promise<BehaviorDelivery> {
  const visitorId = window.localStorage.getItem(`${STORAGE_PREFIX}_visitor_id`);
  const event = buildEvent(payload, visitorId, null);
  sendMauticEvent(payload);
  return sendBehavior(event);
}

export function getBehaviorSnapshot() {
  const maxScrollDepth = Number(window.localStorage.getItem(`${STORAGE_PREFIX}_max_scroll_depth`) ?? "0");
  return {
    maxScrollDepth: Number.isFinite(maxScrollDepth) ? maxScrollDepth : 0,
    clickedTargets: readStoredJson<string[]>(window.localStorage, `${STORAGE_PREFIX}_clicked_targets`, []),
    viewedSections: readStoredJson<string[]>(window.localStorage, `${STORAGE_PREFIX}_viewed_sections`, []),
  };
}

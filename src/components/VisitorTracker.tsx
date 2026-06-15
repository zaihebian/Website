"use client";

import { useEffect, useRef } from "react";

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

const SITE_SOURCE = "liqentech";
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
    utm: readUtmParams(),
    metadata: {
      siteSource: SITE_SOURCE,
      ...payload.metadata,
    },
  };
}

function sendBehavior(event: ReturnType<typeof buildEvent>, useBeacon = false) {
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon("/api/behavior-events", JSON.stringify(event));
    return;
  }

  fetch("/api/behavior-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => undefined);
}

function sendMauticEvent(payload: EventPayload) {
  if (!window.mt) return;

  window.mt("send", "event", {
    eventCategory: "liqentech_website",
    eventAction: payload.type,
    eventLabel: payload.target ?? payload.section ?? String(payload.value ?? ""),
  });
}

export function VisitorTracker() {
  const visitorId = useRef<string | null>(null);
  const sessionId = useRef<string | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    visitorId.current = getStoredId(`${STORAGE_PREFIX}_visitor_id`, "visitor");
    sessionId.current = `session_${crypto.randomUUID()}`;

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
          if (entry.isIntersecting && section && !visibleSections.has(section)) {
            visibleSections.add(section);
            window.localStorage.setItem(`${STORAGE_PREFIX}_viewed_sections`, JSON.stringify([...visibleSections]));
            send({ type: "section_view", section });
          }
        });
      },
      { threshold: 0.45 },
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

    const beforeUnload = () => {
      send(
        {
          type: "time_on_page",
          value: Math.round((Date.now() - startedAt.current) / 1000),
        },
        true,
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", clickHandler);
    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", clickHandler);
      window.removeEventListener("beforeunload", beforeUnload);
      observer.disconnect();
    };
  }, []);

  return null;
}

export function trackBehavior(payload: EventPayload) {
  const visitorId = window.localStorage.getItem(`${STORAGE_PREFIX}_visitor_id`);
  const event = buildEvent(payload, visitorId, null);
  sendBehavior(event);
  sendMauticEvent(payload);
}

export function getBehaviorSnapshot() {
  return {
    maxScrollDepth: Number(window.localStorage.getItem(`${STORAGE_PREFIX}_max_scroll_depth`) ?? "0"),
    clickedTargets: JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}_clicked_targets`) ?? "[]") as string[],
    viewedSections: JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}_viewed_sections`) ?? "[]") as string[],
  };
}

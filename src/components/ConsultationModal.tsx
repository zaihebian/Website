"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { getBehaviorSnapshot, trackBehavior } from "@/components/VisitorTracker";
import { CONTACT_EMAIL } from "@/lib/site";

type ConsultationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SUBMIT_FAILURE_MESSAGE = `We couldn't send your request, so nothing was saved. Please try again, or email us at ${CONTACT_EMAIL}.`;

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const submissionIdRef = useRef<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    // Remember who opened the dialog, then move focus into it synchronously.
    // A delayed focus (setTimeout) could steal the caret from whatever the
    // visitor started typing into — automated input was landing in the wrong
    // field because of it.
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const target = dialogRef.current?.querySelector<HTMLElement>('input[name="name"]') ?? dialogRef.current;
    target?.focus({ preventScroll: true });

    return () => {
      // Closing returns focus to the trigger so keyboard users are not dropped at
      // the top of the document.
      if (triggerRef.current && document.contains(triggerRef.current)) triggerRef.current.focus();
      triggerRef.current = null;
    };
  }, [isOpen]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]',
      ) ?? [],
    ).filter((element) => element.tabIndex >= 0);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    // Clear a stale error from a previous attempt when the modal is reopened.
    // A new open also starts a new submission id, while retries reuse it so the
    // server can recognise the retry as the same enquiry.
    if (isOpen && !wasOpenRef.current) {
      setSubmitError(null);
      submissionIdRef.current = crypto.randomUUID();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    void trackBehavior({ type: "form_start", section: "consultation", target: "consultation-modal" });
  };

  const waitForMauticContactSync = (contact: {
    email: string;
    firstname?: string;
    lastname?: string;
    company?: string;
  }) =>
    new Promise<void>((resolve) => {
      try {
        window.mt?.("send", "pageview", contact);
        window.mt?.("send", "event", {
          eventCategory: "liqentech_website",
          eventAction: "form_submit",
          eventLabel: "consultation-modal",
        });
      } catch (error) {
        // A broken Mautic tracker must not abort the lead capture itself.
        console.error("[consultation] Mautic tracking call failed", error);
      }
      window.setTimeout(resolve, 1200);
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const form = new FormData(e.currentTarget);
      const name = String(form.get("name") ?? "");
      const email = String(form.get("email") ?? "");
      const company = String(form.get("company") ?? "");
      const query = String(form.get("query") ?? "").trim();
      const honeypot = String(form.get("liqentech_verify_check") ?? "").trim();
      const snapshot = getBehaviorSnapshot();
      const [firstname, ...lastnameParts] = name.trim().split(/\s+/);

      await waitForMauticContactSync({
        email,
        firstname,
        lastname: lastnameParts.join(" ") || undefined,
        company,
      });

      const delivery = await trackBehavior({
        type: "form_submit",
        section: "consultation",
        target: "consultation-modal",
        metadata: {
          ...snapshot,
          hasQuery: Boolean(query),
          submissionId: submissionIdRef.current ?? crypto.randomUUID(),
          honeypot,
        },
        contact: {
          email,
          name,
          company,
          query,
        },
      });

      if (!delivery.ok) {
        // The enquiry reached no backend. Never send the visitor to /success
        // here: keep the modal (and every typed value) so they can retry.
        console.error("[consultation] submission was not stored", {
          status: delivery.status,
          error: delivery.error,
        });
        setSubmitError(SUBMIT_FAILURE_MESSAGE);
        return;
      }

      router.push("/success");
      onClose();
    } catch (error) {
      console.error("[consultation] unexpected submission error", error);
      setSubmitError(SUBMIT_FAILURE_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0d11]/45 backdrop-blur-md p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={dialogRef}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl p-6 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="consultation-title" className="text-xl font-semibold tracking-tight text-[var(--ink)]">
                  Book a consultation
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-dim)]">
                  Discover how AI can help your business operate faster, smarter, and more efficiently.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-[var(--ink-dim)] transition hover:bg-[rgba(10,13,17,0.06)] hover:text-[var(--ink)]"
                aria-label="Close"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSubmit} onFocus={markStarted} className="space-y-4">
              {/* Honeypot: hidden from users, filled by naive bots. */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
              >
                <label htmlFor="consult-company-website">Verification</label>
                <input
                  id="consult-company-website"
                  name="liqentech_verify_check"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="consult-name" className="text-sm font-medium text-[var(--ink)]">
                  Name
                </label>
                <input id="consult-name" name="name" type="text" required className="field" placeholder="Your name" autoComplete="name" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="consult-email" className="text-sm font-medium text-[var(--ink)]">
                  Email
                </label>
                <input id="consult-email" name="email" type="email" required className="field" placeholder="you@company.com" autoComplete="email" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="consult-company" className="text-sm font-medium text-[var(--ink)]">
                  Company name
                </label>
                <input id="consult-company" name="company" type="text" required className="field" placeholder="Your company" autoComplete="organization" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="consult-query" className="text-sm font-medium text-[var(--ink)]">
                  Query
                </label>
                <textarea id="consult-query" name="query" rows={4} required className="field resize-none" placeholder="What would you like to automate?" />
              </div>
              {submitError && (
                <div
                  role="alert"
                  data-testid="consultation-error"
                  className="rounded-2xl border border-[rgba(178,52,52,0.32)] bg-[rgba(214,74,74,0.08)] p-3 text-sm leading-relaxed text-[rgba(122,28,28,0.95)]"
                >
                  <p>{submitError}</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Consultation%20request`}
                    className="mt-1 inline-block underline underline-offset-2 hover:text-[var(--ink)]"
                  >
                    Email us instead
                  </a>
                </div>
              )}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {submitting ? "Sending" : submitError ? "Try again" : "Send request"}
                </button>
                <p className="mt-3 text-center text-xs leading-relaxed text-[var(--ink-faint)]">
                  We use your details only to reply to this enquiry. See our{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--ink)]">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

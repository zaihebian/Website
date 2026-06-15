"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { getBehaviorSnapshot, trackBehavior } from "@/components/VisitorTracker";

type ConsultationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const reduceMotion = useReducedMotion();

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
    trackBehavior({ type: "form_start", section: "consultation", target: "consultation-modal" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const company = String(form.get("company") ?? "");
    const query = String(form.get("query") ?? "").trim();
    const snapshot = getBehaviorSnapshot();

    window.mt?.("send", "pageview", {
      email,
      firstname: name,
      company,
      source: "liqentech",
      website: "liqentech.com",
    });

    trackBehavior({
      type: "form_submit",
      section: "consultation",
      target: "consultation-modal",
      metadata: {
        ...snapshot,
        hasQuery: Boolean(query),
      },
      contact: {
        email,
        name,
        company,
        query,
      },
    });

    router.push("/success");
    onClose();
    setSubmitting(false);
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl p-6 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-title"
            onClick={(e) => e.stopPropagation()}
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
                className="rounded-full p-2 text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)]"
                aria-label="Close"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSubmit} onFocus={markStarted} className="space-y-4">
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
              <div className="pt-2">
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                  {submitting ? "Sending" : "Send request"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

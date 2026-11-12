"use client";

import { useConsultation } from "@/components/ConsultationProvider";

type ConsultationCtaProps = {
  label?: string;
  className?: string;
  tracking?: string;
};

/**
 * Opens the shared consultation modal from any page. Kept as its own client
 * component so server-rendered pages can offer the CTA without becoming client
 * components themselves.
 */
export default function ConsultationCta({
  label = "Book a consultation",
  className = "btn-primary",
  tracking,
}: ConsultationCtaProps) {
  const { openConsultation } = useConsultation();

  return (
    <button type="button" onClick={openConsultation} className={className} data-track-click={tracking}>
      {label}
    </button>
  );
}

"use client";

import { createContext, useCallback, useContext, useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";

type ConsultationContextValue = {
  openConsultation: () => void;
};

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error("useConsultation must be used within ConsultationProvider");
  return ctx;
}

export default function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openConsultation = useCallback(() => setOpen(true), []);
  const closeConsultation = useCallback(() => setOpen(false), []);

  return (
    <ConsultationContext.Provider value={{ openConsultation }}>
      {/* The page behind the dialog is inert while it is open, so keyboard and
          assistive tech cannot wander into the background. */}
      <div inert={open}>{children}</div>
      <ConsultationModal isOpen={open} onClose={closeConsultation} />
    </ConsultationContext.Provider>
  );
}

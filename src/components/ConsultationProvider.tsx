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

  return (
    <ConsultationContext.Provider value={{ openConsultation }}>
      {children}
      <ConsultationModal isOpen={open} onClose={() => setOpen(false)} />
    </ConsultationContext.Provider>
  );
}

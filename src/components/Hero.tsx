"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useConsultation } from "@/components/ConsultationProvider";

export default function Hero() {
  const { openConsultation } = useConsultation();
  const reduceMotion = useReducedMotion();

  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 32, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="home" className="relative flex min-h-[100dvh] items-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07090c]/80 via-[#07090c]/30 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6">
        <div className="max-w-3xl">
          <motion.h1
            {...enter(0.1)}
            className="text-5xl font-semibold leading-[1.02] tracking-tighter text-[var(--ink)] sm:text-6xl lg:text-7xl"
          >
            Stop repeating work.
            <br />
            Start scaling.
          </motion.h1>
          <motion.p {...enter(0.25)} className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-dim)]">
            AI-powered systems that automate operations, generate leads, organize knowledge, and eliminate bottlenecks.
          </motion.p>
          <motion.div {...enter(0.4)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={openConsultation} className="btn-primary">
              Book a consultation
            </button>
            <a href="#systems" className="btn-secondary">
              See the systems
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

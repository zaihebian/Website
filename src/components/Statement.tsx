"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.94, 1, 1.04]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80dvh] items-center justify-center px-4 sm:px-6"
      data-track-section="statement"
    >
      <motion.div
        style={reduceMotion ? undefined : { opacity, scale }}
        className="mx-auto max-w-4xl text-center"
      >
        <h2 className="text-4xl font-semibold tracking-tighter text-[var(--ink)] sm:text-6xl lg:text-7xl">
          Work less.
          <br />
          <span className="text-[var(--accent)]">Scale more.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[var(--ink-dim)]">
          Built for businesses that want to move faster with fewer people.
        </p>
      </motion.div>
    </section>
  );
}

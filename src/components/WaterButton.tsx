"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { asLink?: string };

export default function WaterButton({ children, asLink, onMouseMove, ...rest }: Props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
    onMouseMove?.(e);
  };
  const btn = (
    <button ref={ref} onMouseMove={handleMove} className="water-btn" {...rest}>
      {children}
    </button>
  );
  return asLink ? <a href={asLink}>{btn}</a> : btn;
}

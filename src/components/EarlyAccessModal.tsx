"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

type EarlyAccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EarlyAccessModal({ isOpen, onClose }: EarlyAccessModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optional: const data = new FormData(e.currentTarget); send to API
    router.push("/success");
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#0c0c14] border border-cyan-500/30 shadow-xl shadow-cyan-500/10 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Get early access</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="early-name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              id="early-name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="early-email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="early-email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="early-company" className="block text-sm font-medium text-gray-300 mb-1">
              Company name
            </label>
            <input
              id="early-company"
              name="company"
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              placeholder="Your company"
            />
          </div>
          <div>
            <label htmlFor="early-query" className="block text-sm font-medium text-gray-300 mb-1">
              Query
            </label>
            <textarea
              id="early-query"
              name="query"
              rows={4}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none"
              placeholder="How can we help?"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-full transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 border border-gray-500 rounded-full text-gray-300 hover:border-cyan-400 hover:text-white font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

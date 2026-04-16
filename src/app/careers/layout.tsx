import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join LiqenTech to build AI products, SaaS systems, and growth technology for modern teams. Explore remote opportunities in engineering, AI, and digital marketing.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at LiqenTech",
    description:
      "Explore open roles at LiqenTech across frontend engineering, AI engineering, and growth marketing.",
    url: "https://liqentech.com/careers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at LiqenTech",
    description:
      "Explore open roles at LiqenTech across frontend engineering, AI engineering, and growth marketing.",
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

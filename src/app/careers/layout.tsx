import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Two open roles at LiqenTech: an AI automation engineer building multi-agent systems in Microsoft Copilot Studio, and an Oracle engineer for development and administration. Five years or more in each.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at LiqenTech",
    description:
      "Two open roles: AI automation engineering in Microsoft Copilot Studio, and Oracle development and administration.",
    url: `${SITE_URL}/careers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at LiqenTech",
    description:
      "Two open roles: AI automation engineering in Microsoft Copilot Studio, and Oracle development and administration.",
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liqentech | Software Solutions and Development Services",
  description: "Liqentech builds custom software, digital systems, and data solutions for modern businesses. We blend AI, software craftsmanship, digital marketing, and international business consulting.",
  keywords: ["software development", "custom software", "AI solutions", "digital systems", "data solutions", "software consulting", "digital marketing", "business consulting"],
  authors: [{ name: "Liqentech" }],
  creator: "Liqentech",
  publisher: "Liqentech",
  openGraph: {
    title: "Liqentech | Software Solutions and Development Services",
    description: "Liqentech builds custom software, digital systems, and data solutions for modern businesses. We blend AI, software craftsmanship, digital marketing, and international business consulting.",
    type: "website",
    locale: "en_US",
    siteName: "Liqentech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liqentech | Software Solutions and Development Services",
    description: "Liqentech builds custom software, digital systems, and data solutions for modern businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

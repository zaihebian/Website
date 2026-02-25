import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiqenTech · AI SaaS for Growing Companies",
  description: "LiqenTech builds powerful, user-first SaaS tools that help small and medium businesses scale faster. AI-powered assistants, marketing, sales, and business intelligence.",
  keywords: ["software development", "custom software", "AI solutions", "digital systems", "data solutions", "software consulting", "digital marketing", "business consulting"],
  authors: [{ name: "Liqentech" }],
  creator: "Liqentech",
  publisher: "Liqentech",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Liqentech | Software Solutions and Development Services",
    description: "Liqentech builds custom software, digital systems, and data solutions for modern businesses. We blend AI, software craftsmanship, digital marketing, and international business consulting.",
    type: "website",
    url: "https://liqentech.com",
    siteName: "Liqentech",
    locale: "en_US",
    images: [
      {
        url: "https://liqentech.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Liqentech - Software Solutions and Development Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liqentech | Software Solutions and Development Services",
    description: "Liqentech builds custom software, digital systems, and data solutions for modern businesses.",
    images: ["https://liqentech.com/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL("https://liqentech.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Liqentech",
    "url": "https://liqentech.com",
    "logo": "https://liqentech.com/logo.png",
    "description": "Liqentech builds custom software, digital systems, and data solutions for modern businesses. We blend AI, software craftsmanship, digital marketing, and international business consulting.",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "availableLanguage": "English"
    },
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Liqentech Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Integration",
            "description": "Deploy practical AI agents, LLMs, and automation into your stack."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Software Development",
            "description": "Robust, maintainable web and platform engineering."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Marketing",
            "description": "Acquisition with data-backed execution."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "International Business Consulting",
            "description": "Market entry and ops across regions."
          }
        }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

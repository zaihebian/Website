import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://liqentech.com";
const siteName = "LiqenTech";
const defaultTitle = "LiqenTech | AI SaaS and Intelligent Automation for SMB Growth";
const defaultDescription =
  "LiqenTech builds AI-powered SaaS products for growing companies: virtual reception, sales intelligence, workflow automation, and growth systems for SMB teams.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | LiqenTech",
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "AI SaaS",
    "AI automation for SMB",
    "workflow automation",
    "AI receptionist",
    "sales intelligence",
    "software development",
    "custom software",
    "digital systems",
    "data solutions",
    "software consulting",
    "digital marketing",
    "business consulting",
    "AEO",
    "GEO",
  ],
  authors: [{ name: "Liqentech" }],
  creator: "Liqentech",
  publisher: "Liqentech",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  icons: {
    icon: [
      { url: "/Asset/LiqenTech-Circle-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/Asset/LiqenTech-Circle-logo.png", sizes: "192x192", type: "image/png" },
      { url: "/Asset/LiqenTech-Circle-logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/Asset/LiqenTech-Circle-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    url: siteUrl,
    siteName: "Liqentech",
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/Asset/LiqenTech-logo-new.png`,
        width: 1200,
        height: 630,
        alt: "LiqenTech - AI SaaS and Intelligent Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/Asset/LiqenTech-logo-new.png`],
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
  category: "technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Liqentech",
    url: siteUrl,
    logo: `${siteUrl}/Asset/LiqenTech-logo-new.png`,
    description: defaultDescription,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      email: "contact@liqentech.com",
      availableLanguage: ["English"],
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Liqentech Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Integration",
            description: "Deploy practical AI agents, LLMs, and automation into your stack.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Software Development",
            description: "Robust, maintainable web and platform engineering.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Digital Marketing",
            description: "Acquisition with data-backed execution.",
          },
        },
      ],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={siteUrl} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

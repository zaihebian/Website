import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const siteUrl = "https://liqentech.com";
const siteName = "LiqenTech";
const defaultTitle = "LiqenTech | AI Systems That Automate Operations and Scale Businesses";
const defaultDescription =
  "LiqenTech builds AI-powered systems that automate operations, generate leads, organize knowledge, and eliminate bottlenecks. Built for businesses that want to move faster with fewer people.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | LiqenTech",
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "AI automation",
    "business automation",
    "workflow automation",
    "lead generation automation",
    "marketing automation",
    "AI knowledge hub",
    "private AI deployment",
    "system integration",
    "AI consulting",
    "business solutions powered by AI",
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
        alt: "LiqenTech - Business Solutions Powered by AI",
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
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
      telephone: "+353892665691",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Athlone",
      addressCountry: "IE",
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
            name: "Operations Automation",
            description: "Replace repetitive tasks with intelligent workflows, from customer onboarding to internal processes.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Lead Generation Automation",
            description: "Automate lead capture, qualification, follow-up, and pipeline management.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Private AI Deployment",
            description: "Run powerful AI solutions on your own infrastructure with full control, privacy, and security.",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;
              w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
              m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
              })(window,document,'script','/api/mautic/mtc.js','mt');

              mt('send', 'pageview');
            `,
          }}
        />
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

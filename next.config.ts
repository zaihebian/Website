import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not advertise the framework version.
  poweredByHeader: false,
  // Short, guessable URLs from the landing pages and shared links land on the
  // real solution pages instead of the 404.
  async redirects() {
    return [
      { source: "/operations", destination: "/solutions/operations", permanent: true },
      { source: "/customer-journey", destination: "/solutions/customer-journey", permanent: true },
      { source: "/lead-capture", destination: "/solutions/lead-capture", permanent: true },
      { source: "/marketing-automation", destination: "/solutions/customer-journey", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

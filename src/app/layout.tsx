import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiqenTech — Flowing Innovation",
  description: "AI integration, software development, digital marketing, and international business consulting.",
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

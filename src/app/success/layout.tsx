import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enquiry Submitted",
  description: "Thank you for contacting LiqenTech. Your enquiry has been received successfully.",
  alternates: {
    canonical: "/success",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}

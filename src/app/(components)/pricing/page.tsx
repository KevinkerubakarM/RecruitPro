import type { Metadata } from "next";
import Header from "../common/Header";
import Pricing from "./Pricing";

export const metadata: Metadata = {
  title: "Pricing Plans - RecrutPro Recruitment Solutions",
  description:
    "Choose the perfect RecrutPro pricing plan for your company. From Recruiter Pro for small teams to Teams Pro for enterprises. Flexible plans with unlimited candidates, AI-powered screening, and advanced features.",
  keywords: [
    "recruitment pricing",
    "hiring software cost",
    "ATS pricing",
    "recruitment platform plans",
    "hiring tool pricing",
    "recruitment software pricing",
  ],
  openGraph: {
    title: "RecrutPro Pricing - Plans for Every Company Size",
    description:
      "Flexible pricing plans from small teams to enterprises. Get unlimited candidates, AI screening, and advanced recruitment tools.",
    type: "website",
    url: "/pricing",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Pricing />
    </div>
  );
}

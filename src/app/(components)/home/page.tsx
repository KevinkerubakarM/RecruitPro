import type { Metadata } from "next";
import Header from "../common/Header";
import HeroSection from "./HeroSection";
import TrustedBy from "./TrustedBy";
import Features from "./Features";
import Stats from "./Stats";
import CTASection from "./CTASection";
import Footer from "../common/Footer";

export const metadata: Metadata = {
  title: "AI-Powered Recruitment Platform - Hire Top Talent 10x Faster",
  description:
    "RecruitPro connects recruiters with pre-screened, verified candidates using AI-powered matching. Reduce time-to-hire from weeks to days. Join 500+ companies hiring smarter today.",
  openGraph: {
    title: "RecruitPro - AI-Powered Recruitment Platform",
    description:
      "Hire top talent 10x faster with AI-powered candidate matching. 95% match accuracy. 50K+ successful hires.",
    type: "website",
    url: "/home",
  },
  alternates: {
    canonical: "/home",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RecruitPro",
    description:
      "AI-powered recruitment platform connecting recruiters with top talent 10x faster",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://recrutpro.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://recrutpro.com"
        }/candidate/searchJob?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    provider: {
      "@type": "Organization",
      name: "RecruitPro",
      logo: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://recrutpro.com"
      }/logo.png`,
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RecruitPro",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://recrutpro.com",
    logo: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://recrutpro.com"
    }/logo.png`,
    description:
      "AI-powered recruitment platform transforming the hiring process",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@recrutpro.com",
    },
    sameAs: [
      "https://twitter.com/RecruitPro",
      "https://linkedin.com/company/RecruitPro",
      "https://facebook.com/RecruitPro",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          <TrustedBy />
          <Features />
          <Stats />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}

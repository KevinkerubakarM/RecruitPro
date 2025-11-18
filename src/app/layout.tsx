import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://recrutpro.com"),
  title: {
    default: "JobHunt - AI-Powered Job Matching Platform | Find Top Talent 10x Faster",
    template: "%s | JobHunt",
  },
  description:
    "Transform your hiring process with JobHunt's AI-powered platform. Connect recruiters with pre-screened candidates 10x faster. Join 500+ companies hiring top talent today.",
  keywords: [
    "job board",
    "recruitment platform",
    "AI hiring",
    "talent acquisition",
    "job search",
    "career opportunities",
    "candidate matching",
    "recruitment software",
    "hiring platform",
    "job portal",
    "employment platform",
    "talent marketplace",
  ],
  authors: [{ name: "JobHunt" }],
  creator: "JobHunt",
  publisher: "JobHunt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "JobHunt",
    title: "JobHunt - AI-Powered Job Matching Platform | Find Top Talent 10x Faster",
    description:
      "Transform your hiring process with JobHunt's AI-powered platform. Connect recruiters with pre-screened candidates 10x faster.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JobHunt - AI-Powered Job Matching Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobHunt - AI-Powered Job Matching Platform",
    description:
      "Transform your hiring process with AI. Connect recruiters with pre-screened candidates 10x faster.",
    images: ["/twitter-image.jpg"],
    creator: "@jobhunt",
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
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}

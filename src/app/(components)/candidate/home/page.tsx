import { Metadata } from "next";
import CandidateHomeClient from "./CandidateHomeClient";

export const metadata: Metadata = {
  title: "Candidate Dashboard - Track Your Job Search Progress",
  description:
    "Manage your job applications, track interview progress, and discover new career opportunities. View your application statistics and stay organized in your job search.",
  keywords: [
    "candidate dashboard",
    "job search dashboard",
    "application tracker",
    "job applications",
    "career dashboard",
    "interview tracking",
    "job seeker portal",
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Candidate Dashboard - Track Your Job Search",
    description: "Manage your job applications and track your career progress",
    type: "website",
  },
};

export default function CandidateHomePage() {
  return <CandidateHomeClient />;
}

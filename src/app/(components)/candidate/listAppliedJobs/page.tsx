import { Metadata } from "next";
import ListAppliedJobsClient from "./ListAppliedJobsClient";

export const metadata: Metadata = {
  title: "My Job Applications - Track Your Application Status",
  description:
    "Track and manage all your job applications in one place. View application status, filter by stages, and stay updated on your job search progress.",
  keywords: [
    "job applications",
    "application tracking",
    "job status",
    "application history",
    "job search tracker",
    "interview status",
    "application management",
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "My Job Applications - Track Your Application Status",
    description: "Track and manage all your job applications",
    type: "website",
  },
};

export default function ListAppliedJobsPage() {
  return <ListAppliedJobsClient />;
}

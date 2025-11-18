import type { Metadata } from "next";
import JobPageContainer from "./JobPageContainer";

export const metadata: Metadata = {
  title: "Job Opening - Apply Now | RecrutPro",
  description:
    "View job details, requirements, responsibilities, and benefits. Apply now to join our team and advance your career.",
  openGraph: {
    title: "Job Opening - Apply Now",
    description: "View job details and apply to join our team.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JobPage() {
  return <JobPageContainer />;
}

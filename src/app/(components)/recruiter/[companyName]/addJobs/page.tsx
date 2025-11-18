import { Metadata } from "next";
import AddJobPage from "./AddJobs";

export const metadata: Metadata = {
  title: "Post a New Job - Create Job Listing | RecrutPro",
  description:
    "Create and publish job postings on RecrutPro. Add job details, requirements, salary information, and benefits to attract the best candidates for your company.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddJobsPage() {
  return <AddJobPage />;
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import JobPreview from "@/app/(components)/recruiter/[companyName]/addJobs/JobPreview";

function JobContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <article className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h1>
          <p className="text-gray-600">Job ID is missing from the URL.</p>
        </article>
      </div>
    );
  }

  return <JobPreview jobId={jobId} isRecruiterView={false} />;
}

export default function JobPageContainer() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600" role="status" aria-live="polite">
            Loading job details...
          </div>
        </div>
      }
    >
      <JobContent />
    </Suspense>
  );
}

"use client";

import { JobListProps } from "@/types/app/(components)/candidate/jobcard.type";
import JobCard from "./JobCard";

export default function JobList({ jobs, isLoading, emptyMessage = "No jobs found" }: JobListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading jobs">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl shadow-xl p-8 animate-pulse border-2 border-indigo-100"
          >
            <div className="flex items-start gap-5 mb-5">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-indigo-100 rounded w-3/4" />
                <div className="h-4 bg-indigo-50 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-indigo-50 rounded w-full" />
              <div className="h-4 bg-indigo-50 rounded w-5/6" />
              <div className="h-4 bg-indigo-50 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-xl border-2 border-indigo-100">
        <svg
          className="mx-auto h-16 w-16 text-indigo-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs available</h3>
        <p className="text-gray-600 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list" aria-label="Job listings">
      {jobs.map((job) => (
        <div key={job.id} role="listitem">
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
}

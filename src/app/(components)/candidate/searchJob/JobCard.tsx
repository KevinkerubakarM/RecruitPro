"use client";

import { JobCardProps } from "@/types/app/(components)/candidate/jobcard.type";
import { formatSalary, formatJobType, timeAgo, truncateText } from "@/lib/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobCard({ job, onJobClick }: JobCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onJobClick) {
      onJobClick(job.id);
    }

    // Redirect to job details page
    if (job.companyBranding?.companySlug) {
      router.push(`/careers/${job.companyBranding.companySlug}/job?jobId=${job.id}`);
    }
  };

  return (
    <article
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300
                 border-2 border-indigo-100 hover:border-indigo-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View details for ${job.title} at ${job.companyBranding?.companyName}`}
    >
      <div className="p-8">
        {/* Header with company logo and info */}
        <div className="flex items-start gap-5 mb-5">
          {job.companyBranding?.logoUrl && (
            <div className="flex-shrink-0">
              <img
                src={job.companyBranding.logoUrl}
                alt={`${job.companyBranding.companyName} logo`}
                className="w-20 h-20 rounded-2xl object-contain border-2 border-indigo-100 shadow-md"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3
              className="text-2xl font-extrabold text-gray-900 group-hover:text-indigo-600 
                           transition-colors mb-2 truncate"
            >
              {job.title}
            </h3>
            {job.companyBranding && (
              <Link
                href={`/careers/${job.companyBranding.companySlug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-lg font-bold text-gray-700 hover:text-indigo-600 hover:underline
                           inline-block"
              >
                {job.companyBranding.companyName}
              </Link>
            )}
          </div>
        </div>

        {/* Job details */}
        <dl className="space-y-4 mb-5">
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-700 font-medium">
            <div className="flex items-center gap-1">
              <dt className="sr-only">Location</dt>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <dd>{job.location}</dd>
            </div>
            <div className="flex items-center gap-1">
              <dt className="sr-only">Job type</dt>
              <svg
                className="h-4 w-4"
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
              <dd>{formatJobType(job.jobType)}</dd>
            </div>
            {job.employmentType && (
              <div className="flex items-center gap-1">
                <dt className="sr-only">Employment type</dt>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <dd>{formatJobType(job.employmentType)}</dd>
              </div>
            )}
            {job.department && (
              <div className="flex items-center gap-1">
                <dt className="sr-only">Department</dt>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <dd>{job.department}</dd>
              </div>
            )}
            <div className="flex items-center gap-1">
              <dt className="sr-only">Posted date</dt>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <dd>
                <time
                  dateTime={
                    typeof job.postedAt === "string" ? job.postedAt : job.postedAt.toISOString()
                  }
                >
                  {timeAgo(new Date(job.postedAt))}
                </time>
              </dd>
            </div>
          </div>

          {/* Salary */}
          {(job.salaryMin || job.salaryMax) && (
            <div>
              <dt className="sr-only">Salary</dt>
              <dd className="text-xl font-extrabold text-green-600">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </dd>
            </div>
          )}
        </dl>

        {/* Description preview */}
        <p className="text-gray-700 text-base leading-relaxed mb-5 font-medium">
          {truncateText(job.description || "", 200)}
        </p>

        {/* Skills/Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-5">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-bold 
                           rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-full shadow-sm">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t-2 border-indigo-100">
          <span className="text-sm text-gray-600 uppercase tracking-wider font-bold">
            {formatJobType(job.experienceLevel)}
          </span>
          <span
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                       rounded-xl font-bold text-sm shadow-md group-hover:shadow-lg 
                       group-hover:from-indigo-700 group-hover:to-purple-700 
                       transition-all flex items-center gap-2"
            aria-label={`View full details for ${job.title}`}
          >
            View Details
            <svg
              className="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

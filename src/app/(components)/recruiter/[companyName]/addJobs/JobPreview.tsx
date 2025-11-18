"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JobPreviewProps } from "@/types/app/(components)/recruiter/addJobs.type";
import { formatSalary, getAuthHeaders, getUserData } from "@/lib/helper";
import { JOB_TYPES, EXPERIENCE_LEVELS, API_ROUTES } from "@/lib/constants";
import { useToast } from "@/app/(components)/common/useToast";
import AuthWrapper from "@/app/(components)/common/AuthWrapper";

export default function JobPreview({ jobId, isRecruiterView = true }: JobPreviewProps) {
  const router = useRouter();
  const { success, error: showError, ToastContainer } = useToast();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ROUTES.JOB_BY_ID(jobId), {
          headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (result.success && result.data) {
          setJob(result.data);
        } else {
          setError(result.error?.message || "Failed to load job");
          showError(result.error?.message || "Failed to load job");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("An error occurred while loading the job");
        showError("An error occurred while loading the job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleClose = () => {
    router.back();
  };

  const handlePublish = async () => {
    if (!job || !job.companyBranding?.companySlug) {
      showError("Unable to publish: Company information is missing");
      return;
    }

    setPublishing(true);
    try {
      // Job is already created in draft state, just navigate to home
      success("Job posted successfully!");
      setTimeout(() => {
        router.push(`/recruiter/${job.companyBranding.companySlug}/home`);
      }, 1500);
    } catch (err) {
      console.error("Error publishing job:", err);
      showError("An error occurred while publishing the job");
      setPublishing(false);
    }
  };

  const handleApply = async () => {
    if (hasApplied) {
      showError("You have already applied for this job");
      return;
    }

    setApplying(true);
    try {
      // Check if user is logged in
      const user = getUserData();
      if (!user) {
        showError("Please login to apply for this job");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidatePhone: user.phone || null,
          coverLetter: null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setHasApplied(true);
        success("Application submitted successfully!");

        if (result.data.candidateProfileUrl) {
          setTimeout(() => {
            showError(
              `Your profile has been shared: ${window.location.origin}${result.data.candidateProfileUrl}`
            );
          }, 2000);
        }
      } else {
        if (result.error?.code === "DUPLICATE_APPLICATION") {
          setHasApplied(true);
        }
        showError(result.error?.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
      showError("An error occurred while submitting your application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    const content = (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading preview...</div>
      </div>
    );

    return isRecruiterView ? (
      <AuthWrapper requiredRole="RECRUITER">{content}</AuthWrapper>
    ) : (
      content
    );
  }

  if (error || !job) {
    const content = (
      <>
        <ToastContainer />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Job not found"}</p>
            {isRecruiterView && (
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Back to Editor
              </button>
            )}
          </div>
        </div>
      </>
    );

    return isRecruiterView ? (
      <AuthWrapper requiredRole="RECRUITER">{content}</AuthWrapper>
    ) : (
      content
    );
  }

  const jobTypeLabel = JOB_TYPES[job.jobType as keyof typeof JOB_TYPES] || job.jobType;
  const experienceLevelLabel =
    EXPERIENCE_LEVELS[job.experienceLevel as keyof typeof EXPERIENCE_LEVELS] || job.experienceLevel;

  const salaryDisplay = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  // Use the correct job viewing URL and application URL
  const companySlug = job.companyBranding?.companySlug || "";
  const jobViewUrl = `/careers/${companySlug}/job?jobId=${job.id}`;
  const applyUrl = job.applicationUrl || jobViewUrl;

  const mainContent = (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Job Posting Preview */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
              <div className="mb-4">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {job.companyBranding?.companyName || "Company"}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{jobTypeLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>{experienceLevelLabel}</span>
                </div>
              </div>
              {salaryDisplay !== "Salary not specified" && (
                <div className="mt-4 text-lg font-semibold">{salaryDisplay}</div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-8">
              {/* Description */}
              {job.description && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              )}

              {/* Technical Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Requirements</h2>
                <ul className="space-y-2">
                  {job.technicalRequirements
                    .filter((req: string) => req.trim())
                    .map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Soft Skills */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Soft Skills</h2>
                <ul className="space-y-2">
                  {job.softSkills
                    .filter((skill: string) => skill.trim())
                    .map((skill: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{skill}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities
                    .filter((resp: string) => resp.trim())
                    .map((resp: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Benefits */}
              {job.benefits.filter((b: string) => b.trim()).length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits
                      .filter((benefit: string) => benefit.trim())
                      .map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Contact Information */}
              {job.contactEmail && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-gray-700">
                    Questions? Reach out to us at{" "}
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {job.contactEmail}
                    </a>
                  </p>
                </div>
              )}

              {/* Career Page */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Page</h2>
                <p className="text-gray-700 mb-3">
                  View all open positions and learn more about our company culture:
                </p>
                <a
                  href={`/careers/${companySlug}`}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Visit {job.companyBranding?.companyName || "Our"} Career Page
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Apply Button */}
              <div className="pt-6 border-t">
                <button
                  type="button"
                  onClick={!isRecruiterView ? handleApply : undefined}
                  disabled={!isRecruiterView && (applying || hasApplied)}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                    !isRecruiterView && hasApplied
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : !isRecruiterView && applying
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  } ${!isRecruiterView ? "cursor-pointer" : "cursor-default"}`}
                >
                  {!isRecruiterView
                    ? hasApplied
                      ? "Applied ✓"
                      : applying
                      ? "Submitting..."
                      : "Apply for this Position"
                    : "Apply for this Position"}
                </button>
                {isRecruiterView && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Clicking this button will take candidates to the application page
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Auto-generated URLs Section - Only show in recruiter mode */}
          {isRecruiterView && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Auto-Generated Links</h2>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Application URL:</h3>
                  <code className="block bg-gray-50 px-4 py-3 rounded-lg text-sm text-gray-800 break-all border border-gray-200">
                    {applyUrl}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return isRecruiterView ? (
    <AuthWrapper requiredRole="RECRUITER">{mainContent}</AuthWrapper>
  ) : (
    <AuthWrapper>{mainContent}</AuthWrapper>
  );
}

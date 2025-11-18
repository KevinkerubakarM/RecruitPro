"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { storage, STORAGE_KEYS, getAuthHeaders } from "@/lib/helper";
import { JobFormData } from "@/types/app/(components)/recruiter/addJobs.type";
import { validateSalaryRange } from "@/validators/app/(components)/recruiter/addJobs.validator";
import { API_ROUTES, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";
import JobPreview from "./JobPreview";
import AuthWrapper from "@/app/(components)/common/AuthWrapper";
import { useToast } from "@/app/(components)/common/useToast";
import Header from "@/app/(components)/common/Header";

export default function AddJobPage() {
  const params = useParams();
  const router = useRouter();
  const companyName = params.companyName as string;
  const { success, error, ToastContainer } = useToast();

  // Get jobId from URL query params for edit mode
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Get query params on client side
    const searchParams = new URLSearchParams(window.location.search);
    const jobId = searchParams.get("edit");
    setEditJobId(jobId);
    setIsEditMode(!!jobId);
  }, []);

  const [userData, setUserData] = useState<any>(null);
  const [companyBrandingId, setCompanyBrandingId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewJobId, setPreviewJobId] = useState<string | null>(null);

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    location: "",
    jobType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    description: "",
    technicalRequirements: [""],
    softSkills: [""],
    responsibilities: [""],
    benefits: [""],
    salaryMin: undefined,
    salaryMax: undefined,
    salaryCurrency: "USD",
    contactEmail: "",
    expiresAt: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initializePage = async () => {
      const user = storage.get(STORAGE_KEYS.USER_DATA);

      if (!user || user.role !== "RECRUITER") {
        router.push("/login");
        return;
      }

      setUserData(user);

      // Fetch company branding by recruiter ID to get branding ID
      const targetSlug = decodeURIComponent(companyName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      try {
        const response = await fetch(API_ROUTES.RECRUITER.BRANDING, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (result.success && result.data) {
          const brandings = Array.isArray(result.data) ? result.data : [result.data];
          // Match by exact slug OR slug that starts with targetSlug (handles suffixes)
          const targetBranding = brandings.find(
            (b: any) => b.companySlug === targetSlug || b.companySlug.startsWith(targetSlug + "-")
          );

          if (targetBranding) {
            setCompanyBrandingId(targetBranding.id);
          } else {
            error("Career page not found. Please create it first.");
          }
        } else {
          error("Failed to load company branding. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching company branding:", err);
        error("An error occurred while loading company information.");
      }

      // If in edit mode, fetch existing job data
      if (editJobId) {
        try {
          const jobResponse = await fetch(API_ROUTES.JOB_BY_ID(editJobId), {
            headers: getAuthHeaders(),
          });
          const jobResult = await jobResponse.json();

          if (jobResult.success && jobResult.data) {
            const jobData = jobResult.data;
            setFormData({
              title: jobData.title || "",
              location: jobData.location || "",
              jobType: jobData.jobType || "FULL_TIME",
              experienceLevel: jobData.experienceLevel || "MID_LEVEL",
              description: jobData.description || "",
              technicalRequirements:
                jobData.technicalRequirements?.length > 0 ? jobData.technicalRequirements : [""],
              softSkills: jobData.softSkills?.length > 0 ? jobData.softSkills : [""],
              responsibilities:
                jobData.responsibilities?.length > 0 ? jobData.responsibilities : [""],
              benefits: jobData.benefits?.length > 0 ? jobData.benefits : [""],
              salaryMin: jobData.salaryMin || undefined,
              salaryMax: jobData.salaryMax || undefined,
              salaryCurrency: jobData.salaryCurrency || "USD",
              contactEmail: jobData.contactEmail || "",
              expiresAt: jobData.expiresAt ? new Date(jobData.expiresAt) : null,
            });
            // Set the company branding ID from the job data
            if (jobData.companyBrandingId) {
              setCompanyBrandingId(jobData.companyBrandingId);
            }
          } else {
            error("Failed to load job data for editing");
          }
        } catch (err) {
          console.error("Error fetching job for edit:", err);
          error("An error occurred while loading job data");
        }
      }

      setLoading(false);
    };

    initializePage();
  }, [companyName, router, editJobId]);

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleArrayChange = (
    field: "technicalRequirements" | "softSkills" | "responsibilities" | "benefits",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (
    field: "technicalRequirements" | "softSkills" | "responsibilities" | "benefits"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "technicalRequirements" | "softSkills" | "responsibilities" | "benefits",
    index: number
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = "Job title must be at least 3 characters";
    }

    if (!formData.location || formData.location.trim().length < 2) {
      newErrors.location = "Location is required";
    }

    const validTechReqs = formData.technicalRequirements.filter((r) => r.trim());
    if (validTechReqs.length === 0) {
      newErrors.technicalRequirements = "At least one technical requirement is required";
    }

    const validSoftSkills = formData.softSkills.filter((s) => s.trim());
    if (validSoftSkills.length === 0) {
      newErrors.softSkills = "At least one soft skill is required";
    }

    const validResponsibilities = formData.responsibilities.filter((r) => r.trim());
    if (validResponsibilities.length === 0) {
      newErrors.responsibilities = "At least one responsibility is required";
    }

    const salaryValidation = validateSalaryRange(formData.salaryMin, formData.salaryMax);
    if (!salaryValidation.success) {
      newErrors.salary = salaryValidation.error!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = async () => {
    if (!validateForm()) {
      error("Please fix the errors in the form");
      return;
    }

    if (!companyBrandingId) {
      error("Company branding not found. Please set up your company profile first.");
      return;
    }

    setSubmitting(true);

    try {
      // Generate or use existing job ID
      const jobId = isEditMode ? editJobId : previewJobId || crypto.randomUUID();

      const payload = {
        id: jobId,
        companyBrandingId,
        title: formData.title.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        description: formData.description?.trim() || undefined,
        technicalRequirements: formData.technicalRequirements.filter((r) => r.trim()),
        softSkills: formData.softSkills.filter((s) => s.trim()),
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        benefits: formData.benefits.filter((b) => b.trim()),
        salaryMin: formData.salaryMin || null,
        salaryMax: formData.salaryMax || null,
        salaryCurrency: formData.salaryCurrency,
        contactEmail: formData.contactEmail?.trim() || null,
        expiresAt: formData.expiresAt?.toISOString() || null,
        isActive: false, // Draft mode
      };

      const response = await fetch(API_ROUTES.JOBS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success && result.data?.id) {
        // Set preview job ID for subsequent updates
        setPreviewJobId(result.data.id);
        setShowPreview(true);
      } else {
        error(result.error?.message || "Failed to create preview");
      }
    } catch (err) {
      console.error("Error creating preview:", err);
      error("An error occurred while creating preview");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishJob = async () => {
    if (!validateForm()) {
      error("Please fix the errors in the form");
      return;
    }

    if (!companyBrandingId) {
      error("Company branding not found. Please set up your company profile first.");
      return;
    }

    setSubmitting(true);

    try {
      // Generate or use existing job ID
      const jobId = isEditMode ? editJobId : previewJobId || crypto.randomUUID();

      const payload = {
        id: jobId,
        companyBrandingId,
        title: formData.title.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        description: formData.description?.trim() || undefined,
        technicalRequirements: formData.technicalRequirements.filter((r) => r.trim()),
        softSkills: formData.softSkills.filter((s) => s.trim()),
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        benefits: formData.benefits.filter((b) => b.trim()),
        salaryMin: formData.salaryMin || null,
        salaryMax: formData.salaryMax || null,
        salaryCurrency: formData.salaryCurrency,
        contactEmail: formData.contactEmail?.trim() || null,
        expiresAt: formData.expiresAt?.toISOString() || null,
        isActive: true, // Publish as active
      };

      const response = await fetch(API_ROUTES.JOBS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success && result.data?.id) {
        // Show success message and navigate to recruiter home
        success(isEditMode ? "Job updated successfully!" : "Job published successfully!");
        setTimeout(() => {
          router.push(`/recruiter/home`);
        }, 1500);
      } else {
        error(
          result.error?.message || (isEditMode ? "Failed to update job" : "Failed to publish job")
        );
      }
    } catch (err) {
      console.error(isEditMode ? "Error updating job:" : "Error publishing job:", err);
      error(
        isEditMode
          ? "An error occurred while updating the job"
          : "An error occurred while publishing the job"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthWrapper requiredRole="RECRUITER">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-600" role="status" aria-live="polite">
            Loading job posting form...
          </div>
        </div>
      </AuthWrapper>
    );
  }

  // Show preview if preview mode is active
  if (showPreview && previewJobId) {
    return (
      <div className="relative">
        <JobPreview jobId={previewJobId} isRecruiterView={true} />
        {/* Add a custom back button overlay that closes preview */}
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={() => setShowPreview(false)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all font-semibold"
            aria-label="Back to editor"
          >
            ← Back to Editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper requiredRole="RECRUITER">
      <Header />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <article className="bg-white rounded-lg shadow-md p-8">
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? "Edit Job Posting" : "Post a New Job"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditMode ? "Update your job posting for" : "Create a job posting for"}{" "}
                {decodeURIComponent(companyName)}
              </p>
            </header>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-6"
              aria-label="Job posting form"
            >
              {/* Job Title */}
              <section aria-labelledby="job-title-label">
                <label
                  id="job-title-label"
                  htmlFor="job-title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Title *
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Senior Software Engineer"
                  aria-required="true"
                  aria-invalid={errors.title ? "true" : "false"}
                  aria-describedby={errors.title ? "job-title-error" : undefined}
                />
                {errors.title && (
                  <p id="job-title-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.title}
                  </p>
                )}
              </section>

              {/* Location and Job Type */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="job-location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location *
                  </label>
                  <input
                    id="job-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., San Francisco, CA"
                    aria-required="true"
                    aria-invalid={errors.location ? "true" : "false"}
                    aria-describedby={errors.location ? "job-location-error" : undefined}
                  />
                  {errors.location && (
                    <p id="job-location-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="job-type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Job Type *
                  </label>
                  <select
                    id="job-type"
                    value={formData.jobType}
                    onChange={(e) => handleInputChange("jobType", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    aria-required="true"
                  >
                    {Object.entries(JOB_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Experience Level */}
              <section>
                <label
                  htmlFor="experience-level"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Experience Level *
                </label>
                <select
                  id="experience-level"
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-required="true"
                >
                  {Object.entries(EXPERIENCE_LEVELS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </section>

              {/* Description */}
              <section>
                <label
                  htmlFor="job-description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  aria-label="Job description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief overview of the role..."
                />
              </section>

              {/* Technical Requirements */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Requirements *
                </label>
                {formData.technicalRequirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleArrayChange("technicalRequirements", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., 5+ years of React experience"
                    />
                    {formData.technicalRequirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("technicalRequirements", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("technicalRequirements")}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  + Add Technical Requirement
                </button>
                {errors.technicalRequirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.technicalRequirements}</p>
                )}
              </section>

              {/* Soft Skills */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soft Skills *
                </label>
                {formData.softSkills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange("softSkills", index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Strong communication skills"
                    />
                    {formData.softSkills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("softSkills", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("softSkills")}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  + Add Soft Skill
                </button>
                {errors.softSkills && (
                  <p className="mt-1 text-sm text-red-600">{errors.softSkills}</p>
                )}
              </section>

              {/* Responsibilities */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Responsibilities *
                </label>
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleArrayChange("responsibilities", index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Lead development of new features"
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("responsibilities", index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("responsibilities")}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  + Add Responsibility
                </button>
                {errors.responsibilities && (
                  <p className="mt-1 text-sm text-red-600">{errors.responsibilities}</p>
                )}
              </section>

              {/* Benefits (Optional) */}
              <section>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits (Optional)
                </label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Health insurance, 401k"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("benefits", index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("benefits")}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  + Add Benefit
                </button>
              </section>

              {/* Salary Range */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
                  <input
                    type="number"
                    value={formData.salaryMin || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "salaryMin",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
                  <input
                    type="number"
                    value={formData.salaryMax || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "salaryMax",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="80000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <input
                    type="text"
                    value={formData.salaryCurrency}
                    onChange={(e) => handleInputChange("salaryCurrency", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="USD"
                    maxLength={3}
                  />
                </div>
              </section>
              {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}

              {/* Contact Email */}
              <section>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Email (Optional)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="hiring@company.com"
                  aria-label="Contact email for job applications"
                />
              </section>

              {/* Action Buttons */}
              <footer className="flex gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Preview job posting"
                >
                  Preview Job
                </button>
                <button
                  type="button"
                  onClick={handlePublishJob}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  aria-label={
                    submitting
                      ? isEditMode
                        ? "Updating job"
                        : "Publishing job"
                      : isEditMode
                      ? "Update job posting"
                      : "Publish job posting"
                  }
                >
                  {submitting
                    ? isEditMode
                      ? "Updating..."
                      : "Publishing..."
                    : isEditMode
                    ? "Update Job"
                    : "Publish Job"}
                </button>
              </footer>
            </form>
          </article>
        </div>
      </div>
    </AuthWrapper>
  );
}

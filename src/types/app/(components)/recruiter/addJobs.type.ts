// Job form data for creating a new job posting
export interface JobFormData {
  title: string;
  location: string;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
  experienceLevel:
    | "ENTRY_LEVEL"
    | "JUNIOR"
    | "MID_LEVEL"
    | "SENIOR"
    | "LEAD"
    | "EXECUTIVE";
  description?: string;
  technicalRequirements: string[];
  softSkills: string[];
  responsibilities: string[];
  benefits: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  contactEmail?: string;
  expiresAt?: Date | null;
}

// Props for the AddJobs page component
export interface AddJobsPageProps {
  params: {
    companyName: string;
  };
}

// Job creation request
export interface CreateJobRequest {
  id?: string;
  isActive?: boolean;
  title: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  description?: string;
  technicalRequirements: string[];
  softSkills: string[];
  responsibilities: string[];
  benefits: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  contactEmail?: string;
  expiresAt?: string | null;
  companyBrandingId: string;
}

// Job creation response
export interface CreateJobResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    careerPageSlug: string;
    applicationUrl: string;
    isActive: boolean;
  };
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

// Job preview data
export interface JobPreviewData extends JobFormData {
  companyName: string;
  careerPageSlug?: string;
  applicationUrl?: string;
}

// Props for JobPreview component
export interface JobPreviewProps {
  jobId: string;
  isRecruiterView?: boolean;
}

// Props for input field management
export interface ArrayInputField {
  value: string;
  id: string;
}

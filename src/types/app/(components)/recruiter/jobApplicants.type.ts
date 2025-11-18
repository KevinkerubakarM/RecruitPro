// Job Applicant types
export interface JobApplicant {
    id: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone: string | null;
    candidateProfileUrl: string | null;
    resumeUrl: string | null;
    coverLetter: string | null;
    status: string;
    appliedAt: string;

    // Candidate profile information
    skills: string[];
    experience: number | null;
    location: string | null;
    isNewToExperience: boolean;
    yearsOfExperience: number | null;
    companies: string[];
    designations: string[];
    lookingForRoles: string[];
}

// Job information
export interface JobInfo {
    id: string;
    title: string;
    companyName: string;
    location: string;
}

// API Response types
export interface JobApplicantsResponse {
    success: boolean;
    data?: {
        job: JobInfo;
        applicants: JobApplicant[];
    };
    error?: {
        message: string;
        code: string;
    };
}

// Page props
export interface JobApplicantsPageProps {
    searchParams: {
        jobId?: string;
    };
}

// Table component props
export interface ApplicantsTableProps {
    applicants: JobApplicant[];
    loading: boolean;
    jobInfo: JobInfo | null;
}

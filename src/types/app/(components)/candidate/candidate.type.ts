// Job data types
export interface JobData {
    id: string
    companyBrandingId: string
    title: string
    description: string | null
    location: string
    jobType: string  // Changed from JobType enum to string for compatibility with Prisma
    experienceLevel: string  // Changed from ExperienceLevel enum to string for compatibility with Prisma
    employmentType: string
    department?: string | null
    salaryMin?: number | null
    salaryMax?: number | null
    salaryCurrency: string
    requirements: string[]
    responsibilities: string[]
    benefits: string[]
    skills: string[]
    applicationUrl?: string | null
    contactEmail?: string | null
    isActive: boolean
    postedAt: Date | string  // Allow both Date and string for serialization
    expiresAt?: Date | string | null
    createdAt: Date | string  // Allow both Date and string for serialization
    updatedAt: Date | string  // Allow both Date and string for serialization
    companyBranding?: CompanyBrandingBasic
}

export interface CompanyBrandingBasic {
    id: string
    companyName: string
    companySlug: string
    logoUrl?: string | null
    primaryColor: string
}

// Job filter types
export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
    REMOTE = 'REMOTE',
}

export enum ExperienceLevel {
    ENTRY_LEVEL = 'ENTRY_LEVEL',
    JUNIOR = 'JUNIOR',
    MID_LEVEL = 'MID_LEVEL',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
    EXECUTIVE = 'EXECUTIVE',
}

export interface JobFilters {
    location?: string
    jobType?: JobType[]
    experienceLevel?: ExperienceLevel[]
    search?: string
    sortBy?: string
}

export interface JobSearchParams {
    search?: string
    location?: string
    jobType?: string
    experienceLevel?: string
    employmentType?: string
    department?: string
    companyBrandingId?: string
    page?: number
    limit?: number
    sortBy?: string
}

// API Response types
export interface JobsResponse {
    success: boolean
    data?: {
        jobs: JobData[]
        total: number
        page: number
        limit: number
        totalPages: number
    }
    error?: {
        message: string
        code: string
    }
}

// Page props (Next.js 15+ - searchParams is a Promise)
export interface CandidatePageProps {
    searchParams: Promise<JobSearchParams>
}

// Company selection types
export interface CompanyOption {
    id: string;
    name: string;
    slug: string;
    isOwn: boolean;
    logoUrl?: string;
}

export interface CompanySelectionProps {
    companies: CompanyOption[];
    selectedCompanyId: string | null;
    onCompanySelect: (companyId: string) => void;
    onCreateNewCompany: () => void;
}

// Job listing types
export interface JobWithApplications {
    id: string;
    title: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    isActive: boolean;
    postedAt: string;
    expiresAt: string | null;
    applicationCount: number;
    companyName: string;
    companySlug: string;
    careerSlug: string;
}

export interface JobsTableProps {
    jobs: JobWithApplications[];
    loading: boolean;
    onEditJob: (jobId: string, companySlug: string) => void;
    onViewApplications: (jobId: string) => void;
    onToggleJobStatus: (jobId: string, currentStatus: boolean) => void;
}

// Filters types
export interface JobFilters {
    search: string;
    jobId: string;
    companyName: string;
    jobType: string;
    experienceLevel: string;
    isActive: string;
    dateFrom: string;
    dateTo: string;
    sortBy: string;
    page: number;
}

export interface FiltersPanelProps {
    filters: JobFilters;
    onFiltersChange: (filters: JobFilters) => void;
    onReset: () => void;
}

// Dashboard data response
export interface DashboardData {
    jobs: JobWithApplications[];
    stats: {
        totalJobs: number;
        activeJobs: number;
        totalApplications: number;
        recentApplications: number;
    };
}

export interface DashboardResponse {
    success: boolean;
    data?: DashboardData;
    error?: {
        message: string;
        code: string;
    };
}

// Page props
export interface RecruiterHomePageProps {
    // Props can be added if needed for server-side rendering
}

// Action types
export type CompanyAction = "edit" | "addJob";

export interface ActionButtonsProps {
    selectedCompanySlug: string | null;
    onEditCompany: () => void;
    onAddJob: () => void;
}// Stats card types
export interface StatsCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

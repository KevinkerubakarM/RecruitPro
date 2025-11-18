// Candidate home page statistics
export interface CandidateStats {
    totalApplications: number;
    activeApplications: number;
    interviewingCount: number;
    offersReceived: number;
}

// Individual application summary
export interface ApplicationSummary {
    id: string;
    jobTitle: string;
    companyName: string;
    status: string;
    appliedAt: string;
    location: string;
    jobType: string;
}

// API Response for candidate stats
export interface CandidateStatsResponse {
    success: boolean;
    data?: CandidateStats;
    error?: {
        message: string;
        code: string;
        details?: any;
    };
}

// Props for CandidateHome page component
export interface CandidateHomeProps { }

// Props for CTAButtons component
export interface CTAButtonsProps {
    onSearchJobs: () => void;
    onViewApplications: () => void;
}

// Props for StatsCards component
export interface StatsCardsProps {
    stats: CandidateStats;
    loading?: boolean;
}

// Individual stat card data
export interface StatCardData {
    title: string;
    value: number;
    subtitle?: string;
    gradient: string;
    textColor: string;
    accentColor: string;
    icon?: string;
}

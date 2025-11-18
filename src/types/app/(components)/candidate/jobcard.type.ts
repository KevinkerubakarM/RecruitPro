import { JobData } from './candidate.type'

// JobCard component props
export interface JobCardProps {
    job: JobData
    onJobClick?: (jobId: string) => void
}

// JobList component props
export interface JobListProps {
    jobs: JobData[]
    isLoading?: boolean
    emptyMessage?: string
}

// JobFilters component props
export interface JobFiltersProps {
    filters: {
        location: string
        jobType: string[]
        experienceLevel: string[]
    }
    onFilterChange: (filters: {
        location?: string
        jobType?: string[]
        experienceLevel?: string[]
    }) => void
    locations: string[]
    jobTypeCounts?: Record<string, number>
}

// JobSearch component props
export interface JobSearchProps {
    initialValue?: string
    onSearch: (query: string) => void
    placeholder?: string
}

// JobDetails component props
export interface JobDetailsProps {
    job: JobData
    onClose: () => void
    onApply?: (jobId: string) => void
}

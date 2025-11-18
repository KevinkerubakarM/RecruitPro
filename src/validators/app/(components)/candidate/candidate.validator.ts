import { z } from 'zod'
import { JobSearchParams } from '@/types/app/(components)/candidate/candidate.type'

// Job search query schema
const jobSearchParamsSchema = z.object({
    search: z.string().max(200).optional(),
    location: z.string().max(100).optional(),
    jobType: z.string().max(100).optional(),
    experienceLevel: z.string().max(100).optional(),
    companyBrandingId: z.string().cuid().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
})

export function validateJobSearchParams(data: unknown) {
    const result = jobSearchParamsSchema.safeParse(data)

    if (!result.success) {
        return {
            success: false as const,
            errors: result.error.flatten().fieldErrors,
        }
    }

    return {
        success: true as const,
        data: result.data as JobSearchParams,
    }
}

// Job type filter schema
const jobTypeFilterSchema = z.enum([
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP',
    'REMOTE',
])

export function validateJobType(jobType: string) {
    return jobTypeFilterSchema.safeParse(jobType).success
}

// Experience level filter schema
const experienceLevelFilterSchema = z.enum([
    'ENTRY_LEVEL',
    'JUNIOR',
    'MID_LEVEL',
    'SENIOR',
    'LEAD',
    'EXECUTIVE',
])

export function validateExperienceLevel(level: string) {
    return experienceLevelFilterSchema.safeParse(level).success
}

// Parse comma-separated filter values
export function parseFilterArray(value: string | undefined): string[] {
    if (!value) return []
    return value.split(',').map(v => v.trim()).filter(Boolean)
}

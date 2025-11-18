import { primsaService } from '@/services/prisma.service'
import { JobSearchParams } from '@/types/app/(components)/candidate/candidate.type'

// Get all active jobs with optional filters
export async function getJobs(params: JobSearchParams) {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        const {
            search,
            location,
            jobType,
            experienceLevel,
            companyBrandingId,
            page = 1,
            limit = 20,
        } = params

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        // Add company branding filter
        if (companyBrandingId) {
            // When filtering by specific company, don't require published status or active
            where.companyBrandingId = companyBrandingId
        } else {
            // For public job listings, only show active jobs from published companies
            where.isActive = true
        }

        // Add search filter (searches in title, description, skills)
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { skills: { has: search } },
            ]
        }

        // Add location filter
        if (location) {
            where.location = { contains: location, mode: 'insensitive' }
        }

        // Add job type filter
        if (jobType) {
            const types = jobType.split(',').filter(Boolean)
            if (types.length > 0) {
                where.jobType = { in: types }
            }
        }

        // Add experience level filter
        if (experienceLevel) {
            const levels = experienceLevel.split(',').filter(Boolean)
            if (levels.length > 0) {
                where.experienceLevel = { in: levels }
            }
        }

        // Fetch jobs with company branding info
        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                include: {
                    companyBranding: {
                        select: {
                            id: true,
                            companyName: true,
                            companySlug: true,
                            logoUrl: true,
                            primaryColor: true,
                        },
                    },
                },
                orderBy: {
                    postedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.job.count({ where }),
        ])

        return {
            jobs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    } catch (error) {
        console.error('Error fetching jobs:', error)
        throw error
    }
}

// Get job by ID
export async function getJobById(id: string) {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        return await prisma.job.findUnique({
            where: { id },
            include: {
                companyBranding: {
                    select: {
                        id: true,
                        companyName: true,
                        companySlug: true,
                        logoUrl: true,
                        primaryColor: true,
                        bannerUrl: true,
                    },
                },
            },
        })
    } catch (error) {
        console.error('Error fetching job by ID:', error)
        throw error
    }
}

// Get unique locations from all active jobs
export async function getUniqueJobLocations(): Promise<string[]> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        const jobs = await prisma.job.findMany({
            where: {
                isActive: true,
                companyBranding: {
                    isPublished: true,
                },
            },
            select: {
                location: true,
            },
            distinct: ['location'],
            orderBy: {
                location: 'asc',
            },
        })

        return jobs.map((job: any) => job.location)
    } catch (error) {
        console.error('Error fetching job locations:', error)
        return []
    }
}

// Get job counts by type
export async function getJobCountsByType(): Promise<Record<string, number>> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        const jobs = await prisma.job.groupBy({
            by: ['jobType'],
            where: {
                isActive: true,
                companyBranding: {
                    isPublished: true,
                },
            },
            _count: {
                jobType: true,
            },
        })

        return jobs.reduce((acc: Record<string, number>, item: any) => {
            acc[item.jobType] = item._count.jobType
            return acc
        }, {})
    } catch (error) {
        console.error('Error fetching job counts:', error)
        return {}
    }
}

// Update a job
export async function updateJob(id: string, data: any) {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        return await prisma.job.update({
            where: { id },
            data,
        })
    } catch (error) {
        console.error('Error updating job:', error)
        throw error
    }
}

// Delete a job
export async function deleteJob(id: string) {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        return await prisma.job.delete({
            where: { id },
        })
    } catch (error) {
        console.error('Error deleting job:', error)
        throw error
    }
}

// Deactivate a job
export async function deactivateJob(id: string) {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        return await prisma.job.update({
            where: { id },
            data: { isActive: false },
        })
    } catch (error) {
        console.error('Error deactivating job:', error)
        throw error
    }
}

// Upsert a job posting (create or update)
export async function upsertJob(data: {
    id?: string
    companyBrandingId: string
    title: string
    location: string
    jobType: string
    experienceLevel: string
    description?: string
    technicalRequirements: string[]
    softSkills: string[]
    responsibilities: string[]
    benefits?: string[]
    salaryMin?: number | null
    salaryMax?: number | null
    salaryCurrency?: string
    contactEmail?: string | null
    expiresAt?: Date | null
    isActive?: boolean
}) {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        // Generate career page slug from title
        const careerPageSlug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')

        // Get company branding for application URL
        const companyBranding = await prisma.companyBranding.findUnique({
            where: { id: data.companyBrandingId },
            select: { companySlug: true },
        })

        if (!companyBranding) {
            throw new Error('Company branding not found')
        }

        // Generate application URL with job ID
        const jobId = data.id || ''
        const applicationUrl = `/careers/${companyBranding.companySlug}/job?jobId=${jobId}`

        const jobData = {
            companyBrandingId: data.companyBrandingId,
            title: data.title,
            location: data.location,
            jobType: data.jobType,
            experienceLevel: data.experienceLevel,
            description: data.description,
            technicalRequirements: data.technicalRequirements,
            softSkills: data.softSkills,
            responsibilities: data.responsibilities,
            benefits: data.benefits || [],
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            salaryCurrency: data.salaryCurrency || 'USD',
            contactEmail: data.contactEmail,
            expiresAt: data.expiresAt,
            careerPageSlug,
            applicationUrl,
            isActive: data.isActive ?? true,
            // Map to deprecated fields for backward compatibility
            requirements: [...data.technicalRequirements],
            skills: [...data.technicalRequirements, ...data.softSkills],
        }

        // Upsert the job
        const job = await prisma.job.upsert({
            where: { id: data.id || '' },
            update: jobData,
            create: {
                ...jobData,
                id: data.id,
            },
        })

        return job
    } catch (error) {
        console.error('Error upserting job:', error)
        throw error
    }
}

// Get job by career page slug
export async function getJobBySlug(slug: string) {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        return await prisma.job.findUnique({
            where: { careerPageSlug: slug },
            include: {
                companyBranding: {
                    select: {
                        companyName: true,
                        companySlug: true,
                        logoUrl: true,
                        primaryColor: true,
                        secondaryColor: true,
                    },
                },
            },
        })
    } catch (error) {
        console.error('Error fetching job by slug:', error)
        throw error
    }
}

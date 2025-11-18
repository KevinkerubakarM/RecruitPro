import { NextRequest, NextResponse } from 'next/server'
import { getJobs, getUniqueJobLocations, getJobCountsByType, upsertJob } from '@/services/job.service'
import { validateJobSearchParams } from '@/validators/app/(components)/candidate/candidate.validator'
import { validateJobForm } from '@/validators/app/(components)/recruiter/addJobs.validator'
import { CreateJobRequest } from '@/types/app/(components)/recruiter/addJobs.type'

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
}

const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries())

        // Validate search parameters
        const validation = validateJobSearchParams(searchParams)
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Invalid search parameters',
                        code: ERROR_CODES.VALIDATION_ERROR,
                        details: validation.errors,
                    },
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            )
        }

        // Fetch jobs with filters
        const result = await getJobs(validation.data)

        // Fetch additional metadata
        const [locations, jobTypeCounts] = await Promise.all([
            getUniqueJobLocations(),
            getJobCountsByType(),
        ])

        return NextResponse.json(
            {
                success: true,
                data: {
                    ...result,
                    metadata: {
                        locations,
                        jobTypeCounts,
                    },
                },
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error in jobs API:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch jobs',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: CreateJobRequest = await request.json()

        // Validate required fields
        if (!body.companyBrandingId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Company branding ID is required',
                        code: ERROR_CODES.VALIDATION_ERROR,
                    },
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            )
        }

        // Prepare data for validation
        const jobData = {
            title: body.title,
            location: body.location,
            jobType: body.jobType,
            experienceLevel: body.experienceLevel,
            employmentType: body.employmentType,
            department: body.department,
            description: body.description,
            technicalRequirements: body.technicalRequirements,
            softSkills: body.softSkills,
            responsibilities: body.responsibilities,
            benefits: body.benefits || [],
            salaryMin: body.salaryMin,
            salaryMax: body.salaryMax,
            salaryCurrency: body.salaryCurrency || 'USD',
            contactEmail: body.contactEmail,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        }

        // Validate job data
        const validation = validateJobForm(jobData)
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Validation failed',
                        code: ERROR_CODES.VALIDATION_ERROR,
                        details: validation.errors,
                    },
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            )
        }

        // Upsert the job
        const job = await upsertJob({
            id: body.id,
            companyBrandingId: body.companyBrandingId,
            isActive: body.isActive ?? true,
            ...validation.data,
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: job.id,
                    title: job.title,
                    careerSlug: job.careerSlug,
                    applicationUrl: job.applicationUrl || '',
                    isActive: job.isActive,
                },
            },
            { status: HTTP_STATUS.CREATED }
        )
    } catch (error: any) {
        console.error('Error creating job:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: error.message || 'Failed to create job',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

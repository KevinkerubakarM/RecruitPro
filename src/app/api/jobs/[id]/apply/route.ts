import { NextRequest, NextResponse } from 'next/server'
import { primsaService } from '@/services/prisma.service'
import { getAuthHeaders } from '@/lib/helper'

const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
}

const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    DUPLICATE_APPLICATION: 'DUPLICATE_APPLICATION',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: jobId } = await params

        // Get user ID from auth headers
        const userId = request.headers.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Authentication required',
                        code: ERROR_CODES.UNAUTHORIZED,
                    },
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            )
        }

        await primsaService.initialize()
        const prisma = primsaService.getClient()

        // Get user information from database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'User not found',
                        code: ERROR_CODES.UNAUTHORIZED,
                    },
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            )
        }

        const { candidatePhone, coverLetter } = await request.json()

        // Check if candidate has already applied for this job
        const existingApplication = await prisma.jobApplication.findUnique({
            where: {
                jobId_candidateEmail: {
                    jobId,
                    candidateEmail: user.email,
                },
            },
        })

        if (existingApplication) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'You have already applied for this job',
                        code: ERROR_CODES.DUPLICATE_APPLICATION,
                    },
                },
                { status: HTTP_STATUS.CONFLICT }
            )
        }

        // Get candidate profile to include profile URL
        const candidateProfile = await prisma.candidateProfile.findFirst({
            where: {
                userId: user.id,
            },
            include: {
                user: true,
            },
        })

        // Generate candidate profile URL
        const candidateProfileUrl = candidateProfile
            ? `/candidate/${candidateProfile.userId}/public`
            : null

        // Create the application
        const application = await prisma.jobApplication.create({
            data: {
                jobId,
                candidateName: user.name || user.email,
                candidateEmail: user.email,
                candidatePhone: candidatePhone || user.phone || null,
                candidateProfileUrl,
                resumeUrl: candidateProfile?.resume || null,
                coverLetter: coverLetter || null,
                status: 'APPLIED',
            },
            include: {
                job: {
                    include: {
                        companyBranding: {
                            select: {
                                companyName: true,
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    applicationId: application.id,
                    jobTitle: application.job.title,
                    companyName: application.job.companyBranding.companyName,
                    appliedAt: application.appliedAt,
                    candidateProfileUrl,
                },
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error submitting application:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to submit application',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

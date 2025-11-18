import { NextRequest, NextResponse } from 'next/server'
import { primsaService } from '@/services/prisma.service'

const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

const ERROR_CODES = {
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params

        await primsaService.initialize()
        const prisma = primsaService.getClient()

        // Fetch candidate profile with user details
        const candidateProfile = await prisma.candidateProfile.findFirst({
            where: {
                userId: userId,
            },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        phone: true,
                        createdAt: true,
                    },
                },
            },
        })

        if (!candidateProfile) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Candidate profile not found',
                        code: ERROR_CODES.NOT_FOUND,
                    },
                },
                { status: HTTP_STATUS.NOT_FOUND }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: candidateProfile.id,
                    userId: candidateProfile.userId,
                    name: candidateProfile.user.name,
                    email: candidateProfile.user.email,
                    phone: candidateProfile.user.phone,
                    resume: candidateProfile.resume,
                    skills: candidateProfile.skills,
                    experience: candidateProfile.experience,
                    education: candidateProfile.education,
                    location: candidateProfile.location,
                    availableForWork: candidateProfile.availableForWork,
                    isNewToExperience: candidateProfile.isNewToExperience,
                    yearsOfExperience: candidateProfile.yearsOfExperience,
                    companies: candidateProfile.companies,
                    designations: candidateProfile.designations,
                    lookingForRoles: candidateProfile.lookingForRoles,
                    memberSince: candidateProfile.user.createdAt,
                },
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error fetching candidate profile:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch candidate profile',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

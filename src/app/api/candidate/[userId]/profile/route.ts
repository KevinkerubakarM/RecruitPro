import { NextRequest, NextResponse } from 'next/server'
import { primsaService } from '@/services/prisma.service'

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params

        // Get authenticated user ID from headers
        const authUserId = request.headers.get('x-user-id')
        if (!authUserId) {
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

        // Verify the user is updating their own profile
        if (authUserId !== userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Unauthorized to update this profile',
                        code: ERROR_CODES.UNAUTHORIZED,
                    },
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            )
        }

        const body = await request.json()
        const {
            name,
            phone,
            location,
            skills,
            education,
            isNewToExperience,
            yearsOfExperience,
            companies,
            designations,
            lookingForRoles,
            availableForWork,
            resume,
        } = body

        await primsaService.initialize()
        const prisma = primsaService.getClient()

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'User not found',
                        code: ERROR_CODES.NOT_FOUND,
                    },
                },
                { status: HTTP_STATUS.NOT_FOUND }
            )
        }

        // Update user name and phone if provided
        if (name || phone) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(name && { name }),
                    ...(phone && { phone }),
                },
            })
        }

        // Check if profile exists
        const existingProfile = await prisma.candidateProfile.findFirst({
            where: { userId },
        })

        let candidateProfile

        if (existingProfile) {
            // Update existing profile
            candidateProfile = await prisma.candidateProfile.update({
                where: { id: existingProfile.id },
                data: {
                    resume: resume || null,
                    skills: skills || [],
                    education: education || null,
                    location: location || null,
                    availableForWork: availableForWork ?? true,
                    isNewToExperience: isNewToExperience ?? false,
                    yearsOfExperience: yearsOfExperience || null,
                    companies: companies || [],
                    designations: designations || [],
                    lookingForRoles: lookingForRoles || [],
                },
            })
        } else {
            // Create new profile (for recruiters switching to candidate)
            candidateProfile = await prisma.candidateProfile.create({
                data: {
                    userId,
                    resume: resume || null,
                    skills: skills || [],
                    education: education || null,
                    location: location || null,
                    availableForWork: availableForWork ?? true,
                    isNewToExperience: isNewToExperience ?? false,
                    yearsOfExperience: yearsOfExperience || null,
                    companies: companies || [],
                    designations: designations || [],
                    lookingForRoles: lookingForRoles || [],
                },
            })
        }

        // Fetch updated user data
        const updatedUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                phone: true,
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: candidateProfile.id,
                    userId: candidateProfile.userId,
                    name: updatedUser?.name,
                    email: updatedUser?.email,
                    phone: updatedUser?.phone,
                    resume: candidateProfile.resume,
                    skills: candidateProfile.skills,
                    education: candidateProfile.education,
                    location: candidateProfile.location,
                    availableForWork: candidateProfile.availableForWork,
                    isNewToExperience: candidateProfile.isNewToExperience,
                    yearsOfExperience: candidateProfile.yearsOfExperience,
                    companies: candidateProfile.companies,
                    designations: candidateProfile.designations,
                    lookingForRoles: candidateProfile.lookingForRoles,
                },
                message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
            },
            { status: existingProfile ? HTTP_STATUS.OK : HTTP_STATUS.CREATED }
        )
    } catch (error) {
        console.error('Error updating candidate profile:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to update candidate profile',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { primsaService } from '@/services/prisma.service'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            lookingFor,
            company,
            isNewToExperience,
            yearsOfExperience,
            companies,
            lookingForRoles
        } = body

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !lookingFor) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate candidate-specific fields
        if (lookingFor === 'CANDIDATE') {
            if (!lookingForRoles || lookingForRoles.length === 0) {
                return NextResponse.json(
                    { success: false, error: 'Please select at least one role you are looking for' },
                    { status: 400 }
                )
            }

            if (!isNewToExperience) {
                if (!companies || companies.length === 0) {
                    return NextResponse.json(
                        { success: false, error: 'Please provide your work experience details' },
                        { status: 400 }
                    )
                }
                if (yearsOfExperience === undefined || yearsOfExperience < 0) {
                    return NextResponse.json(
                        { success: false, error: 'Please provide valid years of experience' },
                        { status: 400 }
                    )
                }
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Validate role
        if (lookingFor !== 'RECRUITER' && lookingFor !== 'CANDIDATE') {
            return NextResponse.json(
                { success: false, error: 'Invalid role selected' },
                { status: 400 }
            )
        }

        // Initialize Prisma
        await primsaService.initialize()
        const client = primsaService.getClient()

        // Check if user already exists
        const existingUser = await client.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Create user
        const user = await primsaService.createUser({
            email,
            password: hashedPassword,
            role: lookingFor,
            name: `${firstName} ${lastName}`,
            phone,
            company
        })

        // Create profile based on role
        if (lookingFor === 'RECRUITER') {
            await client.recruiterProfile.create({
                data: {
                    userId: user.id
                }
            })
        } else {
            // Create candidate profile with experience details
            const companyNames = isNewToExperience ? [] : companies.map((c: any) => c.name)
            const designations = isNewToExperience ? [] : companies.map((c: any) => c.designation)

            await client.candidateProfile.create({
                data: {
                    userId: user.id,
                    isNewToExperience: isNewToExperience || false,
                    yearsOfExperience: isNewToExperience ? 0 : (yearsOfExperience || 0),
                    companies: companyNames,
                    designations: designations,
                    lookingForRoles: lookingForRoles || []
                }
            })
        }

        // Generate a simple token (in production, use JWT)
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

        // Fetch the created profile
        const userWithProfile = await client.user.findUnique({
            where: { id: user.id },
            include: {
                recruiterProfile: true,
                candidateProfile: true
            }
        })

        const response = NextResponse.json({
            success: true,
            data: {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                token,
                profile: lookingFor === 'RECRUITER' ? userWithProfile?.recruiterProfile : userWithProfile?.candidateProfile
            }
        }, { status: 201 })

        // Set auth token cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return response

    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

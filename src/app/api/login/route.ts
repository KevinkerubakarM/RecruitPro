import { NextRequest, NextResponse } from 'next/server'
import { primsaService } from '@/services/prisma.service'
import { compare } from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { emailOrUsername, password, rememberMe } = body

        // Validate required fields
        if (!emailOrUsername || !password) {
            return NextResponse.json(
                { success: false, error: 'Email/username and password are required' },
                { status: 400 }
            )
        }

        // Initialize Prisma
        await primsaService.initialize()
        const client = primsaService.getClient()

        // Find user by email
        const user = await client.user.findUnique({
            where: { email: emailOrUsername },
            include: {
                recruiterProfile: true,
                candidateProfile: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Generate a simple token (in production, use JWT)
        const tokenExpiry = rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000)
        const token = Buffer.from(`${user.id}:${tokenExpiry}:${user.role}`).toString('base64')

        const response = NextResponse.json({
            success: true,
            data: {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                token,
                profile: user.role === 'RECRUITER' ? user.recruiterProfile : user.candidateProfile
            }
        }, { status: 200 })

        // Set HTTP-only cookie for authentication
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // in seconds
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge,
            path: '/',
        })

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

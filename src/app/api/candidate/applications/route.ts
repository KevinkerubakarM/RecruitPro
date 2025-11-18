import { NextRequest, NextResponse } from 'next/server'
import { getCandidateApplications } from '@/services/application.service'

const HTTP_STATUS = {
    OK: 200,
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
        const searchParams = request.nextUrl.searchParams
        const email = searchParams.get('email')
        const limitParam = searchParams.get('limit')

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Email parameter is required',
                        code: ERROR_CODES.VALIDATION_ERROR,
                    },
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            )
        }

        const limit = limitParam ? parseInt(limitParam, 10) : undefined

        const applications = await getCandidateApplications(email, limit)

        return NextResponse.json(
            {
                success: true,
                data: applications,
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error in candidate applications API:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch applications',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

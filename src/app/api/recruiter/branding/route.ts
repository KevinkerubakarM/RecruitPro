import { NextRequest, NextResponse } from 'next/server'
import {
    getCompanyBrandingByUserId,
    getCompanyBrandingById,
    getCompanyBrandingBySlug,
    upsertCompanyBranding,
    publishCompanyBranding,
} from '@/services/branding.service'
import { validateSaveBrandingRequest } from '@/validators/app/(components)/recruiter/edit.validator'
import { storage, STORAGE_KEYS } from '@/lib/helper'

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

/**
 * GET /api/recruiter/branding
 * Get company branding for the logged-in recruiter
 */
export async function GET(request: NextRequest) {
    try {
        // Get params from headers/query
        const { searchParams } = new URL(request.url)
        const userId = request.headers.get('x-user-id')
        const id = searchParams.get('id')
        const slug = searchParams.get('slug')

        if (!userId && !slug && !id) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Unauthorized - Authentication required',
                        code: ERROR_CODES.UNAUTHORIZED,
                    },
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            )
        }

        // Fetch by id (single), slug (public), or userId (all for user)
        let branding
        if (id) {
            branding = await getCompanyBrandingById(id)
            if (!branding) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            message: 'Company branding not found',
                            code: ERROR_CODES.NOT_FOUND,
                        },
                    },
                    { status: HTTP_STATUS.NOT_FOUND }
                )
            }
        } else if (slug) {
            branding = await getCompanyBrandingBySlug(slug)
            if (!branding) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            message: 'Company branding not found',
                            code: ERROR_CODES.NOT_FOUND,
                        },
                    },
                    { status: HTTP_STATUS.NOT_FOUND }
                )
            }
        } else {
            // Return all brandings for the user
            branding = await getCompanyBrandingByUserId(userId!)
        }

        return NextResponse.json(
            {
                success: true,
                data: branding,
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error fetching branding:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Internal server error',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

/**
 * POST /api/recruiter/branding
 * Create or update company branding
 */
export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Unauthorized',
                        code: ERROR_CODES.UNAUTHORIZED,
                    },
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            )
        }

        const body = await request.json()

        // Validate request data
        const validation = validateSaveBrandingRequest(body)
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

        const branding = await upsertCompanyBranding(userId, validation.data)

        return NextResponse.json(
            {
                success: true,
                data: branding,
            },
            { status: HTTP_STATUS.CREATED }
        )
    } catch (error) {
        console.error('Error saving branding:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Internal server error',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

/**
 * PATCH /api/recruiter/branding
 * Publish or unpublish company branding
 */
export async function PATCH(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Unauthorized',
                        code: ERROR_CODES.UNAUTHORIZED,
                    },
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            )
        }

        const body = await request.json()
        const { id, isPublished } = body

        if (!id || typeof isPublished !== 'boolean') {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Invalid request: id and isPublished are required',
                        code: ERROR_CODES.VALIDATION_ERROR,
                    },
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            )
        }

        const branding = await publishCompanyBranding(id, isPublished)

        return NextResponse.json(
            {
                success: true,
                data: {
                    isPublished: branding.isPublished,
                    publishedAt: branding.publishedAt,
                    publicUrl: `/careers/${branding.companySlug}`,
                },
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error publishing branding:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Internal server error',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

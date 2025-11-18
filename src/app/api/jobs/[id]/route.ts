import { NextRequest, NextResponse } from 'next/server'
import { getJobById } from '@/services/job.service'

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Job ID is required',
                        code: ERROR_CODES.NOT_FOUND,
                    },
                },
                { status: HTTP_STATUS.NOT_FOUND }
            )
        }

        const job = await getJobById(id)

        if (!job) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Job not found',
                        code: ERROR_CODES.NOT_FOUND,
                    },
                },
                { status: HTTP_STATUS.NOT_FOUND }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: job,
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error fetching job by ID:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to fetch job',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Job ID is required',
                        code: ERROR_CODES.NOT_FOUND,
                    },
                },
                { status: HTTP_STATUS.NOT_FOUND }
            )
        }

        // Import updateJob service function
        const { updateJob } = await import('@/services/job.service')

        const updatedJob = await updateJob(id, body)

        if (!updatedJob) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Job not found or failed to update',
                        code: ERROR_CODES.NOT_FOUND,
                    },
                },
                { status: HTTP_STATUS.NOT_FOUND }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: updatedJob,
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: 'Failed to update job',
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        )
    }
}

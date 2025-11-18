import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, uploadVideo, uploadLogo, uploadBanner } from '@/services/cloudinary.service'

const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
}

const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    UPLOAD_FAILED: 'UPLOAD_FAILED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
}

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
        const { file, type } = body

        if (!file || !type) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Missing required fields: file and type',
                        code: ERROR_CODES.VALIDATION_ERROR,
                    },
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            )
        }

        let result

        switch (type) {
            case 'logo':
                result = await uploadLogo(file)
                break
            case 'banner':
                result = await uploadBanner(file)
                break
            case 'video':
                result = await uploadVideo(file)
                break
            case 'image':
                result = await uploadImage(file)
                break
            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            message: 'Invalid upload type',
                            code: ERROR_CODES.VALIDATION_ERROR,
                        },
                    },
                    { status: HTTP_STATUS.BAD_REQUEST }
                )
        }

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: result.error || 'Upload failed',
                        code: ERROR_CODES.UPLOAD_FAILED,
                    },
                },
                { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    url: result.url,
                    publicId: result.publicId,
                },
            },
            { status: HTTP_STATUS.OK }
        )
    } catch (error) {
        console.error('Error uploading file:', error)
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

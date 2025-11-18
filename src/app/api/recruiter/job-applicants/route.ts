import { NextRequest, NextResponse } from "next/server";
import { getJobApplications } from "@/services/application.service";

const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

const ERROR_CODES = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_ERROR: "INTERNAL_ERROR",
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const jobId = searchParams.get("jobId");

        if (!jobId) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "Job ID is required",
                        code: ERROR_CODES.VALIDATION_ERROR,
                    },
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        const data = await getJobApplications(jobId);

        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: HTTP_STATUS.OK }
        );
    } catch (error: any) {
        console.error("Error in job applicants API:", error);

        if (error.message === "Job not found") {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "Job not found",
                        code: ERROR_CODES.NOT_FOUND,
                    },
                },
                { status: HTTP_STATUS.NOT_FOUND }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: {
                    message: "Failed to fetch job applicants",
                    code: ERROR_CODES.INTERNAL_ERROR,
                },
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        );
    }
}

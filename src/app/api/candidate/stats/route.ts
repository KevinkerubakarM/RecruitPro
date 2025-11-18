import { NextRequest, NextResponse } from "next/server";
import { getCandidateStats } from "@/services/application.service";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/constants";
import { CandidateStatsResponse } from "@/types/app/(components)/candidate/home.type";

export async function GET(request: NextRequest) {
    try {
        // Get candidate email from query params or headers
        const { searchParams } = new URL(request.url);
        const candidateEmail = searchParams.get("email");

        if (!candidateEmail) {
            const response: CandidateStatsResponse = {
                success: false,
                error: {
                    message: "Email is required",
                    code: ERROR_CODES.VALIDATION_ERROR,
                },
            };
            return NextResponse.json(response, { status: HTTP_STATUS.BAD_REQUEST });
        }

        // Fetch candidate stats
        const stats = await getCandidateStats(candidateEmail);

        const response: CandidateStatsResponse = {
            success: true,
            data: stats,
        };

        return NextResponse.json(response, { status: HTTP_STATUS.OK });
    } catch (error) {
        console.error("Error fetching candidate stats:", error);

        const response: CandidateStatsResponse = {
            success: false,
            error: {
                message: "Failed to fetch candidate statistics",
                code: ERROR_CODES.INTERNAL_ERROR,
            },
        };

        return NextResponse.json(response, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { getCompanyBrandingBySlug } from "@/services/branding.service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ companySlug: string }> }
) {
    try {
        const { companySlug } = await params;

        if (!companySlug) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "Company slug is required",
                        code: "MISSING_SLUG",
                    },
                },
                { status: 400 }
            );
        }

        const branding = await getCompanyBrandingBySlug(companySlug);

        if (!branding) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "Career page not found",
                        code: "NOT_FOUND",
                    },
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: branding,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching career page:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: "Internal server error",
                    code: "INTERNAL_ERROR",
                },
            },
            { status: 500 }
        );
    }
}

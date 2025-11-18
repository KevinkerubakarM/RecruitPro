import { NextRequest, NextResponse } from "next/server";
import { primsaService } from "@/services/prisma.service";
import { validateJobFilters } from "@/validators/app/(components)/recruiter/home.validator";

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const;

const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get userId from headers
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Unauthorized - Authentication required",
            code: ERROR_CODES.UNAUTHORIZED,
          },
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Get filters from query params
    const filters = {
      search: searchParams.get("search") || "",
      jobId: searchParams.get("jobId") || "",
      jobType: searchParams.get("jobType") || "",
      experienceLevel: searchParams.get("experienceLevel") || "",
      isActive: searchParams.get("isActive") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      companyName: searchParams.get("companyName") || "",
      sortBy: searchParams.get("sortBy") || "date-desc",
      page: parseInt(searchParams.get("page") || "1"),
    };

    // Validate filters
    const validation = validateJobFilters(filters);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid filters",
            code: ERROR_CODES.VALIDATION_ERROR,
            details: validation.errors,
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const validatedFilters = validation.data;

    // Initialize Prisma
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    // Build where clause for jobs query
    const whereClause: any = {
      companyBranding: {
        userId: userId,
      },
    };

    // Apply filters
    if (validatedFilters.search) {
      whereClause.OR = [
        { title: { contains: validatedFilters.search, mode: "insensitive" } },
        {
          location: { contains: validatedFilters.search, mode: "insensitive" },
        },
        {
          description: {
            contains: validatedFilters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (validatedFilters.jobId) {
      whereClause.id = {
        contains: validatedFilters.jobId,
        mode: "insensitive",
      };
    }

    if (validatedFilters.jobType) {
      whereClause.jobType = validatedFilters.jobType;
    }

    if (validatedFilters.experienceLevel) {
      whereClause.experienceLevel = validatedFilters.experienceLevel;
    }

    if (validatedFilters.isActive !== "") {
      whereClause.isActive = validatedFilters.isActive === "true";
    }

    if (validatedFilters.dateFrom) {
      whereClause.postedAt = {
        ...whereClause.postedAt,
        gte: new Date(validatedFilters.dateFrom),
      };
    }

    if (validatedFilters.dateTo) {
      whereClause.postedAt = {
        ...whereClause.postedAt,
        lte: new Date(validatedFilters.dateTo),
      };
    }

    if (validatedFilters.companyName) {
      whereClause.companyBranding = {
        ...whereClause.companyBranding,
        companySlug: validatedFilters.companyName,
      };
    }

    // Fetch jobs with application counts
    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        companyBranding: {
          select: {
            companyName: true,
            companySlug: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        postedAt: "desc",
      },
    });

    // Calculate stats
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job: any) => job.isActive).length;
    const totalApplications = jobs.reduce(
      (sum: number, job: any) => sum + job._count.applications,
      0
    );

    // Get recent applications count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentApplicationsData = await prisma.jobApplication.count({
      where: {
        job: {
          companyBranding: {
            userId: userId,
          },
        },
        appliedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Format response
    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      location: job.location,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      isActive: job.isActive,
      postedAt: job.postedAt.toISOString(),
      expiresAt: job.expiresAt?.toISOString() || null,
      applicationCount: job._count.applications,
      companyName: job.companyBranding.companyName,
      companySlug: job.companyBranding.companySlug,
      careerSlug: job.careerSlug,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          jobs: formattedJobs,
          stats: {
            totalJobs,
            activeJobs,
            totalApplications,
            recentApplications: recentApplicationsData,
          },
        },
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Failed to fetch dashboard data",
          code: ERROR_CODES.INTERNAL_ERROR,
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

// POST endpoint to update job status
export async function POST(request: NextRequest) {
  try {
    // Get userId from headers
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Unauthorized - Authentication required",
            code: ERROR_CODES.UNAUTHORIZED,
          },
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    const { jobId, isActive } = body;

    if (!jobId || typeof isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Job ID and status are required",
            code: ERROR_CODES.VALIDATION_ERROR,
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Initialize Prisma
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    // Verify job belongs to user
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        companyBranding: {
          userId: userId,
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Job not found or unauthorized",
            code: ERROR_CODES.UNAUTHORIZED,
          },
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Update job status
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { isActive },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updatedJob.id,
          isActive: updatedJob.isActive,
        },
      },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Failed to update job status",
          code: ERROR_CODES.INTERNAL_ERROR,
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

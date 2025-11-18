import { primsaService } from "./prisma.service";

/**
 * Get candidate application statistics by email
 */
export async function getCandidateStats(candidateEmail: string) {
  try {
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    // Get all applications for this candidate
    const applications = await prisma.jobApplication.findMany({
      where: {
        candidateEmail: candidateEmail,
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
      },
    });

    // Calculate statistics
    const totalApplications = applications.length;

    // Active applications (not rejected or withdrawn)
    const activeApplications = applications.filter(
      (app: any) => app.status !== "REJECTED" && app.status !== "WITHDRAWN"
    ).length;

    // Currently interviewing
    const interviewingCount = applications.filter(
      (app: any) => app.status === "INTERVIEWING"
    ).length;

    // Offers received
    const offersReceived = applications.filter(
      (app: any) => app.status === "OFFERED"
    ).length;

    return {
      totalApplications,
      activeApplications,
      interviewingCount,
      offersReceived,
    };
  } catch (error) {
    console.error("Error fetching candidate stats:", error);
    throw error;
  }
}

/**
 * Get recent applications for a candidate
 */
export async function getCandidateApplications(
  candidateEmail: string,
  limit: number = 10
) {
  try {
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    const applications = await prisma.jobApplication.findMany({
      where: {
        candidateEmail: candidateEmail,
      },
      include: {
        job: {
          include: {
            companyBranding: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
      take: limit,
    });

    return applications.map((app: any) => ({
      id: app.id,
      jobTitle: app.job.title,
      companyName: app.job.companyBranding.companyName,
      status: app.status,
      appliedAt: app.appliedAt.toISOString(),
      location: app.job.location,
      jobType: app.job.jobType,
    }));
  } catch (error) {
    console.error("Error fetching candidate applications:", error);
    throw error;
  }
}

/**
 * Get application by ID
 */
export async function getApplicationById(applicationId: string) {
  try {
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    return await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: {
          include: {
            companyBranding: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
}

/**
 * Get application status counts
 */
export async function getApplicationStatusCounts(candidateEmail: string) {
  try {
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    const statusCounts = await prisma.jobApplication.groupBy({
      by: ["status"],
      where: {
        candidateEmail: candidateEmail,
      },
      _count: {
        status: true,
      },
    });

    return statusCounts.reduce((acc: any, curr: any) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error("Error fetching application status counts:", error);
    throw error;
  }
}

/**
 * Get all applications for a specific job with candidate profile details
 */
export async function getJobApplications(jobId: string) {
  try {
    await primsaService.initialize();
    const prisma = primsaService.getClient();

    // First get the job details
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        companyBranding: {
          select: {
            companyName: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Get all applications for this job
    const applications = await prisma.jobApplication.findMany({
      where: {
        jobId: jobId,
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    // Get candidate profiles for all applicants
    const candidateEmails = applications.map((app: any) => app.candidateEmail);
    const candidateProfiles = await prisma.user.findMany({
      where: {
        email: { in: candidateEmails },
      },
      include: {
        candidateProfile: true,
      },
    });

    // Create a map of email to profile for easy lookup
    const profileMap = new Map(
      candidateProfiles.map((user: any) => [
        user.email,
        {
          userId: user.id,
          skills: user.candidateProfile?.skills || [],
          experience: user.candidateProfile?.experience,
          location: user.candidateProfile?.location,
          isNewToExperience: user.candidateProfile?.isNewToExperience || false,
          yearsOfExperience: user.candidateProfile?.yearsOfExperience,
          companies: user.candidateProfile?.companies || [],
          designations: user.candidateProfile?.designations || [],
          lookingForRoles: user.candidateProfile?.lookingForRoles || [],
        },
      ])
    );

    // Combine application data with candidate profile data
    const applicantsWithProfiles = applications.map((app: any) => {
      const profile: any = profileMap.get(app.candidateEmail);
      return {
        id: app.id,
        candidateName: app.candidateName,
        candidateEmail: app.candidateEmail,
        candidatePhone: app.candidatePhone,
        candidateProfileUrl: profile?.userId
          ? `/candidate/${profile.userId}/public`
          : null,
        resumeUrl: app.resumeUrl,
        coverLetter: app.coverLetter,
        status: app.status,
        appliedAt: app.appliedAt.toISOString(),
        skills: profile?.skills || [],
        experience: profile?.experience || null,
        location: profile?.location || null,
        isNewToExperience: profile?.isNewToExperience || false,
        yearsOfExperience: profile?.yearsOfExperience || null,
        companies: profile?.companies || [],
        designations: profile?.designations || [],
        lookingForRoles: profile?.lookingForRoles || [],
      };
    });

    return {
      job: {
        id: job.id,
        title: job.title,
        companyName: job.companyBranding.companyName,
        location: job.location,
      },
      applicants: applicantsWithProfiles,
    };
  } catch (error) {
    console.error("Error fetching job applications:", error);
    throw error;
  }
}

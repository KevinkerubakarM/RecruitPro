import { Metadata } from "next";
import {
  getJobs,
  getUniqueJobLocations,
  getJobCountsByType,
} from "@/services/job.service";
import { CandidatePageProps } from "@/types/app/(components)/candidate/candidate.type";
import CandidateClient from "@/app/(components)/candidate/searchJob/Candidate";

// Generate metadata for SEO
export async function generateMetadata({
  searchParams,
}: CandidatePageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const location = resolvedParams?.location || "";

  let title = "Find Your Dream Job";
  let description =
    "Browse thousands of job opportunities from top companies. Find full-time, part-time, contract, and remote positions.";

  if (search && location) {
    title = `${search} Jobs in ${location} `;
    description = `Find ${search} jobs in ${location}. Browse current openings, compare salaries, and apply today.`;
  } else if (search) {
    title = `${search} Jobs`;
    description = `Search ${search} jobs across multiple locations. Discover opportunities that match your skills and experience.`;
  } else if (location) {
    title = `Jobs in ${location}`;
    description = `Explore job opportunities in ${location}. Find full-time, part-time, and remote positions from leading employers.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://recruitpro.com/candidate",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CandidatePage({
  searchParams,
}: CandidatePageProps) {
  // Await search params (Next.js 15+ requirement)
  const resolvedParams = await searchParams;

  // Parse search params
  const params = {
    search: resolvedParams?.search,
    location: resolvedParams?.location,
    jobType: resolvedParams?.jobType,
    experienceLevel: resolvedParams?.experienceLevel,
    page: resolvedParams?.page ? Number(resolvedParams.page) : 1,
    limit: resolvedParams?.limit ? Number(resolvedParams.limit) : 20,
  };

  // Fetch data server-side for SEO and initial load
  const [jobsResult, locations, jobTypeCounts] = await Promise.all([
    getJobs(params),
    getUniqueJobLocations(),
    getJobCountsByType(),
  ]);

  // Parse initial filters
  const initialFilters = {
    search: params.search,
    location: params.location,
    jobType: params.jobType ? params.jobType.split(",") : [],
    experienceLevel: params.experienceLevel
      ? params.experienceLevel.split(",")
      : [],
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: params.search ? `${params.search} Jobs` : "Job Search",
            description:
              "Browse and search for job opportunities from top companies",
            url: `https://jobhunt.com/candidate/searchJob`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: jobsResult.total,
              itemListElement: jobsResult.jobs
                .slice(0, 10)
                .map((job: any, index: number) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "JobPosting",
                    "@id": `https://jobhunt.com/careers/${job.companyBranding?.companySlug}/job?jobId=${job.id}`,
                    title: job.title,
                    description: job.description?.substring(0, 200),
                    datePosted: job.postedAt,
                    employmentType: job.jobType,
                    hiringOrganization: {
                      "@type": "Organization",
                      name: job.companyBranding?.companyName || "Company",
                      logo: job.companyBranding?.logoUrl,
                    },
                    jobLocation: {
                      "@type": "Place",
                      address: {
                        "@type": "PostalAddress",
                        addressLocality: job.location,
                      },
                    },
                    baseSalary:
                      job.salaryMin && job.salaryMax
                        ? {
                            "@type": "MonetaryAmount",
                            currency: job.salaryCurrency || "USD",
                            value: {
                              "@type": "QuantitativeValue",
                              minValue: job.salaryMin,
                              maxValue: job.salaryMax,
                              unitText: "YEAR",
                            },
                          }
                        : undefined,
                  },
                })),
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://jobhunt.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Job Search",
                  item: "https://jobhunt.com/candidate/searchJob",
                },
              ],
            },
          }),
        }}
      />

      <CandidateClient
        initialJobs={jobsResult.jobs}
        initialTotal={jobsResult.total}
        initialPage={jobsResult.page}
        initialLimit={jobsResult.limit}
        initialTotalPages={jobsResult.totalPages}
        locations={locations}
        jobTypeCounts={jobTypeCounts}
        initialFilters={initialFilters}
      />
    </>
  );
}

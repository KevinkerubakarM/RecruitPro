"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobData } from "@/types/app/(components)/candidate/candidate.type";
import JobSearch from "@/app/(components)/candidate/searchJob/JobSearch";
import JobFilters from "@/app/(components)/candidate/searchJob/JobFilters";
import JobList from "@/app/(components)/candidate/searchJob/JobList";
import Pagination from "@/app/(components)/candidate/searchJob/Pagination";
import { API_ROUTES } from "@/lib/constants";
import { buildQueryString } from "@/lib/helper";
import Header from "../../common/Header";

interface CandidateClientProps {
  initialJobs: JobData[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
  initialTotalPages: number;
  locations: string[];
  jobTypeCounts: Record<string, number>;
  initialFilters: {
    search?: string;
    location?: string;
    jobType?: string[];
    experienceLevel?: string[];
  };
}

export default function CandidateClient({
  initialJobs,
  initialTotal,
  initialPage,
  initialLimit,
  initialTotalPages,
  locations,
  jobTypeCounts,
  initialFilters,
}: CandidateClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<JobData[]>(initialJobs);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    location: initialFilters.location || "",
    jobType: initialFilters.jobType || [],
    experienceLevel: initialFilters.experienceLevel || [],
  });

  // Update URL and fetch jobs when filters change
  const updateFiltersAndFetch = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Build query params
    const params: Record<string, any> = {
      page: 1, // Reset to first page on filter change
    };

    if (updatedFilters.search) params.search = updatedFilters.search;
    if (updatedFilters.location) params.location = updatedFilters.location;
    if (updatedFilters.jobType && updatedFilters.jobType.length > 0)
      params.jobType = updatedFilters.jobType.join(",");
    if (
      updatedFilters.experienceLevel &&
      updatedFilters.experienceLevel.length > 0
    )
      params.experienceLevel = updatedFilters.experienceLevel.join(",");

    // Update URL
    const queryString = buildQueryString(params);
    router.push(`/candidate/searchJob${queryString}`, { scroll: false });

    // Fetch jobs
    fetchJobs(params);
  };

  const fetchJobs = async (params: Record<string, any>) => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString(params);
      const response = await fetch(`${API_ROUTES.JOBS}${queryString}`);
      const result = await response.json();

      if (result.success) {
        setJobs(result.data.jobs);
        setTotal(result.data.total);
        setPage(result.data.page);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    updateFiltersAndFetch({ search: query });
  };

  const handleFilterChange = (newFilters: {
    location?: string;
    jobType?: string[];
    experienceLevel?: string[];
  }) => {
    updateFiltersAndFetch(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const params: Record<string, any> = { page: newPage };
    if (filters.search) params.search = filters.search;
    if (filters.location) params.location = filters.location;
    if (filters.jobType && filters.jobType.length > 0)
      params.jobType = filters.jobType.join(",");
    if (filters.experienceLevel && filters.experienceLevel.length > 0)
      params.experienceLevel = filters.experienceLevel.join(",");

    const queryString = buildQueryString(params);
    router.push(`/candidate/searchJob${queryString}`, { scroll: true });
    fetchJobs(params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className="lg:col-span-1"
            role="complementary"
            aria-label="Job filters"
          >
            <h2 className="sr-only">Filter Jobs</h2>
            <JobFilters
              filters={{
                location: filters.location,
                jobType: filters.jobType,
                experienceLevel: filters.experienceLevel,
              }}
              onFilterChange={handleFilterChange}
              locations={locations}
              jobTypeCounts={jobTypeCounts}
            />
          </aside>

          {/* Job List */}
          <section
            className="lg:col-span-3"
            aria-labelledby="job-results-heading"
          >
            <h2 id="job-results-heading" className="sr-only">
              Job Search Results
            </h2>
            <div className="mb-4 flex items-center justify-between">
              <p
                className="text-sm text-gray-600"
                role="status"
                aria-live="polite"
              >
                {isLoading ? (
                  <span>Loading jobs...</span>
                ) : (
                  <span>
                    Showing{" "}
                    <strong>
                      {jobs.length > 0 ? (page - 1) * initialLimit + 1 : 0}
                    </strong>{" "}
                    - <strong>{Math.min(page * initialLimit, total)}</strong> of{" "}
                    <strong>{total.toLocaleString()}</strong> jobs
                  </span>
                )}
              </p>
            </div>

            <JobList
              jobs={jobs}
              isLoading={isLoading}
              emptyMessage="Try adjusting your filters or search query"
            />

            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

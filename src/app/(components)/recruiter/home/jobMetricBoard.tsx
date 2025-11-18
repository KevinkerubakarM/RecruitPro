"use client";

import { JobWithApplications, JobFilters } from "@/types/app/(components)/recruiter/home.type";
import { JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";

interface Company {
  id: string;
  companyName: string;
  companySlug: string;
}

interface DashboardMainProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    recentApplications: number;
  };
  jobs: JobWithApplications[];
  companies: Company[];
  loading: boolean;
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onResetFilters: () => void;
  onEditJob: (jobId: string, companySlug: string) => void;
  onViewApplications: (jobId: string, companySlug: string) => void;
  onToggleJobStatus: (jobId: string, currentStatus: boolean) => void;
}

const ITEMS_PER_PAGE = 20;

// Custom Dropdown Component
function CustomDropdown({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  label: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-300 hover:shadow-md cursor-pointer appearance-none font-medium text-gray-900 pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function JobMetricBoard({
  stats,
  jobs,
  companies,
  loading,
  filters,
  onFiltersChange,
  onResetFilters,
  onEditJob,
  onViewApplications,
  onToggleJobStatus,
}: DashboardMainProps) {
  const handleFilterChange = (key: keyof JobFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      ...(key !== "page" && { page: 1 }), // Reset to page 1 when filters change
    });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== "sortBy" && key !== "page" && value !== "" && value !== 1
  );

  // Sort and paginate jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    switch (filters.sortBy) {
      case "date-asc":
        return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      case "date-desc":
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "applications-asc":
        return a.applicationCount - b.applicationCount;
      case "applications-desc":
        return b.applicationCount - a.applicationCount;
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getJobTypeLabel = (type: string) => {
    return JOB_TYPES[type as keyof typeof JOB_TYPES] || type;
  };

  const getExperienceLevelLabel = (level: string) => {
    return EXPERIENCE_LEVELS[level as keyof typeof EXPERIENCE_LEVELS] || level;
  };

  const statsCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      gradient: "from-indigo-50 to-indigo-100",
      textColor: "text-indigo-900",
      accentColor: "bg-indigo-500",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      gradient: "from-emerald-50 to-emerald-100",
      textColor: "text-emerald-900",
      accentColor: "bg-emerald-500",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      gradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-900",
      accentColor: "bg-purple-500",
    },
    {
      title: "Recent Applications",
      value: stats.recentApplications,
      subtitle: "Last 7 days",
      gradient: "from-pink-50 to-pink-100",
      textColor: "text-pink-900",
      accentColor: "bg-pink-500",
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        aria-label="Dashboard statistics"
      >
        {loading
          ? // Loading skeleton for stats cards
            Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg p-6 relative overflow-hidden animate-pulse"
                aria-label="Loading statistics"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
                <div>
                  <div className="h-3 bg-gray-300 rounded w-20 mb-3"></div>
                  <div className="h-10 bg-gray-300 rounded w-16 mb-2"></div>
                </div>
              </article>
            ))
          : statsCards.map((card, index) => (
              <article
                key={index}
                className={`bg-gradient-to-br ${card.gradient} rounded-2xl shadow-lg hover:shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/50 backdrop-blur-sm relative overflow-hidden`}
                aria-label={`${card.title}: ${card.value}`}
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${card.accentColor}`}
                  aria-hidden="true"
                ></div>
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    {card.title}
                  </p>
                  <p className={`text-4xl font-black ${card.textColor}`}>{card.value}</p>
                  {card.subtitle && (
                    <p className="mt-2 text-xs text-gray-600 font-semibold">{card.subtitle}</p>
                  )}
                </div>
              </article>
            ))}
      </section>

      {/* Filters Panel */}
      <section
        className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-lg p-8 border border-indigo-100 mb-8"
        aria-labelledby="filters-heading"
      >
        <div className="flex items-center justify-between mb-6">
          <header>
            <h2 id="filters-heading" className="text-2xl font-bold text-gray-900">
              Filter & Manage Jobs
            </h2>
            <p className="text-sm text-gray-600 mt-1">Refine your job postings view</p>
          </header>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              aria-label="Reset all filters"
            >
              Reset All
            </button>
          )}
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          role="search"
          aria-label="Job filters"
        >
          {/* Search */}
          <div className="xl:col-span-2">
            <label
              htmlFor="job-search"
              className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider"
            >
              Search
            </label>
            <input
              id="job-search"
              type="text"
              placeholder="Job title, location..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-300"
              aria-label="Search jobs by title or location"
            />
          </div>

          {/* Job ID Filter */}
          <div>
            <label
              htmlFor="job-id"
              className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider"
            >
              Job ID
            </label>
            <input
              id="job-id"
              type="text"
              placeholder="Enter Job ID..."
              value={filters.jobId}
              onChange={(e) => handleFilterChange("jobId", e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-300"
              aria-label="Filter by Job ID"
            />
          </div>

          {/* Company Filter */}
          <CustomDropdown
            label="Company"
            value={filters.companyName}
            onChange={(value) => handleFilterChange("companyName", value)}
            placeholder="All Companies"
            options={[
              { value: "", label: "All Companies" },
              ...companies.map((company) => ({
                value: company.companySlug,
                label: company.companyName,
              })),
            ]}
          />

          {/* Job Type */}
          <CustomDropdown
            label="Job Type"
            value={filters.jobType}
            onChange={(value) => handleFilterChange("jobType", value)}
            placeholder="All Types"
            options={[
              { value: "", label: "All Types" },
              ...Object.entries(JOB_TYPES).map(([key, label]) => ({
                value: key,
                label: label,
              })),
            ]}
          />

          {/* Experience Level */}
          <CustomDropdown
            label="Experience"
            value={filters.experienceLevel}
            onChange={(value) => handleFilterChange("experienceLevel", value)}
            placeholder="All Levels"
            options={[
              { value: "", label: "All Levels" },
              ...Object.entries(EXPERIENCE_LEVELS).map(([key, label]) => ({
                value: key,
                label: label,
              })),
            ]}
          />

          {/* Status */}
          <CustomDropdown
            label="Status"
            value={filters.isActive}
            onChange={(value) => handleFilterChange("isActive", value)}
            placeholder="All Status"
            options={[
              { value: "", label: "All Status" },
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />

          {/* Date From */}
          <div>
            <label
              htmlFor="date-from"
              className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider"
            >
              From
            </label>
            <input
              id="date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-300 cursor-pointer"
              aria-label="Filter jobs from date"
            />
          </div>

          {/* Date To */}
          <div>
            <label
              htmlFor="date-to"
              className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider"
            >
              To
            </label>
            <input
              id="date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-indigo-300 cursor-pointer"
              aria-label="Filter jobs to date"
            />
          </div>

          {/* Sort By */}
          <CustomDropdown
            label="Sort By"
            value={filters.sortBy}
            onChange={(value) => handleFilterChange("sortBy", value)}
            placeholder="Sort By"
            options={[
              { value: "date-desc", label: "Newest First" },
              { value: "date-asc", label: "Oldest First" },
              { value: "title-asc", label: "Title (A-Z)" },
              { value: "title-desc", label: "Title (Z-A)" },
              { value: "applications-desc", label: "Most Applications" },
              { value: "applications-asc", label: "Least Applications" },
            ]}
          />
        </form>
      </section>

      {/* Jobs Table/Cards */}
      <section
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100"
        aria-labelledby="jobs-table-heading"
      >
        <div className="p-6 border-b border-indigo-100 flex justify-between items-center">
          <div>
            <h2 id="jobs-table-heading" className="text-2xl font-bold text-gray-900">
              Job Listings
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, sortedJobs.length)} of{" "}
              {sortedJobs.length} jobs
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center" role="status" aria-live="polite">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading jobs...</h3>
            <p className="text-gray-600">Please wait while we fetch your job postings.</p>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="p-12 text-center" role="status">
            <svg
              className="mx-auto h-16 w-16 text-indigo-200 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new job posting.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                    Job Context
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                    <td className="px-6 py-5">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="text-sm font-bold text-gray-900 mb-1">{job.title}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                              {getExperienceLevelLabel(job.experienceLevel)}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
                              {getJobTypeLabel(job.jobType)}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                              {job.companyName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">{job.location}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <a
                        href={`/recruiter/${job.companySlug}/jobApplicants?jobId=${job.id}`}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-sm inline-block"
                        aria-label={`View ${job.applicationCount} ${
                          job.applicationCount === 1 ? "application" : "applications"
                        } for ${job.title}`}
                      >
                        {job.applicationCount}
                      </a>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        {formatDate(job.postedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <button
                        onClick={() => onToggleJobStatus(job.id, job.isActive)}
                        className={`px-4 py-2 inline-flex text-xs leading-5 font-bold rounded-full ${
                          job.isActive
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } transition-all`}
                        aria-label={`Toggle job status for ${job.title}. Currently ${
                          job.isActive ? "active" : "inactive"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold">
                      <nav className="flex gap-2" aria-label="Job actions">
                        <button
                          onClick={() => onEditJob(job.id, job.companySlug)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-sm"
                          aria-label={`Edit ${job.title} job posting`}
                        >
                          Edit
                        </button>
                        <a
                          href={`/careers/${job.companySlug}/job?jobId=${job.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-sm"
                          aria-label={`View ${job.title} on career page (opens in new tab)`}
                        >
                          View
                        </a>
                      </nav>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && sortedJobs.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page <span className="font-bold">{filters.page}</span> of{" "}
                <span className="font-bold">{totalPages}</span>
              </div>
              <nav className="flex gap-2" aria-label="Pagination">
                <button
                  onClick={() => handleFilterChange("page", filters.page - 1)}
                  disabled={filters.page === 1}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    filters.page === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                  }`}
                  aria-label="Previous page"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (filters.page <= 3) {
                      pageNum = i + 1;
                    } else if (filters.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = filters.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handleFilterChange("page", pageNum)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          filters.page === pageNum
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                            : "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={filters.page === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleFilterChange("page", filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    filters.page === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                  }`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

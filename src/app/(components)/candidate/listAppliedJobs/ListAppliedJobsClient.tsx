"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage, STORAGE_KEYS, getAuthHeaders } from "@/lib/helper";
import { API_ROUTES } from "@/lib/constants";
import { useToast } from "@/app/(components)/common/useToast";
import AuthWrapper from "@/app/(components)/common/AuthWrapper";
import Header from "../../common/Header";

interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedAt: string;
  location: string;
  jobType: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  APPLIED: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "Applied",
  },
  REVIEWING: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Under Review",
  },
  INTERVIEWING: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "Interviewing",
  },
  OFFERED: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Offer Received",
  },
  REJECTED: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Rejected",
  },
  WITHDRAWN: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "Withdrawn",
  },
};

export default function ListAppliedJobsClient() {
  const router = useRouter();
  const { error, ToastContainer } = useToast();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = storage.get(STORAGE_KEYS.USER_DATA);

        if (!user) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${API_ROUTES.CANDIDATE.APPLICATIONS}?email=${encodeURIComponent(user.email)}`,
          {
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();

        if (result.success && result.data) {
          setApplications(result.data);
          setFilteredApplications(result.data);
        } else {
          error("Failed to load applications");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        error("An error occurred while loading your applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [router, error]);

  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(query) ||
          app.companyName.toLowerCase().includes(query) ||
          app.location.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  }, [selectedStatus, searchQuery, applications]);

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      ALL: applications.length,
    };

    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });

    return counts;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <AuthWrapper requiredRole="CANDIDATE">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper requiredRole="CANDIDATE">
      <Header />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <header className="mb-8">
            <nav aria-label="Breadcrumb" className="mb-4">
              <button
                onClick={() => router.push("/candidate/home")}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
                aria-label="Back to Dashboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </button>
            </nav>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600 text-lg">
              Track and manage all your job applications in one place
            </p>
          </header>

          {/* Search and Filter */}
          <section
            aria-label="Search and filter applications"
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search-applications" className="sr-only">
                  Search applications
                </label>
                <input
                  id="search-applications"
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-label="Search by job title, company, or location"
                />
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div
              className="mt-6 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by application status"
            >
              <button
                onClick={() => setSelectedStatus("ALL")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedStatus === "ALL"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={selectedStatus === "ALL"}
              >
                All ({statusCounts.ALL || 0})
              </button>
              {Object.entries(statusColors).map(([status, { bg, text, label }]) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedStatus === status
                      ? "bg-indigo-600 text-white"
                      : `${bg} ${text} hover:opacity-80`
                  }`}
                  aria-pressed={selectedStatus === status}
                >
                  {label} ({statusCounts[status] || 0})
                </button>
              ))}
            </div>
          </section>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <section className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4" role="img" aria-label="Empty mailbox">
                📭
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Found</h2>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedStatus !== "ALL"
                  ? "Try adjusting your filters to see more results."
                  : "You haven't applied to any jobs yet. Start exploring opportunities!"}
              </p>
              <button
                onClick={() => router.push("/candidate/searchJob")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Browse Jobs
              </button>
            </section>
          ) : (
            <section aria-label="Job applications list">
              <ul className="space-y-4">
                {filteredApplications.map((application) => {
                  const statusConfig = statusColors[application.status] || statusColors.APPLIED;

                  return (
                    <li
                      key={application.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
                    >
                      <article className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {application.jobTitle}
                              </h3>
                              <p className="text-lg text-gray-700 font-semibold">
                                {application.companyName}
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.text}`}
                              aria-label={`Application status: ${statusConfig.label}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>

                          <dl className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                            <div className="flex items-center gap-1">
                              <dt className="sr-only">Location</dt>
                              <span aria-hidden="true">📍</span>
                              <dd>{application.location}</dd>
                            </div>
                            <div className="flex items-center gap-1">
                              <dt className="sr-only">Job type</dt>
                              <span aria-hidden="true">💼</span>
                              <dd>{application.jobType.replace("_", " ")}</dd>
                            </div>
                            <div className="flex items-center gap-1">
                              <dt className="sr-only">Applied on</dt>
                              <span aria-hidden="true">📅</span>
                              <dd>
                                <time dateTime={application.appliedAt}>
                                  Applied on {formatDate(application.appliedAt)}
                                </time>
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            onClick={() => {
                              // Navigate to job details or application details
                              // For now, just show a message
                              alert("View details feature coming soon!");
                            }}
                            className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Summary Stats */}
          {applications.length > 0 && (
            <section
              aria-labelledby="summary-heading"
              className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-200"
            >
              <h2 id="summary-heading" className="text-xl font-bold text-gray-900 mb-4">
                Application Summary
              </h2>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <dt className="text-3xl font-bold text-indigo-600">{applications.length}</dt>
                  <dd className="text-sm text-gray-600 mt-1">Total Applications</dd>
                </div>
                <div className="text-center">
                  <dt className="text-3xl font-bold text-yellow-600">
                    {statusCounts.REVIEWING || 0}
                  </dt>
                  <dd className="text-sm text-gray-600 mt-1">Under Review</dd>
                </div>
                <div className="text-center">
                  <dt className="text-3xl font-bold text-purple-600">
                    {statusCounts.INTERVIEWING || 0}
                  </dt>
                  <dd className="text-sm text-gray-600 mt-1">Interviewing</dd>
                </div>
                <div className="text-center">
                  <dt className="text-3xl font-bold text-green-600">{statusCounts.OFFERED || 0}</dt>
                  <dd className="text-sm text-gray-600 mt-1">Offers</dd>
                </div>
              </dl>
            </section>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}

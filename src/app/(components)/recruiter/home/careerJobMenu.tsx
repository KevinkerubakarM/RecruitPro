"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUserData, getAuthHeaders } from "@/lib/helper";
import { API_ROUTES } from "@/lib/constants";
import {
  JobFilters,
  DashboardData,
} from "@/types/app/(components)/recruiter/home.type";
import ManageCareerJobModal from "./manageCareerJobModal";
import JobMetricBoard from "./jobMetricBoard";

interface Company {
  id: string;
  companyName: string;
  companySlug: string;
}

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  isActive: boolean;
}

export default function CareerJobMenu() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [actionType, setActionType] = useState<"career" | "job" | null>(null);
  const [actionMode, setActionMode] = useState<
    "create" | "view" | "edit" | null
  >(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedCompanySlug, setSelectedCompanySlug] = useState<string>("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [existingJobs, setExistingJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [createNewJob, setCreateNewJob] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    companyName: "",
    jobType: "",
    experienceLevel: "",
    isActive: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!userData?.userId) {
        return;
      }

      setLoadingCompanies(true);
      try {
        const response = await fetch(API_ROUTES.RECRUITER.BRANDING, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) return;

        const result = await response.json();
        if (result.success && result.data) {
          const companiesArray = Array.isArray(result.data)
            ? result.data
            : [result.data];
          setCompanies(companiesArray);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    if (userData?.userId) {
      fetchCompanies();
    }
  }, [userData]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData?.userId) {
        return;
      }

      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          ...(filters.search && { search: filters.search }),
          ...(filters.jobType && { jobType: filters.jobType }),
          ...(filters.experienceLevel && {
            experienceLevel: filters.experienceLevel,
          }),
          ...(filters.isActive && { isActive: filters.isActive }),
          ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
          ...(filters.dateTo && { dateTo: filters.dateTo }),
        });

        const response = await fetch(
          `${API_ROUTES.RECRUITER.DASHBOARD}?${queryParams}`,
          {
            headers: getAuthHeaders(),
          }
        );
        const result = await response.json();

        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData, filters, refetchTrigger]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: "",
      companyName: "",
      jobType: "",
      experienceLevel: "",
      isActive: "",
      dateFrom: "",
      dateTo: "",
    });
  }, []);

  const resetModalState = useCallback(() => {
    setActionType(null);
    setActionMode(null);
    setSelectedCompany("");
    setNewCompanyName("");
    setSelectedCompanySlug("");
    setSelectedJob("");
    setCreateNewJob(false);
    setExistingJobs([]);
  }, []);

  const handleToggleJobStatus = useCallback(
    async (jobId: string, currentStatus: boolean) => {
      if (!userData?.userId) {
        return;
      }

      try {
        const response = await fetch(API_ROUTES.RECRUITER.DASHBOARD, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            jobId,
            isActive: !currentStatus,
          }),
        });

        if (!response.ok) throw new Error("Failed to toggle job status");

        const result = await response.json();
        if (result.success) {
          setRefetchTrigger((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error toggling job status:", error);
      }
    },
    [userData]
  );

  const handleOpenActionModal = useCallback(async () => {
    setShowActionModal(true);

    if (!userData?.userId) {
      return;
    }

    setLoadingCompanies(true);

    try {
      const response = await fetch(API_ROUTES.RECRUITER.BRANDING, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) return;

      const result = await response.json();
      if (result.success && result.data) {
        const companiesArray = Array.isArray(result.data)
          ? result.data
          : [result.data];
        setCompanies(companiesArray);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  }, [userData]);

  const handleSelectAction = useCallback(
    async (type: "career" | "job", mode: "create" | "view" | "edit") => {
      setActionType(type);
      setActionMode(mode);
      setShowActionModal(false);

      if (mode === "create" && type === "career") {
        setShowCompanyModal(true);
        return;
      }

      setLoadingCompanies(true);
      setShowCompanyModal(true);

      try {
        const response = await fetch(API_ROUTES.RECRUITER.BRANDING, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch companies");

        const result = await response.json();
        if (result.success && result.data) {
          const companiesArray = Array.isArray(result.data)
            ? result.data
            : [result.data];
          setCompanies(companiesArray);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    },
    [userData]
  );

  const handleCompanySelection = useCallback(async () => {
    let companySlug = "";
    let companyId = "";

    if (selectedCompany) {
      const company = companies.find((c) => c.companySlug === selectedCompany);
      if (company) {
        companySlug = company.companySlug;
        companyId = company.id;
      }
    } else if (newCompanyName.trim()) {
      companySlug = newCompanyName.toLowerCase().replace(/\s+/g, "-");
    }

    if (!companySlug) return;

    setSelectedCompanySlug(companySlug);

    if (actionType === "career") {
      const route =
        actionMode === "view"
          ? `/careers/${companySlug}`
          : `/recruiter/${companySlug}/edit`;

      setShowCompanyModal(false);
      resetModalState();
      router.push(route);
      return;
    }

    if (actionType === "job") {
      setShowCompanyModal(false);

      // For create mode, go directly to job creation page
      if (actionMode === "create") {
        const route = `/recruiter/${companySlug}/addJobs`;
        resetModalState();
        router.push(route);
        return;
      }

      // For view/edit modes, fetch jobs and show job selection modal
      if (companyId) {
        setLoadingJobs(true);
        try {
          const response = await fetch(
            `${API_ROUTES.JOBS}?companyBrandingId=${companyId}`,
            {
              headers: getAuthHeaders(),
            }
          );
          if (!response.ok) throw new Error("Failed to fetch jobs");

          const result = await response.json();
          if (result.success && result.data && result.data.jobs) {
            setExistingJobs(result.data.jobs);
          } else {
            setExistingJobs([]);
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
          setExistingJobs([]);
        } finally {
          setLoadingJobs(false);
        }
      } else {
        setExistingJobs([]);
      }

      setShowJobModal(true);
    }
  }, [
    selectedCompany,
    companies,
    newCompanyName,
    actionType,
    actionMode,
    router,
    resetModalState,
    userData,
  ]);

  const handleCloseModal = useCallback(() => {
    setShowCompanyModal(false);
    resetModalState();
  }, [resetModalState]);

  const handleCloseActionModal = useCallback(() => {
    setShowActionModal(false);
  }, []);

  const handleJobSelection = useCallback(() => {
    if (!selectedCompanySlug) return;

    let route = `/recruiter/${selectedCompanySlug}/addJobs`;

    if (selectedJob) {
      route += `?edit=${selectedJob}`;
    } else if (createNewJob && newCompanyName) {
      route += `?new=true&name=${encodeURIComponent(newCompanyName)}`;
    }

    setShowJobModal(false);
    resetModalState();
    router.push(route);
  }, [
    selectedJob,
    createNewJob,
    selectedCompanySlug,
    newCompanyName,
    router,
    resetModalState,
  ]);

  const handleCloseJobModal = useCallback(() => {
    setShowJobModal(false);
    setSelectedJob("");
    setCreateNewJob(false);
    setExistingJobs([]);
  }, []);

  const handleBackToCompanySelection = useCallback(() => {
    setShowJobModal(false);
    setSelectedJob("");
    setCreateNewJob(false);
    setExistingJobs([]);
    setShowCompanyModal(true);
  }, []);

  const handleEditJob = useCallback(
    (jobId: string, companySlug: string) => {
      router.push(`/recruiter/${companySlug}/addJobs?edit=${jobId}`);
    },
    [router]
  );

  const handleViewApplications = useCallback(
    (jobId: string) => {
      // router.push(`/recruiter/applications/${jobId}`);
    },
    [router]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dashboard Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
          Recruiter Dashboard
        </h1>
        <p className="mt-3 text-xl text-gray-600 font-medium">
          Manage your company career page and job postings
        </p>
      </header>

      {/* Action Button */}
      <section
        className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 px-6 shadow-2xl rounded-3xl mb-8"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="cta-heading"
            className="text-4xl lg:text-5xl font-extrabold text-white mb-6"
          >
            Build Your Brand, Attract Top Talent
          </h2>
          <p className="text-xl text-indigo-100 mb-10 font-medium">
            Create customized career pages and job postings that showcase your
            company culture and opportunities
          </p>
          <button
            onClick={handleOpenActionModal}
            className="px-16 py-6 bg-white text-indigo-600 rounded-3xl font-extrabold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            aria-label="Open career page and job posting wizard"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Dashboard Main Content (Stats, Filters, Table) */}
      {loading && !dashboardData ? (
        <section
          className="mt-12"
          aria-label="Loading dashboard"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Dashboard...
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch your data.
            </p>
          </div>
        </section>
      ) : dashboardData ? (
        <section aria-label="Dashboard metrics and job listings">
          <JobMetricBoard
            stats={dashboardData.stats}
            jobs={dashboardData.jobs}
            companies={companies}
            loading={loading}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
            onEditJob={handleEditJob}
            onViewApplications={handleViewApplications}
            onToggleJobStatus={handleToggleJobStatus}
          />
        </section>
      ) : null}

      <ManageCareerJobModal
        showActionModal={showActionModal}
        showCompanyModal={showCompanyModal}
        showJobModal={showJobModal}
        loadingCompanies={loadingCompanies}
        loadingJobs={loadingJobs}
        companies={companies}
        existingJobs={existingJobs}
        actionType={actionType}
        actionMode={actionMode}
        selectedCompany={selectedCompany}
        selectedCompanySlug={selectedCompanySlug}
        newCompanyName={newCompanyName}
        selectedJob={selectedJob}
        createNewJob={createNewJob}
        onCloseActionModal={handleCloseActionModal}
        onCloseCompanyModal={handleCloseModal}
        onCloseJobModal={handleCloseJobModal}
        onSelectAction={handleSelectAction}
        onCompanySelection={handleCompanySelection}
        onJobSelection={handleJobSelection}
        onBackToCompanySelection={handleBackToCompanySelection}
        onSelectCompany={(slug) => {
          setSelectedCompany(slug);
          setNewCompanyName("");
        }}
        onNewCompanyNameChange={(name) => {
          setNewCompanyName(name);
          setSelectedCompany("");
        }}
        onSelectJob={(jobId) => setSelectedJob(jobId)}
        onCreateNewJobChange={(create) => setCreateNewJob(create)}
      />
    </div>
  );
}

"use client";

import { useMemo } from "react";

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

interface ManageCareerJobModalProps {
  showActionModal: boolean;
  showCompanyModal: boolean;
  showJobModal: boolean;
  loadingCompanies: boolean;
  loadingJobs: boolean;
  companies: Company[];
  existingJobs: Job[];
  actionType: "career" | "job" | null;
  actionMode: "create" | "view" | "edit" | null;
  selectedCompany: string;
  selectedCompanySlug: string;
  newCompanyName: string;
  selectedJob: string;
  createNewJob: boolean;
  onCloseActionModal: () => void;
  onCloseCompanyModal: () => void;
  onCloseJobModal: () => void;
  onSelectAction: (type: "career" | "job", mode: "create" | "view" | "edit") => void;
  onCompanySelection: () => void;
  onJobSelection: () => void;
  onBackToCompanySelection: () => void;
  onSelectCompany: (slug: string) => void;
  onNewCompanyNameChange: (name: string) => void;
  onSelectJob: (jobId: string) => void;
  onCreateNewJobChange: (create: boolean) => void;
}

export default function ManageCareerJobModal({
  showActionModal,
  showCompanyModal,
  showJobModal,
  companies,
  existingJobs,
  actionType,
  actionMode,
  selectedCompany,
  newCompanyName,
  selectedJob,
  createNewJob,
  onCloseActionModal,
  onCloseCompanyModal,
  onCloseJobModal,
  onSelectAction,
  onCompanySelection,
  onJobSelection,
  onBackToCompanySelection,
  onSelectCompany,
  onNewCompanyNameChange,
  onSelectJob,
  onCreateNewJobChange,
}: ManageCareerJobModalProps) {
  const hasCompanies = useMemo(() => companies.length > 0, [companies.length]);

  const modalTitle = useMemo(() => {
    if (!actionMode || !actionType) return "";

    const titles = {
      career: {
        create: "Create Career Page",
        view: "Select Company to View",
        edit: "Select Company to Edit",
      },
      job: {
        create: "Select Company for New Job",
        view: "Select Company to View Jobs",
        edit: "Select Company to Edit Job",
      },
    };

    return titles[actionType][actionMode];
  }, [actionMode, actionType]);

  const isCompanySelectionValid = useMemo(() => {
    // For creating a career page, check if newCompanyName is filled
    if (actionMode === "create" && actionType === "career") {
      return newCompanyName.trim();
    }
    // For all other cases (view, edit, or create job), check if a company is selected
    return selectedCompany;
  }, [actionMode, actionType, newCompanyName, selectedCompany]);

  return (
    <>
      {/* Action Selection Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-extrabold text-gray-900">
                  What would you like to do?
                </h3>
                <button
                  onClick={onCloseActionModal}
                  className="border-2 rounded-lg w-10 h-10 flex items-center justify-center text-xl font-bold transition-all"
                  style={{ backgroundColor: "transparent", color: "black", borderColor: "#4f46e5" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#4f46e5";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "black";
                  }}
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-700 uppercase tracking-wide border-b-2 border-indigo-200 pb-2">
                    Career Pages
                  </h4>

                  <label className="flex items-center p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      value="career-create"
                      onChange={() => onSelectAction("career", "create")}
                      className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Create Career Page</div>
                      <div className="text-sm text-gray-500">Build a new company profile</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-5 border-2 rounded-xl transition-all ${
                      !hasCompanies
                        ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-50"
                        : "bg-white border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="career-view"
                      disabled={!hasCompanies}
                      onChange={() => onSelectAction("career", "view")}
                      className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">View Career Page</div>
                      <div className="text-sm text-gray-500">Preview your published pages</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-5 border-2 rounded-xl transition-all ${
                      !hasCompanies
                        ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-50"
                        : "bg-white border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="career-edit"
                      disabled={!hasCompanies}
                      onChange={() => onSelectAction("career", "edit")}
                      className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Edit Career Page</div>
                      <div className="text-sm text-gray-500">Update existing pages</div>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-700 uppercase tracking-wide border-b-2 border-purple-200 pb-2">
                    Job Posts
                  </h4>

                  <label
                    className={`flex items-center p-5 border-2 rounded-xl transition-all ${
                      !hasCompanies
                        ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-50"
                        : "bg-white border-gray-200 hover:border-purple-600 hover:bg-purple-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="job-create"
                      disabled={!hasCompanies}
                      onChange={() => onSelectAction("job", "create")}
                      className="mr-4 h-5 w-5 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Create Job Post</div>
                      <div className="text-sm text-gray-500">
                        {!hasCompanies ? "Create a career page first" : "Post a new job opening"}
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-5 border-2 rounded-xl transition-all ${
                      !hasCompanies
                        ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-50"
                        : "bg-white border-gray-200 hover:border-purple-600 hover:bg-purple-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="job-view"
                      disabled={!hasCompanies}
                      onChange={() => onSelectAction("job", "view")}
                      className="mr-4 h-5 w-5 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">View Job Posts</div>
                      <div className="text-sm text-gray-500">
                        {!hasCompanies ? "Create a career page first" : "Browse active listings"}
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-5 border-2 rounded-xl transition-all ${
                      !hasCompanies
                        ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-50"
                        : "bg-white border-gray-200 hover:border-purple-600 hover:bg-purple-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="action"
                      value="job-edit"
                      disabled={!hasCompanies}
                      onChange={() => onSelectAction("job", "edit")}
                      className="mr-4 h-5 w-5 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Edit Job Post</div>
                      <div className="text-sm text-gray-500">
                        {!hasCompanies ? "Create a career page first" : "Modify existing posts"}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {!hasCompanies && (
                <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <div>
                    <div className="font-bold text-amber-900">Getting Started</div>
                    <div className="text-sm text-amber-700 mt-1">
                      Create your first career page to unlock job posting features. A career page
                      showcases your company and hosts all your job listings.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Company Selection Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-extrabold text-gray-900">{modalTitle}</h3>
                <button
                  onClick={onCloseCompanyModal}
                  className="border-2 rounded-lg w-10 h-10 flex items-center justify-center text-xl font-bold transition-all"
                  style={{ backgroundColor: "transparent", color: "black", borderColor: "#4f46e5" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#4f46e5";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "black";
                  }}
                >
                  ×
                </button>
              </div>

              {hasCompanies && !(actionMode === "create" && actionType === "career") && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Select Company
                  </label>
                  <div className="space-y-3">
                    {companies.map((company) => (
                      <label
                        key={company.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedCompany === company.companySlug
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="company"
                          value={company.companySlug}
                          checked={selectedCompany === company.companySlug}
                          onChange={(e) => {
                            onSelectCompany(e.target.value);
                          }}
                          className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{company.companyName}</div>
                          <div className="text-sm text-gray-500">/{company.companySlug}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {actionMode === "create" && actionType === "career" && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Add New Company
                  </label>
                  <input
                    type="text"
                    placeholder="Enter company name..."
                    value={newCompanyName}
                    onChange={(e) => onNewCompanyNameChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  {newCompanyName && (
                    <p className="mt-2 text-sm text-gray-500">
                      Slug will be:{" "}
                      <span className="font-mono font-bold text-indigo-600">
                        {newCompanyName.toLowerCase().replace(/\s+/g, "-")}
                      </span>
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={onCloseCompanyModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onCompanySelection}
                  disabled={!isCompanySelectionValid}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                    isCompanySelectionValid
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {actionMode === "view" ? "View" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Selection Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-extrabold text-gray-900">
                  {actionMode === "edit" ? "Select Job to Edit" : "Select Job Post"}
                </h3>
                <button
                  onClick={onCloseJobModal}
                  className="border-2 rounded-lg w-10 h-10 flex items-center justify-center text-xl font-bold transition-all"
                  style={{ backgroundColor: "transparent", color: "black", borderColor: "#4f46e5" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#4f46e5";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "black";
                  }}
                >
                  ×
                </button>
              </div>

              {existingJobs.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Select Existing Job
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {existingJobs.map((job) => (
                      <label
                        key={job.id}
                        className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedJob === job.id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="job"
                          value={job.id}
                          checked={selectedJob === job.id}
                          onChange={(e) => {
                            onSelectJob(e.target.value);
                            onCreateNewJobChange(false);
                          }}
                          className="mr-4 mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-gray-900">
                              {job.title || "Untitled Job"}
                            </div>
                            {job.isActive ? (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-bold">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-bold">
                                Inactive
                              </span>
                            )}
                          </div>
                          {(job.location || job.jobType) && (
                            <div className="text-sm text-gray-500 mt-1">
                              {job.location || "Location not specified"}
                              {job.location && job.jobType && " • "}
                              {job.jobType || ""}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {existingJobs.length === 0 && (
                <div className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl text-center">
                  <div className="text-amber-600 mb-3">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="font-bold text-amber-900 mb-2">No Job Posts Yet</div>
                  <div className="text-sm text-amber-700 mb-4">
                    This company doesn't have any job posts yet.
                    {actionMode === "create" && " You can create the first one below!"}
                  </div>
                  {actionMode !== "create" && (
                    <button
                      onClick={() => {
                        onCloseJobModal();
                        onSelectAction("job", "create");
                      }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-all"
                    >
                      Create First Job Post
                    </button>
                  )}
                </div>
              )}

              {existingJobs.length > 0 && actionMode === "create" && (
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-bold uppercase tracking-wide">
                      Or
                    </span>
                  </div>
                </div>
              )}

              {actionMode === "create" && (
                <div className="mb-8">
                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      createNewJob || existingJobs.length === 0
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="job"
                      checked={createNewJob || existingJobs.length === 0}
                      onChange={(e) => {
                        onCreateNewJobChange(e.target.checked);
                        onSelectJob("");
                      }}
                      className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">Create New Job Post</div>
                      <div className="text-sm text-gray-500">Start with a blank job posting</div>
                    </div>
                  </label>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={onBackToCompanySelection}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={onJobSelection}
                  disabled={
                    actionMode === "create"
                      ? !selectedJob && !createNewJob && existingJobs.length > 0
                      : !selectedJob
                  }
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                    (actionMode === "create" &&
                      (selectedJob || createNewJob || existingJobs.length === 0)) ||
                    (actionMode !== "create" && selectedJob)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

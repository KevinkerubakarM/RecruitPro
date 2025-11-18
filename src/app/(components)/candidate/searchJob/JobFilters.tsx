"use client";

import { JobFiltersProps } from "@/types/app/(components)/candidate/jobcard.type";
import { JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";
import { useState } from "react";

export default function JobFilters({
  filters,
  onFilterChange,
  locations,
  jobTypeCounts = {},
}: JobFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ location: e.target.value || undefined });
  };

  const handleJobTypeToggle = (type: string) => {
    const current = filters.jobType || [];
    const updated = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];
    onFilterChange({ jobType: updated.length > 0 ? updated : undefined });
  };

  const handleExperienceLevelToggle = (level: string) => {
    const current = filters.experienceLevel || [];
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    onFilterChange({ experienceLevel: updated.length > 0 ? updated : undefined });
  };

  const handleClearAll = () => {
    onFilterChange({ location: undefined, jobType: undefined, experienceLevel: undefined });
  };

  const activeFilterCount =
    (filters.location ? 1 : 0) +
    (filters.jobType?.length || 0) +
    (filters.experienceLevel?.length || 0);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-bold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all"
            aria-label="Clear all filters"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden w-full flex items-center justify-between py-2 text-gray-700"
        aria-expanded={isExpanded}
        aria-controls="filter-content"
      >
        <span className="font-medium">{isExpanded ? "Hide Filters" : "Show Filters"}</span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter content */}
      <div id="filter-content" className={`space-y-6 ${isExpanded ? "block" : "hidden"} lg:block`}>
        {/* Location filter */}
        <div>
          <label
            htmlFor="location-filter"
            className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide"
          >
            Location
          </label>
          <select
            id="location-filter"
            value={filters.location || ""}
            onChange={handleLocationChange}
            className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl 
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all
                       hover:border-indigo-300 bg-white font-medium cursor-pointer"
            aria-label="Filter by location"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type filter */}
        <div>
          <fieldset>
            <legend className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Job Type
            </legend>
            <div className="space-y-3">
              {Object.entries(JOB_TYPES).map(([key, label]) => {
                const count = jobTypeCounts[key] || 0;
                return (
                  <label
                    key={key}
                    className="flex items-center cursor-pointer hover:bg-indigo-50 p-3 rounded-xl transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={filters.jobType?.includes(key) || false}
                      onChange={() => handleJobTypeToggle(key)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 
                                 border-gray-300 rounded-md"
                      aria-label={`Filter by ${label}`}
                    />
                    <span className="ml-3 text-sm text-gray-900 flex-1 font-semibold">{label}</span>
                    {count > 0 && (
                      <span className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full font-bold">
                        {count}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Experience Level filter */}
        <div>
          <fieldset>
            <legend className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Experience Level
            </legend>
            <div className="space-y-3">
              {Object.entries(EXPERIENCE_LEVELS).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center cursor-pointer hover:bg-indigo-50 p-3 rounded-xl transition-all"
                >
                  <input
                    type="checkbox"
                    checked={filters.experienceLevel?.includes(key) || false}
                    onChange={() => handleExperienceLevelToggle(key)}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 
                               border-gray-300 rounded-md"
                    aria-label={`Filter by ${label} experience`}
                  />
                  <span className="ml-3 text-sm text-gray-900 font-semibold">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

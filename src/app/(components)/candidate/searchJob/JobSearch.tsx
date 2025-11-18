"use client";

import { JobSearchProps } from "@/types/app/(components)/candidate/jobcard.type";
import { useState, useCallback } from "react";
import { debounce } from "@/lib/helper";
import { UI } from "@/lib/constants";

export default function JobSearch({
  initialValue = "",
  onSearch,
  placeholder = "Search by job title, skills, or keywords...",
}: JobSearchProps) {
  const [searchValue, setSearchValue] = useState(initialValue);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, UI.DEBOUNCE_DELAY),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor="job-search" className="sr-only">
        Search jobs
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          id="job-search"
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full pl-14 pr-14 py-5 border-2 border-indigo-200 rounded-2xl 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-lg
                     hover:border-indigo-300 text-lg placeholder-gray-400 transition-all font-medium"
          aria-label="Search for jobs"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400 hover:text-indigo-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { CTAButtonsProps } from "@/types/app/(components)/candidate/home.type";

export default function CTAButtons({ onSearchJobs, onViewApplications }: CTAButtonsProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 px-6 shadow-2xl rounded-2xl mb-10"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 id="cta-heading" className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
          Welcome to Your Job Portal
        </h2>
        <p className="text-xl text-indigo-100 mb-10 font-medium">
          Search for your dream job or track your applications all in one place.
        </p>
        <nav aria-label="Primary job search actions">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/candidate/searchJob"
              onClick={onSearchJobs}
              className="px-12 py-5 bg-white text-indigo-600 rounded-3xl font-extrabold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              aria-label="Search for available job opportunities"
            >
              <span aria-hidden="true">🔍</span> Search for Jobs
            </Link>
            <button
              onClick={onViewApplications}
              className="px-12 py-5 bg-white text-indigo-600 rounded-3xl font-extrabold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              aria-label="View and manage your job applications"
            >
              <span aria-hidden="true">📋</span> View Applications
            </button>
          </div>
        </nav>
      </div>
    </section>
  );
}

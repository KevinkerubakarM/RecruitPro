"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage, STORAGE_KEYS, getAuthHeaders } from "@/lib/helper";
import { CandidateStats } from "@/types/app/(components)/candidate/home.type";
import { API_ROUTES } from "@/lib/constants";
import CTAButtons from "./CTAButtons";
import StatsCards from "./StatsCards";
import AuthWrapper from "@/app/(components)/common/AuthWrapper";
import { useToast } from "@/app/(components)/common/useToast";
import Header from "../../common/Header";

export default function CandidateHomeClient() {
  const router = useRouter();
  const { error, ToastContainer } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CandidateStats>({
    totalApplications: 0,
    activeApplications: 0,
    interviewingCount: 0,
    offersReceived: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = storage.get(STORAGE_KEYS.USER_DATA);

        if (!user) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${API_ROUTES.CANDIDATE.STATS}?email=${encodeURIComponent(user.email)}`,
          {
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();

        if (result.success && result.data) {
          setStats(result.data);
        } else {
          error("Failed to load statistics");
        }
      } catch (err) {
        console.error("Error fetching candidate stats:", err);
        error("An error occurred while loading your dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router, error]);

  const handleSearchJobs = () => {
    router.push("/candidate/searchJob");
  };

  const handleViewApplications = () => {
    router.push("/candidate/listAppliedJobs");
  };

  return (
    <AuthWrapper requiredRole="CANDIDATE">
      <Header />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Candidate Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Welcome back! Here's an overview of your job search progress.
            </p>
          </header>

          {/* CTA Buttons */}
          <CTAButtons onSearchJobs={handleSearchJobs} onViewApplications={handleViewApplications} />

          {/* Stats Cards */}
          <StatsCards stats={stats} loading={loading} />

          {/* Tips Section */}
          {stats.totalApplications === 0 && (
            <aside
              aria-labelledby="tips-heading"
              className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-200"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl" aria-hidden="true">
                  💡
                </div>
                <div className="flex-1">
                  <h3 id="tips-heading" className="text-xl font-bold text-gray-900 mb-3">
                    Get Started with Your Job Search
                  </h3>
                  <ol className="space-y-2 text-gray-700 list-inside">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold" aria-hidden="true">
                        1.
                      </span>
                      <span>Complete your profile with your latest experience and skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold" aria-hidden="true">
                        2.
                      </span>
                      <span>
                        Browse available positions and find roles that match your expertise
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold" aria-hidden="true">
                        3.
                      </span>
                      <span>
                        Apply to jobs and track your progress right here on your dashboard
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}

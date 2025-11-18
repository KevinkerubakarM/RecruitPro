"use client";

import { StatsCardsProps, StatCardData } from "@/types/app/(components)/candidate/home.type";

export default function StatsCards({ stats, loading = false }: StatsCardsProps) {
  const statsCards: StatCardData[] = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      gradient: "from-indigo-50 to-indigo-100",
      textColor: "text-indigo-900",
      accentColor: "bg-indigo-500",
    },
    {
      title: "Active Applications",
      value: stats.activeApplications,
      gradient: "from-emerald-50 to-emerald-100",
      textColor: "text-emerald-900",
      accentColor: "bg-emerald-500",
    },
    {
      title: "Interviewing",
      value: stats.interviewingCount,
      gradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-900",
      accentColor: "bg-purple-500",
    },
    {
      title: "Offers Received",
      value: stats.offersReceived,
      gradient: "from-pink-50 to-pink-100",
      textColor: "text-pink-900",
      accentColor: "bg-pink-500",
    },
  ];

  if (loading) {
    return (
      <section
        aria-label="Loading application statistics"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-2xl shadow-lg p-6 animate-pulse"
            role="status"
            aria-label="Loading"
          >
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Application Statistics
      </h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl shadow-lg hover:shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/50 backdrop-blur-sm relative overflow-hidden`}
            role="group"
            aria-label={`${card.title}: ${card.value}`}
          >
            <div
              className={`absolute top-0 left-0 w-1 h-full ${card.accentColor}`}
              aria-hidden="true"
            ></div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <dt className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  {card.title}
                </dt>
                <dd className={`text-4xl font-black ${card.textColor}`}>{card.value}</dd>
              </div>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

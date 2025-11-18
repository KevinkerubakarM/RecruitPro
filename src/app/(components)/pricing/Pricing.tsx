"use client";

import Link from "next/link";
import { useState } from "react";

interface PricingPlan {
  name: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      name: "Recruiter Pro",
      description: "Small companies with a single HR/recruiter ( < 70 employees)",
      features: [
        "Total 5 jobs",
        "Unlimited Candidates",
        "Up to 2 Hiring manager / Interviewers",
        "Job Board Integrations",
        "Career Site Builder",
        "Google or Outlook Email Integration",
        "Basic Screening",
        "Interview Scheduling",
      ],
    },
    {
      name: "Teams",
      description: "Companies with a talent acquisition teams",
      features: [
        "Everything in Recruiter Pro +",
        "Unlimited Jobs and Candidates",
        "10 Hiring manager / Interviewers",
        "Access for all employees (Referrals)",
        "Advanced Screening Tools (Skill based tests, One way Video interview etc)",
        "Interview self-scheduling by Candidates",
        "Offer Management & candidate e-signature",
      ],
      isPopular: true,
    },
    {
      name: "Teams Pro",
      description: "Companies with a talent acquisition team & advanced requirements",
      features: [
        "Everything in Teams +",
        "Job Requisition and Approvals",
        "Psychometric testing",
        "Offer approval flow",
        "Advanced and Custom Reporting",
        "Open APIs",
      ],
    },
  ];

  return (
    <main>
      <section
        className="max-w-7xl mx-auto mb-16 text-center py-12"
        aria-labelledby="pricing-heading"
      >
        <h1 id="pricing-heading" className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
          Flexible pricing for companies of all sizes. Start hiring smarter today.
        </p>
      </section>

      {/* Pricing Cards */}
      <section
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6"
        aria-label="Pricing plans"
      >
        {plans.map((plan, index) => (
          <article
            key={index}
            className={`bg-white rounded-3xl shadow-xl border-2 p-8 flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
              plan.isPopular ? "border-indigo-500 scale-105" : "border-gray-200"
            }`}
            aria-label={`${plan.name} pricing plan`}
          >
            {/* Plan Name */}
            <header className="mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{plan.name}</h2>
              {plan.isPopular && (
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">
                  Most Popular
                </span>
              )}
            </header>

            {/* Buttons */}
            <nav className="mb-8 space-y-3" aria-label="Plan actions">
              <button
                onClick={() => setSelectedPlan(plan.name)}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label={`Get pricing for ${plan.name}`}
              >
                Get pricing
              </button>
              <button
                onClick={() => setSelectedPlan(plan.name)}
                className="w-full py-4 px-6 bg-white text-gray-700 border-2 border-gray-300 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                aria-label={`Explore features for ${plan.name}`}
              >
                Explore features
              </button>
            </nav>

            {/* Suitable For */}
            <div className="mb-6 pb-6 border-b-2 border-gray-100">
              <h3 className="text-sm font-extrabold text-gray-900 mb-3 uppercase tracking-wide">
                Suitable for
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {plan.description}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-gray-900 mb-4 uppercase tracking-wide">
                Key Highlights
              </h3>
              <ul className="space-y-3 list-none">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {/* Back to Home Link */}
      <nav className="max-w-7xl mx-auto mt-16 mb-12 text-center" aria-label="Navigation">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-lg hover:underline transition-all"
          aria-label="Return to home page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </nav>
    </main>
  );
}

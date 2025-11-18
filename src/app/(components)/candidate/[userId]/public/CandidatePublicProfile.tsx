"use client";

import { useEffect, useState } from "react";

interface CandidateProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  resume: string | null;
  skills: string[];
  experience: number | null;
  education: string | null;
  location: string | null;
  availableForWork: boolean;
  isNewToExperience: boolean;
  yearsOfExperience: number | null;
  companies: string[];
  designations: string[];
  lookingForRoles: string[];
  memberSince: string;
}

interface Props {
  userId: string;
}

export default function CandidatePublicProfileClient({ userId }: Props) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/candidate/${userId}/profile`);
        const result = await response.json();

        if (result.success) {
          setProfile(result.data);
        } else {
          setError(result.error?.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An error occurred while loading the profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    if (!profile) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      email: profile.email,
      telephone: profile.phone || undefined,
      jobTitle: profile.lookingForRoles?.[0] || undefined,
      address: profile.location
        ? {
            "@type": "PostalAddress",
            addressLocality: profile.location,
          }
        : undefined,
      alumniOf: profile.education
        ? {
            "@type": "EducationalOrganization",
            name: profile.education,
          }
        : undefined,
      knowsAbout: profile.skills,
      worksFor: profile.companies?.map((company: string, index: number) => ({
        "@type": "Organization",
        name: company,
        jobTitle: profile.designations?.[index] || undefined,
      })),
      url: `/candidate/${userId}/public`,
      description: `Professional profile of ${profile.name}${
        profile.location ? ` based in ${profile.location}` : ""
      }`,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Profile not found"}</p>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData();

  return (
    <>
      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <article className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <header className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold"
                  aria-label={`${profile.name} avatar`}
                >
                  {profile.name?.charAt(0).toUpperCase() || "C"}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile.name || "Candidate"}</h1>
                  {profile.location && (
                    <p className="text-indigo-100 flex items-center gap-2 mt-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span itemProp="addressLocality">{profile.location}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {profile.availableForWork && (
                  <span className="inline-flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <span
                      className="w-2 h-2 bg-green-300 rounded-full animate-pulse"
                      aria-hidden="true"
                    ></span>
                    Available for Work
                  </span>
                )}
                {profile.yearsOfExperience !== null && (
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    <span itemProp="yearsOfExperience">
                      {profile.yearsOfExperience}{" "}
                      {profile.yearsOfExperience === 1 ? "Year" : "Years"} Experience
                    </span>
                  </span>
                )}
                {profile.isNewToExperience && (
                  <span className="bg-white/20 px-3 py-1 rounded-full">Fresher</span>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            {/* Contact Information */}
            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-2xl font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <address className="space-y-2 not-italic">
                <p className="text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-indigo-600 hover:underline"
                    itemProp="email"
                  >
                    {profile.email}
                  </a>
                </p>
                {profile.phone && (
                  <p className="text-gray-700 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span itemProp="telephone">{profile.phone}</span>
                  </p>
                )}
              </address>
            </section>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <section aria-labelledby="skills-heading">
                <h2 id="skills-heading" className="text-2xl font-bold text-gray-900 mb-4">
                  Skills
                </h2>
                <ul className="flex flex-wrap gap-2" role="list">
                  {profile.skills.map((skill, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-semibold rounded-full"
                      itemProp="knowsAbout"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Looking For Roles */}
            {profile.lookingForRoles && profile.lookingForRoles.length > 0 && (
              <section aria-labelledby="roles-heading">
                <h2 id="roles-heading" className="text-2xl font-bold text-gray-900 mb-4">
                  Looking For Roles
                </h2>
                <ul className="flex flex-wrap gap-2" role="list">
                  {profile.lookingForRoles.map((role, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-full"
                      itemProp="jobTitle"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Work Experience */}
            {profile.companies && profile.companies.length > 0 && (
              <section aria-labelledby="experience-heading">
                <h2 id="experience-heading" className="text-2xl font-bold text-gray-900 mb-4">
                  Work Experience
                </h2>
                <ul className="space-y-4" role="list">
                  {profile.companies.map((company, index) => (
                    <li key={index} className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-900" itemProp="worksFor">
                        {company}
                      </h3>
                      {profile.designations[index] && (
                        <p className="text-gray-700">{profile.designations[index]}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Education */}
            {profile.education && (
              <section aria-labelledby="education-heading">
                <h2 id="education-heading" className="text-2xl font-bold text-gray-900 mb-4">
                  Education
                </h2>
                <p className="text-gray-700" itemProp="alumniOf">
                  {profile.education}
                </p>
              </section>
            )}

            {/* Resume */}
            {profile.resume && (
              <section aria-labelledby="resume-heading">
                <h2 id="resume-heading" className="text-2xl font-bold text-gray-900 mb-4">
                  Resume
                </h2>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  itemProp="url"
                  aria-label="Download resume PDF"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Resume
                </a>
              </section>
            )}

            {/* Member Since */}
            <footer className="pt-6 border-t">
              <p className="text-sm text-gray-500">
                Member since{" "}
                <time dateTime={profile.memberSince} itemProp="memberSince">
                  {new Date(profile.memberSince).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </p>
            </footer>
          </div>
        </article>
      </div>
    </>
  );
}

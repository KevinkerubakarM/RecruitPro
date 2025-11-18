"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserData, getAuthHeaders } from "@/lib/helper";
import { CompanyBrandingFormData } from "@/types/app/(components)/recruiter/edit.type";
import Header from "@/app/(components)/common/Header";
import AuthWrapper from "@/app/(components)/common/AuthWrapper";

interface PreviewContainerProps {
  hidePreviewHeader?: boolean;
}

export default function PreviewContainer({ hidePreviewHeader = false }: PreviewContainerProps) {
  const params = useParams();
  const router = useRouter();
  const companyName = params.companyName as string;
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<CompanyBrandingFormData | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      const user = getUserData();

      if (user) {
        setUserData(user);
      }

      // Fetch existing branding data
      const defaultSlug = decodeURIComponent(companyName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      try {
        const response = await fetch("/api/recruiter/branding", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const brandings = Array.isArray(data.data) ? data.data : [data.data];
            // Match by exact slug OR slug that starts with defaultSlug (handles suffixes)
            const targetBranding = brandings.find(
              (b: any) =>
                b.companySlug === defaultSlug || b.companySlug.startsWith(defaultSlug + "-")
            );

            if (targetBranding) {
              setBranding({
                companyName: targetBranding.companyName,
                companySlug: targetBranding.companySlug,
                logoUrl: targetBranding.logoUrl,
                bannerUrl: targetBranding.bannerUrl,
                cultureVideoUrl: targetBranding.cultureVideoUrl,
                primaryColor: targetBranding.primaryColor,
                secondaryColor: targetBranding.secondaryColor,
                accentColor: targetBranding.accentColor,
                sections: targetBranding.sections,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching branding:", error);
      }

      setLoading(false);
    };

    initializePage();
  }, [router, companyName]);

  const handleBackToEdit = () => {
    router.push(`/recruiter/${companyName}/edit`);
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/careers/${branding?.companySlug}`;
    navigator.clipboard.writeText(publicUrl);
    alert("Public link copied to clipboard!");
  };

  if (loading) {
    return (
      <AuthWrapper requiredRole="RECRUITER">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-600" role="status" aria-live="polite">
            Loading preview...
          </div>
        </div>
      </AuthWrapper>
    );
  }

  if (!branding) {
    return (
      <AuthWrapper requiredRole="RECRUITER">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No branding data found</p>
            <button
              onClick={handleBackToEdit}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              aria-label="Go to career page editor"
            >
              Go to Editor
            </button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper requiredRole="RECRUITER">
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Preview Header Bar */}
        {!hidePreviewHeader && (
          <header
            className="bg-purple-600 text-white px-4 py-3 shadow-lg sticky top-0 z-50"
            role="banner"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" aria-label="Preview mode indicator">
                  Preview Mode
                </span>
                <span className="text-xs opacity-75">
                  This is how candidates will see your page
                </span>
              </div>
              <nav className="flex items-center gap-3" aria-label="Preview actions">
                <button
                  onClick={copyPublicLink}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                  aria-label="Copy public link to clipboard"
                >
                  Copy Public Link
                </button>
                <button
                  onClick={handleBackToEdit}
                  className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium"
                  aria-label="Return to career page editor"
                >
                  Back to Editor
                </button>
              </nav>
            </div>
          </header>
        )}

        {/* Preview Content */}
        <main className="bg-white" aria-label="Career page preview">
          {/* Banner */}
          {branding.bannerUrl && (
            <div className="w-full h-80 relative">
              <img
                src={branding.bannerUrl}
                alt={`${branding.companyName} banner`}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"
                aria-hidden="true"
              />
            </div>
          )}

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Company Header */}
            <header className="py-12 flex items-center gap-8">
              {branding.logoUrl && (
                <img
                  src={branding.logoUrl}
                  alt={`${branding.companyName} logo`}
                  className="w-32 h-32 rounded-xl object-contain shadow-lg"
                />
              )}
              <div>
                <h1 className="text-5xl font-bold mb-3" style={{ color: branding.primaryColor }}>
                  {branding.companyName}
                </h1>
                <p className="text-xl text-gray-600">Join Our Team</p>
              </div>
            </header>

            {/* Culture Video */}
            {branding.cultureVideoUrl && (
              <section className="mb-16" aria-labelledby="culture-heading">
                <h2
                  id="culture-heading"
                  className="text-3xl font-bold mb-6"
                  style={{ color: branding.primaryColor }}
                >
                  Our Culture
                </h2>
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <video
                    src={branding.cultureVideoUrl}
                    controls
                    className="w-full"
                    aria-label={`${branding.companyName} culture video`}
                  />
                </div>
              </section>
            )}

            {/* Content Sections */}
            {branding.sections
              .filter((s) => s.enabled)
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <section
                  key={section.id}
                  className="mb-16"
                  aria-labelledby={`section-${section.id}`}
                >
                  <h2
                    id={`section-${section.id}`}
                    className="text-3xl font-bold mb-6"
                    style={{ color: branding.primaryColor }}
                  >
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {section.content}
                  </div>
                  {section.images && section.images.length > 0 && (
                    <div
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                      role="list"
                      aria-label={`${section.title} images`}
                    >
                      {section.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${section.title} image ${idx + 1}`}
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                          role="listitem"
                        />
                      ))}
                    </div>
                  )}
                </section>
              ))}

            {/* Call to Action */}
            <section
              className="py-16 text-center border-t border-gray-200"
              aria-labelledby="cta-heading"
            >
              <h2
                id="cta-heading"
                className="text-3xl font-bold mb-4"
                style={{ color: branding.primaryColor }}
              >
                Ready to Join Us?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Explore our open positions and find your next opportunity
              </p>
              <button
                style={{ backgroundColor: branding.accentColor }}
                className="px-8 py-4 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
                aria-label="View open job positions"
              >
                View Open Positions
              </button>
            </section>

            {/* Footer */}
            <footer
              className="py-8 border-t border-gray-200 text-center text-gray-600"
              role="contentinfo"
            >
              <p>
                &copy; {new Date().getFullYear()} {branding.companyName}. All rights reserved.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}

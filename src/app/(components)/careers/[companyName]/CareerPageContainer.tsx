"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CompanyBrandingFormData } from "@/types/app/(components)/recruiter/edit.type";
import Header from "@/app/(components)/common/Header";
import Footer from "@/app/(components)/common/Footer";

export default function CareerPageContainer() {
  const params = useParams();
  const companyName = params.companyName as string;
  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState<CompanyBrandingFormData | null>(null);

  useEffect(() => {
    const fetchPublicBranding = async () => {
      const slug = decodeURIComponent(companyName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      try {
        // Fetch public branding data (no auth required)
        const response = await fetch(`/api/careers/${slug}`);

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setBranding(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching career page:", error);
      }

      setLoading(false);
    };

    fetchPublicBranding();
  }, [companyName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600" role="status" aria-live="polite">
          Loading career page...
        </div>
      </div>
    );
  }

  if (!branding) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <article className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Career Page Not Found</h1>
            <p className="text-gray-600">This company's career page is not available.</p>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="bg-white" aria-label={`${branding.companyName} career page`}>
        {/* Banner */}
        {branding.bannerUrl && (
          <div className="w-full h-80 relative">
            <img
              src={branding.bannerUrl}
              alt={`${branding.companyName} company banner`}
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
              <section key={section.id} className="mb-16" aria-labelledby={`section-${section.id}`}>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

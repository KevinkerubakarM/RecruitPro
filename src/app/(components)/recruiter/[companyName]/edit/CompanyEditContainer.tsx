"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserData, getAuthHeaders } from "@/lib/helper";
import { CompanyBrandingFormData } from "@/types/app/(components)/recruiter/edit.type";
import Header from "@/app/(components)/common/Header";
import AuthWrapper from "@/app/(components)/common/AuthWrapper";
import EditHeader from "./EditHeader";
import StatusNotification from "./StatusNotification";
import CompanyInfoSection from "./CompanyInfoSection";
import BrandAssetsSection from "./BrandAssetsSection";
import ThemeSection from "./ThemeSection";
import ContentSectionsManager from "./ContentSectionsManager";

export default function CompanyEditContainer() {
  const params = useParams();
  const router = useRouter();
  const companyName = params.companyName as string;
  const [userData, setUserData] = useState<any>(null);
  const [brandingId, setBrandingId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [branding, setBranding] = useState<CompanyBrandingFormData>({
    companyName: decodeURIComponent(companyName),
    companySlug: "",
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    accentColor: "#ec4899",
    sections: [],
  });

  useEffect(() => {
    const initializePage = async () => {
      const user = getUserData();

      if (user) {
        setUserData(user);
      }

      const defaultSlug = decodeURIComponent(companyName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      setBranding((prev) => ({
        ...prev,
        companySlug: defaultSlug,
      }));

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
              setBrandingId(targetBranding.id);
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

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/recruiter/branding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ ...branding, id: brandingId }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus({
          type: "success",
          message: "Careers page saved successfully!",
        });
        setTimeout(() => setSaveStatus({ type: null, message: "" }), 3000);
      } else {
        setSaveStatus({
          type: "error",
          message: data.error?.message || "Failed to save",
        });
      }
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: "An error occurred while saving",
      });
    }

    setSaving(false);
  };

  const handlePreview = async () => {
    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/recruiter/branding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ ...branding, id: brandingId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update brandingId if it was newly created
        if (!brandingId && data.data?.id) {
          setBrandingId(data.data.id);
        }

        // Redirect to preview after successful save
        router.push(`/recruiter/${companyName}/preview`);
      } else {
        setSaveStatus({
          type: "error",
          message: data.error?.message || "Failed to save before preview",
        });
      }
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: "An error occurred while saving",
      });
    }

    setSaving(false);
  };

  const handlePublish = async () => {
    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      // First save the branding
      const saveResponse = await fetch("/api/recruiter/branding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ ...branding, id: brandingId }),
      });

      const saveData = await saveResponse.json();

      if (!saveData.success) {
        setSaveStatus({
          type: "error",
          message: saveData.error?.message || "Failed to save before publishing",
        });
        setSaving(false);
        return;
      }

      // Get the branding ID from save response
      const currentBrandingId = brandingId || saveData.data?.id;

      if (!currentBrandingId) {
        setSaveStatus({
          type: "error",
          message: "Could not get branding ID",
        });
        setSaving(false);
        return;
      }

      // Update brandingId if it was newly created
      if (!brandingId && saveData.data?.id) {
        setBrandingId(saveData.data.id);
      }

      // Then publish it
      const publishResponse = await fetch("/api/recruiter/branding", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ id: currentBrandingId, isPublished: true }),
      });

      const publishData = await publishResponse.json();

      if (publishData.success) {
        setSaveStatus({
          type: "success",
          message: `Published! Redirecting...`,
        });
        setTimeout(() => {
          router.push("/recruiter/home");
        }, 1500);
      } else {
        setSaveStatus({
          type: "error",
          message: publishData.error?.message || "Failed to publish",
        });
      }
    } catch (error) {
      console.error("Publish error:", error);
      setSaveStatus({
        type: "error",
        message: "An error occurred while publishing",
      });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <AuthWrapper requiredRole="RECRUITER">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600" role="status" aria-live="polite">
            Loading career page editor...
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper requiredRole="RECRUITER">
      <div className="min-h-screen bg-gray-50">
        <Header />

        <EditHeader
          companyName={branding.companyName}
          onPreview={handlePreview}
          onSave={handleSave}
          onPublish={handlePublish}
          saving={saving}
        />

        <StatusNotification type={saveStatus.type} message={saveStatus.message} />

        <main
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          aria-label="Career page editor"
        >
          <div className="space-y-8">
            <section aria-labelledby="company-info-heading">
              <CompanyInfoSection
                companyName={branding.companyName}
                companySlug={branding.companySlug}
                onCompanyNameChange={(name) => setBranding({ ...branding, companyName: name })}
                onCompanySlugChange={(slug) => setBranding({ ...branding, companySlug: slug })}
              />
            </section>

            <section aria-labelledby="brand-assets-heading">
              <BrandAssetsSection
                logoUrl={branding.logoUrl}
                bannerUrl={branding.bannerUrl}
                cultureVideoUrl={branding.cultureVideoUrl}
                onLogoUpload={(url) => setBranding({ ...branding, logoUrl: url })}
                onLogoDelete={() => setBranding({ ...branding, logoUrl: undefined })}
                onBannerUpload={(url) => setBranding({ ...branding, bannerUrl: url })}
                onBannerDelete={() => setBranding({ ...branding, bannerUrl: undefined })}
                onVideoUpload={(url) => setBranding({ ...branding, cultureVideoUrl: url })}
                onVideoDelete={() => setBranding({ ...branding, cultureVideoUrl: undefined })}
              />
            </section>

            <section aria-labelledby="theme-heading">
              <ThemeSection
                primaryColor={branding.primaryColor}
                secondaryColor={branding.secondaryColor}
                accentColor={branding.accentColor}
                onChange={(colors) => setBranding({ ...branding, ...colors })}
              />
            </section>

            <section aria-labelledby="content-sections-heading">
              <ContentSectionsManager
                sections={branding.sections}
                onSectionsChange={(sections) => setBranding({ ...branding, sections })}
              />
            </section>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}

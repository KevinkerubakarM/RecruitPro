"use client";

import MediaUploader from "./MediaUploader";

interface BrandAssetsSectionProps {
  logoUrl?: string;
  bannerUrl?: string;
  cultureVideoUrl?: string;
  onLogoUpload: (url: string) => void;
  onLogoDelete: () => void;
  onBannerUpload: (url: string) => void;
  onBannerDelete: () => void;
  onVideoUpload: (url: string) => void;
  onVideoDelete: () => void;
}

export default function BrandAssetsSection({
  logoUrl,
  bannerUrl,
  cultureVideoUrl,
  onLogoUpload,
  onLogoDelete,
  onBannerUpload,
  onBannerDelete,
  onVideoUpload,
  onVideoDelete,
}: BrandAssetsSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 id="brand-assets-heading" className="text-xl font-semibold text-gray-900 mb-4">
        Brand Assets
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MediaUploader
          type="logo"
          currentUrl={logoUrl}
          onUpload={onLogoUpload}
          onDelete={onLogoDelete}
          label="Company Logo"
        />
        <MediaUploader
          type="banner"
          currentUrl={bannerUrl}
          onUpload={onBannerUpload}
          onDelete={onBannerDelete}
          label="Banner Image"
        />
      </div>
      <div className="mt-6">
        <MediaUploader
          type="video"
          currentUrl={cultureVideoUrl}
          onUpload={onVideoUpload}
          onDelete={onVideoDelete}
          label="Culture Video"
        />
      </div>
    </div>
  );
}

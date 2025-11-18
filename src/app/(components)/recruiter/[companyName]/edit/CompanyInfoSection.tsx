"use client";

interface CompanyInfoSectionProps {
  companyName: string;
  companySlug: string;
  onCompanyNameChange: (name: string) => void;
  onCompanySlugChange: (slug: string) => void;
}

export default function CompanyInfoSection({
  companyName,
  companySlug,
  onCompanyNameChange,
  onCompanySlugChange,
}: CompanyInfoSectionProps) {
  const handleSlugChange = (value: string) => {
    const sanitizedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    onCompanySlugChange(sanitizedSlug);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 id="company-info-heading" className="text-xl font-semibold text-gray-900 mb-4">
        Company Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            aria-label="Company name"
          />
        </div>
        <div>
          <label htmlFor="company-slug" className="block text-sm font-medium text-gray-700 mb-1">
            Company URL Slug
          </label>
          <input
            id="company-slug"
            type="text"
            value={companySlug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="my-company"
            aria-label="Company URL slug"
          />
          <p className="text-xs text-gray-500 mt-1">Your page will be: /careers/{companySlug}</p>
        </div>
      </div>
    </div>
  );
}

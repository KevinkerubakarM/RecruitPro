"use client";

import ThemeEditor from "./ThemeEditor";

interface ThemeSectionProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  onChange: (colors: { primaryColor: string; secondaryColor: string; accentColor: string }) => void;
}

export default function ThemeSection({
  primaryColor,
  secondaryColor,
  accentColor,
  onChange,
}: ThemeSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 id="theme-heading" className="text-xl font-semibold text-gray-900 mb-4">
        Theme & Colors
      </h2>
      <ThemeEditor
        colors={{
          primaryColor,
          secondaryColor,
          accentColor,
        }}
        onChange={onChange}
      />
    </div>
  );
}

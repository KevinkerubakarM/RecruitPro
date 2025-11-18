"use client";

import { ThemeEditorProps } from "@/types/app/(components)/recruiter/edit.type";

export default function ThemeEditor({ colors, onChange }: ThemeEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Theme Colors</h3>
      <p className="text-sm text-gray-600">
        Customize your company's brand colors. These will be applied throughout your careers page.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primary Color */}
        <div className="space-y-2">
          <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
            Primary Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="primaryColor"
              value={colors.primaryColor}
              onChange={(e) => onChange({ ...colors, primaryColor: e.target.value })}
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors.primaryColor}
              onChange={(e) => onChange({ ...colors, primaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="#6366f1"
              pattern="^#[A-Fa-f0-9]{6}$"
            />
          </div>
          <p className="text-xs text-gray-500">Used for primary buttons and key elements</p>
        </div>

        {/* Secondary Color */}
        <div className="space-y-2">
          <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
            Secondary Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="secondaryColor"
              value={colors.secondaryColor}
              onChange={(e) => onChange({ ...colors, secondaryColor: e.target.value })}
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors.secondaryColor}
              onChange={(e) => onChange({ ...colors, secondaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="#8b5cf6"
              pattern="^#[A-Fa-f0-9]{6}$"
            />
          </div>
          <p className="text-xs text-gray-500">Used for secondary elements and accents</p>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">
            Accent Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="accentColor"
              value={colors.accentColor}
              onChange={(e) => onChange({ ...colors, accentColor: e.target.value })}
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={colors.accentColor}
              onChange={(e) => onChange({ ...colors, accentColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="#ec4899"
              pattern="^#[A-Fa-f0-9]{6}$"
            />
          </div>
          <p className="text-xs text-gray-500">Used for highlights and call-to-actions</p>
        </div>
      </div>

      {/* Color Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
        <div className="flex gap-3">
          <button
            style={{ backgroundColor: colors.primaryColor }}
            className="px-4 py-2 text-white rounded-lg font-medium"
          >
            Primary
          </button>
          <button
            style={{ backgroundColor: colors.secondaryColor }}
            className="px-4 py-2 text-white rounded-lg font-medium"
          >
            Secondary
          </button>
          <button
            style={{ backgroundColor: colors.accentColor }}
            className="px-4 py-2 text-white rounded-lg font-medium"
          >
            Accent
          </button>
        </div>
      </div>
    </div>
  );
}

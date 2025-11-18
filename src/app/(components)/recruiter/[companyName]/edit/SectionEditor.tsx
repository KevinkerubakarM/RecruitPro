"use client";

import { SectionEditorProps, SectionType } from "@/types/app/(components)/recruiter/edit.type";

const sectionTypeLabels: Record<SectionType, string> = {
  [SectionType.ABOUT_US]: "About Us",
  [SectionType.LIFE_AT_COMPANY]: "Life at Company",
  [SectionType.VALUES]: "Our Values",
  [SectionType.BENEFITS]: "Benefits & Perks",
  [SectionType.TEAM]: "Meet the Team",
  [SectionType.LOCATIONS]: "Our Locations",
  [SectionType.TESTIMONIALS]: "Employee Testimonials",
  [SectionType.CUSTOM]: "Custom Section",
};

export default function SectionEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SectionEditorProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={section.enabled}
            onChange={(e) => onChange({ ...section, enabled: e.target.checked })}
            className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="text-sm font-medium text-gray-700">
            {sectionTypeLabels[section.type]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Move Up/Down Buttons */}
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-600"
            title="Delete section"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Section Content Editor */}
      {section.enabled && (
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onChange({ ...section, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter section title"
              maxLength={100}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={section.content}
              onChange={(e) => onChange({ ...section, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter section content..."
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-1">{section.content.length} / 5000 characters</p>
          </div>

          {/* Images (optional enhancement for future) */}
          {section.images && section.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Images</label>
              <div className="grid grid-cols-3 gap-2">
                {section.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Section image ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

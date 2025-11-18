"use client";

import { useState } from "react";
import {
  SectionListProps,
  SectionType,
  ContentSection,
} from "@/types/app/(components)/recruiter/edit.type";
import SectionEditor from "./SectionEditor";

const availableSectionTypes = [
  { type: SectionType.ABOUT_US, label: "About Us" },
  { type: SectionType.LIFE_AT_COMPANY, label: "Life at Company" },
  { type: SectionType.VALUES, label: "Our Values" },
  { type: SectionType.BENEFITS, label: "Benefits & Perks" },
  { type: SectionType.TEAM, label: "Meet the Team" },
  { type: SectionType.LOCATIONS, label: "Our Locations" },
  { type: SectionType.TESTIMONIALS, label: "Employee Testimonials" },
  { type: SectionType.CUSTOM, label: "Custom Section" },
];

export default function SectionList({ sections, onSectionsChange }: SectionListProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAddSection = (type: SectionType) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type,
      title: availableSectionTypes.find((s) => s.type === type)?.label || "New Section",
      content: "",
      order: sections.length,
      enabled: true,
    };

    onSectionsChange([...sections, newSection]);
    setShowAddMenu(false);
  };

  const handleUpdateSection = (id: string, updatedSection: ContentSection) => {
    onSectionsChange(sections.map((s) => (s.id === id ? updatedSection : s)));
  };

  const handleDeleteSection = (id: string) => {
    const filtered = sections.filter((s) => s.id !== id);
    // Reorder remaining sections
    const reordered = filtered.map((s, idx) => ({ ...s, order: idx }));
    onSectionsChange(reordered);
  };

  const handleMoveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    // Swap positions
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];

    // Update order property
    const reordered = newSections.map((s, idx) => ({ ...s, order: idx }));
    onSectionsChange(reordered);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Sections</h3>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          + Add Section
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Add, reorder, and customize content sections for your careers page.
      </p>

      {/* Add Section Menu */}
      {showAddMenu && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Choose a section type:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availableSectionTypes
              .filter((sectionType) => {
                // Allow Custom sections to be added multiple times
                if (sectionType.type === SectionType.CUSTOM) {
                  return true;
                }
                // Filter out sections that are already added
                return !sections.some((s) => s.type === sectionType.type);
              })
              .map((sectionType) => (
                <button
                  key={sectionType.type}
                  onClick={() => handleAddSection(sectionType.type)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left text-sm"
                >
                  {sectionType.label}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">No sections added yet</p>
          <p className="text-sm text-gray-400">
            Click "Add Section" to start building your careers page
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <SectionEditor
                key={section.id}
                section={section}
                onChange={(updated) => handleUpdateSection(section.id, updated)}
                onDelete={() => handleDeleteSection(section.id)}
                onMoveUp={() => handleMoveSection(section.id, "up")}
                onMoveDown={() => handleMoveSection(section.id, "down")}
                canMoveUp={index > 0}
                canMoveDown={index < sections.length - 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}

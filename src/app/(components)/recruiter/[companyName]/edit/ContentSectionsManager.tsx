"use client";

import SectionList from "./SectionList";
import { ContentSection } from "@/types/app/(components)/recruiter/edit.type";

interface ContentSectionsManagerProps {
  sections: ContentSection[];
  onSectionsChange: (sections: ContentSection[]) => void;
}

export default function ContentSectionsManager({
  sections,
  onSectionsChange,
}: ContentSectionsManagerProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 id="content-sections-heading" className="text-xl font-semibold text-gray-900 mb-4">
        Content Sections
      </h2>
      <SectionList sections={sections} onSectionsChange={onSectionsChange} />
    </div>
  );
}

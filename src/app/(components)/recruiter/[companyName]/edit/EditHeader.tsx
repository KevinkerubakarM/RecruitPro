"use client";

interface EditHeaderProps {
  companyName: string;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  saving: boolean;
}

export default function EditHeader({
  companyName,
  onPreview,
  onSave,
  onPublish,
  saving,
}: EditHeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Career Page Builder</h1>
            <p className="text-sm text-gray-600" aria-label="Company name">
              {companyName}
            </p>
          </div>
          <nav className="flex items-center gap-3" aria-label="Page actions">
            <button
              onClick={onPreview}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              aria-label="Preview careers page"
            >
              Preview
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
              aria-label="Save careers page"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onPublish}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              aria-label="Publish careers page"
            >
              Publish
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

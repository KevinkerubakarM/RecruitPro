"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return (
    <nav
      className="flex items-center justify-center gap-3 mt-10"
      aria-label="Pagination navigation"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-6 py-3 border-2 border-indigo-600 rounded-xl text-base font-bold 
                   text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-all shadow-md"
        aria-label="Go to previous page"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-5 py-3 rounded-xl text-base font-bold transition-all shadow-md
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110"
                    : "border-2 border-gray-200 text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300"
                }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-6 py-3 border-2 border-indigo-600 rounded-xl text-base font-bold 
                   text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-all shadow-md"
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}

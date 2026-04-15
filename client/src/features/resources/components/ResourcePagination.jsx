import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ResourcePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-5 pb-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[13px] font-medium card-color border border-gray-200 dark:border-white/10 text-color hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all duration-200
              ${page === currentPage
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                : "text-color card-color border border-gray-200 dark:border-white/10 hover:border-blue-500/40"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[13px] font-medium card-color border border-gray-200 dark:border-white/10 text-color hover:border-blue-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

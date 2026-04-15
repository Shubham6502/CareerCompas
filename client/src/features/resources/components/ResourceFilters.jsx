import { Search } from "lucide-react";

const FILTERS = ["All", "Frontend", "Backend", "DSA"];

export default function ResourceFilters({ search, onSearchChange, activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">

      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-color pointer-events-none"
        />
        
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources..."
          className="w-full card-color border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-color placeholder:subText-color focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
        />
      </div>

      {/* Segmented filter pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl card-color border border-gray-200 dark:border-white/10 overflow-x-auto scrollbar-none">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 whitespace-nowrap
              ${activeFilter === filter
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                : "text-color hover:bg-white/5 dark:hover:bg-white/5"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

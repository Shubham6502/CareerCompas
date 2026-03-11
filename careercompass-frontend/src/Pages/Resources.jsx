import React, { useEffect, useState } from "react";
import {
  Search,
  CloudUpload,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Trophy,
  BookOpen,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ResourcesForm from "../utils/ResourecesForm";
import { useUser } from "@clerk/clerk-react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

function Resources() {
  const { isLoaded, user } = useUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topContributor, setTopContributor] = useState(null);
  const [clicked, setClicked] = useState(false);

  const clerkId = user.id;

  useEffect(() => {
    axios
      .get("https://careercompas.onrender.com/api/resource/getResources", {
        params: {
          page: currentPage,
          limit: 4,
          search,
          subject: activeFilter,
        },
      })
      .then((response) => {
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => {
        console.log("Something Wrong", err);
      });
  }, [currentPage, search, activeFilter, clicked]);

  useEffect(() => {
    axios
      .get("https://careercompas.onrender.com/api/resource/topContributors")
      .then((res) => {
        setTopContributor(res.data);
      })
      .catch((err) => {
        console.log("Something Went Wrong");
      });
  }, [isLoaded, currentPage, clicked]);

  const thumbClicked = (action, ResourceId) => {
    setClicked(!clicked);
    axios
      .post("https://careercompas.onrender.com/api/resource/interact", {
        clerkId,
        ResourceId: ResourceId,
        action,
      })
      .then((res) => {
        console.log("Success");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const filters = ["All", "Frontend", "Backend", "DSA"];

  return (
    <div className="max-w-6xl mx-auto text-color px-4 sm:px-6 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-color">
            Resources
          </h1>
          <p className="subText-color text-sm mt-1">
            Discover, share, and upvote learning materials.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black transition-all hover:opacity-80 px-5 py-2.5 rounded-xl font-medium text-sm shadow-md shrink-0"
        >
          <CloudUpload size={16} />
          Upload Resource
        </button>
      </div>

      {/* ── CONTROLS: SEARCH + FILTERS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-color placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all shadow-sm"
          />
        </div>

        {/* Segmented Filters */}
        <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/40 overflow-x-auto hide-scrollbar max-w-full">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap
                ${activeFilter === filter
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm border border-black/5 dark:border-white/10"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* Resource Cards Column */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pb-4">
          {!data.length ? (
            <div className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen size={24} strokeWidth={1.5} className="text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-color mb-1">No resources found</h3>
              <p className="text-sm subText-color max-w-xs">Try a different search or filter, or upload a new resource.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 p-3 sm:p-4 group"
                >
                  {/* Top: Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {card.subject}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {card.domain}
                    </span>
                  </div>

                  {/* Title + Description */}
                  <Link
                    onClick={() => thumbClicked("VIEW", card._id)}
                    to={card.url}
                    target="_blank"
                    className="block group/link"
                  >
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                      <ExternalLink size={13} className="inline ml-1.5 opacity-0 group-hover/link:opacity-60 transition-opacity -mt-0.5" />
                    </h3>
                    <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {card.description}
                    </p>
                  </Link>

                  {/* Footer: Author + Stats */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
                    <span className="text-[12px] text-gray-400 dark:text-gray-500">
                      by <span className="font-medium text-gray-600 dark:text-gray-300">{card.userName}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Upvote */}
                      <button
                        onClick={() => thumbClicked("UPVOTE", card._id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all
                          ${card.upvote?.ids?.includes(clerkId)
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/5"
                          }`}
                      >
                        <ThumbsUp size={13} />
                        {card.upvote?.ids?.length || 0}
                      </button>

                      {/* Downvote */}
                      <button
                        onClick={() => thumbClicked("DOWNVOTE", card._id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all
                          ${card.downvote?.ids?.includes(clerkId)
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-500/5"
                          }`}
                      >
                        <ThumbsDown size={13} />
                        {card.downvote?.ids?.length || 0}
                      </button>

                      {/* Views */}
                      <span className="flex items-center gap-1 px-2 py-1.5 text-[12px] text-gray-400">
                        <Eye size={13} />
                        {card.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium border border-gray-200 dark:border-gray-700/50 text-color bg-white dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft size={14} /> Prev
              </button>

              <span className="text-[13px] text-gray-500 dark:text-gray-400 tabular-nums">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium border border-gray-200 dark:border-gray-700/50 text-color bg-white dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── SIDEBAR (desktop only) ── */}
        <div className="hidden lg:flex flex-col gap-4 w-52 shrink-0">
          {/* Need Help Card */}
          <div className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-color mb-1.5">Need Help?</h4>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Can't find what you're looking for? Request a resource from the community.
            </p>
          </div>

          {/* Top Contributor Card */}
          {topContributor && topContributor[0] && (
            <div className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={15} className="text-amber-500" />
                <h4 className="text-sm font-semibold text-color">Top Contributor</h4>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30 border border-amber-200 dark:border-amber-700/40 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {topContributor[0]?.userName?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-color truncate">
                  {topContributor[0]?.userName}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {topContributor[0]?.totalResources} resources
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={12} />
                  {topContributor[0]?.totalUpvotes} votes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <ResourcesForm open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default Resources;


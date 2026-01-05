import React, { useEffect, useState } from "react";
import {
  Search,
  CloudUpload,
  Notebook,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from "lucide-react";
import ResourcesForm from "../utils/ResourecesForm";

import { Link } from "react-router-dom";
import axios from "axios";

function Resources() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");      // search text

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  useEffect(() => {
    axios
      .get(
        "http://localhost:5000/api/resource/getResources",{
          params: {
        page: currentPage,
        limit: 4,
        search,
        subject: activeFilter,
      },
        }
      )
      .then((response) => {
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => {
        console.log("Something Wrong", err);
      });
  }, [currentPage,search, activeFilter]);


  const filters = ["All", "Frontend", "Backend", "DSA"];
  return (
    <div className="space-y-4">
      <h1 className="text-blue-400 text-xl font-semibold">Resources</h1>

      <div className="flex flex-wrap items-center gap-4">
        {/* Search Box */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/20 
                     bg-white/5 focus-within:border-blue-400 
                     focus-within:ring-2 focus-within:ring-blue-400/30
                     transition-all text-white"
        >
          <Search size={18} className="text-white/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="bg-transparent outline-none text-sm 
                       placeholder:text-white/50"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <ButtonSearch
              key={filter}
              title={filter}
              isActive={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>

        <div className="flex text-white bg-blue-600 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] md:ml-auto">
          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <CloudUpload />
            Upload Resources
          </button>
          <ResourcesForm open={open} onClose={() => setOpen(false)} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full gap-4 text-white  ">
        {/* Resources Section */}
        <div className="flex-1  ">
            <div className=" rounded-xl 
             max-h-[70vh] min-h-[70vh] overflow-y-auto  
             scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {/* <div className="flex min-h-24 justify-center items-center gap-2 text-lg font-semibold mb-2 ">
            <Notebook className="text-blue-400" />
            Resources
          </div> */}

          {!data.length && (
            <p className="text-white/60 text-center text-white">
              No resources found
            </p>
          )}
          {data.map((card, idx) => {
            return (
              <Link to={card.url} target="_blank" className="group block">
                <div
                  className="relative w-full rounded-xl border mb-2 border-white/10 bg-[#131557c9]
               p-2 px-4 pt-7 sm:pt-10  hover:border-blue-400 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]
               active:scale-[0.98]"
                >
                  {/* Subject & Domain (Top Right) */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full
                       bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {card.subject}
                    </span>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full
                       bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    >
                      {card.domain}
                    </span>
                  </div>

                  {/* Title & Description (Always Next Line) */}
                  <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {card.description}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Author */}
                    <span
                      className="text-xs text-gray-500
                   transition-colors
                   group-hover:text-gray-400"
                    >
                      By {card.userName}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-5 text-sm text-gray-400">
                      <span
                        className="flex items-center gap-1 cursor-pointer
                     transition-transform transition-colors
                     hover:text-green-400 hover:scale-110"
                      >
                        <ThumbsUp size={15} />
                        {card.upvote}
                      </span>

                      <span
                        className="flex items-center gap-1 cursor-pointer
                     transition-transform transition-colors
                     hover:text-red-400 hover:scale-110"
                      >
                        <ThumbsDown size={15} />
                        {card.downvote}
                      </span>

                      <span
                        className="flex items-center gap-1 cursor-pointer
                     transition-transform transition-colors
                     hover:text-blue-400 hover:scale-110"
                      >
                        <Eye size={15} />
                        {card.views}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
           <div className="flex justify-center gap-2 text-white mt-6 ">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded border"
            >
              Prev
            </button>

            <span className="px-4 py-1 text-white">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded border"
            >
              Next
            </button>
          </div>
         
        </div>

        {/* Need Help Section */}
        <div
          className="flex flex-col gap-3 justify-center
                  text-center"
        >
          <div className="w-full md:w-48  bg-black/20 border border-white/10 rounded-xl p-4">
            <span className="font-medium">Need Help?</span>
            <div className="text-sm text-white/60 mt-1">
              Can't find what you are looking for? Request a resource
            </div>
          </div>
          <div className="w-full md:w-48  bg-black/20 border border-white/10 rounded-xl p-4">
            <span className="font-medium">Top Contributor</span>
            <span className="text-sm text-white/60 mt-1"></span>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}

const ButtonSearch = ({ title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-xl text-sm font-medium transition-all
        ${
          isActive
            ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            : "border border-white/20 text-white/80 hover:bg-white/5"
        }`}
    >
      {title}
    </button>
  );
};

export default Resources;

import React, { useEffect, useState } from "react";
import {
  Search,
  CloudUpload,
  Notebook,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ArrowUp,
  CircleUserRound,
} from "lucide-react";
import ResourcesForm from "../utils/ResourecesForm";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";

function Resources() {
   const { isLoaded, user } = useUser();
   if (!user) {
    return <Navigate to="/" replace />;
  }
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState(""); // search text
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topContributor, setTopContributor] = useState(null);
  const [clicked, setClicked] = useState(false);

  
  const clerkId = user.id;


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/resource/getResources", {
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
      .get("http://localhost:5000/api/resource/topContributors")
      .then((res) => {
        setTopContributor(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Something Went Wrong");
      });
  }, [isLoaded, currentPage,clicked]);

  const thumbClicked = (action, ResourceId) => {
    setClicked(!clicked);
    axios
      .post("http://localhost:5000/api/resource/interact", {
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
    <div className="space-y-4 w-full overflow-x-hidden ">
      <div className="flex  flex-wrap items-center gap-4 ">
        {/* Search Box */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-3xl border text-color border-white/20 
                     card-color focus-within:border-blue-400 
                     focus-within:ring-2 focus-within:ring-blue-400/30
                     transition-all text-color"
        >
          <Search size={18} className="text-color" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="bg-transparent outline-none text-sm 
                       placeholder:text-color"
          />
        </div>

        {/* Filter Buttons */}
        <div
          className="flex flex-wrap items-center
    gap-2 card-color
    md:rounded-full
    px-3 sm:px-5
    py-2
    md:border border-white/10 
    hover:bg-color
    max-w-full 
    overflow-x-auto sm:overflow-visible"
        >
          {filters.map((filter) => (
            <ButtonSearch
              key={filter}
              title={filter}
              isActive={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>

        <div className="flex text-color bg-blue-600 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] md:ml-auto">
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

      <div className=" md:flex  gap-3 text-color">
        {/* Resources Section */}
        <div className="flex-1 ">
          <div
            className="
    relative
    min-h-[60vh] sm:min-h-[73vh]
    max-h-[60vh] sm:max-h-[73vh]
    overflow-y-auto
    rounded-2xl
    border card-border
    card-color
    p-4 sm:p-5
    scrollbar-thin
    scrollbar-thumb-white/20
    scrollbar-track-transparent
        "
          >
            {/* Empty State */}
            {!data.length && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-white/50">No resources found</p>
              </div>
            )}

            {/* Cards */}
            {data.map((card, idx) => (
              <div
                key={idx}
                className="
        group relative mb-3
        rounded-2xl
        border card-border
        card-color
        p-4 sm:p-5
        transition-all duration-300
        hover:border-blue-400/50
        hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)]
        active:scale-[0.98]
       "
              >
                {/* Badges */}
                <div className=" md:absolute my-2 md:mt-0 top-3 right-3  w-full md:w-auto flex gap-2">
                  <span
                    className="
            text-[11px] font-semibold
            px-2.5 py-1
            rounded-full
            bg-blue-500/15
            text-blue-400
            border border-blue-500/30
          "
                  >
                    {card.subject}
                  </span>
                  <span
                    className="
            text-[11px] font-medium
            px-2.5 py-1
            rounded-full
            bg-purple-500/15
            text-purple-400
            border border-purple-500/30
          "
                  >
                    {card.domain}
                  </span>
                </div>

                {/* Content */}

                <Link
                  onClick={() => {
                    thumbClicked("VIEW", card._id);
                  }}
                  to={card.url}
                  target="_blank"
                  className="block"
                >
                  <h3
                    className="
            text-base sm:text-lg
            font-semibold
            text-color
            leading-snug
            pr-24
            group-hover:text-blue-400
            transition-colors
          "
                  >
                    {card.title}
                  </h3>

                  <p className="mt-1 text-sm subText-color line-clamp-2">
                    {card.description}
                  </p>
                </Link>

                {/* Footer */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Author */}
                  <span className="text-xs subText-color">
                    By <span className="subText-color">{card.userName}</span>
                  </span>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm subText-color">
                    <span
                     onClick={() => {
                          thumbClicked("UPVOTE", card._id);
                        }}
                      className={`flex items-center gap-1 cursor-pointer
              transition-all  rounded-4xl p-2
              hover:text-green-400 hover:scale-110 ${
                card.upvote?.ids?.includes(clerkId)
                  ? "bg-blue-500 text-color block"
                  : "subText-color block"
              }`}
                    >
                      <ThumbsUp
                        size={15}
                       
                      />
                      {card.upvote?.ids.length}
                    </span>

                    <span
                     onClick={() => {
                          thumbClicked("DOWNVOTE", card._id);
                        }}
                      className={`flex items-center gap-1 cursor-pointer
              transition-all  rounded-4xl p-2
              hover:text-green-400 hover:scale-110 ${
                card.downvote?.ids?.includes(clerkId)
                  ? "bg-blue-500 text-color block"
                  : "subText-color block"
              }`}
                    >
                      <ThumbsDown
                        size={15}
                       
                      />
                      {card.downvote?.ids.length}
                    </span>

                    <span
                      className="
              flex items-center gap-1
              transition-all
              hover:text-blue-400
            "
                    >
                      <Eye size={15} />
                      {card.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 gap-2 ">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded border"
            >
              Prev
            </button>

            <span className="px-4 py-1 text-color">
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
          <div className="w-full md:w-48  card-color border card-border rounded-xl p-4">
            <span className="font-medium">Need Help?</span>
            <div className="text-sm subText-color mt-1">
              Can't find what you are looking for? Request a resource
            </div>
          </div>
          {topContributor && (
            <div className="w-full md:w-48  card-color border card-border rounded-xl p-4">
              <span className="font-medium flex items-center justify-center">
                <ArrowUp size={25} color="red" />
                Top Contributors
              </span>
              <span className="text-sm subText-color mt-1 break-words whitespace-normal">
                {topContributor[0]?.userName}
              </span>
              <div className="text-xs subText-color mt-1 flex justify-around items-center">
                <span className="flex items-center justify-center gap-1">
                  <Notebook size={12} title="Resources Uploads" />
                  {topContributor[0]?.totalResources}
                </span>

                <span className="flex items-center justify-center gap-1">
                  <ThumbsUp size={12} />
                  {topContributor[0]?.totalUpvotes}
                </span>
              </div>
            </div>
          )}
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
            ? "bg-blue-500 text-color shadow-[0_0_25px_rgba(59,130,246,0.45)]"
            : "border border-white/20 text-color hover:bg-white/5"
        }`}
    >
      {title}
    </button>
  );
};

export default Resources;

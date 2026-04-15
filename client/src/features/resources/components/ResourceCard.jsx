import { ThumbsUp, ThumbsDown, Eye, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext} from "../../auth/auth.context";


export default function ResourceCard({ card, onInteract }) {
  const { user } = useAuthContext();
  const userId = user?._id;
  console.log("ResourceCard received props:", { card, userId });
  let upvoted   = card.upvote?.ids?.includes(userId);
  let downvoted = card.downvote?.ids?.includes(userId);

  const handleClick = (action, resourceId) => {
    console.log("Button clicked:", { action, resourceId });
    if(action === "UPVOTE" && !upvoted) {
      card.upvote.ids.push(userId);
      card.downvote.ids = card.downvote.ids.filter(id => id !== userId); // Remove downvote if it exists
    } else if(action === "DOWNVOTE" && !downvoted) {
      card.downvote.ids.push(userId);
      card.upvote.ids = card.upvote.ids.filter(id => id !== userId); // Remove upvote if it exists
    } else if(action === "UPVOTE" && upvoted) {
      card.upvote.ids = card.upvote.ids.filter(id => id !== userId);
      card.downvote.ids = card.downvote.ids.filter(id => id !== userId); // Ensure downvote is also removed
    } else if(action === "DOWNVOTE" && downvoted) {
      card.downvote.ids = card.downvote.ids.filter(id => id !== userId);
      card.upvote.ids = card.upvote.ids.filter(id => id !== userId); // Ensure upvote is also removed
    }else{
      console.log("No action taken for:", { action, resourceId, upvoted, downvoted });
    }
    onInteract(action, resourceId);
  };  


  return (
    <div className="group card-color border border-gray-200 dark:border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300">

      {/* ── Top: badges ── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
          {card.subject}
        </span>
        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          {card.domain}
        </span>
      </div>

      {/* ── Title + description (clickable) ── */}
      <Link
        to={card.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick("VIEW", card._id)}
        className="block group/link"
      >
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-color leading-snug group-hover/link:text-blue-500 dark:group-hover/link:text-blue-400 transition-colors pr-1">
          {card.title}
          <ExternalLink
            size={12}
            className="inline ml-1.5 opacity-0 group-hover/link:opacity-50 transition-opacity -mt-0.5"
          />
        </h3>
        <p className="mt-1.5 w-full text-[13px] subText-color line-clamp-3 leading-relaxed break-all">
  {card.description}
</p>
      </Link>

      {/* ── Footer: author + actions ── */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between gap-2">

        {/* Author */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-500 dark:text-blue-400 shrink-0">
            {card.userName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <span className="text-[12px] subText-color truncate">
            by <span className="text-color font-medium">{card.userName}</span>
          </span>
        </div>

        {/* Vote + view actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleClick("UPVOTE", card._id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200
              ${upvoted
                ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/25"
                : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/8 border border-transparent"
              }`}
          >
            <ThumbsUp size={13} />
            <span>{card.upvote?.ids?.length || 0}</span>
          </button>

          <button
            onClick={() => handleClick("DOWNVOTE", card._id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200
              ${downvoted
                ? "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/25"
                : "text-gray-400 hover:text-red-500 hover:bg-red-500/8 border border-transparent"
              }`}
          >
            <ThumbsDown size={13} />
            <span>{card.downvote?.ids?.length || 0}</span>
          </button>

          <span className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] subText-color">
            <Eye size={13} />
            {card.views}
          </span>
        </div>
      </div>
    </div>
  );
}

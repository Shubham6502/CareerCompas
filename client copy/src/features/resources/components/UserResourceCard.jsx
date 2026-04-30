import { ThumbsUp, ThumbsDown, Eye, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../auth/auth.context";
import EditResourcesModal from "../modals/EditResourcesModal";
import { useState } from "react";



export default function UserResourceCard({ card, onEdit, onDelete }) {
  const { user } = useAuthContext();
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
    <div className="group card-color border border-gray-200 dark:border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300">

      {/* ── Badges ── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
          {card.subject}
        </span>
        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          {card.domain}
        </span>
      </div>

      {/* ── Title + description ── */}
      <Link to={card.url} target="_blank" rel="noopener noreferrer" className="block group/link">
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-color leading-snug group-hover/link:text-blue-500 transition-colors">
          {card.title}
          <ExternalLink size={12} className="inline ml-1.5 opacity-0 group-hover/link:opacity-50 transition-opacity -mt-0.5" />
        </h3>
         <p className="mt-1.5 w-full text-[13px] subText-color line-clamp-3 leading-relaxed break-all">
          {card.description}
        </p>
      </Link>

      {/* ── Footer ── */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between gap-2">

        {/* Edit / Delete */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-200"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            onClick={() => onDelete(card._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] subText-color">
            <ThumbsUp size={13} /> {card.upvote?.ids?.length || 0}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] subText-color">
            <ThumbsDown size={13} /> {card.downvote?.ids?.length || 0}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] subText-color">
            <Eye size={13} /> {card.views}
          </span>
        </div>
      </div>
    </div>
    {editModalOpen && (
      <EditResourcesModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        resource={card}
        onEdit={onEdit}
      />
    )}
    </>
  );
}

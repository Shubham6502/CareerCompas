import { motion } from "framer-motion";
import { Share2, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SharedResources({ latestResource, count = 0 }) {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold tracking-widest uppercase text-blue-400">Shared Resources</p>
        <div className="w-7 h-7 rounded-lg bg-blue-500/12 border border-blue-500/20 flex items-center justify-center">
          <Share2 size={12} className="text-blue-400" />
        </div>
      </div>

      <div className="flex items-end gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-white/6">
        <p className="text-3xl font-bold text-color leading-none">{count}</p>
        <p className="text-[10px] subText-color tracking-widest uppercase pb-1">Active Assets</p>
      </div>

      <p className="text-[9px] font-bold tracking-widest uppercase subText-color mb-2">Latest Upload</p>
      {latestResource ? (
        <div className="flex items-center gap-2.5 subcard-color rounded-xl border border-slate-100 dark:border-white/6 px-3 py-2 mb-3">
          <FileText size={13} className="text-blue-400 flex-shrink-0" />
          <span className="text-[11px] text-color font-medium truncate flex-1">
            {latestResource.title?.length > 22 ? latestResource.title.slice(0, 22) + "…" : latestResource.title}
          </span>
          <span className="text-[10px] text-indigo-400 font-medium flex-shrink-0">{latestResource.subject || ""}</span>
        </div>
      ) : (
        <p className="text-[11px] subText-color mb-3">No resources shared yet.</p>
      )}

      <button onClick={() => navigate("/userresources")}
        className="w-full py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.18)" }}>
        View Resources <ArrowRight size={12} />
      </button>
    </motion.div>
  );
}
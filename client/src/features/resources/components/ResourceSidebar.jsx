import { Trophy, BookOpen, ThumbsUp, MessageSquarePlus } from "lucide-react";

export default function ResourceSidebar({ topContributor }) {
  return (
    <div className="hidden lg:flex flex-col gap-4 w-56 shrink-0">

      {/* ── Need Help ── */}
      <div className="card-color border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <MessageSquarePlus size={14} className="text-blue-500 dark:text-blue-400" />
          </div>
          <h4 className="text-[13px] font-semibold text-color">Uploaded Resources</h4>
        </div>
        <p className="text-[12px] subText-color leading-relaxed">
          Share your favorite learning resources with the community and help others on their career journey!
        </p>
        <button className="mt-3 w-full py-2 rounded-xl text-[12px] font-medium subcard-color border border-gray-200 dark:border-white/10 text-color hover:border-blue-500/40 transition-all duration-200">
          View Resources 
        </button>
      </div>

      {/* ── Top Contributor ── */}
      {topContributor?.[0] && (
        <div className="card-color border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={14} className="text-amber-500" />
            <h4 className="text-[13px] font-semibold text-color">Top Contributor</h4>
          </div>

          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/25 flex items-center justify-center shrink-0">
              <span className="text-[14px] font-bold text-amber-500">
                {topContributor[0]?.userName?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-color truncate">
                {topContributor[0]?.userName}
              </p>
              <p className="text-[11px] subText-color">Community Champion</p>
            </div>
          </div>

          <div className="subcard-color rounded-xl p-3 border border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1.5 subText-color">
                <BookOpen size={12} />
                Resources
              </span>
              <span className="font-semibold text-color">
                {topContributor[0]?.totalResources}
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px] mt-2">
              <span className="flex items-center gap-1.5 subText-color">
                <ThumbsUp size={12} />
                Upvotes
              </span>
              <span className="font-semibold text-color">
                {topContributor[0]?.totalUpvotes}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick stats ── */}
      <div className="card-color border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
        <h4 className="text-[13px] font-semibold text-color mb-3">Community Stats</h4>
        <div className="space-y-2.5">
          {[
            { label: "Total Resources", value: "1.2k+" },
            { label: "Contributors",    value: "340+"  },
            { label: "Upvotes Given",   value: "8.4k+" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-[12px]">
              <span className="subText-color">{label}</span>
              <span className="font-semibold text-blue-500 dark:text-blue-400">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDashboardContext } from "../Dashboard.context";

const RANK_COLORS = {
  1: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
  2: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
  3: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400",
};
const DEFAULT_RANK =
  "bg-slate-50 dark:bg-green-500/20 text-green-700 dark:text-green-400";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const row = {
  hidden: { opacity: 0, x: 10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function Leaderboard({ data = [], currentUserId }) {
  const { setTotalUsers, setCurrentUserRank } = useDashboardContext();
  console.log("Leaderboard data:", data, "Current User ID:", currentUserId);

  
  useEffect(() => {
    if (!data || data.length === 0) return;

    setTotalUsers(data.length);

    const userIndex = data.findIndex(
      (item) => String(item.userId) === String(currentUserId)
    );

    setCurrentUserRank(userIndex >= 0 ? data[userIndex].rank : null);
  }, [data, currentUserId, setTotalUsers, setCurrentUserRank]);


  const leaderboardData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const userIndex = data.findIndex(
      (item) => String(item.userId) === String(currentUserId)
    );

    let selectedUsers = [];

    // Case 1: User in top 5
    if (userIndex >= 0 && userIndex < 5) {
      selectedUsers = data.slice(0, 5);
    }
    // Case 2: User below top 5
    else if (userIndex >= 5) {
      selectedUsers = [...data.slice(0, 4), data[userIndex]];
    }
    // Case 3: User not found
    else {
      selectedUsers = data.slice(0, 5);
    }

    return selectedUsers.map((u) => ({
      rank: u.rank,
      initials: u.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      name: u.name,
      xp: u.xp,
      profileImage: u.profileImage || null,
      isYou: String(u.userId) === String(currentUserId),
    }));
  }, [data, currentUserId]);
console.log("Processed leaderboard data:", leaderboardData);

  if (!data || data.length === 0) {
    return (
      <div className="p-5 text-center text-sm text-gray-500">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5 mt-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={15} className="text-amber-500" />
          <p className="text-sm font-bold text-color">Leaderboard</p>
        </div>
        <span className="text-[11px] font-medium text-color subcard-color px-2.5 py-1 rounded-full border border-slate-100 dark:border-white/10">
          This Week
        </span>
      </div>

      {/* Rows */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {leaderboardData.map((u, idx) => (
          <motion.div
            key={u.rank || idx} 
            variants={row}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors
              ${
                u.isYou
                  ? "bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/20"
                  : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
              }`}
          >
            {/* Rank */}
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                RANK_COLORS[u.rank] || DEFAULT_RANK
              }`}
            >
              {u.rank}
            </div>
             
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
              ${
                u.isYou
                  ? "bg-indigo-600 text-white"
                  : "subcard-color dark:bg-white/10 text-color"
              }`}
            >
              
              {u.profileImage ? (
                <img src={u.profileImage} alt={u.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                u.initials
              )}
            </div>

            {/* Name + XP */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  u.isYou
                    ? "text-indigo-500 dark:text-indigo-300"
                    : "text-color"
                }`}
              >
                {u.name}
              </p>
              <p className="text-[11px] subText-color">
                {u.xp?.toLocaleString()} XP
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
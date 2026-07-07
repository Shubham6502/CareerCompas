import { motion } from "framer-motion";

const BADGES = [
  { id:1,  name:"First Step",    req:1,   tier:"Starter",   tc:"#3B6D11", bg:"#EAF3DE", bc:"#97C459",  icon:"🌱" },
  { id:2,  name:"On Fire",       req:3,   tier:"Starter",   tc:"#854F0B", bg:"#FAEEDA", bc:"#EF9F27",  icon:"🔥" },
  { id:3,  name:"Charged Up",    req:7,   tier:"Bronze",    tc:"#0C447C", bg:"#E6F1FB", bc:"#378ADD",  icon:"⚡" },
  { id:4,  name:"Crystal Clear", req:14,  tier:"Bronze",    tc:"#3C3489", bg:"#EEEDFE", bc:"#7F77DD",  icon:"💎" },
  { id:5,  name:"Champion",      req:30,  tier:"Silver",    tc:"#444441", bg:"#F1EFE8", bc:"#B4B2A9",  icon:"🏆" },
  { id:6,  name:"Night Owl",     req:45,  tier:"Silver",    tc:"#3C3489", bg:"#EEEDFE", bc:"#AFA9EC",  icon:"🌙" },
  { id:7,  name:"Eagle Eye",     req:60,  tier:"Gold",      tc:"#633806", bg:"#FAEEDA", bc:"#FAC775",  icon:"🦅" },
  { id:8,  name:"Magnetic",      req:90,  tier:"Gold",      tc:"#085041", bg:"#E1F5EE", bc:"#5DCAA5",  icon:"🧲" },
  { id:9,  name:"Stellar",       req:120, tier:"Platinum",  tc:"#72243E", bg:"#FBEAF0", bc:"#ED93B1",  icon:"🌟" },
  { id:10, name:"Tidal Wave",    req:180, tier:"Platinum",  tc:"#0C447C", bg:"#E6F1FB", bc:"#85B7EB",  icon:"🌊" },
  { id:11, name:"Summit",        req:270, tier:"Diamond",   tc:"#26215C", bg:"#EEEDFE", bc:"#7F77DD",  icon:"🏔️" },
  { id:12, name:"Hall of Fame",  req:365, tier:"Legendary", tc:"#412402", bg:"#FAEEDA", bc:"#EF9F27",  icon:"👑" },
];

export default function EarnedBadges({ maxStreak = 0 }) {
  const earned = BADGES.filter(b => maxStreak >= b.req).length;

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.35, delay:0.05 }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4 sm:p-5 mb-5">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🏅</span>
          <p className="text-[11px] font-bold tracking-widest uppercase text-amber-400">Streak Badges</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full subcard-color overflow-hidden">
              <motion.div initial={{ width:0 }} animate={{ width:`${(earned/BADGES.length)*100}%` }}
                transition={{ duration:0.8, ease:"easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                style={{ boxShadow:"0 0 6px rgba(251,191,36,0.5)" }} />
            </div>
            <span className="text-[11px] subText-color">{earned}/{BADGES.length}</span>
          </div>
          <span className="text-[10px] subText-color border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full">
            🔥 {maxStreak}d streak
          </span>
        </div>
      </div>

      <div className="overflow-x-auto" style={{ scrollbarWidth:"none" }}>
        <div className="flex gap-2.5 pb-1" style={{ minWidth:"max-content" }}>
          {BADGES.map((badge, i) => {
            const unlocked = maxStreak >= badge.req;
            return (
              <motion.div key={badge.id}
                initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                transition={{ delay:i*0.025, duration:0.2 }}
                className={`flex flex-col items-center gap-1 flex-shrink-0 w-16 ${unlocked ? "cursor-pointer" : "cursor-default"}`}
                title={unlocked ? `${badge.name}: ${badge.tier}` : `Unlock at ${badge.req}-day streak`}>
                <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                  ${unlocked ? "hover:scale-110 hover:-translate-y-0.5" : "grayscale opacity-25"}`}
                  style={{
                    background: unlocked ? badge.bg : "#f1f5f9",
                    border: `1.5px solid ${unlocked ? badge.bc : "transparent"}`,
                    boxShadow: unlocked ? `0 0 10px ${badge.bc}55` : "none",
                  }}>
                  <span className="text-base leading-none">{badge.icon}</span>
                  {unlocked && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center"
                      style={{ boxShadow:"0 0 5px rgba(52,211,153,0.7)", fontSize:7 }}>✓</span>
                  )}
                </div>
                <span className="text-[9px] font-semibold text-color text-center leading-tight">{badge.name}</span>
                <span className="text-[8px] font-bold tracking-wide text-center"
                  style={{ color: unlocked ? badge.tc : "#999" }}>
                  {unlocked ? badge.tier : `${badge.req}d`}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
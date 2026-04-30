 import Card from './Card';
 import SectionLabel from './SectionLabel.jsx';
 const badgeData = [
  {
    id: 1,
    name: "First Step",
    req: 1,
    tier: "Starter",
    tierColor: "#3B6D11",
    bg: "#EAF3DE",
    border: "#97C459",
    icon: "🌱",
    desc: "You showed up. The journey begins.",
  },
  {
    id: 2,
    name: "On Fire",
    req: 3,
    tier: "Starter",
    tierColor: "#854F0B",
    bg: "#FAEEDA",
    border: "#EF9F27",
    icon: "🔥",
    desc: "3 days straight. The habit is forming.",
  },
  {
    id: 3,
    name: "Charged Up",
    req: 7,
    tier: "Bronze",
    tierColor: "#0C447C",
    bg: "#E6F1FB",
    border: "#378ADD",
    icon: "⚡",
    desc: "A full week — you mean business.",
  },
  {
    id: 4,
    name: "Crystal Clear",
    req: 14,
    tier: "Bronze",
    tierColor: "#3C3489",
    bg: "#EEEDFE",
    border: "#7F77DD",
    icon: "💎",
    desc: "Two weeks of pure dedication.",
  },
  {
    id: 5,
    name: "Champion",
    req: 30,
    tier: "Silver",
    tierColor: "#444441",
    bg: "#F1EFE8",
    border: "#B4B2A9",
    icon: "🏆",
    desc: "A full month. You're a champion.",
  },
  {
    id: 6,
    name: "Night Owl",
    req: 45,
    tier: "Silver",
    tierColor: "#3C3489",
    bg: "#EEEDFE",
    border: "#AFA9EC",
    icon: "🌙",
    desc: "45 nights of consistency.",
  },
  {
    id: 7,
    name: "Eagle Eye",
    req: 60,
    tier: "Gold",
    tierColor: "#633806",
    bg: "#FAEEDA",
    border: "#FAC775",
    icon: "🦅",
    desc: "60 days — sharp focus, no excuses.",
  },
  {
    id: 8,
    name: "Magnetic",
    req: 90,
    tier: "Gold",
    tierColor: "#085041",
    bg: "#E1F5EE",
    border: "#5DCAA5",
    icon: "🧲",
    desc: "90 days of unstoppable momentum.",
  },
  {
    id: 9,
    name: "Stellar",
    req: 120,
    tier: "Platinum",
    tierColor: "#72243E",
    bg: "#FBEAF0",
    border: "#ED93B1",
    icon: "🌟",
    desc: "Four months — you're shining bright.",
  },
  {
    id: 10,
    name: "Tidal Wave",
    req: 180,
    tier: "Platinum",
    tierColor: "#0C447C",
    bg: "#E6F1FB",
    border: "#85B7EB",
    icon: "🌊",
    desc: "Half a year of relentless flow.",
  },
  {
    id: 11,
    name: "Summit",
    req: 270,
    tier: "Diamond",
    tierColor: "#26215C",
    bg: "#EEEDFE",
    border: "#7F77DD",
    icon: "🏔️",
    desc: "You've climbed higher than most dare.",
  },
  {
    id: 12,
    name: "Hall of Fame",
    req: 365,
    tier: "Legendary",
    tierColor: "#412402",
    bg: "#FAEEDA",
    border: "#EF9F27",
    icon: "👑",
    desc: "365 days. You are a legend.",
  },
];
export default function EarnedBadges({ maxStreak}) {
 
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>🏅Earned Badges</SectionLabel>
        <SectionLabel>MaxStreak:{maxStreak}d</SectionLabel>
      </div>
{/* <div
  
  className="scroll-container w-full overflow-x-auto "

>
         */}
      <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-none overflow-y-hidden scroll-smooth " >
        <div className="w-50 flex gap-3 md:gap-4.5 pl-1 p-6 " style={{ minWidth: "100%" }}>
        {badgeData.map((badge) => {
          const unlocked = maxStreak >= badge.req;
          return (
            <div key={badge.id} className="flex flex-col items-center gap-2 flex-shrink-0 w-[72px]">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center relative transition-all
                  ${unlocked ? "hover:scale-110 hover:-translate-y-1 cursor-pointer" : "grayscale opacity-35 cursor-default"}`}
                style={{
                  background: badge.bg,
                  border: `1.5px solid ${unlocked ? badge.border : "rgba(255,255,255,0.1)"}`,
                }}
                title={unlocked ? badge.name : `Unlock at ${badge.req}-day streak`}
              >
                <span className="text-xl">{badge.icon}</span>
                {!unlocked && (
                  <span className="absolute -bottom-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-[9px]">
                    🔒
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-center leading-tight" style={{ color: "var(--text-color)" }}>
                {badge.name}
              </span>
              <span className="text-[9px] font-medium tracking-widest uppercase text-center"
                style={{ color: unlocked ? badge.tierColor : "#555" }}>
                {badge.tier}
              </span>
              <span className="text-[9px] text-center" style={{ color: "var(--muted-color)" }}>
                {unlocked ? "Earned" : `${badge.req}d streak`}
              </span>
            </div>
          );
        })}
        </div>
      </div>
    </Card>
  );
}
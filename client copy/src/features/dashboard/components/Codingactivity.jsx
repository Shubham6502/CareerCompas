import { motion } from "framer-motion";
import { useMemo, useState, useRef, useEffect } from "react";

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const INTENSITY = [
  "subcard-color",
  "bg-[#0e4429] dark:bg-[#0e4429]",
  "bg-[#006d32] dark:bg-[#006d32]",
  "bg-[#26a641] dark:bg-[#26a641]",
  "bg-[#39d353] dark:bg-[#39d353]",
];

/**
 * Convert taskCompletionData + createdAt into a Map<"YYYY-MM-DD", taskCount>
 *
 * taskCompletionData shape:
 *   { "day-1": ["id1","id2"], "day-2": ["id3"], "day-15": ["id4","id5","id6"], ... }
 *
 * createdAt: ISO string or Date — the origin day (day-1 = createdAt date)
 */
function buildDateMap(taskCompletionData, createdAt) {
  const map = new Map(); // "YYYY-MM-DD" -> taskCount
  if (!taskCompletionData || !createdAt) return map;

  const origin = new Date(createdAt);
  // Normalise to midnight local time
  origin.setHours(0, 0, 0, 0);


  Object.entries(taskCompletionData).forEach(([key, ids]) => {
    // Parse "day-N"
    const match = key.date;

  

    const date = new Date(taskCompletionData[key].date);
    // date.setDate(origin.getDate() + (dayNumber - 1)); // day-1 → origin, day-2 → origin+1 …

    const yyyy = date.getFullYear();
    
    const mm   = String(date.getMonth() + 1).padStart(2, "0");
    const dd   = String(date.getDate()).padStart(2, "0");
    const key2 = `${yyyy}-${mm}-${dd}`;


    const count =taskCompletionData[key].completedTaskIds.length;
    map.set(key2, (map.get(key2) || 0) + count);
  });

  return map;
}

/**
 * Map a raw task count to an intensity level 0-4.
 * Thresholds can be tuned to your dataset.
 *   0  → no tasks
 *   1  → 1 task
 *   2  → 2-3 tasks
 *   3  → 4-6 tasks
 *   4  → 7+ tasks
 */
function countToLevel(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function buildMonthGrid(year, dateMap, createdAt) {
  const now      = new Date();
  const startDay = createdAt ? new Date(createdAt) : null;
  if (startDay) startDay.setHours(0, 0, 0, 0);

  const months = [];

  for (let m = 0; m < 12; m++) {
    const firstDay    = new Date(year, m, 1);
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const startDow    = (firstDay.getDay() + 6) % 7; // Mon = 0

    const cells = [];
    for (let p = 0; p < startDow; p++) cells.push({ type: "pad" });

    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, m, d);

      // Future days → invisible spacer
      // if (thisDate > now) {
      //   cells.push({ type: "future" });
      //   continue;
      // }

      // Before account creation → invisible spacer
      // if (startDay && thisDate < startDay) {
      //   cells.push({ type: "before" });
      //   continue;
      // }

      // Build the date key and look up task count
      const yyyy  = year;
      const mm2   = String(m + 1).padStart(2, "0");
      const dd2   = String(d).padStart(2, "0");
      const dKey  = `${yyyy}-${mm2}-${dd2}`;
      const count = dateMap.get(dKey) || 0;
      const val   = countToLevel(count);

      cells.push({ type: "day", val, count });
    }

    while (cells.length % 7 !== 0) cells.push({ type: "pad" });

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    months.push({ month: m, weeks });
  }

  return months;
}

export default function CodingActivity({ taskCompletionData, createdAt ,maxStreak}) {
  const currentYear = new Date().getFullYear();
  const years       = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const scrollRef = useRef(null);

  // Build date → count map once from props
  const dateMap = useMemo(
    () => buildDateMap(taskCompletionData, createdAt),
    [taskCompletionData, createdAt]
  );

  const monthData = useMemo(
    () => buildMonthGrid(selectedYear, dateMap, createdAt),
    [selectedYear, dateMap, createdAt]
  );

  const { totalTasks, activeDays } = useMemo(() => {
    let totalTasks = 0, activeDays = 0, cur = 0;
    monthData.forEach(({ weeks }) =>
      weeks.flat().forEach(cell => {
        if (cell.type !== "day") return;
        if (cell.val > 0) {
          totalTasks += cell.count;
          activeDays++;
          cur++;
         
        } else {
          cur = 0;
        }
      })
    );
    return { totalTasks, activeDays};
  }, [monthData]);

  // Scroll to the rightmost (most recent) month on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm mb-5 w-full flex flex-col overflow-hidden relative"
    >
      <div className="p-4 sm:p-5 w-full max-w-full relative flex flex-col">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-color">Coding Activity</h3>
            <p className="text-xs subText-color mt-0.5">
              <span className="font-semibold text-color">{totalTasks}</span> tasks completed ·{" "}
              Total active days:{" "}
              <span className="font-semibold text-color">{activeDays}</span> ·{" "}
              Max streak:{" "}
              <span className="font-semibold text-color">{maxStreak}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Legend */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] subText-color">Less</span>
              {INTENSITY.map((cls, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${cls}`} />
              ))}
              <span className="text-[11px] subText-color">More</span>
            </div>

            {/* Year dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-1 text-xs font-semibold text-color border border-slate-200 dark:border-white/15 rounded-lg px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-colors"
              >
                {selectedYear}
                <svg
                  className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-color border border-slate-200 dark:border-white/15 rounded-xl shadow-lg overflow-hidden min-w-[80px]">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => { setSelectedYear(y); setDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                        y === selectedYear
                          ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                          : "text-color hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Scrollable grid ── */}
       <div
  ref={scrollRef}
  className="scroll-container w-full overflow-x-auto overflow-y-hidden scroll-smooth"

>
        <div className="w-50 flex gap-2 pl-1 p-6 " style={{ minWidth: "100%" }}>

            {/* Day-of-week labels */}
            <div className="sticky left-0 flex flex-col gap-[3px] pr-2 pt-[18px] z-10 w-8 flex-shrink-0">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={i}
                  className="text-[9px] text-color h-[10px] flex items-center justify-end w-full leading-none font-medium"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Month blocks */}
            {monthData.map(({ month, weeks }, mi) => (
              <div
                key={mi}
                className="flex flex-col"
                style={{ marginRight: mi < 11 ? "8px" : "0" }}
              >
                {/* Month label */}
                <div className="text-[10px] text-slate-400 dark:text-white/40 font-medium h-[14px] leading-[14px] mb-1 whitespace-nowrap">
                  {MONTHS[month]}
                </div>

                {/* Week columns */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((cell, di) => {
                        // Invisible spacer — keeps grid aligned
                        if (cell.type === "pad" || cell.type === "future" || cell.type === "before") {
                          return <div key={di} className="w-[10px] h-[10px]" />;
                        }

                        // Real day — always render a coloured block
                        return (
                          <motion.div
                            key={di}
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: mi * 0.025 + wi * 0.007, duration: 0.13 }}
                            title={
                              cell.count > 0
                                ? `${cell.count} task${cell.count > 1 ? "s" : ""} completed`
                                : "No tasks completed"
                            }
                            className={`w-[10px] h-[10px] rounded-[2px] cursor-default transition-all
                              hover:ring-[1.5px] hover:ring-indigo-400 hover:ring-offset-[1px]
                              dark:hover:ring-offset-[#111113] ${INTENSITY[cell.val]}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </motion.div>
  );
}
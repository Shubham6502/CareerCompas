import { useState, useMemo, useCallback ,useEffect} from "react";
import Hero from "../components/Hero.jsx";
import StatsRow from "../components/StatsRow.jsx";
import WeekSection from "../components/WeekSection.jsx";
import { useRoadmap } from "../hooks/useRoadmap.js";
import PageLoader from "../../../components/Loaders/PageLoader.jsx";
import { useRoadmapContext } from "../roadmap.context.jsx";


const CAT_COLOR = {
  DSA:    "bg-blue-500/80",
  Dev:    "bg-purple-500/80",
  CS:     "bg-cyan-500/80",
  Prep:   "bg-orange-500/80",
  System: "bg-pink-500/80",
  Review: "bg-slate-500/80",
  Career: "bg-teal-500/80",
};

const DIFF = {
  Easy:   { cls: "text-green-400 bg-green-500/10 border-green-500/20",   label: "Easy"   },
  Medium: { cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", label: "Medium" },
  Hard:   { cls: "text-red-400 bg-red-500/10 border-red-500/20",          label: "Hard"   },
};
const weekColor=
  [
  "#09E381",
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#67e8f9",
  "#c084fc",
  "#f87171",
  "#6ee7b7",
  "#fcd34d",
]
  


// ─── Roadmap ───────────────────────────────────────────────────────────

export default function Roadmap() {

  const [tasks, setTasks] = useState(null);
  const [lastCompletedDay, setLastCompletedDay] = useState(0);
  const [roadmapDetails, setRoadmapDetails] = useState(null);
  const { fetchRoadmap } = useRoadmap();
  const [loading, setLoading] = useState(true);
  const {currentDay,setCurrentDay,setProgress}=useRoadmapContext();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await fetchRoadmap();
      setTasks(data.roadmap.days);
      setCurrentDay(data.lastCompletedDay);
      setRoadmapDetails(data.roadmapDetails);
      setLoading(false);

    }
    fetchData();
  }, []);
 


  const weeks = useMemo(() => {
    if (!tasks) return [];

    return tasks.reduce((acc, day, idx) => {
      const weekIndex = Math.floor(idx / 7);

      if (!acc[weekIndex]) {
        const completedWeek = Math.floor(currentDay / 7);
        acc[weekIndex] = {
          id: `week-${weekIndex + 1}`,
          locked: weekIndex > completedWeek,
          name: `Week ${weekIndex + 1}`,
          colorCls: weekColor[weekIndex % weekColor.length],
          days: []
        };
      }

      acc[weekIndex].days.push({
        dayNumber: day.dayNumber,
        tasks: day.tasks.map(task => ({
          id: task._id,
          title: task.title,
          category: task.category,
          difficulty: task.difficulty,
          resourceUrl: task.resourceUrl,
          done: task.isCompleted
        }))
      });

      return acc;
    }, []);
  }, [tasks]);


  const [taskDoneMap, setTaskDoneMap] = useState({});

  useEffect(() => {
    const map = {};
    weeks.forEach(w =>
      w.days.forEach(d =>
        d.tasks.forEach(t => {
          if (t.done) map[t.id] = true;
        })
      )
    );
    setTaskDoneMap(map);
  }, [weeks]);

  const onToggle = useCallback(taskId => {
    setTaskDoneMap(prev => {
      const next = { ...prev };
      if (next[taskId]) delete next[taskId];
      else next[taskId] = true;
      return next;
    });
  }, []);

  const totalTasks = useMemo(
    () =>
      weeks.reduce(
        (s, w) =>
          s +
          w.days.reduce((ss, d) => ss + d.tasks.length, 0),
        0
      ),
    [weeks]
  );

  const doneTasks = Object.keys(taskDoneMap).length;

  const pct = Math.round((doneTasks / totalTasks) * 100);
  setProgress(pct);

  if(loading){
    return <PageLoader />;
  }

  return (
     <div
           className="
             w-[95%]
             h-[90vh]
             overflow-hidden
           "
         >
           {/* SCROLLABLE CONTENT */}
           <div
             className="
               relative
               h-full
               overflow-y-auto
               scrollbar-thin
               scrollbar-thumb-blue-600/40
               scrollbar-track-transparent
             "
           >
    <div className="w-full min-w-0 h-full px-3 ">

      <Hero totalTasks={totalTasks} doneTasks={doneTasks} roadmapDetails={roadmapDetails} currentDay={currentDay} />
      <StatsRow doneTasks={doneTasks} totalTasks={totalTasks} currentDay={currentDay} />

      {weeks.map((week, wi) => (
        <WeekSection
          key={week.id}
          week={week}
          taskDoneMap={taskDoneMap}
          onToggle={onToggle}
          defaultOpen={wi === 0}
          index={wi}
        />
      ))}
    </div>
    </div>
    </div>
  );
}
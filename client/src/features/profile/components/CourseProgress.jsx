import Card from "./Card";
import { useState } from "react";
import { useRoadmapContext } from "../../roadmap/roadmap.context.jsx";
export default function CourseProgress({ courses}) {
  const [tab, setTab] = useState("running");
  const { progress } = useRoadmapContext();

  const runningCourses = courses.filter(c => c.status === "active");
  const completedCourses = courses.filter(c => c.status === "completed");


  return (
    <Card>
      {/* Tabs */}
      <div className="flex gap-6 mb-5 border-b" style={{ borderColor: "rgba(139,148,158,0.2)" }}>
        {["running", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="pb-2 text-xs font-bold tracking-widest uppercase transition-colors"
            style={{
              color: tab === t ? "#58a6ff" : "var(--subText-color)",
              borderBottom: tab === t ? "2px solid #58a6ff" : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "running" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {runningCourses.map((course) => (
              <div key={course.roadmap.goalRole}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                    {course.roadmap.goalRole}
                  </span>
                  <span className="text-xs" style={{ color: course.color }}>
                    {course.roadmap.experienceLevel}
                  </span>
                </div>
                <p className="text-[10px] tracking-widest mb-2 text-blue-400" >
                  {progress}% PROGRESS
                </p>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(139,148,158,0.2)" }}>
                  <div
                    className="h-full rounded-full bg-blue-300"
                    style={{ width: `${progress || 0}%` }}
                  />
                </div>
                <span className="text-xs" style={{ color: "var(--subText-color)" }}>
                  {course.roadmap.timelineDays} DAYS ROADMAP
                </span>
              </div>
            ))}
          </div>

          {/* Archived */}
          {/* <div>
            <p className="text-[10px] tracking-widest mb-3" style={{ color: "var(--subText-color)" }}>
              RECENTLY ARCHIVED
            </p>
            {archived.map((item) => (
              <div key={item.title} className="flex items-center justify-between py-2 rounded-lg px-3"
                style={{ backgroundColor: "rgba(63,185,80,0.06)", border: "1px solid rgba(63,185,80,0.15)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: "#3fb950" }}>✅</span>
                  <span className="text-sm" style={{ color: "var(--text-color)" }}>{item.title}</span>
                </div>
                <span className="text-[10px]" style={{ color: "var(--subText-color)" }}>{item.date}</span>
              </div>
            ))}
          </div> */}
        </>
      )}

      {tab === "completed" && (
        <div className="text-center py-8" style={{ color: "var(--subText-color)" }}>
          {completedCourses.length==0?<p className="text-sm">Completed courses will appear here.</p>
           :<>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {completedCourses.map((course) => (
              <div key={course.roadmap.goalRole}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                    {course.roadmap.goalRole}
                  </span>
                  <span className="text-xs" style={{ color: course.color }}>
                    {course.roadmap.experienceLevel}
                  </span>
                </div>
                {/* <p className="text-[10px] tracking-widest mb-2" style={{ color: "var(--subText-color)" }}>
                  {course.progress}% PROGRESS
                </p> */}
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(139,148,158,0.2)" }}>
                  {/* <div
                    className="h-full rounded-full"
                    style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                  /> */}
                </div>
                <span className="text-xs" style={{ color: "var(--subText-color)" }}>
                  {course.roadmap.timelineDays} DAYS ROADMAP
                </span>
              </div>
            ))}
          </div>

          {/* Archived */}
          {/* <div>
            <p className="text-[10px] tracking-widest mb-3" style={{ color: "var(--subText-color)" }}>
              RECENTLY ARCHIVED
            </p>
            {archived.map((item) => (
              <div key={item.title} className="flex items-center justify-between py-2 rounded-lg px-3"
                style={{ backgroundColor: "rgba(63,185,80,0.06)", border: "1px solid rgba(63,185,80,0.15)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: "#3fb950" }}>✅</span>
                  <span className="text-sm" style={{ color: "var(--text-color)" }}>{item.title}</span>
                </div>
                <span className="text-[10px]" style={{ color: "var(--subText-color)" }}>{item.date}</span>
              </div>
            ))}
          </div> */}
        </>}
        </div>
      )}
    </Card>
  );
}
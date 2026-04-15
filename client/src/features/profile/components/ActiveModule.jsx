import Card from "./Card";
import SectionLabel from "./SectionLabel";
import {useRoadmapContext} from "../../roadmap/roadmap.context.jsx";
export default function ActiveModule({ module, onContinue, }) {

  const { progress } = useRoadmapContext();

  if (!module) {
    return (
      <Card className="relative overflow-hidden">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-[10px] tracking-widest px-2 py-0.5 rounded font-bold">
            ACTIVE MODULE
          </span>
        </div>
      </Card>
    );
  }


  let roadmapData = null;

  if (Array.isArray(module)) {
    const active = module.find(m => m.status === "active");
    roadmapData = active?.roadmap || module[0]?.roadmap;
  } else if (module?.status === "active") {
    roadmapData = module.roadmap;
  }


  if (!roadmapData) {
    roadmapData = {
      goalRole: "Full Stack Developer",
      experienceLevel: "Beginner",
      targetType: "Job Preparation",
      timelineDays: 90,
      studyHoursPerDay: 2,
    };
  }
  console.log("Roadmap Data in ActiveModule progress:", progress);

  return (
    <Card className="relative overflow-hidden">

      {/* Glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: "#3fb950" }}
      />

      <div className="flex items-start gap-3 mb-3">
        <span className="text-[10px] tracking-widest px-2 py-0.5 rounded font-bold"
          style={{
            backgroundColor: "rgba(63,185,80,0.15)",
            color: "#3fb950",
            border: "1px solid rgba(63,185,80,0.3)",
          }}>
          ACTIVE MODULE
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">

        {/* Visual */}
        <div className="shrink-0 w-full sm:w-36 h-28 rounded-xl flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 50% 50%, #3fb95040, #0d1117)",
            border: "1px solid rgba(63,185,80,0.2)",
          }}>
          <div className="w-14 h-14 rounded-full animate-pulse"
            style={{
              background: "radial-gradient(circle, #3fb950, #1a7f37)",
              boxShadow: "0 0 30px #3fb95080",
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold">
            {roadmapData.goalRole}
          </h3>

          <p className="text-sm mb-3">
            {roadmapData.experienceLevel} | {roadmapData.targetType} | {roadmapData.timelineDays} days roadmap
          </p>

          {/* Progress */}
          <div className="h-1.5 rounded-full mb-3 overflow-hidden"
            style={{ backgroundColor: "rgba(139,148,158,0.2)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress||0}%`,
                background: "linear-gradient(90deg, #3fb950, #58a6ff)",
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[10px]">
              DAILY TARGET(HR): {roadmapData.studyHoursPerDay}
            </p>

            <button
              onClick={onContinue}
              className="px-4 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "#58a6ff", color: "#0d1117" }}
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
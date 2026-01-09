import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExternalLink, ArrowLeft, CheckCircle } from "lucide-react";

function RoadmapTasks() {
  const location = useLocation();
  const navigate = useNavigate();
  const dayData = location.state?.day;
  const active=location.state?.active;

  console.log(active);

  if (!dayData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1b0349] px-6 py-10 text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Day {dayData.day} Roadmap
          </h1>
          <span  className={`px-4 py-1 rounded-full text-sm font-medium  bg-green-400/10 border border-green-400/30 text-green-300 ${active?"block":"hidden"}`}>
            Active Day
          </span>
        </div>
        <p className="text-white/60 mt-2">
          Complete the following tasks to progress in your roadmap.
        </p>
      </div>

      {/* Task List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {dayData.tasks.map((task, idx) => (
          <a
            key={idx}
            href={task.url}
            target="_blank"
            rel="noreferrer"
            className="group block"
          >
            <div className="flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-blue-400 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-300">
                    {task.title}
                  </h3>
                  <p className="text-sm text-white/50">
                    Click to open learning resource
                  </p>
                </div>
              </div>
              <ExternalLink
                size={18}
                className="text-white/40 group-hover:text-white"
              />
            </div>
          </a>
        ))}
      </div>

      {/* Footer Action */}
      <div className="max-w-4xl mx-auto mt-10 flex justify-center">
        <button
          onClick={() => navigate("/roadmap")}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium shadow-lg"
        >
          <ArrowLeft size={18} />
          Back to Roadmap
        </button>
      </div>
    </div>
  );
}

export default RoadmapTasks;

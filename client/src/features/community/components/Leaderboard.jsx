import { useState } from "react";

export default function Leaderboard() {
  const [mode, setMode] = useState("daily");

  return (
    <div className="card-color p-6 rounded-xl border border-gray-700">
      <div className="flex gap-4 mb-4">
        <button onClick={() => setMode("daily")} className={mode==="daily" ? "text-blue-400" : ""}>
          Daily
        </button>
        <button onClick={() => setMode("all")} className={mode==="all" ? "text-blue-400" : ""}>
          All Time
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>1. Shubham</span>
          <span>🔥 12</span>
        </div>
        <div className="flex justify-between">
          <span>2. Priya</span>
          <span>🔥 8</span>
        </div>
      </div>
    </div>
  );
}
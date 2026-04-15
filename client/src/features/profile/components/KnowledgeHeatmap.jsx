import Card from "./Card";
import SectionLabel from "./SectionLabel";
export default function KnowledgeHeatmap({ data }) {
  const COLS = 52;
  const ROWS = 7;
  const colors = ["transparent", "#1a7f3740", "#3fb95060", "#3fb95090", "#3fb950"];

  const weeks = Array.from({ length: COLS }, (_, w) =>
    data.slice(w * ROWS, w * ROWS + ROWS)
  );

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Knowledge Heatmap</SectionLabel>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]" style={{ color: "var(--subText-color)" }}>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div
              key={l}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: l === 0 ? "rgba(139,148,158,0.15)" : colors[l] }}
            />
          ))}
          <span className="text-[10px]" style={{ color: "var(--subText-color)" }}>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((val, di) => (
                <div
                  key={di}
                  className="w-2.5 h-2.5 rounded-sm"
                  title={`Activity: ${val}`}
                  style={{
                    backgroundColor:
                      val === 0 ? "rgba(139,148,158,0.1)" : colors[val],
                    transition: "opacity 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
                  onMouseLeave={(e) => (e.target.style.opacity = 1)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
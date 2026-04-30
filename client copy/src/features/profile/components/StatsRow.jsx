import Card from "./Card";
import SectionLabel from "./SectionLabel.jsx";
export default function StatsRow({ rankData}) {
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <p
          className="text-[10px] tracking-widest uppercase mb-1"
          style={{ color: "var(--subText-color)" }}
        >
          Global Ranking
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: "var(--text-color)" }}
        >
         #{rankData.rank}
        </p>
      </Card>
      <Card>
        <p
          className="text-[10px] tracking-widest uppercase mb-1"
          style={{ color: "var(--subText-color)" }}
        >
          {/* Developer Level
           */}
          Experience Points
        </p>
        <p className="text-3xl font-bold" style={{ color: "#58a6ff" }}>
          {rankData.xp}
        </p>
      </Card>
    </div>
  );
}
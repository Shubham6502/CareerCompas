import Card from "./Card";
import SectionLabel from "./SectionLabel";
import { useNavigate } from "react-router-dom";
export default function SharedResources({ data,latestResource, count }) {

  const navigate = useNavigate();
  return (
    <Card>
      <SectionLabel>👤 Shared Resources By You</SectionLabel>
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/[0.07] pb-4 ">
        <div >
           <p
            className="text-4xl font-bold"
            style={{ color: "var(--text-color)" }}
          >
            {count}
          </p>
          <p
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "var(--subText-color)" }}
          >
            Active Assets
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "rgba(88,166,255,0.15)",
            border: "1px solid rgba(88,166,255,0.3)",
          }}
        >
          ☁
        </div>
      </div>

      <div className="space-y-2 mb-4">
      <SectionLabel> Latest Uploaded</SectionLabel>
          <div  className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "var(--text-color)" }}>
              {latestResource?.title?.slice(0,8)+ "..." || "No resources shared yet"}
            </span>
            <span className="text-xs" style={{ color: "#58a6ff" }}>
              {latestResource?.subject || ""}
            </span>
          </div>
        
      </div>
      <button
        onClick={() => navigate("/userresources")} //redirect to user resources page
        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        style={{
          backgroundColor: "rgba(88,166,255,0.12)",
          color: "#58a6ff",
          border: "1px solid rgba(88,166,255,0.25)",
        }}
      >
        View Resources →
      </button>
    </Card>
  );
}
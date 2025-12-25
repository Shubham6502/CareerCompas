import axios from "axios";
import { Lock, CheckCircle } from "lucide-react";
import { use, useEffect ,useState} from "react";
import { useUser } from "@clerk/clerk-react";



const Roadmap = () => {
const [roadmap, setRoadmap] = useState([]);
const { user } = useUser();
const { isLoaded } = useUser();
const clerkId=user.id;
const[progress,setProgress]=useState({});
useEffect(()=>{
 
  if (!user || !isLoaded) return;
  axios.get(`http://localhost:5000/api/progress/getProgress/${clerkId}`)
  .then((response)=>{
    setProgress(response.data);
  });
},[user,isLoaded]);
console.log("Clerk ID in roadmap:",clerkId);
console.log("Progress data in roadmap:",progress.domain);

useEffect(() => {
  if (!progress.domain) return;
  axios.get(`http://localhost:5000/api/roadmap/${progress.domain}`)
  .then((response)=>{
    setRoadmap(response.data.days);
  })
},[progress.domain]); 
console.log("Roadmap data:",roadmap);
  return (
    /* OUTER CARD (NO SCROLL HERE) */
    <div
      className="
        w-[95%]
        h-[90vh]
        bg-white/5
        backdrop-blur-lg
        rounded-2xl
        border border-white/10
        shadow-xl
        overflow-hidden
      "
    >
      {/* SCROLLABLE CONTENT */}
      <div
        className="
          relative
          h-full
          overflow-y-auto
          px-6 py-10
          scrollbar-thin
          scrollbar-thumb-blue-600/40
          scrollbar-track-transparent
        "
      >
        {/* Vertical dotted line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-blue-500/40" />

        {Object.values(roadmap).map((daysItem,index) => {
          const isLeft = index % 2 === 0;
          const item="completed";

          return (
            <div
              key={`${daysItem.day}-${index}`}
              className={`relative flex w-full mb-14 ${
                isLeft ? "justify-start" : "justify-end"
              }`}
            >
              {/* Connector */}
              <div
                className={`absolute top-1/2 left-1/2 w-24 h-px border-t border-dashed border-blue-500/40 ${
                  isLeft ? "-translate-x-full" : "translate-x-0"
                }`}
              />

              {/* Node */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg
                    ${
                      item === "completed"
                        ? "bg-blue-600"
                        : item === "active"
                        ? "bg-blue-500 animate-pulse"
                        : "bg-[#1E293B]"
                    }`}
                >
                  {item === "completed" && (
                    <CheckCircle size={18} className="text-white" />
                  )}
                  {item === "locked" && (
                    <Lock size={16} className="text-blue-300" />
                  )}
                  {item === "active" && (
                    <span className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Card */}
              <div
                className={`w-64 px-5 py-3 rounded-xl border text-sm transition
                  ${
                    item === "completed"
                      ? "bg-blue-600/50 border-blue-500/30 text-blue-200"
                      : item === "active"
                      ? "bg-blue-600/10 border-blue-600/40 text-white"
                      : "bg-[#020617] border-white/10 text-gray-400"
                  }`}
              >
                <p className="text-xs opacity-70">Day {daysItem.day}</p>
                <p className="font-medium">{daysItem.topic}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;

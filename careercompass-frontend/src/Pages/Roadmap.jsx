import axios from "axios";
import { Lock, CheckCircle, CircleDotDashed } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate,Navigate } from "react-router-dom";

const Roadmap = () => {
  const { user } = useUser();
  if(!user){
      return <Navigate to="/" replace />;
  }

  const [roadmap, setRoadmap] = useState([]);
  const { isLoaded } = useUser();
  const clerkId = user?.id;
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});

  
  useEffect(() => {
    if (!user || !isLoaded) return;
    axios
      .get(`http://localhost:5000/api/progress/getProgress/${clerkId}`)
      .then((response) => {
        setProgress(response.data);
      });
  }, [user, isLoaded]);

  useEffect(() => {
    if (!progress.domain) return;
    axios
      .get(`http://localhost:5000/api/roadmap/${progress.domain}`)
      .then((response) => {
        setRoadmap(response.data.days);
      });
  }, [progress.domain]);

  const handleClick = (daysItem) => {
    if (
      daysItem.day < progress.currentDay ||
      daysItem.day === progress.currentDay
    ) {
      navigate("/roadmap/tasks", {
        state: {
          day: daysItem,
          active: daysItem.day === progress.currentDay?true:false,
        },
      });
    } else {
      alert("locked");
    }
  };

  return (
    /* OUTER CARD (NO SCROLL HERE) */
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
          px-6 py-10
          scrollbar-thin
          scrollbar-thumb-blue-600/40
          scrollbar-track-transparent
        "
      >
        {/* Vertical dotted line */}
        {progress.domain &&(<div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-blue-500 " />)}
        {!progress.domain && (<div className=" text-color items-center justify-center">Please Attempt Assessment</div>)}
        {Object.values(roadmap).map((daysItem, index) => {
          const isLeft = index % 2 === 0;
          let item = "completed";
          if (
            progress.completedDays.includes(daysItem.day) &&
            progress.currentDay !== daysItem.day
          ) {
            item = "completed";
          } else if (progress.currentDay === daysItem.day) {
            item = "active";
          } else if (progress.currentDay > daysItem.day) {
            item = "incomplete";
          } else {
            item = "locked";
          }

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
                        ? "bg-green-500"
                        : item === "active"
                        ? "bg-blue-500 animate-pulse"
                        : item === "incomplete"
                        ? "bg-green-900/50"
                        : "bg-amber-600"
                    }`}
                >
                  {item === "completed" && (
                    <CheckCircle size={18} className="text-color" />
                  )}
                  {item === "locked" && (
                    <Lock size={16} className="text-blue-300" />
                  )}
                  {item === "incomplete" && (
                    <CircleDotDashed size={16} className="text-color" />
                  )}
                  {item === "active" && (
                    <span className="w-3 h-3 bg-color rounded-full" />
                  )}
                </div>
              </div>

              {/* Card */}
              <div
                onClick={() => handleClick(daysItem)}
                className={`w-64 px-5 py-3 rounded-xl border text-sm transition
                  ${
                    item === "completed"
                      ? "bg-green-500 border-green-600/30 text-color"
                      : item === "active"
                      ? "bg-blue-600/70 border-blue-500/30 text-color"
                      : item === "incomplete"
                      ? "bg-green-900/50 text-color border-green-700/20"
                      : "bg-amber-200/20 border-amber-500 text-color"
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

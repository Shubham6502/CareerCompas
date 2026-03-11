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
  const [loading,setLoading]=useState(true);
  const clerkId = user?.id;
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});

  
  useEffect(() => {
    if (!user || !isLoaded) return;
    axios
      .get(`https://careercompas.onrender.com/api/progress/getProgress/${clerkId}`)
      .then((response) => {
        setProgress(response.data);
      });
  }, [user, isLoaded]);

  useEffect(() => {
    if (!progress.domain) return;
    axios
      .get(`https://careercompas.onrender.com/api/roadmap/${progress.domain}`)
      .then((response) => {
        setRoadmap(response.data.days);
        setLoading(false);
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
  if(loading && progress.domain){
    return(  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
    </div>)
  }

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
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all
                    ${
                      item === "completed"
                        ? "bg-green-500 text-white"
                        : item === "active"
                        ? "bg-blue-600 text-white animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(37,99,235,0.6)] border-2 border-white dark:border-gray-900"
                        : item === "incomplete"
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-500 border border-gray-300 dark:border-gray-700"
                        : "bg-gray-100 dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-800"
                    }`}
                >
                  {item === "completed" && (
                    <CheckCircle size={18} />
                  )}
                  {item === "locked" && (
                    <Lock size={16} />
                  )}
                  {item === "incomplete" && (
                    <CircleDotDashed size={16} />
                  )}
                  {item === "active" && (
                    <span className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Card */}
              <div
                onClick={() => handleClick(daysItem)}
                className={`w-64 px-5 py-4 rounded-2xl border text-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg
                  ${
                    item === "completed"
                      ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 hover:border-green-500/60"
                      : item === "active"
                      ? "bg-blue-600/10 border-blue-500/50 text-blue-700 dark:text-blue-400 shadow-[0_4px_20px_rgba(37,99,235,0.15)] hover:border-blue-500/80"
                      : item === "incomplete"
                      ? "subcard-color border card-border text-color hover:border-gray-400 dark:hover:border-gray-500"
                      : "bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 opacity-70"
                  }`}
              >
                <p className="text-xs font-semibold tracking-wider uppercase opacity-80 mb-1">Day {daysItem.day}</p>
                <p className="font-bold text-base leading-tight">{daysItem.topic}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;

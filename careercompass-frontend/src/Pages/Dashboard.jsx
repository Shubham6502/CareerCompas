import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AssessmentLoading from "../components/Loaders/AssessmentLoading";
import axios from "axios";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [progressData,setProgressData]=useState([]);
  const [tasks, setTasks] = useState([]);
  const { isLoaded } = useUser();
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
   const [loading, setLoading] = useState(false);//assessment loading state
    const [questions, setQuestions] = useState([]);//assessment questions state

  useEffect(( )=>{
    if (!isLoaded || !user) return;
    const clerkId=user.id;
  
  axios.get(`http://localhost:5000/api/progress/getProgress/${clerkId}`,{
    params:{clerkId:clerkId}
  }).then((response)=>{
    setProgressData(response.data);
    setCompletedTaskIds(response.data.completedTasksids || []);
  }).catch((error)=>{
    console.log("Error fetching progress data:",error);
  });
 },[isLoaded,user]);

  const domain = progressData.domain;
  const streak = progressData.streak ;
  const maxS = progressData.maxStreak ;
  const progress = progressData.progressPercent;
  const day=progressData.currentDay || 1;
console.log(domain,day);

  useEffect(()=>{
    if(!domain || !day) return;
    // setLoading(true);
    axios.get(`http://localhost:5000/api/roadmap/getRoadmap/${domain}`,{params:{day:day}})
    .then((response)=>{
      setTasks(response.data.days[0].tasks);
      
    })
    .catch((error)=>{
      console.log("Error fetching tasks:",error);
      // setLoading(false);
    })
  },[domain,day]);

   const handleTaskClick = async (task) => {
  try {
    // setLoading(true);
    await axios.post("http://localhost:5000/api/progress/completeTask", {
      clerkId: user.id,
      taskId: task.id,
    });

      setCompletedTaskIds((prev) => [...prev, task.id]);

    // open resource
    window.open(task.url, "_blank");
    } catch (err) {
    console.error("Failed to complete task", err);
    // setLoading(false);
    }
  };
  
 
  //Assassessment redirection for first time users
    const loadTest = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/test/generate-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: user.fullName,
          }),
        }
      );

      const data = await res.json();

      // Store questions temporarily
      setQuestions(data.questions);

      // Navigate AFTER questions are ready
      navigate("/assessment/test", {
        state: { questions: data.questions },
      });
    } catch (err) {
      console.error("Failed to generate test", err);
      alert("Failed to load assessment. Try again.");
      setLoading(false);
    }
  };
   if (loading) {
      return <AssessmentLoading />;
    }

  return (
    <div className="space-y-8 text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-blue-300">
          Hi {user?.firstName}
        </h1>
        <p className="text-gray-400 mt-1">
          Stay consistent. Small steps every day.
        </p>
      </div>

     
       {domain && (<>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Selected Domain"
          value={domain}
          subtitle="Locked for roadmap"
          icon="🎯"
        />
        <StatCard
          title="Current Streak"
          value={`${streak} Days`}
          subtitle={`Max Streak :${maxS}`}
          icon="🔥"
        />
        <StatCard
          title="Overall Progress"
          value={`${Math.round(progress)}%`}
          subtitle="Across roadmap"
          icon="📈"
        />
      </div>

      {/* MAIN CONTENT */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TODAY TASKS (SAME CARD DESIGN) */}
        <GlowCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              Today’s Tasks
            </h2>
            <span className="text-xs px-3 py-1 rounded-md bg-blue-500/10 text-blue-400">
              Day {day}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={() =>
                  handleTaskClick(task)
                }
              />
            ))}
          </div>
        </GlowCard>

        {/* 3-MONTH STREAK TRACKER (SAME RIGHT CARD) */}
        <GlowCard>
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="mb-4 flex justify-center">
                <div
                  className="w-12 h-12 rounded-full bg-blue-500/20
                             flex items-center justify-center text-xl"
                >
                  🗓️
                </div>
              </div>

              <h3 className="text-lg font-medium text-center">
                3-Month Tracker
              </h3>
              <p className="text-sm text-gray-400 text-center mt-2">
                Complete daily tasks to finish your roadmap
              </p>
            </div>

            <GlowButton
              text="View Roadmap →"
              onClick={() => navigate("/roadmap")}
            />
          </div>
        </GlowCard>

      </div>
     </> )}
     {!domain && (<div className="space-y-8">
      <h1 className="text-3xl font-semibold text-grey-400">
        Career Assessment
      </h1>

      <p className="text-gray-400">
        This short assessment helps identify the career domain that best matches your skills and interests.

Please answer all questions honestly. There are no right or wrong answers.

Your responses will be used to create a personalized learning roadmap and daily tasks to guide your career preparation.
      </p>

      {/* Start Button */}
      <AssesButton 
        text="Start Assessment →"
        onClick={loadTest}
      />
    </div>) }

    </div>
  );
};

/* ---------------- COMPONENTS (UNCHANGED DESIGN) ---------------- */

const StatCard = ({ title, value, subtitle, icon }) => (
  <div
    className="rounded-xl bg-[#0F172A] border border-white/10 p-5
               hover:border-blue-500/30 transition"
  >
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-400">{title}</p>
      <span>{icon}</span>
    </div>
    <p className="text-2xl font-semibold mt-2">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
  </div>
);

const GlowCard = ({ children, className = "" }) => (
  <div
    className={`relative rounded-xl bg-[#0F172A]
                border border-white/10 p-6 overflow-hidden ${className}`}
  >
    <div
      className="absolute -inset-1 bg-gradient-to-br
                 from-blue-500/20 via-purple-500/10 to-transparent
                 blur-2xl opacity-40"
    />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const TaskItem = ({ task, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                border transition
                ${
                  task.completed
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-[#0B0F1A] border-white/10 hover:bg-white/5"
                }`}
  >
    <input
      type="checkbox"
      // checked={completedTaskIds.includes(task.id)}
      readOnly
      className="accent-blue-500"
    />
    <span
      className={`text-sm ${
        task.completed
          ? "line-through text-gray-400"
          : "text-gray-300"
      }`}
    >
      {task.title}
    </span>
  </div>
);

const GlowButton = ({ text, onClick }) => (
  <div className="relative mt-6">
    <div
      className="absolute inset-0 rounded-lg blur-xl opacity-60
                 bg-gradient-to-r from-blue-500 to-purple-500
                 pointer-events-none"
    />
    <button
      onClick={onClick}
      className="relative z-10 w-full py-3 rounded-lg
                 bg-blue-600 hover:bg-blue-700 transition font-medium"
    >
      {text}
    </button>
  </div>
);
const AssesButton = ({ text, onClick }) => (
  <div className="relative inline-block">
    <div
      className="absolute inset-0 rounded-lg blur-xl opacity-60
                 bg-gradient-to-r from-blue-500 to-purple-500
                 pointer-events-none"
    />
    <button
      onClick={onClick}
      className="relative z-10 px-6 py-3 rounded-lg
                 bg-blue-600 hover:bg-blue-700 transition
                 font-medium text-white"
    >
      {text}
    </button>
  </div>
);

export default Dashboard;

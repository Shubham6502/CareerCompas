import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AssessmentLoading from "../components/Loaders/AssessmentLoading";
import axios from "axios";
import { CheckCircle, Clock11, Target } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { isLoaded } = useUser();
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [loading, setLoading] = useState(false); //assessment loading state
  const [questions, setQuestions] = useState([]); //assessment questions state
  const [completedDays, setCompletedDays] = useState([]);
  const [refreshProgress, setRefreshProgress] = useState(false);
  const [assessment, setAssessment] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const clerkId = user.id;

    axios
      .get(`http://localhost:5000/api/progress/getProgress/${clerkId}`, {
        params: { clerkId: clerkId },
      })
      .then((response) => {
        setProgressData(response.data);
        const taskIds = response.data.completedTasks.tasks || [];
        setCompletedTaskIds(taskIds);
        setCompletedDays(response.data.completedDays || []);
        setAssessment(Boolean(response.data?.todayTasksCompleted));
       
      })
      .catch((error) => {
        console.log("Error fetching progress data:", error);
      });
  }, [isLoaded, user, refreshProgress,assessment]);

  const domain = progressData.domain;
  const streak = progressData.streak;
  const maxS = progressData.maxStreak;
  const progress = progressData.progressPercent;
  const day = progressData.currentDay;

  useEffect(() => {
    if (!domain || !day) return;

    axios
      .get(`http://localhost:5000/api/roadmap/getRoadmap/${domain}`, {
        params: { day: day },
      })
      .then((response) => {
        setTasks(response.data.days[0].tasks);
      })
      .catch((error) => {
        console.log("Error fetching tasks:", error);
        // setLoading(false);
      });
  }, [domain, day]);

  const handleTaskClick = async (task) => {
    try {
      // setLoading(true);
      await axios.post("http://localhost:5000/api/progress/completeTask", {
        clerkId: user.id,
        taskId: task.id,
      });

      setCompletedTaskIds((prev) => {
        if (prev.includes(task.id)) return prev;
        return [...prev, task.id];
      });
      setRefreshProgress((prev) => !prev);

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

      const res = await fetch("http://localhost:5000/api/test/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: user.fullName,
        }),
      });

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

  const streakData = Array.from({ length: 90 }, (_, i) => ({
    day: i + 1,
    completed: completedDays?.includes(i + 1) || false,
  }));

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

      {domain && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Selected Domain"
              value={domain}
              subtitle="Locked for roadmap"
              icon={<Target />}
            />
            <StatCard
              title="Current Streak"
              value={`${streak} Days`}
              // subtitle={`Max Streak :${maxS}`}
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
                <h2 className="text-lg font-medium">Today’s Tasks</h2>
                <span className="text-xs px-3 py-1 rounded-md bg-blue-500/10 text-blue-400">
                  Day {day}
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    completedTask={completedTaskIds}
                    taskurl={task.url}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
              </div>
            </GlowCard>

            {/* 3-MONTH STREAK TRACKER (SAME RIGHT CARD) */}

            <div
              className="
  w-full max-w-2xl
  rounded-2xl
  bg-[#1a1f3a]
  p-6
  shadow-xl
"
            >
              <h2 className="text-xl font-semibold text-white">
                90 Days Tracker
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Complete daily tasks to maintain your streak
              </p>

              {/* 90-Day Heatmap */}

              <div className="grid grid-cols-15 gap-2">
                {streakData.map((day, idx) => {
                  const activeDay = progressData?.ActiveDays?.find(
                    (d) => Number(d.day) === Number(day.day)
                  );

                  const len = activeDay ? activeDay.tasks.length : 0;

                  return (
                    <div
                      key={idx}
                      className={`
          w-4 h-4 rounded-sm
          ${
            len == 3
              ? "bg-green-500"
              : len == 2
              ? "bg-green-700"
              : len == 1
              ? "bg-green-900"
              : "bg-gray-700"
          }
        `}
                      title={`Day ${day.day} -${len} tasks Completed`}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between mt-6 text-sm text-gray-300">
                <span>Total Active Days: {completedDays?.length || 0}</span>
                <span>Max Streak: {maxS}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {assessment && (
        <button
          className=" bg-[#1a1f3a] border border-white/20 p-4 rounded-xl cursor-pointer"
          onClick={() => [navigate("/dailyassessment")]}
        >
          Go To Assessment
        </button>
      )}
      {!domain && (
        <div className="space-y-8">
          <h1 className="text-3xl font-semibold text-grey-400">
            Career Assessment
          </h1>

          <p className="text-gray-400">
            This short assessment helps identify the career domain that best
            matches your skills and interests. Please answer all questions
            honestly. There are no right or wrong answers. Your responses will
            be used to create a personalized learning roadmap and daily tasks to
            guide your career preparation.
          </p>

          {/* Start Button */}
          <AssesButton text="Start Assessment →" onClick={loadTest} />
        </div>
      )}
    </div>
  );
};

/* ---------------- COMPONENTS (UNCHANGED DESIGN) ---------------- */

const StatCard = ({ title, value, subtitle, icon }) => (
  <div
    className="rounded-xl bg-[#1a1f3a] border border-white/10 p-5
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
    className={`relative rounded-xl bg-[#1a1f3a]
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

const TaskItem = ({ task, onClick, completedTask }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                border transition
                ${
                  task.completed
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-[#0b1123] border-white/10 hover:bg-white/5"
                }`}
  >
    <div className="flex items-center select-none">
      <input
        type="checkbox"
        checked={completedTask.includes(task.id)}
        readOnly
        className="hidden"
      />

      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleCompleteTask(task.id);
        }}
        className="cursor-pointer"
      >
        {completedTask.includes(task.id) ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <Clock11 className="w-6 h-6 text-blue-600" />
        )}
      </div>
    </div>

    <span
      className={`text-sm ${
        task.completed ? "line-through text-gray-400" : "text-gray-300"
      }`}
    >
      {task.title}
    </span>

    {completedTask.includes(task.id) && (
      <a
        href={task.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className=" ml-auto 
    px-4 py-1.5
    text-sm font-medium
    text-blue-500
    border border-blue-500/30
    rounded-md
    hover:bg-blue-500
    hover:text-white
    transition"
      >
        Revisit
      </a>
    )}
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

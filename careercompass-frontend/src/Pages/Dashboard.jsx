import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

 
  const domain = "Software Development";
  const streak = 5;
  const progress = 12;

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Solve 3 DSA questions (Arrays)",
      resource: "/resources/dsa-arrays",
      completed: false,
    },
    {
      id: 2,
      title: "Read: Time Complexity Basics",
      resource: "/resources/time-complexity",
      completed: false,
    },
    {
      id: 3,
      title: "Revise yesterday’s topic",
      resource: "/resources/revision",
      completed: false,
    },
  ]);

  const handleTaskClick = (taskId, resource) => {
    // Mark task complete
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t
      )
    );

    // Redirect to resource
    navigate(resource);
  };

  return (
    <div className="space-y-8 text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-blue-400">
          Hi {user?.firstName}
        </h1>
        <p className="text-gray-400 mt-1">
          Stay consistent. Small steps every day.
        </p>
      </div>

      {/* TOP STATS (SAME DESIGN) */}
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
          subtitle="Consistency matters"
          icon="🔥"
        />
        <StatCard
          title="Overall Progress"
          value={`${progress}%`}
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
              Day {streak + 1}
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={() =>
                  handleTaskClick(task.id, task.resource)
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
      checked={task.completed}
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

export default Dashboard;

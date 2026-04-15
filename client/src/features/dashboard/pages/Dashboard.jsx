import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import PageLoader from "../../../components/Loaders/PageLoader.jsx";
import { useAuthContext } from "../../auth/auth.context.jsx";

import {
  getUserData,
  getRoadmap,
  getActivityLog,
  getcomptetedTask,
  getLeaderBoardData,
} from "../services/dashboard.services.js";

import { useDashboard } from "../hooks/useDashboard.js";
// import { DashboardContext } from "../Dashboard.context.jsx";

// ── Component imports ────────────────────────────────────────────────────────
import DashboardHeader from "../components/Dashboardheader.jsx";
import QuickActions from "../components/QuickActions.jsx";
import StatsGrid from "../components/Statsgrid.jsx";
import TodaysMission from "../components/Todaysmission.jsx";
import ActivityLog from "../components/ActivityLog.jsx";
import CodingActivity from "../components/CodingActivity.jsx";
import SkillRadar from "../components/SkillRadar.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

// ── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_PROGRESS = { xp: 0, currentStreak: 0, longestStreak: 0 };
const DEFAULT_ROADMAP = {
  timelineDays: 30,
  goalRole: "Software Engineer",
  studyHoursPerDay: 2,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
let _taskId = 0;

function normDiff(raw = "") {
  const s = String(raw).toLowerCase();
  if (s === "hard") return "Hard";
  if (s === "medium") return "Medium";
  return "Easy";
}

function transformApiTasks(raw = {}) {
  const tasks = (raw.tasks ?? []).map((t) => ({
    id: t._id ?? t.id ?? ++_taskId,
    day: raw.currentDay ?? 1,
    title: t.title ?? "Untitled Task",
    category: t.category ?? "General",
    difficulty: normDiff(t.difficulty),
    mins: Number(t.estimatedMinutes ?? t.estimatedmins ?? t.mins) || 30,
    done: Boolean(t.done ?? t.completed ?? false),
    description: t.description ?? "",
    type: t.type ?? "article",
    resourceUrl: t.resourceUrl ?? t.resourceurl ?? "",
  }));

  const grouped = tasks.reduce((acc, t) => {
    (acc[t.day] = acc[t.day] || []).push(t);
    return acc;
  }, {});

  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)
    .map((day) => ({ day, title: day, tasks: grouped[day] }));
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function FullSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-56 rounded-xl bg-slate-100 dark:bg-white/10" />
      <div className="h-4 w-72 rounded-lg bg-slate-100 dark:bg-white/10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-slate-100 dark:bg-white/10"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-slate-100 dark:bg-white/10"
          />
        ))}
      </div>
      <div className="h-56 rounded-2xl bg-slate-100 dark:bg-white/10" />
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { task_completion } = useDashboard();

 
  const {user:authenticatedUser,isInitialized: isAuthReady } = useAuthContext();
  console.log("Authenticated User in Dashboard:", authenticatedUser._id, "Auth Ready:", isAuthReady);

  const [roadmapDays, setRoadmapDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [userProgress, setUserProgress] = useState(DEFAULT_PROGRESS);
  const [roadmapDetails, setRoadmapDetails] = useState(DEFAULT_ROADMAP);

  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [taskCompletionGraph, setTaskCompletionGraph] = useState(null);
  const [accountCreatedAt, setAccountCreatedAt] = useState(null);
  const [longestStreak, setLongestStreak] = useState(0);

  const [leaderboardUsers, setLeaderboardUsers] = useState([]);

  const pendingTaskIds = useRef(new Set());

 
  useEffect(() => {
    if (!isAuthReady || !authenticatedUser) return;

    let isCancelled = false;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [
          userResponse,
          roadmapResponse,
          activityResponse,
          taskCompletionResponse,
          leaderboardResponse,
        ] = await Promise.all([
          getUserData(),
          getRoadmap(),
          getActivityLog(),
          getcomptetedTask(),
          getLeaderBoardData(),
        ]);

      
        if (isCancelled) return;

        // ── Roadmap ──
        if (roadmapResponse) {
          const today = roadmapResponse.currentDay || 1;
          const formattedDays = transformApiTasks(roadmapResponse);

          const validDay =
            formattedDays.find((d) => d.day === today)?.day ??
            formattedDays[0]?.day ??
            1;

          setCurrentDay(today);
          setRoadmapDays(formattedDays);
          setSelectedDay(validDay);

          setCompletedTaskIds(
            roadmapResponse.progress?.completedTasks || []
          );

          setUserProgress({
            xp: roadmapResponse.progress?.xp || 0,
            currentStreak: roadmapResponse.progress?.currentStreak || 0,
            longestStreak: roadmapResponse.progress?.longestStreak || 0,
          });

          setRoadmapDetails({
            timelineDays: roadmapResponse.roadmap?.timelineDays || 30,
            goalRole: roadmapResponse.roadmap?.goalRole || "Software Engineer",
            roadmapId: roadmapResponse.roadmap?.roadmapId || null,
            studyHoursPerDay: roadmapResponse.roadmap?.studyHoursPerDay || 2,
          });
        }

        // ── Activity Logs ──
        if (activityResponse) setActivityLogs(activityResponse);

        // ── Task Completion ──
        if (taskCompletionResponse?.completions?.[0]) {
          setTaskCompletionGraph(taskCompletionResponse.completions[0].days);
          setAccountCreatedAt(taskCompletionResponse.completions[0].startedAt);
          setLongestStreak(taskCompletionResponse.completions[0].longestStreak);
        }

        // ── Leaderboard ──
     
        if (leaderboardResponse?.leaderboard) {
          setLeaderboardUsers(leaderboardResponse.leaderboard);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error?.message || "Failed to load dashboard.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isCancelled = true;
    };
  }, [isAuthReady, authenticatedUser]);


  const refreshActivityLogs = useCallback(async () => {
  try {
    const updatedLogs = await getActivityLog();
    if (updatedLogs) {
      setActivityLogs(updatedLogs);
    }
  } catch (error) {
    console.error("Failed to refresh activity logs", error);
  }
}, []);


const handleTaskToggle = useCallback(
  async (taskId, difficulty, roadmapId, totalTasks, currentDayValue) => {
    if (pendingTaskIds.current.has(taskId)) return;
    pendingTaskIds.current.add(taskId);

    let wasTaskCompleted = false;

    // Optimistic update
    setRoadmapDays((previousDays) =>
      previousDays.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => {
          if (task.id === taskId) {
            wasTaskCompleted = task.done;
            return { ...task, done: !task.done };
          }
          return task;
        }),
      }))
    );

    setCompletedTaskIds((previousTaskIds) =>
      wasTaskCompleted
        ? previousTaskIds.filter((id) => id !== taskId)
        : [...previousTaskIds, taskId]
    );

    try {
      await task_completion(
        taskId,
        difficulty,
        roadmapId,
        totalTasks,
        currentDayValue
      );

      // Refresh progress (XP / streak)
      const updatedRoadmap = await getRoadmap();

      if (updatedRoadmap) {
        setUserProgress({
          xp: updatedRoadmap.progress?.xp || 0,
          currentStreak:
            updatedRoadmap.progress?.currentStreak || 0,
          longestStreak:
            updatedRoadmap.progress?.longestStreak || 0,
        });
      }

      refreshActivityLogs();
    } catch (error) {
      console.error(error);

      // Rollback on failure
      setRoadmapDays((previousDays) =>
        previousDays.map((day) => ({
          ...day,
          tasks: day.tasks.map((task) =>
            task.id === taskId
              ? { ...task, done: !task.done }
              : task
          ),
        }))
      );

      setCompletedTaskIds((previousTaskIds) =>
        wasTaskCompleted
          ? [...previousTaskIds, taskId]
          : previousTaskIds.filter((id) => id !== taskId)
      );
    } finally {
      pendingTaskIds.current.delete(taskId);
    }
  },
  [task_completion, refreshActivityLogs]
);

  // ── Derived values ──
  const activeDayData = useMemo(() => {
    return (
      roadmapDays.find((d) => d.day === selectedDay) ??
      roadmapDays.find((d) => d.day === currentDay) ??
      roadmapDays[0] ??
      null
    );
  }, [roadmapDays, selectedDay, currentDay]);

  const { doneCount, totalCount } = useMemo(
    () => ({
      doneCount: completedTaskIds.length,
      totalCount: activeDayData?.tasks?.length ?? 0,
    }),
    [completedTaskIds.length, activeDayData]
  );

  // ✅ FIX: correct loading condition
  if (!isAuthReady || isLoading) {
    return <PageLoader />;
  }

  // ── Error state ──
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-5xl"
        >
          ⚠️
        </motion.div>
        <p className="text-sm font-medium text-slate-600 dark:text-white/60">
          {errorMessage}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 🔥 ONLY CHANGE HERE: use authenticatedUser
  return (
    <div className="w-full h-[93vh] overflow-hidden">
      <div
        className="h-full overflow-y-auto px-4 sm:px-6 py-6 sm:py-8
        scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FullSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-6 xl:gap-8 items-start"
            >
              <div className="flex-1 min-w-0">
                <DashboardHeader
                  roadmapInfo={roadmapDetails}
                  studyHoursPerDay={roadmapDetails.studyHoursPerDay}
                  currentDay={currentDay}
                />

                <QuickActions />

                <StatsGrid
                  activeDayData={activeDayData}
                  progress={userProgress}
                  roadmapInfo={roadmapDetails}
                  doneCount={doneCount}
                  completedTasksToday={completedTaskIds}
                  totalCount={totalCount}
                />

                <TodaysMission
                  activeDayData={activeDayData}
                  allDays={roadmapDays}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  onToggle={handleTaskToggle}
                  task_completion={task_completion}
                  roadmapInfo={roadmapDetails}
                  totalCount={totalCount}
                  completedTasksToday={completedTaskIds}
                  pendingTasks={pendingTaskIds.current}
                  loading={false}
                />

                <ActivityLog progress={userProgress} activityLogs={activityLogs} />

                <CodingActivity
                  taskCompletionData={taskCompletionGraph}
                  createdAt={accountCreatedAt}
                  maxStreak={longestStreak}
                />
                <div className="md:hidden">
                 <Leaderboard
                  data={leaderboardUsers}
                  currentUserId={ authenticatedUser?._id}
                />
                </div>
              </div>
              

              <aside className="hidden xl:flex flex-col gap-4 w-[280px] flex-shrink-0 sticky top-0">
                <SkillRadar />
                <Leaderboard
                  data={leaderboardUsers}
                  currentUserId={ authenticatedUser?._id}
                />
              </aside>
               
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

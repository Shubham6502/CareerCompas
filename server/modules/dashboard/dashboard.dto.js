export const mapDashboardResponse = (
  user,
  roadmap,
  cluster,
  progress,
  todayPlan,
  assessmentSummary,
  revisionSummary,
  analyticsSummary,
  profile,
  recContext,
  tasksData
) => {
  const userDTO = {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatarUrl || null
  };

  const roadmapDTO = {
    id: roadmap._id.toString(),
    title: roadmap.title,
    domain: roadmap.domain,
    track: roadmap.track,
    version: roadmap.version
  };

  const clusterDTO = cluster ? {
    id: cluster._id.toString(),
    name: cluster.name,
    difficulty: cluster.difficulty,
    estimatedHours: cluster.estimatedHours,
    estimatedTasks: cluster.estimatedTasks
  } : null;

  const progressDTO = progress ? {
    status: progress.status,
    progressPercentage: progress.progressPercentage,
    completedTopics: progress.completedTopics || [],
    currentTopicIndex: progress.currentTopicIndex,
    currentTaskIndex: progress.currentTaskIndex,
    adaptiveMode: progress.adaptiveMode || null
  } : null;

  let todayPlanDTO = null;
  if (todayPlan) {
    const totalTasks = todayPlan.tasks.length;
    const completedTasks = todayPlan.tasks.filter(t => t.completed).length;
    const remainingTasks = totalTasks - completedTasks;

    const taskMinutesMap = new Map(tasksData.map(t => [t._id.toString(), t.estimatedMinutes || 15]));

    let estimatedRemainingMinutes = 0;
    todayPlan.tasks.forEach(t => {
      if (!t.completed) {
        estimatedRemainingMinutes += taskMinutesMap.get(t.taskId.toString()) || 15;
      }
    });

    todayPlanDTO = {
      id: todayPlan._id.toString(),
      planDate: todayPlan.planDate,
      studyHoursBudget: todayPlan.studyHoursBudget,
      status: todayPlan.status,
      totalTasks,
      completedTasks,
      remainingTasks,
      estimatedRemainingMinutes,
      tasks: todayPlan.tasks.map(t => ({
        taskId: t.taskId.toString(),
        taskSlug: t.taskSlug,
        topicId: t.topicId ? t.topicId.toString() : null,
        reason: t.reason,
        completed: t.completed
      }))
    };
  }

  const lastAttempt = assessmentSummary?.lastAttempt || null;
  const assessmentDTO = {
    due: progress ? (progress.status === "entry_assessment" || progress.status === "final_assessment") : false,
    type: progress ? ((progress.status === "entry_assessment" || progress.status === "final_assessment") ? progress.status : null) : null,
    score: lastAttempt ? lastAttempt.score : null,
    lastAttempt: lastAttempt ? {
      id: lastAttempt._id.toString(),
      score: lastAttempt.score,
      percentage: lastAttempt.percentage,
      submittedAt: lastAttempt.submittedAt
    } : null
  };

  const revisionDTO = {
    dueCount: revisionSummary?.dueCount || 0,
    nextRevisionAt: revisionSummary?.nextRevisionAt || null
  };

  const analyticsDTO = {
    learningVelocity: recContext?.learningVelocity || 1.2,
    averageAccuracy: analyticsSummary?.averageAccuracy || 0,
    completedClusters: analyticsSummary?.completedClusters || 0,
    completedTopics: analyticsSummary?.completedTopics || 0,
    totalStudyHours: analyticsSummary?.totalStudyHours || 0,
    streak: profile?.currentStreak || 0
  };

  const recommendationContextDTO = recContext ? {
    weakTopics: recContext.weakTopics || [],
    strongTopics: recContext.strongTopics || [],
    confidence: recContext.confidence || 0,
    estimatedCompletion: recContext.estimatedCompletion || null,
    nextMilestone: recContext.nextMilestone || null,
    nextRecommendedAction: recContext.nextRecommendedAction || null
  } : null;

  return {
    success: true,
    user: userDTO,
    roadmap: roadmapDTO,
    cluster: clusterDTO,
    progress: progressDTO,
    todayPlan: todayPlanDTO,
    assessment: assessmentDTO,
    revision: revisionDTO,
    analytics: analyticsDTO,
    recommendationContext: recommendationContextDTO
  };
};

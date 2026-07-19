# CareerCompass Daily Study Planner Specifications

This document describes the budget constraints, task sequencing rules, and cognitive load balancing strategies used by the CareerCompass Daily Planner.

---

## 📅 Planner Execution Pipeline

When a user triggers `GET /api/learning-engine/start-day`, the daily plan is generated using the following pipeline:

```
┌────────────────────────────────┐
│   Resolve User Hour Budget     │  <-- e.g. 1.5 hours/day = 90 minutes budget
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│   Inject Overdue Revisions     │  <-- revision.service retrieves due items
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│    Evaluate Remaining Budget   │
└───────────────┬────────────────┘
                │ (Budget > 0)
                ▼
┌────────────────────────────────┐
│  Loop Topic Tasks sequentially │  <-- Sorted by Task.order
└───────────────┬────────────────┘
                │ (Task fits budget)
                ▼
┌────────────────────────────────┐
│      Add Task to Daily Plan    │  <-- Deducts estimated task duration from budget
└───────────────┬────────────────┘
                │ (Budget exhausted)
                ▼
┌────────────────────────────────┐
│  Cache Pointers & Save Plan    │  <-- Caches currentTopicIndex & currentTaskIndex
└────────────────────────────────┘
```

---

## ⏱️ Budget & Duration Rules

1. **Study Budget**: Extracted from the user's `CareerProfile.studyHoursPerDay` and converted to minutes:
   $$\text{BudgetMinutes} = \text{StudyHoursPerDay} \times 60$$
2. **Task Durations**: Every task model specifies an `estimatedMinutes` field (defaulting to 15 minutes if not provided).
3. **Budget Gating**: Tasks are added to the plan only if their duration is less than or equal to the remaining budget minutes.

---

## 🔄 Resume Pointer Serialization

When the daily budget is exhausted, the planner saves the current progress state:
* **`UserClusterProgress.currentTopicIndex`**: The index of the topic the user is currently working on.
* **`UserClusterProgress.currentTaskIndex`**: The index of the next task to be completed in the active topic.

When the user returns, the application calls `resumeLearning()` to retrieve the current task immediately without running the planner again.

---

## ⚖️ Cognitive Load & Task Type Balancing

To avoid cognitive fatigue (e.g., planning only coding exercises or only long reading articles), the planner applies the following balancing rules:
1. **Task Sequencing**: Tasks within a topic are sorted by their `order` field. Administrators should arrange tasks to alternate cognitive load (e.g., Article -> Exercise -> Quiz).
2. **Daily Limits**: The planner config limits the number of tasks of each type allowed per day:
   * `maxCodingTasks`: Default 2
   * `maxReadingTasks`: Default 2
   * `maxTopicsPerDay`: Default 3

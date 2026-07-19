# CareerCompass Architectural Decision Records (ADRs)

This document records the key architectural decisions, motivations, alternatives considered, and consequences of the CareerCompass backend design.

---

## 🏛️ ADR 1: Decoupling Roadmaps and Learning Clusters
* **Status**: Approved
* **Context**: Roadmaps originally stored ordered arrays of clusters directly. This prevented cluster reuse across different roadmaps with different order sequences.
* **Decision**: Introduce a mapping table collection `RoadmapCluster` referencing `roadmapId` and `clusterId` with an explicit `order` field.
* **Consequences**:
  * **Pros**: Reusable clusters, zero data duplication, support for optional clusters and custom unlock rules per roadmap.
  * **Cons**: Requires additional database queries to resolve the active cluster path.

---

## 🏛️ ADR 2: Spaced-Repetition Modeling
* **Status**: Approved
* **Context**: The legacy database model used simple boolean flags (e.g. `isRevision: Boolean`) to track revision tasks, which did not support multiple revision intervals or spaced-repetition algorithms.
* **Decision**: Create a dedicated `RevisionSchedule` collection tracking `revisionNumber`, `dueDate`, `completed`, `interval`, and `easeFactor`.
* **Consequences**:
  * **Pros**: Supports advanced scheduling algorithms (SM2, FSRS) and allows revision tasks to be prioritized in the daily planner.
  * **Cons**: Requires cleanup/maintenance of completed schedules.

---

## 🏛️ ADR 3: Roadmap and Cluster Versioning
* **Status**: Approved
* **Context**: Updating a roadmap or cluster (e.g., adding or reordering topics) could disrupt active users, causing them to skip topics or lose their progress.
* **Decision**: Add version numbers (`version`), publication status (`isPublished`), and parent links (`previousVersion`) to the `Roadmap` and `LearningCluster` schemas.
* **Consequences**:
  * **Pros**: Existing users remain locked to their version until they choose to migrate.
  * **Cons**: Active databases must support multiple active schema configurations.

---

## 🏛️ ADR 4: soft Deletion
* **Status**: Approved
* **Context**: Hard-deleting roadmaps, clusters, or topics breaks foreign keys in user progress logs, task completions, and assessment records.
* **Decision**: Add `isDeleted` and `deletedAt` flags to core models. Update query functions to filter for `{ isDeleted: false }`.
* **Consequences**:
  * **Pros**: Preserves historical data and avoids broken database references.
  * **Cons**: Slightly larger query complexity and index storage.

---

## 🏛️ ADR 5: Event-Driven Telemetry
* **Status**: Approved
* **Context**: Adding features like streaks, badges, or leaderboards directly to the task completion controller increases coupling and makes the codebase harder to maintain.
* **Decision**: Create a `LearningEvent` collection to log events (e.g., `TASK_COMPLETED`, `CLUSTER_COMPLETED`). Sibling systems can consume these events asynchronously.
* **Consequences**:
  * **Pros**: Keeps core services clean; new features can be added without modifying existing code.
  * **Cons**: Requires an event log cleanup policy.

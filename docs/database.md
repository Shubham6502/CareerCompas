# CareerCompass Database Schema Documentation

This document describes the Mongoose schemas, indexes, normalization models, and validation constraints in the CareerCompass database.

---

## 🗺️ Entity Relationship Layout

```
 ┌──────────────┐          ┌─────────────────┐          ┌─────────────────┐
 │   Roadmap    ├─────────►│ RoadmapCluster  │◄─────────┤ LearningCluster │
 └──────┬───────┘          └────────┬────────┘          └────────┬────────┘
        │                           │                            │
        │                           │                            │
        ▼                           ▼                            ▼
 ┌──────────────┐          ┌─────────────────┐          ┌─────────────────┐
 │CareerProfile │          │UserClusterProgr.│          │RevisionSchedule │
 └──────────────┘          └─────────────────┘          └─────────────────┘
```

---

## 💾 Model Configuration Specification

### 1. Roadmap (`Roadmap`)
Stores curriculum outlines. Enables version-locking, so active students are not disrupted when roadmaps are updated.
* **Schema**:
  | Field | Type | Indexes / Constraints | Default / Details |
  | :--- | :--- | :--- | :--- |
  | `title` | `String` | Required | e.g. `"Backend Roadmap"` |
  | `domain` | `String` | Required, Indexed | e.g. `"Backend"` |
  | `track` | `String` | Required, Indexed | e.g. `"Beginner"` |
  | `version` | `Number` | Required | Default `1` |
  | `isPublished` | `Boolean` | Indexed | Default `false` |
  | `previousVersion`| `ObjectId` | Ref: `Roadmap` | Default `null` |
  | `isActive` | `Boolean` | — | Default `true` |
  | `isDeleted` | `Boolean` | Indexed | Default `false` |
  | `deletedAt` | `Date` | — | Default `null` |
* **Compound Index**: `{ domain: 1, track: 1, version: 1 }` (Unique)

---

### 2. RoadmapCluster Linkage (`RoadmapCluster`)
Maps clusters to roadmaps. Allows reusable clusters to be arranged in different orders on different roadmaps without data duplication.
* **Schema**:
  | Field | Type | Indexes / Constraints | Default / Details |
  | :--- | :--- | :--- | :--- |
  | `roadmapId` | `ObjectId` | Ref: `Roadmap`, Required | Indexed |
  | `clusterId` | `ObjectId` | Ref: `LearningCluster`, Required| Indexed |
  | `order` | `Number` | Required | Sequencing order |
  | `isOptional` | `Boolean` | — | Default `false` |
  | `unlockCondition` | `Object` | Embedded Schema | Gating rules |
* **Embedded Schema (`unlockCondition`)**:
  * `type`: `String` (Enum: `["COMPLETE_CLUSTER", "ASSESSMENT_SCORE"]`, Default `"COMPLETE_CLUSTER"`)
  * `minimum`: `Number` (Default `70`)
* **Compound Indexes**:
  * `{ roadmapId: 1, order: 1 }`
  * `{ roadmapId: 1, clusterId: 1 }` (Unique)

---

### 3. Learning Cluster (`LearningCluster`)
A curriculum cluster grouping multiple topics.
* **Schema**:
  | Field | Type | Indexes / Constraints | Default / Details |
  | :--- | :--- | :--- | :--- |
  | `name` | `String` | Required, Trimmed | e.g. `"JS Foundations"` |
  | `clusterKey` | `String` | Required, Unique, Indexed | e.g. `"js-foundations"` |
  | `topicsIncluded` | `Array` | Sub-documents array | Ordered by array position |
  | `estimatedHours` | `Number` | — | Default `0` |
  | `estimatedTasks` | `Number` | — | Default `0` |
  | `difficulty` | `String` | Enum: `["easy", "medium", "hard"]`| Default `"medium"` |
  | `prerequisiteClusters`| `[ObjectId]` | Ref: `LearningCluster` | Lock validation chain |
  | `version` | `Number` | — | Default `1` |
  | `isDeleted` | `Boolean` | Indexed | Default `false` |
  | `deletedAt` | `Date` | — | Default `null` |
* **Sub-document (`topicsIncluded`)**:
  * `topicId`: `ObjectId` (Ref: `Topic`, Required)
  * `slug`: `String` (Required)
  * `displayName`: `String` (Required)

---

### 4. User Cluster Progress (`UserClusterProgress`)
Tracks a user's progress through a learning cluster.
* **Schema**:
  | Field | Type | Indexes / Constraints | Default / Details |
  | :--- | :--- | :--- | :--- |
  | `userId` | `ObjectId` | Ref: `User`, Required, Indexed | — |
  | `roadmapId` | `ObjectId` | Ref: `Roadmap`, Required | — |
  | `clusterId` | `ObjectId` | Ref: `LearningCluster`, Required| — |
  | `status` | `String` | Enum: `[locked, entry_assessment, learning, paused, final_assessment, revision, completed, skipped]` | Default `"locked"`, Indexed |
  | `currentTopicIndex`| `Number` | — | Default `0` (Resume pointer) |
  | `currentTaskIndex` | `Number` | — | Default `0` (Resume pointer) |
  | `completedTopics` | `[ObjectId]` | Ref: `Topic` | Topics completed |
  | `skippedTopics` | `[ObjectId]` | Ref: `Topic` | Topics skipped |
  | `entryAssessmentScore`| `Number`| — | Default `null` |
  | `finalAssessmentScore`| `Number`| — | Default `null` |
  | `progressPercentage` | `Number`| — | Default `0` |
  | `clusterVersion` | `Number` | — | Default `1` |
  | `adaptiveMode` | `String` | Enum: `["full", "shortened"]` | Default `null` |
  | `startedAt` | `Date` | — | Default `Date.now` |
  | `completedAt` | `Date` | — | Default `null` |
* **Compound Index**: `{ userId: 1, roadmapId: 1, clusterId: 1 }` (Unique)

---

### 5. Revision Schedule (`RevisionSchedule`)
Tracks spaced-repetition revision tasks for topics.
* **Schema**:
  | Field | Type | Indexes / Constraints | Default / Details |
  | :--- | :--- | :--- | :--- |
  | `userId` | `ObjectId` | Ref: `User`, Required | Indexed |
  | `topicId` | `ObjectId` | Ref: `Topic`, Required | Indexed |
  | `clusterId` | `ObjectId` | Ref: `LearningCluster`, Required| Indexed |
  | `revisionNumber` | `Number` | Required | Revision step count |
  | `dueDate` | `Date` | Required | Indexed (Overdue matches) |
  | `completed` | `Boolean` | Indexed | Default `false` |
  | `interval` | `Number` | Required | Interval in days |
  | `easeFactor` | `Number` | — | Default `2.5` |
  | `policy` | `Object` | Embedded Schema | Spacing settings |
* **Embedded Schema (`policy`)**:
  * `intervals`: `[Number]` (Default `[1, 7, 15, 30]`)
  * `algorithm`: `String` (Enum: `["SM2", "FSRS", "fixed"]`, Default `"SM2"`)

---

## 🗑️ Soft Deletion & Data Preservation Rules

To preserve historical study metrics and progress analytics, the core curriculum models do not use hard deletes.
* **Soft Delete Fields**:
  * `isDeleted`: `Boolean` (Default: `false`)
  * `deletedAt`: `Date` (Default: `null`)
* **Usage**: When deleting a resource, set `isDeleted` to `true` and update `deletedAt`. All active curriculum queries must include `{ isDeleted: false }`.

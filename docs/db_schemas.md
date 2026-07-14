# CareerCompass Database Schemas

CareerCompass uses **MongoDB** as its primary data store, managed via the **Mongoose** ODM. The database models are structured to support modularity, fast query execution through compounding indexing, spaced-repetition learning, and AI auditability.

---

## 1. Core User & Auth Models

### User Schema (`User`)
- **Path**: `server/models/user.js`
- **Purpose**: Represents registered user profiles, credentials, role-based authorization, and account state.
- **Fields**:
  - `email` (String, required, unique, lowercase, trimmed): User email, validated with a regex.
  - `passwordHash` (String): Hashed password, only required if `authProvider === "local"`. Excluded by default (`select: false`).
  - `authProvider` (String, enum: `["local", "google", "github"]`): Authentication method.
  - `providerId` (String): OAuth unique identifier.
  - `firstName` / `lastName` (String, required, max length 60).
  - `avatarUrl` (String): Link to profile avatar.
  - `role` (String, enum: `["student", "mentor", "moderator", "admin"]`): Authorization role.
  - `accountStatus` (String, enum: `["pending-verification", "active", "suspended", "deactivated"]`).
  - `emailVerified` (Boolean).
  - `subscriptionTier` (String, enum: `["free", "pro", "premium"]`).
  - `mfaEnabled` (Boolean).
  - `mfaSecret` (String, select: false): Key for two-factor authentication.
  - `security` (Sub-document): Logs login dates, failed attempts, lockouts, and token versions.
  - `isDeleted` (Boolean): Flag for soft-deletion.
- **Indexes**:
  - `{ email: 1 }` (unique)
  - `{ authProvider: 1, providerId: 1 }` (unique, sparse, partial filter on non-null values)
  - `{ role: 1, accountStatus: 1 }` (compound, optimized for admin panel sorting)
  - `{ isDeleted: 1 }`
  - `{ createdAt: -1 }` (for growth metrics)

### OTP Schema (`Otp`)
- **Path**: `server/modules/auth/otp.model.js`
- **Purpose**: Temporary one-time passcodes for email verification and password resets.
- **Fields**:
  - `email` (String, required, indexed).
  - `otpHash` (String, required): Hashed OTP value.
  - `purpose` (String, enum: `["email-verification", "password-reset"]`).
  - `expiresAt` (Date, required): Time of expiration.
  - `attempts` (Number, default 0): Number of verification attempts.
- **Indexes**:
  - `{ expiresAt: 1 }` (TTL index: document is automatically deleted upon expiration).

### Token Blacklist Schema (`TokenBlacklist`)
- **Path**: `server/modules/auth/tokenBlacklist.model.js`
- **Purpose**: Blacklists JSON Web Tokens upon user logouts or security revocations using the token's `jti` (JWT ID) claim.
- **Fields**:
  - `tokenJti` (String, required, unique): Unique token identifier.
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `reason` (String, enum: `["logout", "security-revocation", "password-change"]`).
  - `expiresAt` (Date, required): Mapped to the token's original expiration date.
- **Indexes**:
  - `{ expiresAt: 1 }` (TTL index: auto-deletes the record once the token naturally expires).

---

## 2. Career & Placement Models

### Career Profile Schema (`CareerProfile`)
- **Path**: `server/modules/careerProfile/careerProfile.model.js`
- **Purpose**: Houses a student's learning targets, timeline constraint, priority companies, and study budget.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required, unique).
  - `targetRole` (String, required): Target job role (e.g., "Backend Engineer").
  - `targetCompanies` (Array):
    - `company` (String, required)
    - `tier` (String, enum: `["faang", "product", "startup", "service", "government"]`)
    - `priority` (Number, min 1, max 3)
  - `experienceLevel` (String, enum: `["student", "fresher", "0-2yrs", "2-5yrs", "5+yrs"]`).
  - `studyHoursPerDay` (Number, min 0.5, max 16).
  - `deadlineDate` (Date, indexed): Target job placement or interview date.
  - `preferredLearningStyle` (String, enum: `["visual", "reading", "hands-on", "mixed"]`).
  - `onboardingCompleted` (Boolean).
  - `isDeleted` (Boolean, default false).

### Job Match Schema (`JobMatch`)
- **Path**: `server/models/jobMatches.js`
- **Purpose**: Recommendations for open roles fetched from external APIs based on the user's skill set and profile.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `jobId` (String, required): External job source ID.
  - `jobTitle` / `company` / `jobUrl` (String, required).
  - `matchScore` (Number, min 0, max 100).
  - `matchingSkills` / `missingSkills` (Array of Strings).
  - `status` (String, enum: `["suggested", "saved", "applied", "rejected", "interviewing"]`).
  - `matchedAt` (Date).

### Resume Analysis Schema (`ResumeAnalysis`)
- **Path**: `server/models/resumeAnalysis.js`
- **Purpose**: Logs ATS optimization scores and AI feedback based on parsed resume uploads.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `resumeVersion` (Number, required).
  - `fileUrl` (String, required): Object storage URL pointing to the resume PDF.
  - `atsScore` (Number, min 0, max 100).
  - `extractedSkills` / `missingKeywords` (Array of Strings).
  - `relatedTopicSlugs` (Array of Strings): Connects missing skills to the platform's learning topic nodes.
  - `strengths` / `improvementSuggestions` (Array of Strings).
  - `targetRoleAtAnalysis` (String, required).
  - `aiModelUsed` (String, required): Used for auditable Gemini response logging.
  - `analyzedAt` (Date, indexed).

---

## 3. Curriculum & Learning Graph Models

### Topic Schema (`Topic`)
- **Path**: `server/modules/topics/topics.model.js`
- **Purpose**: Represents modules/nodes in the curriculum knowledge graph.
- **Fields**:
  - `slug` (String): Unique identifier (e.g. "nodejs-basics").
  - `displayName` / `shortName` (String).
  - `domain` / `category` / `subCategory` (String): Graph classification.
  - `parentTopic` (Schema.Types.ObjectId, ref: "Topic").
  - `prerequisites` (Array):
    - `topicId` (Schema.Types.ObjectId, ref: "Topic")
    - `minMastery` / `minAssessmentScore` (Number)
  - `nextTopics` (Array):
    - `topicId` (Schema.Types.ObjectId, ref: "Topic")
    - `edgeWeight` (Number): Traversing priority weight.
  - `relatedTopics` (Array of Topic ObjectIds).
  - `description` / `learningObjectives` / `keyConcepts` / `commonMistakes` (Strings/Arrays).
  - `difficultyScore` / `importanceScore` (Number).
  - `interviewWeight` / `interviewFrequency` (Number).
  - `isCoreConcept` / `isInterviewCritical` (Boolean).
  - `semanticSummary` / `keywords` (AI search properties).
  - `embeddingStatus` (Sub-document): RAG embeddings state.
  - `estimatedLearningHours` (Number).

### Task Schema (`Task`)
- **Path**: `server/modules/task/tasks.model.js`
- **Purpose**: Discrete learning assets (problems, articles, quizzes) belonging to topics.
- **Fields**:
  - `topicId` (Schema.Types.ObjectId, ref: "Topic", required).
  - `slug` / `title` (String, required).
  - `taskType` (String, enum: `["coding", "quiz", "reading", "project"]`).
  - `difficultyLevel` (String, enum: `["easy", "medium", "hard"]`).
  - `difficultyScore` (Number, min 0, max 100).
  - `estimatedMinutes` (Number, required).
  - `careerTracks` (Array of Strings): e.g., `["faang", "product", "startup"]`.
  - `learningStage` (String, enum: `["concept-introduction", "practice", "reinforcement", "mock-assessment"]`).
  - `bloomLevel` (String, enum: `["remember", "understand", "apply", "analyze", "evaluate", "create"]`).
  - `conceptsCovered` (Array of Concepts: `name`, `slug`, `weight`, `difficulty`).
  - `adaptiveRules` (Sub-document): Mastery thresholds, revision stages, unlock criteria, and recommendations.
  - `resources` (Array of Resources: `title`, `type`, `url`, `duration`, `isFree`).
  - `isActive` / `isDeprecated` (Boolean).

---

## 4. Progress, Plans & Assessment Models

### Daily Plan Schema (`DailyPlan`)
- **Path**: `server/modules/daily-plan/dailyPlan.model.js`
- **Purpose**: Tracks customized daily workloads scheduled for users.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `planDate` (Date, required): Date normalized to midnight UTC.
  - `tasks` (Array):
    - `taskId` (Schema.Types.ObjectId, ref: "Task", required)
    - `taskSlug` (String)
    - `topicId` (Schema.Types.ObjectId)
    - `reason` (String, enum: `["continuation", "new-topic"]`)
    - `triggerData` (Schema.Types.Mixed)
    - `completed` (Boolean)
  - `studyHoursBudget` (Number, required).
  - `status` (String, enum: `["active", "completed", "partially-completed", "expired"]`).
  - `completedTaskCount` (Number).
  - `generatedAt` (Date).

### User Task Progress Schema (`UserTaskProgress`)
- **Path**: `server/models/userTaskProgress.js`
- **Purpose**: Event-based completion tracking for individual tasks.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `taskId` (Schema.Types.ObjectId, ref: "Task", required).
  - `taskSlug` (String, required).
  - `topicId` (Schema.Types.ObjectId, ref: "Topic", required): Denormalized to accelerate roll-ups.
  - `status` (String, enum: `["not-started", "in-progress", "completed", "skipped"]`).
  - `accuracy` (Number, min 0, max 100).
  - `timeSpentMinutes` (Number).
  - `attemptsCount` (Number).
  - `firstAttemptedAt` / `completedAt` / `lastAttemptedAt` (Dates).

### Skill Progress Schema (`SkillProgress`)
- **Path**: `server/models/skillProgress.js`
- **Purpose**: Summarizes a user's mastery level and spaced-repetition schedules per curriculum topic.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `topicId` (Schema.Types.ObjectId, ref: "Topic", required).
  - `topicSlug` (String, required): Denormalized to avoid joins.
  - `masteryScore` / `confidenceScore` / `accuracyRate` (Number, min 0, max 100).
  - `attemptsCount` / `correctCount` / `streakCount` (Number).
  - `status` (String, enum: `["not-started", "in-progress", "mastered", "needs-revision"]`).
  - `lastAttemptedAt` / `lastAssessedAt` (Dates).
  - `nextRevisionDueAt` (Date, indexed): Deadline calculation for spaced-repetition.
  - `revisionStage` (Number): Numerical stage of spaced-repetition.
- **Indexes**:
  - `{ userId: 1, topicId: 1 }` (unique)
  - `{ userId: 1, nextRevisionDueAt: 1 }` (critical index supporting daily dashboard retrieval)
  - `{ userId: 1, status: 1 }`
  - `{ userId: 1, masteryScore: 1 }`

### Assessment Result Schema (`AssessmentResult`)
- **Path**: `server/models/assessmentResults.js`
- **Purpose**: Historical log of completed concept quizzes. Documents are immutable.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `assessmentId` (Schema.Types.ObjectId, required).
  - `topicId` (Schema.Types.ObjectId, ref: "Topic", required).
  - `score` (Number, min 0, max 100, required).
  - `totalQuestions` / `correctAnswers` / `timeTakenSeconds` (Numbers).
  - `answers` (Array of Embedded Answers: `questionId`, `selectedAnswer`, `isCorrect`, `timeTakenSeconds`).
  - `passed` (Boolean).
  - `attemptNumber` (Number).
  - `submittedAt` (Date, indexed).

### Weekly Report Schema (`WeeklyReport`)
- **Path**: `server/models/weeklyReports.js`
- **Purpose**: Performance summaries generated automatically at week-ends by Gemini.
- **Fields**:
  - `userId` (Schema.Types.ObjectId, ref: "User", required).
  - `weekStartDate` / `weekEndDate` (Dates, required).
  - `tasksCompleted` / `hoursStudied` (Numbers).
  - `topicsImproved` (Array: `topicId`, `topicSlug`, `masteryDelta`).
  - `revisionsCompleted` / `assessmentsTaken` / `avgAssessmentScore` (Numbers).
  - `readinessScoreStart` / `readinessScoreEnd` / `readinessDelta` (Numbers).
  - `aiSummaryText` (String, required): AI synthesized summary.
  - `aiModelUsed` (String).
  - `generatedAt` (Date).

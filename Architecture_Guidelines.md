# CareerCompass V3 -- Architecture & Development Instructions

## Vision

CareerCompass is an AI-powered adaptive career learning platform. The
goal is to deliver the shortest personalized path from a user's current
skill level to their target role.

## Principles

-   No fixed roadmap for every user.
-   Daily plans are generated dynamically.
-   AI decides what to learn next.
-   Topics represent knowledge.
-   Tasks are learning resources.
-   Assessments validate mastery.
-   Personalization is the core feature.

## Product Flow

User Registration → Career Profile → Diagnostic Assessment → Initial
Learning State → AI Planning Engine → Daily Plan → User Task Progress →
Topic Mastery Update → Next Daily Plan

Future: Assessment → AI Coach → RAG → Adaptive Learning

## Modules

### Authentication

JWT, Refresh Token. Future: Redis blacklist.

### Career Profile

Stores: - Target role - Companies - Experience - Study hours -
Preferences

### Topic

Stores knowledge graph: - prerequisites - nextTopics - concepts -
learningObjectives - importance - interviewCritical

### Task

Reusable learning activities: - article - video - coding - project -
revision

Tasks are never permanently assigned to every user.

### UserTaskProgress

Tracks: - status - attempts - timeSpent - completion - activity
timestamps

### TopicMastery

Stores: - masteryScore - confidenceLevel - weakConcepts -
strongConcepts - assessmentScore - revisionDue - learningStatus

Do NOT store derived values like totalTasks or completionPercentage.

### Learning State (Future)

Stores AI planning state: - recommendedDifficulty - nextTopics -
revisionPriority - aiReasoning - confidence

### Daily Plan

Generated daily from: - Career Profile - Topic Mastery - Learning
State - User Progress

Different users receive different tasks.

### Assessment (Later)

Types: - Diagnostic - Topic Quiz - Practice - Adaptive - Final

### Question Bank

Reusable questions with: - difficulty - concept - explanation - bloom
level - tags - interview frequency

## AI Planning Engine

Responsibilities: - Skip mastered topics. - Prioritize weak topics. -
Recommend revisions. - Increase difficulty gradually. - Respect daily
study hours. - Optimize for interview readiness.

## Future RAG

Sources: - Question bank - Notes - Documentation - Interview guides

Pipeline: Vector DB → Retrieval → LLM → Personalized answer

## Future Redis

Use for: - JWT blacklist - OTP - Rate limiting - AI cache - Daily plan
cache - Session cache

## Background Jobs

BullMQ later: - Daily plan generation - Revision scheduling - Embedding
generation - Notifications

## Dashboard

Show: - Today's tasks - Mastery - Weak areas - Interview readiness -
Study streak

## Development Order

-   Authentication ✅
-   Career Profile ✅
-   Topics ✅
-   Tasks ✅
-   Daily Plan ✅
-   UserTaskProgress ✅
-   TopicMastery
-   Learning State
-   Dashboard APIs
-   Analytics
-   Assessment
-   Question Bank
-   Assessment Attempt
-   AI Planner
-   Redis
-   Background Jobs
-   RAG
-   AI Coach

## Final Goal

The system should answer: 'Given this user's goals, strengths,
weaknesses, available time and history, what is the highest-impact thing
they should study today?'

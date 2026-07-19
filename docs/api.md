# CareerCompass REST API Registry

This document describes the primary API endpoints, request headers, payloads, and response shapes for the CareerCompass backend application.

---

## 🔒 Authentication & Headers

All authenticated routes require a valid JSON Web Token (JWT) sent via cookies:
* **Cookie Header**: `Cookie: token=<JWT_STRING>`

---

## 🔑 Authentication Endpoints

### 1. Register User
* **Endpoint**: `POST /api/auth/register`
* **Request Payload**:
  ```json
  {
    "displayName": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Success Response** ($201\text{ Created}$):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "65b8e9f2a0...",
      "email": "jane@example.com",
      "displayName": "Jane Doe",
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

### 2. Login User
* **Endpoint**: `POST /api/auth/login`
* **Request Payload**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Success Response** ($200\text{ OK}$):
  ```json
  {
    "message": "User logged in successfully",
    "user": {
      "_id": "65b8e9f2a0...",
      "email": "jane@example.com",
      "displayName": "Jane Doe",
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

---

## 🚀 Learning Engine Endpoints

### 1. Get Dashboard Metrics
Fetches the current progress state, daily plan, pending revisions, and learning analytics.
* **Endpoint**: `GET /api/learning-engine/dashboard`
* **Success Response** ($200\text{ OK}$):
  ```json
  {
    "success": true,
    "user": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com"
    },
    "roadmap": {
      "_id": "60c72b2f9b1d8a001f8d42d3",
      "title": "Backend Engineering",
      "domain": "Backend",
      "track": "Beginner",
      "version": 1
    },
    "cluster": {
      "_id": "60c72b2f9b1d8a001f8d42d5",
      "name": "Node.js Basics",
      "difficulty": "medium"
    },
    "progress": {
      "_id": "60c72b2f9b1d8a001f8d42d9",
      "status": "learning",
      "currentTopicIndex": 1,
      "currentTaskIndex": 0,
      "completedTopics": ["60c72b2f9b1d8a001f8d42a1"],
      "progressPercentage": 50,
      "adaptiveMode": "shortened"
    },
    "todayPlan": {
      "_id": "60c72b2f9b1d8a001f8d42e1",
      "planDate": "2026-07-19T00:00:00.000Z",
      "studyHoursBudget": 2,
      "status": "active",
      "tasks": [
        {
          "taskId": "60c72b2f9b1d8a001f8d42b1",
          "taskSlug": "loops-exercise",
          "topicId": "60c72b2f9b1d8a001f8d42c1",
          "reason": "continuation",
          "completed": false
        }
      ]
    },
    "assessment": {
      "due": false,
      "type": null
    },
    "revision": {
      "dueCount": 0,
      "nextRevisionAt": "2026-07-20T14:30:00.000Z"
    },
    "analytics": {
      "learningVelocity": 1.2,
      "averageAccuracy": 85
    },
    "recommendationContext": {
      "weakTopics": ["Asynchronous Loops"],
      "strongTopics": [],
      "learningVelocity": 1.2,
      "confidence": 85,
      "estimatedCompletion": "2026-08-15",
      "nextMilestone": "Node.js Streams",
      "nextRecommendedAction": "Continue Learning Tasks"
    }
  }
  ```

---

### 2. Start Day
Determines the daily action based on the user's progress.
* **Endpoint**: `GET /api/learning-engine/start-day`

#### A. Entry Diagnostic Due ($200\text{ OK}$):
```json
{
  "success": true,
  "action": "ENTRY_ASSESSMENT",
  "clusterId": "60c72b2f9b1d8a001f8d42d5",
  "questions": [
    {
      "_id": "60c72b2f9b1d8a001f8d42f1",
      "title": "Variable Scope",
      "question": "What is the scope of var?",
      "options": [
        { "id": "A", "text": "Function scope" },
        { "id": "B", "text": "Block scope" }
      ],
      "questionType": "mcq",
      "difficulty": "easy"
    }
  ]
}
```

#### B. Active Plan ($200\text{ OK}$):
```json
{
  "success": true,
  "action": "LEARNING",
  "clusterId": "60c72b2f9b1d8a001f8d42d5",
  "dailyPlan": {
    "_id": "60c72b2f9b1d8a001f8d42e1",
    "userId": "60c72b2f9b1d8a001f8d42a0",
    "roadmapId": "60c72b2f9b1d8a001f8d42d3",
    "clusterId": "60c72b2f9b1d8a001f8d42d5",
    "planDate": "2026-07-19T00:00:00.000Z",
    "tasks": [
      {
        "taskId": "60c72b2f9b1d8a001f8d42b1",
        "taskSlug": "variables-scope-reading",
        "topicId": "60c72b2f9b1d8a001f8d42f5",
        "reason": "new-topic",
        "completed": false
      }
    ]
  }
}
```

---

### 3. Submit Assessment Answers
* **Endpoint**: `POST /api/learning-engine/submit-assessment`
* **Request Payload**:
  ```json
  {
    "clusterId": "60c72b2f9b1d8a001f8d42d5",
    "answers": [
      {
        "questionId": "60c72b2f9b1d8a001f8d42f1",
        "selectedAnswer": "A",
        "timeTakenSeconds": 25
      }
    ]
  }
  ```
* **Success Response** ($200\text{ OK}$):
  ```json
  {
    "success": true,
    "score": 1,
    "percentage": 100,
    "passed": true,
    "attempt": {
      "_id": "60c72b2f9b1d8a001f8d4301",
      "userId": "60c72b2f9b1d8a001f8d42a0",
      "roadmapId": "60c72b2f9b1d8a001f8d42d3",
      "clusterId": "60c72b2f9b1d8a001f8d42d5",
      "assessmentType": "entry_assessment",
      "score": 1,
      "percentage": 100,
      "timeTaken": 25
    }
  }
  ```

---

## 🛠️ Error Codes & Messages

| Status Code | Error Message / Details |
| :--- | :--- |
| `400 Bad Request` | `"Missing required fields."` or `"User ID is required."` |
| `401 Unauthorized`| `"Unauthorized: Invalid token"` or missing authentication cookie |
| `404 Not Found` | `"No active progress record found for this cluster."` |
| `500 Server Error`| `"Internal server error"` or database connectivity failures |

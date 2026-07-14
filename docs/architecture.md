# CareerCompass Backend Architecture

This document details the backend architectural design, folder structure, code routing, layered separation of concerns, and integration points for the CareerCompass application.

---

## 1. Directory Structure

The project follows a hybrid design: global shared directories house legacy/cross-cutting concerns, while feature-specific components are organized under a modular `/modules` folder structure.

```
/server
├── config/                  # Database connections, third-party credentials
├── controllers/             # Global/Legacy route controllers
├── middlewares/             # Auth, error handling, rate limiting, validation
├── models/                  # Global mongoose schemas
├── modules/                 # Modular Feature-centric directories
│   ├── auth/                # Sign-up, login, token blacklist, OTP management
│   ├── careerProfile/       # Goal roles, study budget, target companies
│   ├── daily-plan/          # Daily study schedule generator, service, repository
│   ├── task/                # Learning tasks, coding exercises, reading resources
│   └── topics/              # Knowledge graphs, category definitions
├── routes/                  # Legacy routing definitions
├── seeds/                   # Seed scripts for topics, tasks, and initial resources
├── services/                # Legacy business logic services
├── shared/                  # Common utilities and types
└── utils/                   # Helper functions (e.g. email mailers, custom formatters)
```

---

## 2. Layered Architecture (Service-Repository Pattern)

Feature modules in `/modules` (e.g. `daily-plan`) follow a strict **layered architecture** to keep logic decoupled, testable, and maintainable.

```
Request ──> [Routes] ──> [Controller] ──> [Service] ──> [Repository] ──> [Database]
```

### 1. Routes Layer (`*.routes.js`)
- Handles endpoint definitions, HTTP verb associations, and applies necessary middlewares (e.g. `authenticateToken` verification).
- Strictly passes request controls directly to the respective controller.

### 2. Controller Layer (`*.controller.js`)
- Responsible for parsing client inputs (headers, cookies, request bodies, query params).
- Validates request structure and maps inputs onto service method arguments.
- Formulates HTTP responses (status codes, JSON payload formats) and handles errors thrown by the service layer.

### 3. Service Layer (`*.service.js`)
- Houses the core **business and domain logic** (e.g. scheduling algorithms, time math, graph traversals).
- Fully decoupled from Express request/response objects (never references `req` or `res`).
- Coordinates multiple actions, implements error conditions (such as throwing validation/not-found errors), and interacts with the database *exclusively* via the Repository layer.

### 4. Repository Layer (`*.repository.js`)
- Acts as a dedicated **database abstraction layer**.
- Contains direct Mongoose database query, insert, update, and delete calls.
- Hides query composition details (such as compounding filters, projections, and `.lean()` invocations) from the rest of the application.

---

## 3. Core System Workflows

### Authentication Flow
1. **Registration/Login**: Validated credentials generate a cookie-backed JSON Web Token containing a cryptographic `jti` ID claim.
2. **Authorization**: Incoming API requests pass through the `authenticateToken` middleware, decoding the JWT.
3. **Session Revocation**: Logging out blacklists the JWT's `jti` in the `TokenBlacklist` collection. The token becomes immediately invalid across all endpoints. Automatic TTL configuration wipes expired blacklist entries, keeping the table optimized.

### Daily Plan Generation Algorithm
1. The user logs in, requesting their day's study tasks.
2. The service pulls the user's `CareerProfile` to calculate their today's time budget (in minutes) and target company tier.
3. The generator checks if a plan for the current UTC day has already been created. If not, it requests the user's completed tasks to prevent duplicates.
4. The traversal walk begins:
   - **Continuation**: If the user has a pending topic from their previous plan, it attempts to pull outstanding tasks first.
   - **Graph Traversal**: If the previous topic is exhausted, the walker traverses the topic graph (`nextTopics`) sorted by relationship weights.
   - **Fallbacks**: If graph paths are broken or empty, it matches unvisited topics belonging to the same category or domain, finally falling back to the curriculum root.
5. Tasks are sorted by difficulty and estimated time and packed into the day's study budget.
6. The created plan document is persisted, handling potential concurrent thread duplication via a duplicate key catch block.

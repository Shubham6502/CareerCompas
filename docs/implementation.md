# CareerCompass Developer & AI Implementation Guide

This guide establishes the coding standards, module structure templates, and specific algorithmic requirements (such as spaced repetition and graph-based scheduling) for developers and AI agents working on this codebase.

---

## 1. Coding Conventions & Standards

When writing Javascript for this project, you must adhere to the following rules:

### Module Format
- The project utilizes **ES Modules** (`import` / `export` syntax). Never use `require` or CommonJS patterns.
- Specify extensions on local imports (e.g. `import myService from "./myService.js"`).

### Mongoose Query Operations
- **Read Operations**: Always append `.lean()` to Mongoose query chains if you are only reading data. This improves performance and returns plain JavaScript objects instead of Mongoose documents.
- **Write/Update Operations**: Prefer using explicit updates (e.g. `findByIdAndUpdate` or `updateOne`) in the Repository layer, returning the modified object with `{ new: true }`. Avoid calling `.save()` on plain, lean objects, as it will crash.

### Code Organization
- Legacy files reside in root-level folders (`/controllers`, `/services`, `/models`).
- **All new features must be modularized** under the `/modules` folder.
- Follow the **Service-Repository** pattern for all module code, keeping routes, controllers, services, and repositories in separate, dedicated files.

---

## 2. Standard Module Blueprint

Use this template structure when creating a new module. Replace `item` with your feature name:

### 1. Repository (`item.repository.js`)
Handles database schema imports and direct queries/updates:
```javascript
import mongoose from "mongoose";
import Item from "./item.model.js";

export const getItemById = async (id) => {
  return Item.findById(id).lean();
};

export const createItem = async (data) => {
  return Item.create(data);
};

export const updateItem = async (id, updateData) => {
  return Item.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean();
};
```

### 2. Service (`item.service.js`)
Orchestrates business logic and validations:
```javascript
import * as itemRepository from "./item.repository.js";

export const getDetails = async (itemId) => {
  const item = await itemRepository.getItemById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }
  // Perform business math or mapping...
  return item;
};
```

### 3. Controller (`item.controller.js`)
Parses HTTP input and handles status coding:
```javascript
import * as itemService from "./item.service.js";

export const getItemDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await itemService.getDetails(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 4. Routes (`item.routes.js`)
Declares endpoints and injects middlewares:
```javascript
import express from "express";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import * as itemController from "./item.controller.js";

const router = express.Router();

router.get("/:id", authenticateToken, itemController.getItemDetails);

export default router;
```

---

## 3. Algorithmic Implementations

### Spaced Repetition (Learning Cycle)
Spaced-repetition scheduling is managed using the `SkillProgress` schema. The field `nextRevisionDueAt` determines when a topic needs to be revisited:
1. When a user completes a task or quiz, the service evaluates their mastery score and confidence.
2. Based on their performance:
   - Successful completions increment `revisionStage` and push `nextRevisionDueAt` out exponentially (e.g. 1 day, 3 days, 7 days, 14 days, 30 days).
   - Poor performance resets the `revisionStage` back to `0`, setting `nextRevisionDueAt` immediately or for the next calendar day.
3. The query `{ nextRevisionDueAt: { $lte: new Date() } }` is indexed and must be utilized by services to fetch overdue revision tasks.

### Graph-Based Topic Traversal
The curriculum is organized as a directed graph. Each `Topic` has:
- `prerequisites`: Required prior topics and mastery scores.
- `nextTopics`: Outbound links containing weights indicating importance or logical succession.

To walk the graph to schedule new daily plans:
1. Verify if the current topic has remaining eligible tasks.
2. If tasks are exhausted, fetch `nextTopics` from the topic graph.
3. Sort `nextTopics` in descending order of `edgeWeight` to prioritize the most important concept paths.
4. If no graph connections exist or they are already fully mastered, fall back to matching topics by `category`, then by `domain`, and finally fall back to the root topics (no prerequisites).

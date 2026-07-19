# CareerCompass Adaptive Learning Engine Specifications

This document describes the state machine rules, diagnostic routing thresholds, and grading algorithms that power the CareerCompass Adaptive Learning Engine.

---

## 🔄 User State Machine & Progression Transitions

The user's progress through a cluster is managed as a state machine inside the `UserClusterProgress` collection:

```
        ┌──────────────┐
        │    locked    │   <-- Gated by prerequisite cluster checks
        └──────┬───────┘
               │ (Prerequisites satisfied)
               ▼
     ┌──────────────────┐
     │ entry_assessment │  <-- Diagnostic assessment phase
     └────┬───────────┬─┘
          │           │ (Score >= 90%)
          │           ▼
          │     ┌──────────────┐
          │     │  completed   │  <-- Bypasses the cluster entirely
          │     └──────────────┘
          │ (Score < 90%)
          ▼
     ┌──────────────────┐
     │     learning     │  <-- Day-to-day budget-based study phase
     └────┬─────────────┘
          │ (All topics completed)
          ▼
     ┌──────────────────┐
     │ final_assessment │  <-- Graduation assessment phase
     └────┬───────────┬─┘
          │           │ (Passed >= 60%)
          │           ▼
          │     ┌──────────────┐
          │     │  completed   │  <-- Activates revision schedule
          │     └──────────────┘
          │ (Failed < 60%)
          ▼
     ┌──────────────────┐
     │     learning     │  <-- Resets to learning phase to review weak topics
     └──────────────────┘
```

### Transition Triggers:
1. **Unlocking**: A `locked` cluster transitions to `entry_assessment` when all prerequisite clusters are marked as `completed` or `skipped`.
2. **Diagnostic Skip**: During the `entry_assessment` grading step, if the score $\ge 90\%$, the cluster is marked as `completed`.
3. **Adaptive Path Gating**:
   * **Score 60% - 89%**: Activates a **Shortened Path** (`adaptiveMode = "shortened"`). Topics where the user scored $\ge 55\%$ are marked as completed, allowing the user to focus only on weak areas.
   * **Score < 60%**: Activates the **Full Path** (`adaptiveMode = "full"`), requiring the user to complete all topics in the cluster.

---

## 🧮 Core Algorithms & Formulas

### 1. Spaced Repetition (SM2 Algorithm)
Tracks learning retention using review intervals ($I$) in days and an ease factor ($EF$):
* **Grade Mapping ($q$)**:
  * Score $\ge 90\% \rightarrow q = 5$
  * Score $\ge 80\% \rightarrow q = 4$
  * Score $\ge 70\% \rightarrow q = 3$
  * Score $\ge 60\% \rightarrow q = 2$
  * Otherwise $\rightarrow q = 1$

* **Algorithm**:
  * If $q < 3$ (Failed):
    * Next Interval ($I'$) = 1 day
    * Ease Factor ($EF'$) = $\max(1.3, EF - 0.2)$
  * If $q \ge 3$ (Passed):
    * For revision step 1: $I' = 1$ day
    * For revision step 2: $I' = 6$ days
    * For revision step $n > 2$: $I' = \text{round}(I \times EF)$
    * Ease Factor updates:
      $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
      Clamp $EF' \ge 1.3$.

---

### 2. Multi-Factor Topic Mastery
Blends historical mastery scores with new assessment scores:
$$\text{Mastery}' = \text{round}(\text{Mastery}_{\text{prev}} \times 0.7 + \text{Score}_{\text{new}} \times 0.3)$$
$$\text{Confidence}' = \text{round}(\text{Confidence}_{\text{prev}} \times 0.7 + \text{Score}_{\text{new}} \times 0.3)$$

---

### 3. Multi-Factor Weak Topic Evaluation
Calculates a weakness score for each topic. A topic is classified as weak if it has at least one attempt and satisfies:
$$\text{WeaknessScore} = (\text{Attempts} \times 0.2) + (100 - \text{Mastery}) \times 0.4 + (100 - \text{Accuracy}) \times 0.4 > 45$$
Additionally, any topic with $\text{Mastery} < 60\%$ is classified as weak.

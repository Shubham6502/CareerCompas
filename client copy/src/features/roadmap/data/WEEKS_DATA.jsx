 export const WEEKS_DATA = [
  {
    id: 1, label: "Week 1 — Core Basics", color: "#22c55e",
    colorCls: "text-green-500", accentBg: "bg-green-500", locked: false,
    days: [
      { id: 1, day: 1, title: "Foundations", tasks: [
        { id: 1,  t: "Solve Two Sum (Arrays & Hashing)",      cat: "DSA",    d: "Easy",   time: "45m",    done: true  },
        { id: 2,  t: "Build Express REST API scaffold",        cat: "Dev",    d: "Medium", time: "1h 30m", done: true  },
        { id: 3,  t: "Learn HTTP status codes & methods",      cat: "CS",     d: "Easy",   time: "30m",    done: true  },
        { id: 4,  t: "Behavioral: Tell me about yourself",     cat: "Prep",   d: "Easy",   time: "20m",    done: true  },
      ]},
      { id: 2, day: 2, title: "Data Structures Deep Dive", tasks: [
        { id: 5,  t: "Implement Stack & Queue from scratch",   cat: "DSA",    d: "Easy",   time: "1h",     done: true  },
        { id: 6,  t: "Linked list traversal & reversal",       cat: "DSA",    d: "Medium", time: "45m",    done: true  },
        { id: 7,  t: "Hash map internals deep dive",           cat: "CS",     d: "Easy",   time: "30m",    done: true  },
        { id: 8,  t: "Build a CRUD REST API",                  cat: "Dev",    d: "Medium", time: "1h 30m", done: true  },
        { id: 9,  t: "Behavioral: Strengths & weaknesses",     cat: "Prep",   d: "Easy",   time: "20m",    done: true  },
      ]},
      { id: 3, day: 3, title: "Problem Solving Patterns", tasks: [
        { id: 10, t: "Two pointer technique problems",         cat: "DSA",    d: "Medium", time: "1h",     done: true  },
        { id: 11, t: "Fast & slow pointer pattern",            cat: "DSA",    d: "Medium", time: "45m",    done: true  },
        { id: 12, t: "Add authentication middleware",          cat: "Dev",    d: "Medium", time: "1h",     done: true  },
      ]},
      { id: 4, day: 4, title: "Sliding Window Mastery", tasks: [
        { id: 13, t: "Maximum subarray — Kadane's algorithm",  cat: "DSA",    d: "Easy",   time: "30m",    done: true  },
        { id: 14, t: "Longest substring without repeating",    cat: "DSA",    d: "Medium", time: "45m",    done: true  },
        { id: 15, t: "Minimum window substring",               cat: "DSA",    d: "Hard",   time: "1h",     done: true  },
      ]},
      { id: 5, day: 5, title: "Stack & Queue Patterns", tasks: [
        { id: 16, t: "Valid parentheses variations",           cat: "DSA",    d: "Easy",   time: "30m",    done: true  },
        { id: 17, t: "Daily temperatures problem",             cat: "DSA",    d: "Medium", time: "45m",    done: true  },
        { id: 18, t: "Implement LRU Cache",                    cat: "DSA",    d: "Hard",   time: "1h 30m", done: true  },
        { id: 19, t: "Design a rate limiter",                  cat: "System", d: "Medium", time: "45m",    done: true  },
        { id: 20, t: "Behavioral: Leadership example",         cat: "Prep",   d: "Easy",   time: "20m",    done: true  },
      ]},
    ],
  },
  {
    id: 2, label: "Week 2 — Intermediate", color: "#f59e0b",
    colorCls: "text-yellow-500", accentBg: "bg-yellow-500", locked: true,
    days: [
      { id: 6,  day: 6,  title: "Binary Search Deep Dive", tasks: [
        { id: 21, t: "Classic binary search template",         cat: "DSA",    d: "Easy",   time: "30m",    done: false },
        { id: 22, t: "Search in rotated sorted array",         cat: "DSA",    d: "Medium", time: "45m",    done: false },
        { id: 23, t: "Find minimum in rotated array",          cat: "DSA",    d: "Medium", time: "30m",    done: false },
      ]},
      { id: 7,  day: 7,  title: "Weekly Review & Rest", tasks: [
        { id: 24, t: "Review week 1 flashcards",               cat: "Review", d: "Easy",   time: "1h",     done: false },
        { id: 25, t: "Mock interview session",                  cat: "Prep",   d: "Medium", time: "1h",     done: false },
      ]},
      { id: 8,  day: 8,  title: "Linked Lists Fundamentals", tasks: [
        { id: 26, t: "Reverse linked list (iterative)",        cat: "DSA",    d: "Easy",   time: "45m",    done: false },
        { id: 27, t: "Merge two sorted lists",                  cat: "DSA",    d: "Easy",   time: "30m",    done: false },
        { id: 28, t: "Detect cycle in linked list",             cat: "DSA",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 9,  day: 9,  title: "Trees & Traversals", tasks: [
        { id: 29, t: "BFS and DFS implementations",            cat: "DSA",    d: "Medium", time: "1h",     done: false },
        { id: 30, t: "Level order traversal",                   cat: "DSA",    d: "Easy",   time: "30m",    done: false },
      ]},
      { id: 10, day: 10, title: "Graph Algorithms Intro", tasks: [
        { id: 31, t: "Number of islands",                       cat: "DSA",    d: "Medium", time: "45m",    done: false },
        { id: 32, t: "Clone graph",                             cat: "DSA",    d: "Medium", time: "45m",    done: false },
        { id: 33, t: "Topological sort",                        cat: "DSA",    d: "Hard",   time: "1h",     done: false },
      ]},
      { id: 11, day: 11, title: "Dynamic Programming Basics", tasks: [
        { id: 34, t: "Fibonacci with memoization",              cat: "DSA",    d: "Easy",   time: "30m",    done: false },
        { id: 35, t: "Climbing stairs",                         cat: "DSA",    d: "Easy",   time: "20m",    done: false },
        { id: 36, t: "House robber",                            cat: "DSA",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 12, day: 12, title: "Advanced DP Patterns", tasks: [
        { id: 37, t: "Longest common subsequence",              cat: "DSA",    d: "Medium", time: "1h",     done: false },
        { id: 38, t: "0/1 Knapsack problem",                    cat: "DSA",    d: "Hard",   time: "1h",     done: false },
      ]},
    ],
  },
  {
    id: 3, label: "Week 3 — Advanced", color: "#ef4444",
    colorCls: "text-red-500", accentBg: "bg-red-500", locked: true,
    days: [
      { id: 13, day: 13, title: "Backtracking Essentials", tasks: [
        { id: 39, t: "Subsets & permutations",                  cat: "DSA",    d: "Medium", time: "1h",     done: false },
        { id: 40, t: "N-Queens problem",                        cat: "DSA",    d: "Hard",   time: "1h 30m", done: false },
      ]},
      { id: 14, day: 14, title: "Heap & Priority Queue", tasks: [
        { id: 41, t: "Kth largest element",                     cat: "DSA",    d: "Medium", time: "45m",    done: false },
        { id: 42, t: "Merge K sorted lists",                    cat: "DSA",    d: "Hard",   time: "1h",     done: false },
        { id: 43, t: "Top K frequent elements",                 cat: "DSA",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 15, day: 15, title: "Trie & String Algorithms", tasks: [
        { id: 44, t: "Implement Trie data structure",           cat: "DSA",    d: "Medium", time: "1h",     done: false },
        { id: 45, t: "Word search II",                          cat: "DSA",    d: "Hard",   time: "1h 30m", done: false },
      ]},
      { id: 16, day: 16, title: "Intervals & Greedy", tasks: [
        { id: 46, t: "Merge intervals",                         cat: "DSA",    d: "Medium", time: "45m",    done: false },
        { id: 47, t: "Non-overlapping intervals",               cat: "DSA",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 17, day: 17, title: "Bit Manipulation", tasks: [
        { id: 48, t: "Single number (XOR trick)",               cat: "DSA",    d: "Easy",   time: "20m",    done: false },
        { id: 49, t: "Number of 1 bits",                        cat: "DSA",    d: "Easy",   time: "20m",    done: false },
        { id: 50, t: "Sum of two integers without +",           cat: "DSA",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 18, day: 18, title: "Union Find & Advanced Graphs", tasks: [
        { id: 51, t: "Number of connected components",          cat: "DSA",    d: "Medium", time: "45m",    done: false },
        { id: 52, t: "Redundant connection",                    cat: "DSA",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 19, day: 19, title: "System Design Deep Dive", tasks: [
        { id: 53, t: "Design URL shortener",                    cat: "System", d: "Medium", time: "1h 30m", done: false },
        { id: 54, t: "Design rate limiter",                     cat: "System", d: "Hard",   time: "1h 30m", done: false },
        { id: 55, t: "Consistent hashing deep dive",            cat: "System", d: "Hard",   time: "1h",     done: false },
      ]},
      { id: 20, day: 20, title: "Week 3 Consolidation", tasks: [
        { id: 56, t: "Speed run: 10 medium problems",           cat: "DSA",    d: "Medium", time: "2h",     done: false },
        { id: 57, t: "System design mock",                      cat: "System", d: "Hard",   time: "1h",     done: false },
      ]},
    ],
  },
  {
    id: 4, label: "Week 4 — Interview Ready", color: "#3b82f6",
    colorCls: "text-blue-500", accentBg: "bg-blue-500", locked: true,
    days: [
      { id: 21, day: 21, title: "Mock Interviews Round 1", tasks: [
        { id: 58, t: "Full mock interview session",             cat: "Prep",   d: "Hard",   time: "1h",     done: false },
        { id: 59, t: "Review & feedback session",               cat: "Prep",   d: "Medium", time: "30m",    done: false },
      ]},
      { id: 22, day: 22, title: "Concurrency & OS Fundamentals", tasks: [
        { id: 60, t: "Threads vs processes deep dive",          cat: "CS",     d: "Medium", time: "45m",    done: false },
        { id: 61, t: "Deadlocks & race conditions",             cat: "CS",     d: "Medium", time: "45m",    done: false },
      ]},
      { id: 23, day: 23, title: "API Design & Best Practices", tasks: [
        { id: 62, t: "REST vs GraphQL vs gRPC",                 cat: "System", d: "Medium", time: "1h",     done: false },
        { id: 63, t: "API versioning strategies",               cat: "Dev",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 24, day: 24, title: "Security & Authentication", tasks: [
        { id: 64, t: "OAuth 2.0 deep dive",                     cat: "CS",     d: "Medium", time: "1h",     done: false },
        { id: 65, t: "JWT implementation & best practices",     cat: "Dev",    d: "Medium", time: "45m",    done: false },
      ]},
      { id: 25, day: 25, title: "Portfolio & Resume Polish", tasks: [
        { id: 66, t: "Update GitHub & LinkedIn profiles",       cat: "Career", d: "Easy",   time: "1h",     done: false },
        { id: 67, t: "Write 3 STAR-format stories",             cat: "Prep",   d: "Easy",   time: "1h",     done: false },
      ]},
      { id: 26, day: 26, title: "Mock Interviews Round 2", tasks: [
        { id: 68, t: "Back-to-back mock sessions",              cat: "Prep",   d: "Hard",   time: "2h",     done: false },
      ]},
      { id: 27, day: 27, title: "Final Mock Interviews", tasks: [
        { id: 69, t: "Full system design interview",            cat: "System", d: "Hard",   time: "1h",     done: false },
        { id: 70, t: "Behavioral marathon — 10 questions",      cat: "Prep",   d: "Medium", time: "1h",     done: false },
      ]},
      { id: 28, day: 28, title: "Final Review & Confidence", tasks: [
        { id: 71, t: "Review all patterns & cheat sheets",      cat: "Review", d: "Easy",   time: "2h",     done: false },
        { id: 72, t: "Mindset prep & visualization",            cat: "Prep",   d: "Easy",   time: "30m",    done: false },
      ]},
    ],
  },
];

// export default WEEKS_DATA;